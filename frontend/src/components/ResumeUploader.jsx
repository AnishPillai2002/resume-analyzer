import React, { useState } from 'react';
import axios from 'axios';

const ResumeUploader = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setError('');
    } else {
      setFile(null);
      setError('Please select a PDF file');
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a PDF file');
      return;
    }

    setIsUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:5000/api/analyze-resume', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setIsUploading(false);
      setFile(null);
      
      // Reset the file input
      document.getElementById('resume-file').value = '';
      
      // Call the parent component's callback with the uploaded resume data
      if (onUploadSuccess) {
        onUploadSuccess(response.data);
      }
    } catch (err) {
      setIsUploading(false);
      setError(err.response?.data?.error || 'Failed to upload resume');
    }
  };

  // Loading spinner component
  const LoadingSpinner = () => (
    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Upload Resume</h2>
      
      <div className="mb-4">
        <label 
          htmlFor="resume-file" 
          className="block w-full cursor-pointer text-center py-2 px-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors"
        >
          <div className="flex flex-col items-center justify-center py-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <span className="text-gray-600">
              {file ? file.name : 'Click to select PDF resume'}
            </span>
          </div>
          <input 
            id="resume-file" 
            type="file" 
            accept=".pdf" 
            className="hidden" 
            onChange={handleFileChange}
          />
        </label>
      </div>

      {error && (
        <div className="mb-4 text-red-500 text-sm">
          {error}
        </div>
      )}

      <button
        onClick={handleUpload}
        disabled={!file || isUploading}
        className={`w-full py-2 px-4 rounded-md font-medium flex items-center justify-center ${
          !file || isUploading
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-blue-600 text-white hover:bg-blue-700'
        } transition-colors`}
      >
        {isUploading ? (
          <>
            <LoadingSpinner />
            <span>Processing...</span>
          </>
        ) : (
          'Upload Resume'
        )}
      </button>
    </div>
  );
};

export default ResumeUploader;
