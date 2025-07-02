import React from 'react';
import { useSearch } from '../hooks/useSearch';
import { DocumentCard } from '../components/Documents/DocumentCard';
import { LoadingSpinner } from '../components/Common/LoadingSpinner';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export const Search: React.FC = () => {
  const { query, results, isLoading, facets } = useSearch();

  if (!query) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <MagnifyingGlassIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Search Documents</h3>
          <p className="text-gray-500">
            Use the search bar above to find documents, projects, or content.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Search Results for "{query}"
        </h1>
        <p className="text-gray-600 mt-1">
          {results.length} results found
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      ) : results.length === 0 ? (
        <div className="text-center py-12">
          <MagnifyingGlassIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
          <p className="text-gray-500">
            Try adjusting your search terms or browse documents by category.
          </p>
        </div>
      ) : (
        <div className="flex gap-6">
          {/* Search Results */}
          <div className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {results.map((result) => (
                <div key={result.document.id} className="relative">
                  <DocumentCard
                    document={result.document}
                    onDelete={() => {}}
                    onUpdate={() => {}}
                    onClick={() => {}}
                  />
                  {/* Search highlights */}
                  {result.highlights.length > 0 && (
                    <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-md">
                      <p className="text-xs font-medium text-yellow-800 mb-1">Matches:</p>
                      {result.highlights.slice(0, 2).map((highlight, index) => (
                        <p key={index} className="text-xs text-yellow-700">
                          {highlight}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Search Facets */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-4">Refine Results</h3>
              
              {facets.categories.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Categories</h4>
                  <div className="space-y-1">
                    {facets.categories.map((category) => (
                      <div key={category.name} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{category.name}</span>
                        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                          {category.count}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {facets.fileTypes.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">File Types</h4>
                  <div className="space-y-1">
                    {facets.fileTypes.map((fileType) => (
                      <div key={fileType.name} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 uppercase">{fileType.name}</span>
                        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                          {fileType.count}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {facets.projects.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Projects</h4>
                  <div className="space-y-1">
                    {facets.projects.map((project) => (
                      <div key={project.name} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">#{project.name.slice(-4)}</span>
                        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                          {project.count}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};