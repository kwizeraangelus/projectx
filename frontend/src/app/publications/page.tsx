'use client'; 

import React, { useState, useMemo, useEffect } from 'react';
import { Metadata } from 'next';
import PublicationsClient from './PublicationsClient';
import { Publication } from './PublicationComponents';

// --- Data & Types ---

// Define the expected structure that matches your Django UploadSerializer output
interface Publication {
  id: number;
  title: string;
  author: string; // From user.get_full_name via serializer
  description: string;
  field_of_study: string; // The field used for filtering
  cover_url: string; // The URL for the cover image
  file_url: string;
}

const CORE_FIELDS = [
  'Engineering', 'Medicine/Health Sciences', 'Arts & Humanities', 'Natural Sciences',
  'Social Sciences', 'Business & Economics', 'Computer Science/IT', 'Education',
];

// --- Sub-Components: Publication Card ---

const PublicationCard: React.FC<Publication> = ({ title, author, description, cover_url, file_url }) => (
  <a 
    href={file_url} 
    target="_blank" 
    rel="noopener noreferrer" 
    className="bg-white p-4 rounded-lg shadow-xl flex flex-col h-full transform transition duration-300 hover:shadow-2xl hover:-translate-y-1 cursor-pointer"
  >
    <div className="w-full h-40 bg-gray-200 rounded-md mb-3 overflow-hidden">
        <img 
          src={cover_url} 
          alt={`Cover image for ${title}`} 
          className="w-full h-full object-cover"
          // Placeholder fallback in case cover_url is invalid
          onError={(e) => { e.currentTarget.src = 'https://placehold.co/400x200/cccccc/333333?text=No+Cover'; }}
        />
    </div>
    <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-2">{title}</h3>
    <p className="text-sm text-gray-600 mb-2 italic">By: {author}</p>
    <p className="text-sm text-gray-700 flex-grow overflow-hidden line-clamp-3">{description}</p>
    <div className="mt-3 text-xs font-semibold text-blue-600 flex items-center">
        Read Publication 
        <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
    </div>
  </a>
);

// --- Data Fetching Function ---

async function getPublications(): Promise<Publication[]> {
  // 🚨 API URL: Ensure this is correct for your Django setup
  const API_URL = 'http://127.0.0.1:8000/api/innovations/public-list/'; 
  
  try {
    const res = await fetch(API_URL, { cache: 'no-store' }); 
    
    if (!res.ok) {
      console.error(`Django API Error: ${res.status} ${res.statusText}. Check Django server status.`);
      return []; 
    }
    return res.json();
  } catch (error) {
    console.error("Failed to fetch publications from API:", error);
    return [];
  }
}

// --- Main Page Component ---

export default function PublicationsPage() {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [selectedField, setSelectedField] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch data on component mount
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      const data = await getPublications();
      setPublications(data);
      setIsLoading(false);
    }
    fetchData();
  }, []); 

  // Memoized filtering logic
  const filteredPublications = useMemo(() => {
    if (isLoading) return [];
    if (!selectedField) {
      return publications; 
    }
    // Filter must match the 'field_of_study' property from the API data
    return publications.filter(pub => pub.field_of_study === selectedField); 
  }, [selectedField, publications, isLoading]);
  
  // Button click handler
  const handleClick = (field: string) => {
    setSelectedField(prev => (prev === field ? null : field));
  };


  return (
    <div className="min-h-screen bg-green-900 bg-opacity-95 p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        
        <h1 className="text-4xl font-extrabold text-white mb-8 border-b-2 border-white/30 pb-2">Browse Research Publications</h1>

        {/* Field Buttons (Filtering logic) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-12">
          {CORE_FIELDS.map((field) => (
            <button 
              key={field}
              onClick={() => handleClick(field)}
              className={`
                w-full h-16 font-semibold text-xs sm:text-sm uppercase rounded-lg shadow-xl transition duration-200 ease-in-out
                ${selectedField === field 
                    ? 'bg-yellow-400 text-green-900 ring-4 ring-yellow-200' 
                    : 'bg-white text-gray-800 hover:bg-gray-100'
                }
              `}
            >
              {field}
            </button>
          ))}
        </div>

        <h2 className="text-2xl font-bold text-white mb-6 mt-10">
          {selectedField ? `Results for: ${selectedField}` : 'Latest Uploads (All Fields)'}
        </h2>

        {/* Publication Cards (Filtered) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {isLoading ? (
             <div className="col-span-full text-center text-white italic p-10 bg-white/10 rounded-lg shadow-inner">
                 <svg className="animate-spin h-5 w-5 mr-3 inline text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                 Fetching publications...
             </div>
          ) : filteredPublications.length === 0 ? (
            <p className="col-span-full text-white text-center text-xl p-10 bg-white/10 rounded-lg shadow-inner">
              {selectedField 
                ? `No publications found for "${selectedField}".` 
                : 'The API returned no publications. Please check your Django data.'
              }
            </p>
          ) : (
            filteredPublications.map((pub) => (
              <PublicationCard key={pub.id} {...pub} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}