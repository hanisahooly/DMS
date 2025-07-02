export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: UserRole;
  department?: string;
  permissions: Permission[];
  lastLogin?: Date;
  isActive: boolean;
  mfaEnabled: boolean;
  preferences: UserPreferences;
}

export interface UserRole {
  id: string;
  name: string;
  permissions: Permission[];
  hierarchy: number;
}

export interface Permission {
  resource: string;
  action: string;
  conditions?: PermissionCondition[];
}

export interface PermissionCondition {
  field: string;
  operator: 'equals' | 'contains' | 'in' | 'greater_than' | 'less_than';
  value: any;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  timezone: string;
  notifications: NotificationPreferences;
  defaultView: 'grid' | 'list' | 'table';
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  documentUpdates: boolean;
  workflowNotifications: boolean;
  systemAlerts: boolean;
}

export interface AuthResult {
  status: 'success' | 'mfa_required' | 'error';
  user?: User;
  tokens?: {
    accessToken: string;
    refreshToken: string;
  };
  challenge?: string;
  tempToken?: string;
  error?: string;
}