import React from 'react';

const CandidateDetails = ({ candidate }) => {
  if (!candidate) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-md h-full flex items-center justify-center">
        <p className="text-gray-500 text-center">Select a candidate to view details</p>
      </div>
    );
  }

  const resumeData = candidate.resume_data || {};

  // Helper function to render array or object items
  const renderListItems = (items, itemType = "") => {
    if (!items) return null;
    
    // If items is an array of strings
    if (Array.isArray(items) && typeof items[0] === 'string') {
      return (
        <div className="flex flex-wrap gap-2">
          {items.map((item, index) => (
            <span 
              key={index} 
              className={`px-3 py-1 rounded-full text-sm ${
                itemType === "skill" || itemType === "technology" 
                  ? "bg-blue-100 text-blue-800" 
                  : "bg-blue-100 text-blue-800"
              }`}
            >
              {item}
            </span>
          ))}
        </div>
      );
    }
    
    // If items is an array of objects
    if (Array.isArray(items) && typeof items[0] === 'object') {
      return (
        <div className="space-y-4">
          {items.map((item, index) => (
            <div key={index} className="border-l-2 border-blue-500 pl-4 py-1">
              {Object.entries(item).map(([key, value]) => {
                // Handle nested arrays (like Description)
                if (Array.isArray(value)) {
                  return (
                    <div key={key} className="mb-2">
                      <span className="font-medium text-gray-700">{key}:</span>
                      <ul className="list-disc list-inside ml-2 mt-1 text-gray-600">
                        {value.map((desc, i) => (
                          <li key={i}>{desc}</li>
                        ))}
                      </ul>
                    </div>
                  );
                }
                
                // Handle Technologies/Skills in projects
                if ((key === "Technologies" || key === "Skills") && Array.isArray(value)) {
                  return (
                    <div key={key} className="mb-2">
                      <span className="font-medium text-gray-700">{key}:</span>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {value.map((tech, i) => (
                          <span key={i} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                }
                
                return (
                  <div key={key} className="mb-1">
                    <span className="font-medium text-gray-700">{key}: </span>
                    <span className="text-gray-600">{value}</span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      );
    }
    
    // If items is an object
    if (typeof items === 'object' && !Array.isArray(items)) {
      return (
        <div className="border-l-2 border-blue-500 pl-4 py-1">
          {Object.entries(items).map(([key, value]) => {
            // Handle nested arrays
            if (Array.isArray(value)) {
              // Special handling for Technologies/Skills
              if (key === "Technologies" || key === "Skills") {
                return (
                  <div key={key} className="mb-2">
                    <span className="font-medium text-gray-700">{key}:</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {value.map((tech, i) => (
                        <span key={i} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              }
              
              return (
                <div key={key} className="mb-2">
                  <span className="font-medium text-gray-700">{key}:</span>
                  <ul className="list-disc list-inside ml-2 mt-1 text-gray-600">
                    {value.map((desc, i) => (
                      <li key={i}>{desc}</li>
                    ))}
                  </ul>
                </div>
              );
            }
            
            return (
              <div key={key} className="mb-1">
                <span className="font-medium text-gray-700">{key}: </span>
                <span className="text-gray-600">{value}</span>
              </div>
            );
          })}
        </div>
      );
    }
    
    return null;
  };

  // Define sections to display with blue-shaded color schemes
  const sections = [
    {
      title: "Personal Information",
      color: "bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-500",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {resumeData["Full Name"] && (
            <div className="mb-2">
              <span className="text-gray-600 font-medium">Full Name: </span>
              <span className="text-gray-800">{resumeData["Full Name"]}</span>
            </div>
          )}
          {resumeData["Email"] && (
            <div className="mb-2">
              <span className="text-gray-600 font-medium">Email: </span>
              <span className="text-gray-800">{resumeData["Email"]}</span>
            </div>
          )}
          {resumeData["Phone Number"] && (
            <div className="mb-2">
              <span className="text-gray-600 font-medium">Phone: </span>
              <span className="text-gray-800">{resumeData["Phone Number"]}</span>
            </div>
          )}
          {resumeData["Other relevant information"] && (
            <div className="col-span-2">
              <span className="text-gray-600 font-medium">Other Information: </span>
              <div className="ml-4 mt-1">
                {Object.entries(resumeData["Other relevant information"]).map(([key, value]) => (
                  <div key={key} className="mb-1">
                    <span className="font-medium text-gray-700">{key}: </span>
                    {Array.isArray(value) ? (
                      <div className="flex flex-wrap gap-2 mt-1">
                        {value.map((item, i) => (
                          <span key={i} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                            {item}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-600">{value}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )
    },
    {
      title: "Summary",
      color: "bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-500",
      content: resumeData["Summary"] && (
        <p className="text-gray-700 whitespace-pre-line">{resumeData["Summary"]}</p>
      )
    },
    {
      title: "Skills",
      color: "bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-500",
      content: resumeData["Skills"] && renderListItems(resumeData["Skills"], "skill")
    },
    {
      title: "Work Experience",
      color: "bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-500",
      content: resumeData["Work Experience"] && renderListItems(resumeData["Work Experience"])
    },
    {
      title: "Education",
      color: "bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-500",
      content: resumeData["Education"] && renderListItems(resumeData["Education"])
    },
    {
      title: "Projects",
      color: "bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-500",
      content: resumeData["Projects"] && renderListItems(resumeData["Projects"])
    },
    {
      title: "Achievements",
      color: "bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-500",
      content: resumeData["Achievements"] && renderListItems(resumeData["Achievements"])
    },
    {
      title: "Certifications",
      color: "bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-500",
      content: resumeData["Certifications"] && renderListItems(resumeData["Certifications"])
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md h-full overflow-y-auto">
      <div className="p-6 border-b bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <h2 className="text-2xl font-bold">{resumeData["Full Name"] || "Candidate Details"}</h2>
        {resumeData["Email"] && (
          <p className="text-blue-100">{resumeData["Email"]}</p>
        )}
        {resumeData["Phone Number"] && (
          <p className="text-blue-100">{resumeData["Phone Number"]}</p>
        )}
      </div>

      <div className="p-6 space-y-8">
        {sections.map((section, index) => (
          section.content ? (
            <div key={index} className="border-b pb-6 last:border-b-0 last:pb-0">
              <h3 className={`text-lg font-semibold mb-4 text-gray-800 ${section.color} px-4 py-2 rounded-md shadow-sm`}>
                {section.title}
              </h3>
              <div className="ml-1 mt-4">
                {section.content}
              </div>
            </div>
          ) : null
        ))}
        
        <div className="text-xs text-gray-400 mt-6 pt-4 border-t">
          <p>Resume uploaded: {new Date(candidate.uploaded_at).toLocaleString()}</p>
          <p>Original filename: {candidate.original_filename}</p>
        </div>
      </div>
    </div>
  );
};

export default CandidateDetails;
