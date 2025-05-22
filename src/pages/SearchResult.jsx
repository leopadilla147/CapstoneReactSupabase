import React, { useEffect, useState } from 'react';
import bgImage from "../assets/bg-gradient.png";
import { useLocation } from 'react-router-dom';
import TopNavbar from '../components/topNavBar';
import { supabase } from '../connect-supabase';

function useQuery() {
  const location = useLocation();
  return new URLSearchParams(location.search);
}

function truncateText(text, maxLines = 8, maxCharsPerLine = 650) {
  if (!text) return '';
  
  const lines = text.split('\n');
  let result = [];
  let totalChars = 0;
  
  for (let i = 0; i < lines.length; i++) {
    if (result.length >= maxLines) {
      result.push('...');
      break;
    }
    
    const line = lines[i];
    if (line.length > maxCharsPerLine) {
      result.push(line.substring(0, maxCharsPerLine) + '...');
      totalChars += maxCharsPerLine;
    } else {
      result.push(line);
      totalChars += line.length;
    }
    
    if (totalChars >= maxLines * maxCharsPerLine * 0.7) {
      if (i < lines.length - 1) {
        result.push('...');
      }
      break;
    }
  }
  
  return result.join('\n');
}

function highlightMatches(text, keyword) {
  if (!keyword.trim()) return text;

  const escapedKeyword = keyword.replace(/[-[\]/{}()*+?.\\^$|]/g, "\\$&");
  const regex = new RegExp(escapedKeyword, "gi");
  
  return text.replace(regex, match => `<span class="bg-yellow-200">${match}</span>`);
}

function ResultsPage() {
  const query = useQuery().get('q') || '';
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('thesestwo')
          .select('thesisID, title, author, abstract, qr_code_url')
          .or(`title.ilike.%${query}%,author.ilike.%${query}%,abstract.ilike.%${query}%`)
          .order('title', { ascending: true });

        if (error) throw error;
        setResults(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (query) fetchResults();
  }, [query]);

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed font-sans"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <TopNavbar />

      {/* Filters Bar */}
      <div className="flex justify-between items-center flex-wrap gap-4 px-8 py-4 bg-white/90 border-b border-gray-300">
        <div>
          <h3 className="text-lg font-bold text-black m-0">Search Results</h3>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-sm font-medium text-black">
            {loading ? 'Searching...' : `Found ${results.length} results`}
          </span>
        </div>
      </div>

      {/* Results Area */}
      <div className="p-6 space-y-4 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-red-800 mb-4">
          {query ? `Results for: "${query}"` : 'All Theses'}
        </h2>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-800"></div>
          </div>
        ) : error ? (
          <div className="bg-white p-8 rounded-xl shadow-md text-center">
            <p className="text-red-500 text-lg">Error: {error}</p>
          </div>
        ) : results.length === 0 ? (
          <div className="bg-white p-8 rounded-xl shadow-md text-center">
            <p className="text-gray-600 text-lg">No results found.</p>
          </div>
        ) : (
          results.map((item) => (
            <div
              key={item.thesisID}
              className="bg-white p-6 rounded-xl shadow-md flex flex-col lg:flex-row gap-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex-grow min-w-0">
                <h3 className="text-lg font-semibold text-red-700 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600 mb-3">
                  <span className="font-medium">Author(s):</span> {item.author}
                </p>
                <div
                  className="text-sm text-gray-800 whitespace-pre-line bg-gray-50 p-3 rounded"
                  style={{ height: '135px', overflow: 'hidden' }}
                  dangerouslySetInnerHTML={{
                    __html: highlightMatches(truncateText(item.abstract), query) || 'No abstract available'
                  }}
                />
              </div>
              
              {item.qr_code_url && (
                <div className="flex-shrink-0 flex items-center justify-center">
                  <img
                    src={item.qr_code_url}
                    alt="QR Code"
                    className="w-[135px] h-[135px] object-contain border border-gray-200"
                  />
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ResultsPage;