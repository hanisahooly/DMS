import React, { useState } from 'react';
import { useDocuments } from '../hooks/useDocuments';
import { useAppSelector, useAppDispatch } from '../hooks/redux';
import { setViewMode, setShowFilters } from '../store/slices/uiSlice';
import { DocumentGrid } from '../components/Documents/DocumentGrid';
import { DocumentFilters } from '../components/Documents/DocumentFilters';
import { 
  Squares2X2Icon, 
  ListBulletIcon, 
  TableCellsIcon,
  FunnelIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';

export const Documents: React.FC = () => {
  const dispatch = useAppDispatch();
  const { viewMode, showFilters } = useAppSelector(state => state.ui);
  const {
    documents,
    selectedDocuments,
    filters,
    isLoading,
    totalCount,
    currentPage,
    pageSize,
    sortBy,
    sortOrder,
    setFilters,
    clearFilters,
    toggleSelection,
    clearSelection,
    setSortBy,
    setCurrentPage,
    delete: deleteDocument,
    update: updateDocument,
  } = useDocuments();

  const [selectedDocument, setSelectedDocument] = useState(null);

  const totalPages = Math.ceil(totalCount / pageSize);

  const handleDocumentClick = (document: any) => {
    setSelectedDocument(document);
    // In a real app, this would open a document viewer
    console.log('Opening document:', document);
  };

  const handleBulkDelete = async () => {
    if (selectedDocuments.length === 0) return;
    
    if (confirm(`Are you sure you want to delete ${selectedDocuments.length} document(s)?`)) {
      for (const id of selectedDocuments) {
        await deleteDocument(id);
      }
      clearSelection();
    }
  };

  const viewModeButtons = [
    { mode: 'grid', icon: Squares2X2Icon, label: 'Grid' },
    { mode: 'list', icon: ListBulletIcon, label: 'List' },
    { mode: 'table', icon: TableCellsIcon, label: 'Table' },
  ];

  return (
    <div className="h-full flex">
      {/* Filters Sidebar */}
      {showFilters && (
        <DocumentFilters
          filters={filters}
          onFiltersChange={setFilters}
          onClearFilters={clearFilters}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
              <p className="text-sm text-gray-600 mt-1">
                {totalCount} documents found
              </p>
            </div>

            <div className="flex items-center space-x-4">
              {/* Bulk Actions */}
              {selectedDocuments.length > 0 && (
                <div className="flex items-center space-x-2 bg-primary-50 border border-primary-200 rounded-lg px-3 py-2">
                  <span className="text-sm font-medium text-primary-700">
                    {selectedDocuments.length} selected
                  </span>
                  <button
                    onClick={handleBulkDelete}
                    className="text-sm text-red-600 hover:text-red-700 font-medium"
                  >
                    Delete
                  </button>
                  <button
                    onClick={clearSelection}
                    className="text-sm text-gray-600 hover:text-gray-700 font-medium"
                  >
                    Clear
                  </button>
                </div>
              )}

              {/* Sort */}
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split('-');
                  setSortBy(field, order as 'asc' | 'desc');
                }}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="uploadDate-desc">Newest first</option>
                <option value="uploadDate-asc">Oldest first</option>
                <option value="name-asc">Name A-Z</option>
                <option value="name-desc">Name Z-A</option>
                <option value="size-desc">Largest first</option>
                <option value="size-asc">Smallest first</option>
              </select>

              {/* View Mode */}
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                {viewModeButtons.map(({ mode, icon: Icon, label }) => (
                  <button
                    key={mode}
                    onClick={() => dispatch(setViewMode(mode as any))}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === mode
                        ? 'bg-white text-primary-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                    title={label}
                  >
                    <Icon className="w-4 h-4" />
                  </button>
                ))}
              </div>

              {/* Filters Toggle */}
              <button
                onClick={() => dispatch(setShowFilters(!showFilters))}
                className={`p-2 rounded-lg border transition-colors ${
                  showFilters
                    ? 'bg-primary-50 border-primary-200 text-primary-600'
                    : 'bg-white border-gray-300 text-gray-600 hover:text-gray-900'
                }`}
              >
                <FunnelIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <DocumentGrid
            documents={documents}
            isLoading={isLoading}
            selectedDocuments={selectedDocuments}
            onToggleSelect={toggleSelection}
            onDelete={deleteDocument}
            onUpdate={updateDocument}
            onClick={handleDocumentClick}
          />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
              <div className="text-sm text-gray-700">
                Showing {(currentPage - 1) * pageSize + 1} to{' '}
                {Math.min(currentPage * pageSize, totalCount)} of {totalCount} results
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-md border border-gray-300 text-gray-600 hover:text-gray-900 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeftIcon className="w-4 h-4" />
                </button>
                
                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-3 py-2 rounded-md text-sm font-medium ${
                          currentPage === pageNum
                            ? 'bg-primary-600 text-white'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-md border border-gray-300 text-gray-600 hover:text-gray-900 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRightIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};