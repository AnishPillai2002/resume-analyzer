# Resume Analyzer

A modern web application that analyzes and extracts structured data from resumes, leveraging AI for semantic search and candidate matching.

## Features

- **Resume Parsing**: Extract structured data from PDF resumes
- **AI-Powered Analysis**: Analyze resume content using OpenAI
- **Candidate Database**: Store and manage parsed resume data
- **User-Friendly Interface**: Modern React frontend for easy interaction

## System Architecture

### Backend
- **Flask API**: RESTful API for resume processing and data retrieval
- **OpenAI Integration**: Advanced text analysis and extraction
- **Document Storage**: MongoDB for storing parsed resume data

### Frontend
- **React**: Modern UI components and state management
- **Tailwind CSS**: Responsive and clean design


## Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)
- API Keys:
  - OpenAI/Azure AI API Key
  - Pinecone API Key
  - MongoDB connection string (or local MongoDB instance)

## Project Structure

```
resume-analyzer/
├── backend/              # Flask backend application
│   ├── app.py            # Main application file
│   ├── requirements.txt  # Python dependencies
│   └── Dockerfile        # Backend container configuration
├── frontend/             # React frontend application
│   ├── src/              # React source code
│   ├── public/           # Static assets
│   ├── package.json      # Node.js dependencies
│   ├── vite.config.js    # Vite configuration
│   ├── nginx.conf        # Nginx configuration for serving frontend
│   └── Dockerfile        # Frontend container configuration
├── docker-compose.yml    # Docker Compose configuration
├── .env                  # Environment variables
└── README.md             # Project documentation
```

## Getting Started

### Setup

1. Clone the repository
2. Configure environment variables in the `.env` file:
   ```
   GITHUB_TOKEN=your_github_token_here
   TEXT_EMBEDDING_TOKEN=your_text_embedding_token_here
   MONGODB_URI=mongodb://localhost:27017/resume-processor
   PINECONE_API_KEY=your_pinecone_api_key_here
   ```
3. Make sure Docker and Docker Compose are installed on your system
4. Navigate to the project root directory

### Running the Application

```bash
# Build and start the containers
docker-compose up -d

# To rebuild the containers (if you make changes)
docker-compose up -d --build

# To stop the containers
docker-compose down
```

### Accessing the Application

- Frontend: http://localhost:80
- Backend API: http://localhost:5000

## Environment Variables

The application uses the following environment variables:

- `GITHUB_TOKEN`: API key for Azure AI services
- `MONGODB_URI`: Connection string for MongoDB

## Docker Containers

1. **Backend Container**:
   - Python Flask application
   - Exposes port 5000
   - Connects to MongoDB and Pinecone
   - Includes health check endpoints

2. **Frontend Container**:
   - React application served via Nginx
   - Multi-stage build for optimized image size
   - Exposes port 80
   - Proxies API requests to the backend

## API Endpoints

- `POST /api/analyze-resume`: Upload and analyze a resume
- `GET /api/resumes`: Get all processed resumes
- `GET /health`: Health check endpoint

## Troubleshooting

- If you encounter issues with the containers, check the logs:
  ```bash
  docker-compose logs
  # Or for specific service
  docker-compose logs backend
  docker-compose logs frontend
  ```

- To access a specific container's shell:
  ```bash
  docker exec -it resume-analyzer-backend bash
  docker exec -it resume-analyzer-frontend sh
  ```

- Common issues:
  - DNS resolution problems: Check Docker's network settings
  - Pinecone API connection: Verify API key and network connectivity
  - MongoDB connection: Ensure the connection string is correct

## Development

For local development without Docker:

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Security

- Non-root users are used in Docker containers
- Environment variables for sensitive information
- HTTPS recommended for production deployment

## License

[MIT License](LICENSE)
