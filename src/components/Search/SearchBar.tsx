import React, { useState, useRef, useEffect } from 'react';
import { useSearch } from '../../hooks/useSearch';
import { useNavigate } from 'react-router-dom';
import { MagnifyingGlassIcon, XMarkIcon, ClockIcon } from '@heroicons/react/24/outline';

export const SearchBar: React.FC = () => {
  const navigate = useNavigate();
  const { 
    query, 
    suggestions, 
    recentSearches, 
    search, 
    getSuggestions, 
    clearRecentSearches 
  } = useSearch();
  
  const [inputValue, setInputValue] = useState(query);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (inputValue.trim() && inputValue !== query) {
        getSuggestions(inputValue);
      }
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [inputValue, query, getSuggestions]);

  const handleSearch = async (searchQuery: string) => {
    if (searchQuery.trim()) {
      await search(searchQuery);
      navigate('/search');
      setShowSuggestions(false);
      inputRef.current?.blur();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setShowSuggestions(true);
    setActiveSuggestion(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const allSuggestions = [...recentSearches, ...suggestions];
    
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveSuggestion(prev => 
        prev < allSuggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveSuggestion(prev => prev > 0 ? prev - 1 : -1);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeSuggestion >= 0) {
        const selectedSuggestion = allSuggestions[activeSuggestion];
        setInputValue(selectedSuggestion);
        handleSearch(selectedSuggestion);
      } else {
        handleSearch(inputValue);
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setActiveSuggestion(-1);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    handleSearch(suggestion);
  };

  const clearInput = () => {
    setInputValue('');
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  return (
    <div className="relative">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => {
            // Delay hiding suggestions to allow clicks
            setTimeout(() => setShowSuggestions(false), 200);
          }}
          placeholder="Search documents, projects, or content..."
          className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        />
        {inputValue && (
          <button
            onClick={clearInput}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <XMarkIcon className="h-4 w-4 text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>

      {/* Suggestions dropdown */}
      {showSuggestions && (inputValue || recentSearches.length > 0) && (
        <div
          ref={suggestionsRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto"
        >
          {/* Recent searches */}
          {recentSearches.length > 0 && !inputValue && (
            <div className="p-2">
              <div className="flex items-center justify-between px-3 py-2">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Recent Searches
                </span>
                <button
                  onClick={clearRecentSearches}
                  className="text-xs text-gray-400 hover:text-gray-600"
                >
                  Clear
                </button>
              </div>
              {recentSearches.map((search, index) => (
                <button
                  key={`recent-${index}`}
                  onClick={() => handleSuggestionClick(search)}
                  className={`w-full text-left px-3 py-2 text-sm rounded-md hover:bg-gray-50 flex items-center ${
                    activeSuggestion === index ? 'bg-gray-50' : ''
                  }`}
                >
                  <ClockIcon className="w-4 h-4 mr-3 text-gray-400" />
                  {search}
                </button>
              ))}
            </div>
          )}

          {/* Suggestions */}
          {suggestions.length > 0 && inputValue && (
            <div className="p-2">
              {recentSearches.length > 0 && <div className="border-t border-gray-100 my-2" />}
              <div className="px-3 py-2">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Suggestions
                </span>
              </div>
              {suggestions.map((suggestion, index) => {
                const adjustedIndex = recentSearches.length + index;
                return (
                  <button
                    key={`suggestion-${index}`}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className={`w-full text-left px-3 py-2 text-sm rounded-md hover:bg-gray-50 flex items-center ${
                      activeSuggestion === adjustedIndex ? 'bg-gray-50' : ''
                    }`}
                  >
                    <MagnifyingGlassIcon className="w-4 h-4 mr-3 text-gray-400" />
                    {suggestion}
                  </button>
                );
              })}
            </div>
          )}

          {/* No results */}
          {inputValue && suggestions.length === 0 && recentSearches.length === 0 && (
            <div className="p-4 text-sm text-gray-500 text-center">
              No suggestions found
            </div>
          )}
        </div>
      )}
    </div>
  );
};