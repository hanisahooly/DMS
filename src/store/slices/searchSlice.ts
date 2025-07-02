import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { SearchResult } from '../../types/document';
import { searchService } from '../../services/searchService';

interface SearchState {
  query: string;
  results: SearchResult[];
  isLoading: boolean;
  error: string | null;
  suggestions: string[];
  recentSearches: string[];
  facets: {
    categories: Array<{ name: string; count: number }>;
    fileTypes: Array<{ name: string; count: number }>;
    projects: Array<{ name: string; count: number }>;
  };
}

const initialState: SearchState = {
  query: '',
  results: [],
  isLoading: false,
  error: null,
  suggestions: [],
  recentSearches: JSON.parse(localStorage.getItem('recentSearches') || '[]'),
  facets: {
    categories: [],
    fileTypes: [],
    projects: [],
  },
};

export const searchDocuments = createAsyncThunk(
  'search/searchDocuments',
  async (query: string) => {
    const result = await searchService.search(query);
    return result;
  }
);

export const getSuggestions = createAsyncThunk(
  'search/getSuggestions',
  async (query: string) => {
    const suggestions = await searchService.getSuggestions(query);
    return suggestions;
  }
);

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setQuery: (state, action: PayloadAction<string>) => {
      state.query = action.payload;
    },
    clearResults: (state) => {
      state.results = [];
      state.query = '';
    },
    addRecentSearch: (state, action: PayloadAction<string>) => {
      const query = action.payload.trim();
      if (query && !state.recentSearches.includes(query)) {
        state.recentSearches.unshift(query);
        state.recentSearches = state.recentSearches.slice(0, 10); // Keep only 10 recent searches
        localStorage.setItem('recentSearches', JSON.stringify(state.recentSearches));
      }
    },
    clearRecentSearches: (state) => {
      state.recentSearches = [];
      localStorage.removeItem('recentSearches');
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchDocuments.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(searchDocuments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.results = action.payload.results;
        state.facets = action.payload.facets;
      })
      .addCase(searchDocuments.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Search failed';
      })
      .addCase(getSuggestions.fulfilled, (state, action) => {
        state.suggestions = action.payload;
      });
  },
});

export const {
  setQuery,
  clearResults,
  addRecentSearch,
  clearRecentSearches,
  clearError,
} = searchSlice.actions;

export default searchSlice.reducer;