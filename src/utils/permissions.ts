import { User, Permission } from '../types/user';
import { Document } from '../types/document';

export const checkPermission = (
  user: User,
  resource: string,
  action: string,
  context?: any
): boolean => {
  // Super admin has all permissions
  if (user.role.name === 'Super Admin') {
    return true;
  }

  // Check user's direct permissions
  const hasDirectPermission = user.permissions.some(permission =>
    permission.resource === resource && permission.action === action
  );

  if (hasDirectPermission) {
    return true;
  }

  // Check role permissions
  const hasRolePermission = user.role.permissions.some(permission =>
    permission.resource === resource && permission.action === action
  );

  return hasRolePermission;
};

export const getDocumentPermissions = (user: User, document: Document) => {
  return {
    canRead: checkPermission(user, 'document', 'read', document),
    canWrite: checkPermission(user, 'document', 'write', document),
    canDelete: checkPermission(user, 'document', 'delete', document),
    canShare: checkPermission(user, 'document', 'share', document),
    canApprove: checkPermission(user, 'document', 'approve', document),
    canDownload: checkPermission(user, 'document', 'download', document),
  };
};

export const canAccessProject = (user: User, projectId: string): boolean => {
  return checkPermission(user, 'project', 'read', { projectId });
};

export const canManageUsers = (user: User): boolean => {
  return checkPermission(user, 'user', 'manage');
};

export const canViewAuditLogs = (user: User): boolean => {
  return checkPermission(user, 'audit', 'read');
};

export const canManageWorkflows = (user: User): boolean => {
  return checkPermission(user, 'workflow', 'manage');
};