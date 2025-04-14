import React, { useState, useEffect } from 'react';

const CandidateList = ({ candidates, selectedId, onSelectCandidate }) => {
  const [filteredCandidates, setFilteredCandidates] = useState([]);
  const [filters, setFilters] = useState({
    skills: '',
    education: '',
    college: '',
    experience: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  // Apply filters whenever candidates or filter values change
  useEffect(() => {
    if (!candidates || candidates.length === 0) {
      setFilteredCandidates([]);
      return;
    }

    let result = [...candidates];

    // Filter by skills
    if (filters.skills.trim()) {
      const skillsArray = filters.skills.toLowerCase().split(',').map(s => s.trim());
      result = result.filter(candidate => {
        const candidateSkills = candidate.resume_data?.Skills || [];
        return skillsArray.some(skill => 
          candidateSkills.some(s => s.toLowerCase().includes(skill))
        );
      });
    }

    // Filter by education level
    if (filters.education.trim()) {
      const educationSearch = filters.education.toLowerCase();
      result = result.filter(candidate => {
        const education = candidate.resume_data?.Education || {};
        
        // Handle different education data structures
        if (Array.isArray(education)) {
          return education.some(edu => 
            (edu.Degree || '').toLowerCase().includes(educationSearch)
          );
        } else {
          return (education.Degree || '').toLowerCase().includes(educationSearch);
        }
      });
    }

    // Filter by college/institution
    if (filters.college.trim()) {
      const collegeSearch = filters.college.toLowerCase();
      result = result.filter(candidate => {
        const education = candidate.resume_data?.Education || {};
        
        // Handle different education data structures
        if (Array.isArray(education)) {
          return education.some(edu => 
            (edu.Institution || '').toLowerCase().includes(collegeSearch)
          );
        } else {
          return (education.Institution || '').toLowerCase().includes(collegeSearch);
        }
      });
    }

    // Filter by years of experience
    if (filters.experience.trim()) {
      const minExperience = parseInt(filters.experience);
      if (!isNaN(minExperience)) {
        result = result.filter(candidate => {
          const workExperience = candidate.resume_data?.['Work Experience'] || [];
          
          // Calculate total years of experience
          let totalYears = 0;
          
          // Handle array of work experiences
          if (Array.isArray(workExperience)) {
            workExperience.forEach(exp => {
              const dates = exp.Dates || exp.date || exp.Duration || exp.Period || '';
              if (dates) {
                // Try to extract years from date ranges like "2020 - 2023" or "2020 – Present"
                const yearMatch = dates.match(/(\d{4})\s*[-–]\s*(\d{4}|Present|present|Current|current)/i);
                if (yearMatch) {
                  const startYear = parseInt(yearMatch[1]);
                  const endYear = yearMatch[2].match(/\d{4}/) 
                    ? parseInt(yearMatch[2]) 
                    : new Date().getFullYear();
                  
                  if (!isNaN(startYear) && !isNaN(endYear)) {
                    totalYears += (endYear - startYear);
                  }
                }
              }
            });
          } 
          // Handle object work experience
          else if (typeof workExperience === 'object') {
            const dates = workExperience.Dates || workExperience.date || workExperience.Duration || workExperience.Period || '';
            if (dates) {
              const yearMatch = dates.match(/(\d{4})\s*[-–]\s*(\d{4}|Present|present|Current|current)/i);
              if (yearMatch) {
                const startYear = parseInt(yearMatch[1]);
                const endYear = yearMatch[2].match(/\d{4}/) 
                  ? parseInt(yearMatch[2]) 
                  : new Date().getFullYear();
                
                if (!isNaN(startYear) && !isNaN(endYear)) {
                  totalYears += (endYear - startYear);
                }
              }
            }
          }
          
          return totalYears >= minExperience;
        });
      }
    }

    setFilteredCandidates(result);
  }, [candidates, filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      skills: '',
      education: '',
      college: '',
      experience: ''
    });
  };

  if (!candidates || candidates.length === 0) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md mt-4">
        <p className="text-gray-500 text-center py-8">No candidates available</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md mt-4 overflow-hidden">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-lg font-semibold">Candidates</h2>
        <button 
          onClick={() => setShowFilters(!showFilters)}
          className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>
      </div>

      {showFilters && (
        <div className="p-4 bg-gray-50 border-b">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Skills (comma separated)</label>
              <input
                type="text"
                name="skills"
                value={filters.skills}
                onChange={handleFilterChange}
                placeholder="e.g. React, Python, SQL"
                className="w-full p-2 border rounded-md text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Education Level</label>
              <input
                type="text"
                name="education"
                value={filters.education}
                onChange={handleFilterChange}
                placeholder="e.g. Bachelor, Master, PhD"
                className="w-full p-2 border rounded-md text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">College/Institution</label>
              <input
                type="text"
                name="college"
                value={filters.college}
                onChange={handleFilterChange}
                placeholder="e.g. MIT, Stanford"
                className="w-full p-2 border rounded-md text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Min. Years of Experience</label>
              <input
                type="number"
                name="experience"
                value={filters.experience}
                onChange={handleFilterChange}
                placeholder="e.g. 2"
                min="0"
                className="w-full p-2 border rounded-md text-sm"
              />
            </div>
          </div>
          <div className="mt-3 flex justify-between items-center">
            <span className="text-sm text-gray-500">
              {filteredCandidates.length} of {candidates.length} candidates
            </span>
            <button
              onClick={clearFilters}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Clear Filters
            </button>
          </div>
        </div>
      )}

      <div className="max-h-[500px] overflow-y-auto">
        {filteredCandidates.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No candidates match your filters</p>
        ) : (
          filteredCandidates.map((candidate) => {
            const resumeData = candidate.resume_data || {};
            const name = resumeData['Full Name'] || 'Unknown';
            const email = resumeData['Email'] || 'No email';
            
            return (
              <div
                key={candidate._id}
                onClick={() => onSelectCandidate(candidate)}
                className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedId === candidate._id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                }`}
              >
                <h3 className="font-medium text-gray-900">{name}</h3>
                <p className="text-sm text-gray-600">{email}</p>
                {resumeData.Skills && resumeData.Skills.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {resumeData.Skills.slice(0, 3).map((skill, index) => (
                      <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
                        {skill}
                      </span>
                    ))}
                    {resumeData.Skills.length > 3 && (
                      <span className="text-xs text-gray-500">+{resumeData.Skills.length - 3} more</span>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default CandidateList;
