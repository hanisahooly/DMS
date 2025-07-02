export interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  category: string;
  tags: string[];
  uploadDate: Date;
  lastModified: Date;
  author: string;
  projectId?: string;
  workflowState?: WorkflowState;
  permissions?: DocumentPermissions;
  versions?: DocumentVersion[];
  metadata?: DocumentMetadata;
  auditTrail?: AuditEntry[];
  collaborators?: Collaborator[];
  approvals?: Approval[];
  isFavorite?: boolean;
  isArchived?: boolean;
  url?: string;
  thumbnailUrl?: string;
}

export interface DocumentMetadata {
  extractedText?: string;
  ocrConfidence?: number;
  technicalSpecs?: TechnicalSpecification;
  geoLocation?: GeoLocation;
  relatedDocuments?: string[];
  customFields?: Record<string, any>;
  fileHash?: string;
  virusScanResult?: 'clean' | 'infected' | 'pending';
}

export interface DocumentVersion {
  id: string;
  version: string;
  uploadDate: Date;
  author: string;
  changes: string;
  size: number;
  url: string;
}

export interface WorkflowState {
  id: string;
  name: string;
  status: 'pending' | 'in_progress' | 'approved' | 'rejected' | 'completed';
  currentStep: string;
  assignees: string[];
  deadline?: Date;
  comments?: WorkflowComment[];
}

export interface WorkflowComment {
  id: string;
  author: string;
  content: string;
  timestamp: Date;
  type: 'comment' | 'approval' | 'rejection';
}

export interface DocumentPermissions {
  canRead: boolean;
  canWrite: boolean;
  canDelete: boolean;
  canShare: boolean;
  canApprove: boolean;
  canDownload: boolean;
}

export interface Collaborator {
  id: string;
  name: string;
  email: string;
  role: 'viewer' | 'editor' | 'approver' | 'owner';
  addedDate: Date;
}

export interface Approval {
  id: string;
  approver: string;
  status: 'pending' | 'approved' | 'rejected';
  timestamp?: Date;
  comments?: string;
}

export interface TechnicalSpecification {
  drawingNumber?: string;
  revision?: string;
  scale?: string;
  discipline?: string;
  phase?: string;
}

export interface GeoLocation {
  latitude: number;
  longitude: number;
  address?: string;
}

export interface AuditEntry {
  id: string;
  timestamp: Date;
  userId: string;
  action: string;
  details: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface DocumentFilters {
  categories: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  fileTypes: string[];
  projects: string[];
  authors: string[];
  tags: string[];
  workflowStatus: string[];
  favorites?: boolean;
  archived?: boolean;
}

export interface SearchResult {
  document: Document;
  highlights: string[];
  score: number;
}

export interface UploadProgress {
  id: string;
  fileName: string;
  progress: number;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  error?: string;
}