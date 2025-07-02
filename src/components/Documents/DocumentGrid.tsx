import React from 'react';
import { Document } from '../../types/document';
import { DocumentCard } from './DocumentCard';
import { LoadingSpinner } from '../Common/LoadingSpinner';

interface DocumentGridProps {
  documents: Document[];
  isLoading?: boolean;
  selectedDocuments?: string[];
  onToggleSelect?: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Document>) => void;
  onClick: (document: Document) => void;
}

export const DocumentGrid: React.FC<DocumentGridProps> = ({
  documents,
  isLoading = false,
  selectedDocuments = [],
  onToggleSelect,
  onDelete,
  onUpdate,
  onClick,
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📄</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No documents found</h3>
        <p className="text-gray-500 mb-6">
          Get started by uploading your first document or adjust your search filters.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
      {documents.map((document) => (
        <DocumentCard
          key={document.id}
          document={document}
          onDelete={onDelete}
          onUpdate={onUpdate}
          onClick={onClick}
          isSelected={selectedDocuments.includes(document.id)}
          onToggleSelect={onToggleSelect}
        />
      ))}
    </div>
  );
};