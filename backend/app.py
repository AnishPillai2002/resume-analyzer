from flask import Flask, request, jsonify
from flask_cors import CORS
import PyPDF2
import os
import re
import json
from openai import OpenAI
from dotenv import load_dotenv
from pymongo import MongoClient
from datetime import datetime

from azure.core.credentials import AzureKeyCredential
from bson import ObjectId

from azure.ai.inference import ChatCompletionsClient
from azure.ai.inference.models import SystemMessage, UserMessage



# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Initialize OpenAI client
client = OpenAI(
    base_url="https://models.inference.ai.azure.com",
    api_key=os.getenv("GITHUB_TOKEN")
)

#Initialize ChatCompletionsClient
# Initialize OpenAI client
llm_client = ChatCompletionsClient(
    endpoint="https://models.inference.ai.azure.com",
    credential=AzureKeyCredential(os.environ["GITHUB_TOKEN"]),
)

# Initialize MongoDB client
mongo_client = MongoClient(os.getenv("MONGODB_URI", "mongodb://localhost:27017/"))
db = mongo_client["resume-processor"]
resumes_collection = db["resumes"]



# Function to store resume data in MongoDB
def store_resume_data(resume_data, filename, raw_text):
    """
    Store resume data in MongoDB
    Args:
        resume_data (dict): Parsed JSON data from the resume
        filename (str): Original filename of the PDF
        raw_text (str): Full extracted text from the resume
    Returns:
        str: ID of the inserted document
    """
    try:

        # Step 1: Create a document to store in MongoDB
        document = {
            "resume_data": resume_data,
            "original_filename": filename,
            "raw_text": raw_text,
            "uploaded_at": datetime.utcnow(),
        }

        # Step 2: Insert the document into MongoDB
        result = resumes_collection.insert_one(document)
        
        # Step 3: Get the inserted document ID
        doc_id = str(result.inserted_id)
        print("1. Resume Data Stored in MongoDB with ID:", doc_id)
        
        # Step 4 : Add the document ID to the resume data
        resume_data['_id'] = doc_id
    
        # Step 6: Return the document ID
        return doc_id
    except Exception as e:
        raise Exception(f"Failed to store resume data: {str(e)}")

# Function to extract text from PDF
def extract_text_from_pdf(pdf_file):

    #Step 1: Read the PDF file
    pdf_reader = PyPDF2.PdfReader(pdf_file)
    text = ""
    # Step 2: Extract text from each page
    for page in pdf_reader.pages:
        page_text = page.extract_text()
        if page_text:
            text += page_text
    # Step 3: Return the extracted text
    return text

# Function to analyze resume text using OpenAI
def analyze_resume(text):

    # Step 1: Create a system prompt for OpenAI
    system_prompt = """You are a resume analyzer. Extract the following information from the resume in a structured format:

- Full Name
- Email
- Phone Number
- Skills (as a list)
- Work Experience (including company names, positions, and dates)
- Education
- Projects (if any)
- Certifications (if any)
- Languages (if any)
- Hobbies (if any)
- Summary (if any)
- Achievements (if any)
- Publications (if any)
- References (if any)
- Other relevant information

Instructions:
1. If any of the above information is not present in the resume, return null for that field.
2. If a summary is not provided in the resume, generate a short 2–4 sentence professional summary based on the extracted details, highlighting the candidate’s background, skills, and strengths.

Return all the information in a clean JSON format, including the original or generated summary.
"""


    try:

        # Step 2: Call OpenAI API to analyze the resume text
        response = client.chat.completions.create(
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": text}
            ],
            model="gpt-4o",
            temperature=0.7,
            max_tokens=4096,
            top_p=1
        )
        
        # Step 3: Return the response content 
        return response.choices[0].message.content
    except Exception as e:
        return str(e)

# API endpoint to convert PDF resumes to JSON and store in MongoDB and Pinecone
@app.route('/api/analyze-resume', methods=['POST'])
def analyze_resume_endpoint():
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400

    file = request.files['file']
    if file.filename == '' or not file.filename.endswith('.pdf'):
        return jsonify({'error': 'Invalid file format. Please upload a PDF'}), 400

    try:
        # Step 1 : Read the PDF file and return the text
        pdf_text = extract_text_from_pdf(file)

        # Step 2 : Analyze the text using OpenAI, and get the structured data
        analysis_result = analyze_resume(pdf_text)

        # Step 3 : Clean and convert the result string to real JSON
        cleaned_json_str = re.sub(r"^```json|```$", "", analysis_result.strip()).strip()
        parsed_json = json.loads(cleaned_json_str)

        # Step 4 : Store the data in MongoDB and create embeddings
        document_id = store_resume_data(parsed_json, file.filename, pdf_text)

        # Step 5 : Add the MongoDB ID to the response
        parsed_json["_id"] = document_id

        # Step 6 : Return the parsed JSON data
        return jsonify(parsed_json)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# API Endpoint to retrieve all resumes
@app.route('/api/resumes', methods=['GET'])
def get_resumes():
    try:
        # Get all resumes from MongoDB, excluding the raw text to reduce response size
        resumes = list(resumes_collection.find({}, {'raw_text': 0}))

        # Convert ObjectId to string for JSON serialization
        for resume in resumes:
            resume['_id'] = str(resume['_id'])
            resume['uploaded_at'] = resume['uploaded_at'].isoformat()

        return jsonify(resumes)
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# Health check endpoint for Docker
@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy"}), 200


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
