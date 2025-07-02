import { Project } from '../types/project';

class ProjectService {
  private projects: Project[] = [
    {
      id: 'proj-1',
      name: 'Downtown Office Complex',
      description: 'Modern office building with sustainable design',
      status: 'active',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31'),
      budget: 5000000,
      client: 'ABC Corporation',
      manager: 'John Doe',
      team: [
        {
          userId: '1',
          name: 'John Doe',
          role: 'Project Manager',
          permissions: ['read', 'write', 'delete'],
          joinDate: new Date('2024-01-01'),
        },
        {
          userId: '2',
          name: 'Jane Smith',
          role: 'Architect',
          permissions: ['read', 'write'],
          joinDate: new Date('2024-01-01'),
        },
      ],
      location: 'New York, NY',
      documentCount: 25,
      tags: ['commercial', 'office', 'sustainable'],
    },
    {
      id: 'proj-2',
      name: 'Residential Tower',
      description: 'Luxury residential high-rise',
      status: 'planning',
      startDate: new Date('2024-03-01'),
      client: 'XYZ Developers',
      manager: 'Mike Johnson',
      team: [
        {
          userId: '3',
          name: 'Mike Johnson',
          role: 'Project Manager',
          permissions: ['read', 'write', 'delete'],
          joinDate: new Date('2024-02-15'),
        },
      ],
      location: 'Los Angeles, CA',
      documentCount: 12,
      tags: ['residential', 'luxury', 'high-rise'],
    },
  ];

  async getProjects(): Promise<Project[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...this.projects];
  }

  async getProject(id: string): Promise<Project | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return this.projects.find(project => project.id === id) || null;
  }

  async createProject(project: Omit<Project, 'id' | 'documentCount'>): Promise<Project> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newProject: Project = {
      ...project,
      id: `proj-${Date.now()}`,
      documentCount: 0,
    };
    
    this.projects.push(newProject);
    return newProject;
  }

  async updateProject(id: string, updates: Partial<Project>): Promise<Project> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = this.projects.findIndex(project => project.id === id);
    if (index === -1) {
      throw new Error('Project not found');
    }
    
    this.projects[index] = { ...this.projects[index], ...updates };
    return this.projects[index];
  }

  async deleteProject(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = this.projects.findIndex(project => project.id === id);
    if (index === -1) {
      throw new Error('Project not found');
    }
    
    this.projects.splice(index, 1);
  }
}

export const projectService = new ProjectService();