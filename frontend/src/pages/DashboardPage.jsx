import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ResumeUploader from '../components/ResumeUploader';
import CandidateList from '../components/CandidateList';
import CandidateDetails from '../components/CandidateDetails';

const DashboardPage = () => {
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch all resumes when component mounts
  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const response = await axios.get('http://localhost:5000/api/resumes');
      setCandidates(response.data);
      setIsLoading(false);
    } catch (err) {
      setError('Failed to fetch resumes. Please try again later.');
      setIsLoading(false);
      console.error('Error fetching resumes:', err);
    }
  };

  const handleUploadSuccess = (newResumeData) => {
    // Add the new resume to the candidates list
    setCandidates(prevCandidates => [
      {
        _id: newResumeData._id,
        resume_data: newResumeData,
        original_filename: '',
        uploaded_at: new Date().toISOString()
      },
      ...prevCandidates
    ]);
    
    // Select the newly uploaded resume
    setSelectedCandidate({
      _id: newResumeData._id,
      resume_data: newResumeData,
      original_filename: '',
      uploaded_at: new Date().toISOString()
    });
  };

  const handleSelectCandidate = (candidate) => {
    setSelectedCandidate(candidate);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Resume Dashboard</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel */}
          <div className="lg:col-span-1 space-y-4">
            <ResumeUploader onUploadSuccess={handleUploadSuccess} />
            
            {isLoading ? (
              <div className="bg-white p-4 rounded-lg shadow-md mt-4">
                <p className="text-center text-gray-500">Loading candidates...</p>
              </div>
            ) : error ? (
              <div className="bg-white p-4 rounded-lg shadow-md mt-4">
                <p className="text-center text-red-500">{error}</p>
                <button 
                  onClick={fetchResumes}
                  className="mt-2 w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Retry
                </button>
              </div>
            ) : (
              <CandidateList 
                candidates={candidates} 
                selectedId={selectedCandidate?._id}
                onSelectCandidate={handleSelectCandidate} 
              />
            )}
          </div>
          
          {/* Right Panel */}
          <div className="lg:col-span-2">
            <CandidateDetails candidate={selectedCandidate} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DashboardPage;
