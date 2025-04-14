import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h2 className="text-xl font-bold">
              <span className="text-blue-400">Resume</span> Analyzer
            </h2>
            <p className="text-gray-400 mt-2">Streamline your hiring process with AI</p>
          </div>
          <div className="flex flex-col md:flex-row md:space-x-8">
            <div className="mb-4 md:mb-0">
              <h3 className="text-lg font-semibold mb-2">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="/" className="text-gray-400 hover:text-blue-400 transition-colors">Home</a></li>
                <li><a href="/dashboard" className="text-gray-400 hover:text-blue-400 transition-colors">Dashboard</a></li>
                <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">About</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Contact</h3>
              <ul className="space-y-2">
                <li className="text-gray-400">support@resumeanalyzer.com</li>
                <li className="text-gray-400">+1 (555) 123-4567</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Resume Analyzer. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
