import React from 'react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-indigo-800 text-white py-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Streamline Your Hiring Process with AI-Powered Resume Analysis
            </h1>
            <p className="text-xl mb-8 text-blue-100">
              Quickly analyze resumes, extract key information, and find the perfect candidates 
              for your positions using advanced AI technology.
            </p>
            <Link 
              to="/dashboard" 
              className="bg-white text-blue-700 font-bold py-3 px-8 rounded-full 
                        hover:bg-blue-100 transition-colors duration-300 inline-block"
            >
              Get Started
            </Link>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
              <div className="border-b-2 border-gray-200 pb-4 mb-4">
                <div className="h-6 bg-blue-100 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-100 rounded w-1/2"></div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="h-4 w-4 rounded-full bg-green-400 mr-2"></div>
                  <div className="h-4 bg-gray-100 rounded w-3/4"></div>
                </div>
                <div className="flex items-center">
                  <div className="h-4 w-4 rounded-full bg-blue-400 mr-2"></div>
                  <div className="h-4 bg-gray-100 rounded w-2/3"></div>
                </div>
                <div className="flex items-center">
                  <div className="h-4 w-4 rounded-full bg-yellow-400 mr-2"></div>
                  <div className="h-4 bg-gray-100 rounded w-5/6"></div>
                </div>
                <div className="flex items-center">
                  <div className="h-4 w-4 rounded-full bg-purple-400 mr-2"></div>
                  <div className="h-4 bg-gray-100 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
