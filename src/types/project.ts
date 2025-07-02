export interface Project {
  id: string;
  name: string;
  description?: string;
  status: 'planning' | 'active' | 'on_hold' | 'completed' | 'cancelled';
  startDate: Date;
  endDate?: Date;
  budget?: number;
  client: string;
  manager: string;
  team: ProjectMember[];
  location?: string;
  erpId?: string;
  documentCount: number;
  tags: string[];
  metadata?: Record<string, any>;
}

export interface ProjectMember {
  userId: string;
  name: string;
  role: string;
  permissions: string[];
  joinDate: Date;
}