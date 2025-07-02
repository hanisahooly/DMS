import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Document, DocumentFilters, UploadProgress } from '../../types/document';
import { documentService } from '../../services/documentService';

interface DocumentsState {
  documents: Document[];
  selectedDocuments: string[];
  filters: DocumentFilters;
  isLoading: boolean;
  error: string | null;
  uploadProgress: UploadProgress[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

const initialState: DocumentsState = {
  documents: [],
  selectedDocuments: [],
  filters: {
    categories: [],
    fileTypes: [],
    projects: [],
    authors: [],
    tags: [],
    workflowStatus: [],
  },
  isLoading: false,
  error: null,
  uploadProgress: [],
  totalCount: 0,
  currentPage: 1,
  pageSize: 20,
  sortBy: 'uploadDate',
  sortOrder: 'desc',
};

export const fetchDocuments = createAsyncThunk(
  'documents/fetchDocuments',
  async (params: {
    page?: number;
    pageSize?: number;
    filters?: DocumentFilters;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) => {
    const result = await documentService.getDocuments(params);
    return result;
  }
);

export const uploadDocument = createAsyncThunk(
  'documents/uploadDocument',
  async (
    { file, metadata }: { file: File; metadata: Partial<Document> },
    { dispatch }
  ) => {
    const uploadId = Date.now().toString();
    
    // Add upload progress
    dispatch(addUploadProgress({
      id: uploadId,
      fileName: file.name,
      progress: 0,
      status: 'uploading',
    }));

    try {
      const result = await documentService.uploadDocument(file, metadata, (progress) => {
        dispatch(updateUploadProgress({ id: uploadId, progress }));
      });

      dispatch(updateUploadProgress({ 
        id: uploadId, 
        progress: 100, 
        status: 'completed' 
      }));

      return result;
    } catch (error) {
      dispatch(updateUploadProgress({ 
        id: uploadId, 
        status: 'error',
        error: error instanceof Error ? error.message : 'Upload failed'
      }));
      throw error;
    }
  }
);

export const deleteDocument = createAsyncThunk(
  'documents/deleteDocument',
  async (id: string) => {
    await documentService.deleteDocument(id);
    return id;
  }
);

export const updateDocument = createAsyncThunk(
  'documents/updateDocument',
  async ({ id, updates }: { id: string; updates: Partial<Document> }) => {
    const result = await documentService.updateDocument(id, updates);
    return result;
  }
);

const documentsSlice = createSlice({
  name: 'documents',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<DocumentFilters>) => {
      state.filters = action.payload;
      state.currentPage = 1; // Reset to first page when filters change
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
      state.currentPage = 1;
    },
    setSelectedDocuments: (state, action: PayloadAction<string[]>) => {
      state.selectedDocuments = action.payload;
    },
    toggleDocumentSelection: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      if (state.selectedDocuments.includes(id)) {
        state.selectedDocuments = state.selectedDocuments.filter(docId => docId !== id);
      } else {
        state.selectedDocuments.push(id);
      }
    },
    clearSelection: (state) => {
      state.selectedDocuments = [];
    },
    setSortBy: (state, action: PayloadAction<{ sortBy: string; sortOrder: 'asc' | 'desc' }>) => {
      state.sortBy = action.payload.sortBy;
      state.sortOrder = action.payload.sortOrder;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    addUploadProgress: (state, action: PayloadAction<UploadProgress>) => {
      state.uploadProgress.push(action.payload);
    },
    updateUploadProgress: (state, action: PayloadAction<Partial<UploadProgress> & { id: string }>) => {
      const index = state.uploadProgress.findIndex(up => up.id === action.payload.id);
      if (index !== -1) {
        state.uploadProgress[index] = { ...state.uploadProgress[index], ...action.payload };
      }
    },
    removeUploadProgress: (state, action: PayloadAction<string>) => {
      state.uploadProgress = state.uploadProgress.filter(up => up.id !== action.payload);
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDocuments.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDocuments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.documents = action.payload.documents;
        state.totalCount = action.payload.totalCount;
      })
      .addCase(fetchDocuments.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch documents';
      })
      .addCase(uploadDocument.fulfilled, (state, action) => {
        state.documents.unshift(action.payload);
      })
      .addCase(deleteDocument.fulfilled, (state, action) => {
        state.documents = state.documents.filter(doc => doc.id !== action.payload);
        state.selectedDocuments = state.selectedDocuments.filter(id => id !== action.payload);
      })
      .addCase(updateDocument.fulfilled, (state, action) => {
        const index = state.documents.findIndex(doc => doc.id === action.payload.id);
        if (index !== -1) {
          state.documents[index] = action.payload;
        }
      });
  },
});

export const {
  setFilters,
  clearFilters,
  setSelectedDocuments,
  toggleDocumentSelection,
  clearSelection,
  setSortBy,
  setCurrentPage,
  addUploadProgress,
  updateUploadProgress,
  removeUploadProgress,
  clearError,
} = documentsSlice.actions;

export default documentsSlice.reducer;