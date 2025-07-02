import { SearchResult } from '../types/document';
import { documentService } from './documentService';

class SearchService {
  async search(query: string): Promise<{
    results: SearchResult[];
    facets: {
      categories: Array<{ name: string; count: number }>;
      fileTypes: Array<{ name: string; count: number }>;
      projects: Array<{ name: string; count: number }>;
    };
  }> {
    await new Promise(resolve => setTimeout(resolve, 300));

    const { documents } = await documentService.getDocuments();
    
    if (!query.trim()) {
      return {
        results: [],
        facets: {
          categories: [],
          fileTypes: [],
          projects: [],
        },
      };
    }

    const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 0);
    
    const results: SearchResult[] = documents
      .map(document => {
        let score = 0;
        const highlights: string[] = [];
        
        // Search in document name
        const nameMatches = searchTerms.filter(term => 
          document.name.toLowerCase().includes(term)
        );
        score += nameMatches.length * 3; // Higher weight for name matches
        
        if (nameMatches.length > 0) {
          highlights.push(`Name: ${document.name}`);
        }
        
        // Search in tags
        const tagMatches = document.tags.filter(tag =>
          searchTerms.some(term => tag.toLowerCase().includes(term))
        );
        score += tagMatches.length * 2;
        
        if (tagMatches.length > 0) {
          highlights.push(`Tags: ${tagMatches.join(', ')}`);
        }
        
        // Search in category
        const categoryMatches = searchTerms.filter(term =>
          document.category.toLowerCase().includes(term)
        );
        score += categoryMatches.length;
        
        if (categoryMatches.length > 0) {
          highlights.push(`Category: ${document.category}`);
        }
        
        // Search in author
        const authorMatches = searchTerms.filter(term =>
          document.author.toLowerCase().includes(term)
        );
        score += authorMatches.length;
        
        if (authorMatches.length > 0) {
          highlights.push(`Author: ${document.author}`);
        }
        
        return {
          document,
          highlights,
          score,
        };
      })
      .filter(result => result.score > 0)
      .sort((a, b) => b.score - a.score);

    // Generate facets
    const categories = new Map<string, number>();
    const fileTypes = new Map<string, number>();
    const projects = new Map<string, number>();
    
    results.forEach(result => {
      const doc = result.document;
      
      categories.set(doc.category, (categories.get(doc.category) || 0) + 1);
      fileTypes.set(doc.type, (fileTypes.get(doc.type) || 0) + 1);
      
      if (doc.projectId) {
        projects.set(doc.projectId, (projects.get(doc.projectId) || 0) + 1);
      }
    });

    return {
      results,
      facets: {
        categories: Array.from(categories.entries()).map(([name, count]) => ({ name, count })),
        fileTypes: Array.from(fileTypes.entries()).map(([name, count]) => ({ name, count })),
        projects: Array.from(projects.entries()).map(([name, count]) => ({ name, count })),
      },
    };
  }

  async getSuggestions(query: string): Promise<string[]> {
    await new Promise(resolve => setTimeout(resolve, 100));

    if (!query.trim()) return [];

    const { documents } = await documentService.getDocuments();
    const suggestions = new Set<string>();
    
    const queryLower = query.toLowerCase();
    
    documents.forEach(doc => {
      // Suggest document names
      if (doc.name.toLowerCase().includes(queryLower)) {
        suggestions.add(doc.name);
      }
      
      // Suggest tags
      doc.tags.forEach(tag => {
        if (tag.toLowerCase().includes(queryLower)) {
          suggestions.add(tag);
        }
      });
      
      // Suggest categories
      if (doc.category.toLowerCase().includes(queryLower)) {
        suggestions.add(doc.category);
      }
    });
    
    return Array.from(suggestions).slice(0, 5);
  }
}

export const searchService = new SearchService();