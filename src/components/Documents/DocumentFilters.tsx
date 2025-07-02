import React, { useState } from 'react';
import { useAppSelector } from '../../hooks/redux';
import { DocumentFilters as IDocumentFilters } from '../../types/document';
import { 
  FunnelIcon, 
  XMarkIcon,
  CalendarIcon,
  FolderIcon,
  TagIcon,
  UserIcon,
  DocumentIcon,
} from '@heroicons/react/24/outline';
import { Disclosure, Transition } from '@headlessui/react';

interface DocumentFiltersProps {
  filters: IDocumentFilters;
  onFiltersChange: (filters: IDocumentFilters) => void;
  onClearFilters: () => void;
}

export const DocumentFilters: React.FC<DocumentFiltersProps> = ({
  filters,
  onFiltersChange,
  onClearFilters,
}) => {
  const { showFilters } = useAppSelector(state => state.ui);
  const [availableCategories] = useState(['Specifications', 'Drawings', 'Documentation', 'Reports', 'Contracts']);
  const [availableFileTypes] = useState(['pdf', 'dwg', 'docx', 'xlsx', 'jpg', 'png']);
  const [availableAuthors] = useState(['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Wilson']);
  const [availableTags] = useState(['project', 'requirements', 'architecture', 'design', 'meeting', 'notes']);

  const updateFilters = (key: keyof IDocumentFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const toggleArrayFilter = (key: keyof IDocumentFilters, value: string) => {
    const currentArray = filters[key] as string[];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    
    updateFilters(key, newArray);
  };

  const hasActiveFilters = Object.values(filters).some(value => {
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === 'object' && value !== null) return true;
    return Boolean(value);
  });

  if (!showFilters) return null;

  return (
    <div className="bg-white border-r border-gray-200 w-80 flex-shrink-0 overflow-y-auto">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <FunnelIcon className="w-5 h-5 text-gray-500 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
          </div>
          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              Clear all
            </button>
          )}
        </div>

        <div className="space-y-6">
          {/* Categories */}
          <Disclosure defaultOpen>
            {({ open }) => (
              <>
                <Disclosure.Button className="flex items-center justify-between w-full text-left">
                  <div className="flex items-center">
                    <FolderIcon className="w-4 h-4 text-gray-500 mr-2" />
                    <span className="font-medium text-gray-900">Categories</span>
                  </div>
                  <span className="text-gray-400">
                    {open ? '−' : '+'}
                  </span>
                </Disclosure.Button>
                <Transition
                  enter="transition duration-100 ease-out"
                  enterFrom="transform scale-95 opacity-0"
                  enterTo="transform scale-100 opacity-100"
                  leave="transition duration-75 ease-out"
                  leaveFrom="transform scale-100 opacity-100"
                  leaveTo="transform scale-95 opacity-0"
                >
                  <Disclosure.Panel className="mt-3 space-y-2">
                    {availableCategories.map((category) => (
                      <label key={category} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.categories.includes(category)}
                          onChange={() => toggleArrayFilter('categories', category)}
                          className="w-4 h-4 text-primary-600 bg-white border-gray-300 rounded focus:ring-primary-500 focus:ring-2"
                        />
                        <span className="ml-3 text-sm text-gray-700">{category}</span>
                      </label>
                    ))}
                  </Disclosure.Panel>
                </Transition>
              </>
            )}
          </Disclosure>

          {/* File Types */}
          <Disclosure>
            {({ open }) => (
              <>
                <Disclosure.Button className="flex items-center justify-between w-full text-left">
                  <div className="flex items-center">
                    <DocumentIcon className="w-4 h-4 text-gray-500 mr-2" />
                    <span className="font-medium text-gray-900">File Types</span>
                  </div>
                  <span className="text-gray-400">
                    {open ? '−' : '+'}
                  </span>
                </Disclosure.Button>
                <Transition
                  enter="transition duration-100 ease-out"
                  enterFrom="transform scale-95 opacity-0"
                  enterTo="transform scale-100 opacity-100"
                  leave="transition duration-75 ease-out"
                  leaveFrom="transform scale-100 opacity-100"
                  leaveTo="transform scale-95 opacity-0"
                >
                  <Disclosure.Panel className="mt-3 space-y-2">
                    {availableFileTypes.map((fileType) => (
                      <label key={fileType} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.fileTypes.includes(fileType)}
                          onChange={() => toggleArrayFilter('fileTypes', fileType)}
                          className="w-4 h-4 text-primary-600 bg-white border-gray-300 rounded focus:ring-primary-500 focus:ring-2"
                        />
                        <span className="ml-3 text-sm text-gray-700 uppercase">{fileType}</span>
                      </label>
                    ))}
                  </Disclosure.Panel>
                </Transition>
              </>
            )}
          </Disclosure>

          {/* Authors */}
          <Disclosure>
            {({ open }) => (
              <>
                <Disclosure.Button className="flex items-center justify-between w-full text-left">
                  <div className="flex items-center">
                    <UserIcon className="w-4 h-4 text-gray-500 mr-2" />
                    <span className="font-medium text-gray-900">Authors</span>
                  </div>
                  <span className="text-gray-400">
                    {open ? '−' : '+'}
                  </span>
                </Disclosure.Button>
                <Transition
                  enter="transition duration-100 ease-out"
                  enterFrom="transform scale-95 opacity-0"
                  enterTo="transform scale-100 opacity-100"
                  leave="transition duration-75 ease-out"
                  leaveFrom="transform scale-100 opacity-100"
                  leaveTo="transform scale-95 opacity-0"
                >
                  <Disclosure.Panel className="mt-3 space-y-2">
                    {availableAuthors.map((author) => (
                      <label key={author} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.authors.includes(author)}
                          onChange={() => toggleArrayFilter('authors', author)}
                          className="w-4 h-4 text-primary-600 bg-white border-gray-300 rounded focus:ring-primary-500 focus:ring-2"
                        />
                        <span className="ml-3 text-sm text-gray-700">{author}</span>
                      </label>
                    ))}
                  </Disclosure.Panel>
                </Transition>
              </>
            )}
          </Disclosure>

          {/* Tags */}
          <Disclosure>
            {({ open }) => (
              <>
                <Disclosure.Button className="flex items-center justify-between w-full text-left">
                  <div className="flex items-center">
                    <TagIcon className="w-4 h-4 text-gray-500 mr-2" />
                    <span className="font-medium text-gray-900">Tags</span>
                  </div>
                  <span className="text-gray-400">
                    {open ? '−' : '+'}
                  </span>
                </Disclosure.Button>
                <Transition
                  enter="transition duration-100 ease-out"
                  enterFrom="transform scale-95 opacity-0"
                  enterTo="transform scale-100 opacity-100"
                  leave="transition duration-75 ease-out"
                  leaveFrom="transform scale-100 opacity-100"
                  leaveTo="transform scale-95 opacity-0"
                >
                  <Disclosure.Panel className="mt-3 space-y-2">
                    {availableTags.map((tag) => (
                      <label key={tag} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.tags.includes(tag)}
                          onChange={() => toggleArrayFilter('tags', tag)}
                          className="w-4 h-4 text-primary-600 bg-white border-gray-300 rounded focus:ring-primary-500 focus:ring-2"
                        />
                        <span className="ml-3 text-sm text-gray-700">#{tag}</span>
                      </label>
                    ))}
                  </Disclosure.Panel>
                </Transition>
              </>
            )}
          </Disclosure>

          {/* Date Range */}
          <Disclosure>
            {({ open }) => (
              <>
                <Disclosure.Button className="flex items-center justify-between w-full text-left">
                  <div className="flex items-center">
                    <CalendarIcon className="w-4 h-4 text-gray-500 mr-2" />
                    <span className="font-medium text-gray-900">Date Range</span>
                  </div>
                  <span className="text-gray-400">
                    {open ? '−' : '+'}
                  </span>
                </Disclosure.Button>
                <Transition
                  enter="transition duration-100 ease-out"
                  enterFrom="transform scale-95 opacity-0"
                  enterTo="transform scale-100 opacity-100"
                  leave="transition duration-75 ease-out"
                  leaveFrom="transform scale-100 opacity-100"
                  leaveTo="transform scale-95 opacity-0"
                >
                  <Disclosure.Panel className="mt-3 space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        From
                      </label>
                      <input
                        type="date"
                        value={filters.dateRange?.start.toISOString().split('T')[0] || ''}
                        onChange={(e) => {
                          const start = new Date(e.target.value);
                          updateFilters('dateRange', {
                            start,
                            end: filters.dateRange?.end || new Date(),
                          });
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        To
                      </label>
                      <input
                        type="date"
                        value={filters.dateRange?.end.toISOString().split('T')[0] || ''}
                        onChange={(e) => {
                          const end = new Date(e.target.value);
                          updateFilters('dateRange', {
                            start: filters.dateRange?.start || new Date(),
                            end,
                          });
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                  </Disclosure.Panel>
                </Transition>
              </>
            )}
          </Disclosure>

          {/* Special Filters */}
          <div className="space-y-3">
            <h3 className="font-medium text-gray-900">Special Filters</h3>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filters.favorites || false}
                onChange={(e) => updateFilters('favorites', e.target.checked)}
                className="w-4 h-4 text-primary-600 bg-white border-gray-300 rounded focus:ring-primary-500 focus:ring-2"
              />
              <span className="ml-3 text-sm text-gray-700">Favorites only</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filters.archived || false}
                onChange={(e) => updateFilters('archived', e.target.checked)}
                className="w-4 h-4 text-primary-600 bg-white border-gray-300 rounded focus:ring-primary-500 focus:ring-2"
              />
              <span className="ml-3 text-sm text-gray-700">Archived documents</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};