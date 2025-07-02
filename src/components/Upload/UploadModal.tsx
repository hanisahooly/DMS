import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useAppSelector, useAppDispatch } from '../../hooks/redux';
import { useDocuments } from '../../hooks/useDocuments';
import { setShowUploadModal, addNotification } from '../../store/slices/uiSlice';
import { Dialog, Transition } from '@headlessui/react';
import { 
  XMarkIcon, 
  CloudArrowUpIcon, 
  DocumentIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { formatFileSize, validateFileType, validateFileSize } from '../../utils/fileUtils';

const ALLOWED_FILE_TYPES = [
  'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt',
  'jpg', 'jpeg', 'png', 'gif', 'svg',
  'dwg', 'dxf', 'rvt', 'ifc', 'skp',
  'zip', 'rar', '7z'
];

const MAX_FILE_SIZE_MB = 100;

interface FileWithMetadata {
  file: File;
  category: string;
  tags: string[];
  projectId?: string;
}

export const UploadModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const { showUploadModal } = useAppSelector(state => state.ui);
  const { upload, uploadProgress } = useDocuments();
  
  const [files, setFiles] = useState<FileWithMetadata[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    const newErrors: string[] = [];
    const validFiles: FileWithMetadata[] = [];

    // Handle rejected files
    rejectedFiles.forEach(({ file, errors }) => {
      errors.forEach((error: any) => {
        if (error.code === 'file-too-large') {
          newErrors.push(`${file.name}: File is too large (max ${MAX_FILE_SIZE_MB}MB)`);
        } else if (error.code === 'file-invalid-type') {
          newErrors.push(`${file.name}: File type not supported`);
        }
      });
    });

    // Process accepted files
    acceptedFiles.forEach(file => {
      if (!validateFileType(file, ALLOWED_FILE_TYPES)) {
        newErrors.push(`${file.name}: File type not supported`);
        return;
      }

      if (!validateFileSize(file, MAX_FILE_SIZE_MB)) {
        newErrors.push(`${file.name}: File is too large (max ${MAX_FILE_SIZE_MB}MB)`);
        return;
      }

      validFiles.push({
        file,
        category: 'Uncategorized',
        tags: [],
        projectId: undefined,
      });
    });

    setFiles(prev => [...prev, ...validFiles]);
    setErrors(newErrors);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize: MAX_FILE_SIZE_MB * 1024 * 1024,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-powerpoint': ['.ppt'],
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
      'text/plain': ['.txt'],
      'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.svg'],
      'application/zip': ['.zip'],
      'application/x-rar-compressed': ['.rar'],
      'application/x-7z-compressed': ['.7z'],
    },
  });

  const updateFileMetadata = (index: number, field: keyof FileWithMetadata, value: any) => {
    setFiles(prev => prev.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    ));
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    setIsUploading(true);
    
    try {
      for (const fileWithMetadata of files) {
        await upload(fileWithMetadata.file, {
          category: fileWithMetadata.category,
          tags: fileWithMetadata.tags,
          projectId: fileWithMetadata.projectId,
        });
      }

      dispatch(addNotification({
        type: 'success',
        title: 'Upload Complete',
        message: `Successfully uploaded ${files.length} file(s)`,
      }));

      handleClose();
    } catch (error) {
      dispatch(addNotification({
        type: 'error',
        title: 'Upload Failed',
        message: 'Some files failed to upload. Please try again.',
      }));
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    if (!isUploading) {
      setFiles([]);
      setErrors([]);
      dispatch(setShowUploadModal(false));
    }
  };

  return (
    <Transition appear show={showUploadModal}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
        <Transition.Child
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex items-center justify-between mb-6">
                  <Dialog.Title className="text-lg font-semibold text-gray-900">
                    Upload Documents
                  </Dialog.Title>
                  <button
                    onClick={handleClose}
                    disabled={isUploading}
                    className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 disabled:opacity-50"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </div>

                {/* Upload Area */}
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                    isDragActive
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <input {...getInputProps()} />
                  <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-lg font-medium text-gray-900 mb-2">
                    {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    or click to browse files
                  </p>
                  <p className="text-xs text-gray-400">
                    Supported formats: PDF, DOC, XLS, PPT, Images, CAD files, Archives
                    <br />
                    Maximum file size: {MAX_FILE_SIZE_MB}MB
                  </p>
                </div>

                {/* Errors */}
                {errors.length > 0 && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center mb-2">
                      <ExclamationTriangleIcon className="w-5 h-5 text-red-500 mr-2" />
                      <h4 className="text-sm font-medium text-red-800">Upload Errors</h4>
                    </div>
                    <ul className="text-sm text-red-700 space-y-1">
                      {errors.map((error, index) => (
                        <li key={index}>• {error}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* File List */}
                {files.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-sm font-medium text-gray-900 mb-4">
                      Files to Upload ({files.length})
                    </h3>
                    <div className="space-y-4 max-h-64 overflow-y-auto">
                      {files.map((fileWithMetadata, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center">
                              <DocumentIcon className="w-5 h-5 text-gray-400 mr-3" />
                              <div>
                                <p className="text-sm font-medium text-gray-900">
                                  {fileWithMetadata.file.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {formatFileSize(fileWithMetadata.file.size)}
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={() => removeFile(index)}
                              disabled={isUploading}
                              className="p-1 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 disabled:opacity-50"
                            >
                              <XMarkIcon className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                Category
                              </label>
                              <select
                                value={fileWithMetadata.category}
                                onChange={(e) => updateFileMetadata(index, 'category', e.target.value)}
                                disabled={isUploading}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:opacity-50"
                              >
                                <option value="Uncategorized">Uncategorized</option>
                                <option value="Specifications">Specifications</option>
                                <option value="Drawings">Drawings</option>
                                <option value="Documentation">Documentation</option>
                                <option value="Reports">Reports</option>
                                <option value="Contracts">Contracts</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                Tags (comma-separated)
                              </label>
                              <input
                                type="text"
                                value={fileWithMetadata.tags.join(', ')}
                                onChange={(e) => {
                                  const tags = e.target.value
                                    .split(',')
                                    .map(tag => tag.trim())
                                    .filter(tag => tag.length > 0);
                                  updateFileMetadata(index, 'tags', tags);
                                }}
                                disabled={isUploading}
                                placeholder="e.g., project, draft, review"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:opacity-50"
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                Project ID (optional)
                              </label>
                              <input
                                type="text"
                                value={fileWithMetadata.projectId || ''}
                                onChange={(e) => updateFileMetadata(index, 'projectId', e.target.value || undefined)}
                                disabled={isUploading}
                                placeholder="e.g., proj-1"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:opacity-50"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Upload Progress */}
                {uploadProgress.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-sm font-medium text-gray-900 mb-4">Upload Progress</h3>
                    <div className="space-y-2">
                      {uploadProgress.map((progress) => (
                        <div key={progress.id} className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">{progress.fileName}</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-32 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${progress.progress}%` }}
                              />
                            </div>
                            <span className="text-xs text-gray-500 w-12 text-right">
                              {progress.progress}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
                  <button
                    onClick={handleClose}
                    disabled={isUploading}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpload}
                    disabled={files.length === 0 || isUploading}
                    className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isUploading ? 'Uploading...' : `Upload ${files.length} file(s)`}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};