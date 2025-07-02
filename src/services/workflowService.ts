import { WorkflowState } from '../types/document';

class WorkflowService {
  private workflows: WorkflowState[] = [
    {
      id: 'wf-1',
      name: 'Document Review',
      status: 'in_progress',
      currentStep: 'Technical Review',
      assignees: ['john.doe@hsgroup.com', 'jane.smith@hsgroup.com'],
      deadline: new Date('2024-02-01'),
      comments: [
        {
          id: 'c1',
          author: 'John Doe',
          content: 'Initial review completed. Minor revisions needed.',
          timestamp: new Date('2024-01-15'),
          type: 'comment',
        },
      ],
    },
    {
      id: 'wf-2',
      name: 'Design Approval',
      status: 'pending',
      currentStep: 'Client Approval',
      assignees: ['client@abccorp.com'],
      deadline: new Date('2024-01-30'),
      comments: [],
    },
  ];

  async getWorkflows(): Promise<WorkflowState[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...this.workflows];
  }

  async getWorkflow(id: string): Promise<WorkflowState | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return this.workflows.find(wf => wf.id === id) || null;
  }

  async processApproval(
    workflowId: string, 
    stepId: string, 
    decision: 'approve' | 'reject'
  ): Promise<WorkflowState> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const workflow = this.workflows.find(wf => wf.id === workflowId);
    if (!workflow) {
      throw new Error('Workflow not found');
    }
    
    // Update workflow status based on decision
    if (decision === 'approve') {
      workflow.status = 'approved';
    } else {
      workflow.status = 'rejected';
    }
    
    return workflow;
  }

  async addComment(
    workflowId: string, 
    comment: string, 
    author: string
  ): Promise<WorkflowState> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const workflow = this.workflows.find(wf => wf.id === workflowId);
    if (!workflow) {
      throw new Error('Workflow not found');
    }
    
    if (!workflow.comments) {
      workflow.comments = [];
    }
    
    workflow.comments.push({
      id: `c${Date.now()}`,
      author,
      content: comment,
      timestamp: new Date(),
      type: 'comment',
    });
    
    return workflow;
  }
}

export const workflowService = new WorkflowService();