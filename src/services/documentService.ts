import { Document, DocumentFilters } from '../types/document';
import { v4 as uuidv4 } from 'uuid';

class DocumentService {
  private documents: Document[] = [
    {
      id: '1',
      name: 'Project Specifications.pdf',
      type: 'pdf',
      size: 2048576,
      category: 'Specifications',
      tags: ['project', 'requirements'],
      uploadDate: '2024-01-15T00:00:00.000Z',
      lastModified: '2024-01-15T00:00:00.000Z',
      author: 'John Doe',
      projectId: 'proj-1',
      isFavorite: false,
      isArchived: false,
      url: 'https://example.com/doc1.pdf',
    },
    {
      id: '2',
      name: 'Architectural Drawings.dwg',
      type: 'dwg',
      size: 5242880,
      category: 'Drawings',
      tags: ['architecture', 'design'],
      uploadDate: '2024-01-14T00:00:00.000Z',
      lastModified: '2024-01-14T00:00:00.000Z',
      author: 'Jane Smith',
      projectId: 'proj-1',
      isFavorite: true,
      isArchived: false,
      url: 'https://example.com/doc2.dwg',
    },
    {
      id: '3',
      name: 'Meeting Minutes.docx',
      type: 'docx',
      size: 102400,
      category: 'Documentation',
      tags: ['meeting', 'notes'],
      uploadDate: '2024-01-13T00:00:00.000Z',
      lastModified: '2024-01-13T00:00:00.000Z',
      author: 'Mike Johnson',
      projectId: 'proj-2',
      isFavorite: false,
      isArchived: false,
      url: 'https://example.com/doc3.docx',
    },
  ];

  async getDocuments(params: {
    page?: number;
    pageSize?: number;
    filters?: DocumentFilters;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  } = {}): Promise<{ documents: Document[]; totalCount: number }> {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay

    let filteredDocuments = [...this.documents];

    // Apply filters
    if (params.filters) {
      const { filters } = params;
      
      if (filters.categories.length > 0) {
        filteredDocuments = filteredDocuments.filter(doc => 
          filters.categories.includes(doc.category)
        );
      }
      
      if (filters.fileTypes.length > 0) {
        filteredDocuments = filteredDocuments.filter(doc => 
          filters.fileTypes.includes(doc.type)
        );
      }
      
      if (filters.projects.length > 0) {
        filteredDocuments = filteredDocuments.filter(doc => 
          doc.projectId && filters.projects.includes(doc.projectId)
        );
      }
      
      if (filters.authors.length > 0) {
        filteredDocuments = filteredDocuments.filter(doc => 
          filters.authors.includes(doc.author)
        );
      }
      
      if (filters.tags.length > 0) {
        filteredDocuments = filteredDocuments.filter(doc => 
          filters.tags.some(tag => doc.tags.includes(tag))
        );
      }
      
      if (filters.favorites) {
        filteredDocuments = filteredDocuments.filter(doc => doc.isFavorite);
      }
      
      if (filters.archived !== undefined) {
        filteredDocuments = filteredDocuments.filter(doc => 
          doc.isArchived === filters.archived
        );
      }
      
      if (filters.dateRange) {
        const startDate = new Date(filters.dateRange.start);
        const endDate = new Date(filters.dateRange.end);
        
        filteredDocuments = filteredDocuments.filter(doc => {
          const docDate = new Date(doc.uploadDate);
          return docDate >= startDate && docDate <= endDate;
        });
      }
    }

    // Apply sorting
    const sortBy = params.sortBy || 'uploadDate';
    const sortOrder = params.sortOrder || 'desc';
    
    filteredDocuments.sort((a, b) => {
      let aValue = (a as any)[sortBy];
      let bValue = (b as any)[sortBy];
      
      // Handle date strings
      if (sortBy === 'uploadDate' || sortBy === 'lastModified') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      } else if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    // Apply pagination
    const page = params.page || 1;
    const pageSize = params.pageSize || 20;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    
    const paginatedDocuments = filteredDocuments.slice(startIndex, endIndex);

    return {
      documents: paginatedDocuments,
      totalCount: filteredDocuments.length,
    };
  }

  async uploadDocument(
    file: File, 
    metadata: Partial<Document>,
    onProgress?: (progress: number) => void
  ): Promise<Document> {
    // Simulate upload progress
    if (onProgress) {
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 100));
        onProgress(i);
      }
    }

    const now = new Date().toISOString();
    const document: Document = {
      id: uuidv4(),
      name: file.name,
      type: file.name.split('.').pop()?.toLowerCase() || 'unknown',
      size: file.size,
      category: metadata.category || 'Uncategorized',
      tags: metadata.tags || [],
      uploadDate: now,
      lastModified: now,
      author: metadata.author || 'Current User',
      projectId: metadata.projectId,
      isFavorite: false,
      isArchived: false,
      url: URL.createObjectURL(file),
    };

    this.documents.unshift(document);
    return document;
  }

  async updateDocument(id: string, updates: Partial<Document>): Promise<Document> {
    await new Promise(resolve => setTimeout(resolve, 300));

    const index = this.documents.findIndex(doc => doc.id === id);
    if (index === -1) {
      throw new Error('Document not found');
    }

    this.documents[index] = {
      ...this.documents[index],
      ...updates,
      lastModified: new Date().toISOString(),
    };

    return this.documents[index];
  }

  async deleteDocument(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));

    const index = this.documents.findIndex(doc => doc.id === id);
    if (index === -1) {
      throw new Error('Document not found');
    }

    this.documents.splice(index, 1);
  }

  async getDocument(id: string): Promise<Document | null> {
    await new Promise(resolve => setTimeout(resolve, 200));

    return this.documents.find(doc => doc.id === id) || null;
  }

  async getCategories(): Promise<string[]> {
    const categories = [...new Set(this.documents.map(doc => doc.category))];
    return categories.sort();
  }

  async getAuthors(): Promise<string[]> {
    const authors = [...new Set(this.documents.map(doc => doc.author))];
    return authors.sort();
  }

  async getTags(): Promise<string[]> {
    const allTags = this.documents.flatMap(doc => doc.tags);
    const uniqueTags = [...new Set(allTags)];
    return uniqueTags.sort();
  }
}

export const documentService = new DocumentService();