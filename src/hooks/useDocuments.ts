import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './redux';
import { 
  fetchDocuments, 
  uploadDocument, 
  deleteDocument, 
  updateDocument,
  setFilters,
  clearFilters,
  setSelectedDocuments,
  toggleDocumentSelection,
  clearSelection,
  setSortBy,
  setCurrentPage,
} from '../store/slices/documentsSlice';
import { DocumentFilters } from '../types/document';

export const useDocuments = () => {
  const dispatch = useAppDispatch();
  const {
    documents,
    selectedDocuments,
    filters,
    isLoading,
    error,
    uploadProgress,
    totalCount,
    currentPage,
    pageSize,
    sortBy,
    sortOrder,
  } = useAppSelector(state => state.documents);

  useEffect(() => {
    dispatch(fetchDocuments({
      page: currentPage,
      pageSize,
      filters,
      sortBy,
      sortOrder,
    }));
  }, [dispatch, currentPage, pageSize, filters, sortBy, sortOrder]);

  const handleUpload = async (file: File, metadata: any) => {
    return dispatch(uploadDocument({ file, metadata }));
  };

  const handleDelete = async (id: string) => {
    return dispatch(deleteDocument(id));
  };

  const handleUpdate = async (id: string, updates: any) => {
    return dispatch(updateDocument({ id, updates }));
  };

  const handleSetFilters = (newFilters: DocumentFilters) => {
    dispatch(setFilters(newFilters));
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
  };

  const handleSetSelectedDocuments = (ids: string[]) => {
    dispatch(setSelectedDocuments(ids));
  };

  const handleToggleSelection = (id: string) => {
    dispatch(toggleDocumentSelection(id));
  };

  const handleClearSelection = () => {
    dispatch(clearSelection());
  };

  const handleSetSortBy = (field: string, order: 'asc' | 'desc') => {
    dispatch(setSortBy({ sortBy: field, sortOrder: order }));
  };

  const handleSetCurrentPage = (page: number) => {
    dispatch(setCurrentPage(page));
  };

  const refresh = () => {
    dispatch(fetchDocuments({
      page: currentPage,
      pageSize,
      filters,
      sortBy,
      sortOrder,
    }));
  };

  return {
    documents,
    selectedDocuments,
    filters,
    isLoading,
    error,
    uploadProgress,
    totalCount,
    currentPage,
    pageSize,
    sortBy,
    sortOrder,
    upload: handleUpload,
    delete: handleDelete,
    update: handleUpdate,
    setFilters: handleSetFilters,
    clearFilters: handleClearFilters,
    setSelectedDocuments: handleSetSelectedDocuments,
    toggleSelection: handleToggleSelection,
    clearSelection: handleClearSelection,
    setSortBy: handleSetSortBy,
    setCurrentPage: handleSetCurrentPage,
    refresh,
  };
};