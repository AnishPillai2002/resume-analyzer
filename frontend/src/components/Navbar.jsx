import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-gray-800 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold flex items-center">
          <span className="text-blue-400">Resume</span>
          <span className="ml-1">Analyzer</span>
        </Link>
        <div className="flex space-x-6">
          <Link to="/" className="hover:text-blue-400 transition-colors">Home</Link>
          <Link to="/dashboard" className="hover:text-blue-400 transition-colors">Dashboard</Link>
          <Link to="#" className="hover:text-blue-400 transition-colors">About</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
