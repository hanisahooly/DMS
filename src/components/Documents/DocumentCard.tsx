import React, { useState } from 'react';
import { Document } from '../../types/document';
import { formatFileSize, getFileIcon, getFileTypeColor } from '../../utils/fileUtils';
import { format } from 'date-fns';
import { 
  EllipsisVerticalIcon, 
  EyeIcon, 
  PencilIcon, 
  TrashIcon, 
  ArrowDownTrayIcon,
  StarIcon,
  ShareIcon,
  DocumentDuplicateIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { Menu, Transition } from '@headlessui/react';

interface DocumentCardProps {
  document: Document;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Document>) => void;
  onClick: (document: Document) => void;
  isSelected?: boolean;
  onToggleSelect?: (id: string) => void;
}

export const DocumentCard: React.FC<DocumentCardProps> = ({
  document,
  onDelete,
  onUpdate,
  onClick,
  isSelected = false,
  onToggleSelect,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(document.name);

  const handleSaveEdit = () => {
    if (editName.trim() && editName !== document.name) {
      onUpdate(document.id, { name: editName.trim() });
    }
    setIsEditing(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      setEditName(document.name);
      setIsEditing(false);
    }
  };

  const handleCardClick = (e: React.MouseEvent) => {
    if (isEditing) return;
    
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('input')) return;
    
    onClick(document);
  };

  const toggleFavorite = () => {
    onUpdate(document.id, { isFavorite: !document.isFavorite });
  };

  return (
    <div 
      className={`group bg-white rounded-xl border-2 transition-all duration-200 overflow-hidden cursor-pointer hover:shadow-lg ${
        isSelected 
          ? 'border-primary-500 shadow-md' 
          : 'border-gray-200 hover:border-gray-300'
      }`}
      onClick={handleCardClick}
    >
      {/* Selection checkbox */}
      {onToggleSelect && (
        <div className="absolute top-3 left-3 z-10">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onToggleSelect(document.id)}
            onClick={(e) => e.stopPropagation()}
            className="w-4 h-4 text-primary-600 bg-white border-gray-300 rounded focus:ring-primary-500 focus:ring-2"
          />
        </div>
      )}

      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="text-4xl">{getFileIcon(document.type)}</div>
          
          <div className="flex items-center space-x-2">
            {/* Favorite button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite();
              }}
              className={`p-1 rounded-md transition-colors ${
                document.isFavorite 
                  ? 'text-yellow-500 hover:text-yellow-600' 
                  : 'text-gray-400 hover:text-yellow-500 opacity-0 group-hover:opacity-100'
              }`}
            >
              {document.isFavorite ? (
                <StarIconSolid className="w-5 h-5" />
              ) : (
                <StarIcon className="w-5 h-5" />
              )}
            </button>

            {/* Menu */}
            <Menu as="div" className="relative opacity-0 group-hover:opacity-100 transition-opacity">
              <Menu.Button
                onClick={(e) => e.stopPropagation()}
                className="p-1 rounded-md hover:bg-gray-100 text-gray-400 hover:text-gray-600"
              >
                <EllipsisVerticalIcon className="w-5 h-5" />
              </Menu.Button>
              
              <Transition
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20 py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onClick(document);
                        }}
                        className={`${
                          active ? 'bg-gray-50' : ''
                        } flex items-center w-full px-4 py-2 text-sm text-gray-700`}
                      >
                        <EyeIcon className="w-4 h-4 mr-3" />
                        Open
                      </button>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsEditing(true);
                        }}
                        className={`${
                          active ? 'bg-gray-50' : ''
                        } flex items-center w-full px-4 py-2 text-sm text-gray-700`}
                      >
                        <PencilIcon className="w-4 h-4 mr-3" />
                        Rename
                      </button>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          // Handle download
                        }}
                        className={`${
                          active ? 'bg-gray-50' : ''
                        } flex items-center w-full px-4 py-2 text-sm text-gray-700`}
                      >
                        <ArrowDownTrayIcon className="w-4 h-4 mr-3" />
                        Download
                      </button>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          // Handle share
                        }}
                        className={`${
                          active ? 'bg-gray-50' : ''
                        } flex items-center w-full px-4 py-2 text-sm text-gray-700`}
                      >
                        <ShareIcon className="w-4 h-4 mr-3" />
                        Share
                      </button>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          // Handle duplicate
                        }}
                        className={`${
                          active ? 'bg-gray-50' : ''
                        } flex items-center w-full px-4 py-2 text-sm text-gray-700`}
                      >
                        <DocumentDuplicateIcon className="w-4 h-4 mr-3" />
                        Duplicate
                      </button>
                    )}
                  </Menu.Item>
                  <div className="border-t border-gray-100 my-1"></div>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(document.id);
                        }}
                        className={`${
                          active ? 'bg-gray-50' : ''
                        } flex items-center w-full px-4 py-2 text-sm text-red-600`}
                      >
                        <TrashIcon className="w-4 h-4 mr-3" />
                        Delete
                      </button>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>
        
        <div className="space-y-3">
          {isEditing ? (
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onBlur={handleSaveEdit}
              onKeyDown={handleKeyPress}
              onClick={(e) => e.stopPropagation()}
              className="w-full text-sm font-medium text-gray-900 bg-gray-50 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              autoFocus
            />
          ) : (
            <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 leading-5 min-h-[2.5rem]">
              {document.name}
            </h3>
          )}
          
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>{formatFileSize(document.size)}</span>
            <span>{format(document.uploadDate, 'MMM d, yyyy')}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getFileTypeColor(document.type)}`}>
              {document.type.toUpperCase()}
            </span>
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
              {document.category}
            </span>
          </div>
          
          {document.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {document.tags.slice(0, 2).map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-gray-100 text-gray-600"
                >
                  #{tag}
                </span>
              ))}
              {document.tags.length > 2 && (
                <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-gray-100 text-gray-600">
                  +{document.tags.length - 2} more
                </span>
              )}
            </div>
          )}

          {/* Author and project info */}
          <div className="pt-2 border-t border-gray-100">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>By {document.author}</span>
              {document.projectId && (
                <span className="bg-gray-100 px-2 py-1 rounded">
                  Project #{document.projectId.slice(-4)}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};