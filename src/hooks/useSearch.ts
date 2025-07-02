import { useAppDispatch, useAppSelector } from './redux';
import { 
  searchDocuments, 
  getSuggestions, 
  setQuery, 
  clearResults, 
  addRecentSearch,
  clearRecentSearches,
} from '../store/slices/searchSlice';

export const useSearch = () => {
  const dispatch = useAppDispatch();
  const {
    query,
    results,
    isLoading,
    error,
    suggestions,
    recentSearches,
    facets,
  } = useAppSelector(state => state.search);

  const handleSearch = async (searchQuery: string) => {
    dispatch(setQuery(searchQuery));
    if (searchQuery.trim()) {
      dispatch(addRecentSearch(searchQuery));
      return dispatch(searchDocuments(searchQuery));
    } else {
      dispatch(clearResults());
    }
  };

  const handleGetSuggestions = async (searchQuery: string) => {
    return dispatch(getSuggestions(searchQuery));
  };

  const handleClearResults = () => {
    dispatch(clearResults());
  };

  const handleClearRecentSearches = () => {
    dispatch(clearRecentSearches());
  };

  return {
    query,
    results,
    isLoading,
    error,
    suggestions,
    recentSearches,
    facets,
    search: handleSearch,
    getSuggestions: handleGetSuggestions,
    clearResults: handleClearResults,
    clearRecentSearches: handleClearRecentSearches,
  };
};