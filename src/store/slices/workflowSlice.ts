import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { WorkflowState } from '../../types/document';
import { workflowService } from '../../services/workflowService';

interface WorkflowSliceState {
  workflows: WorkflowState[];
  isLoading: boolean;
  error: string | null;
}

const initialState: WorkflowSliceState = {
  workflows: [],
  isLoading: false,
  error: null,
};

export const fetchWorkflows = createAsyncThunk(
  'workflow/fetchWorkflows',
  async () => {
    const workflows = await workflowService.getWorkflows();
    return workflows;
  }
);

export const approveDocument = createAsyncThunk(
  'workflow/approveDocument',
  async ({ workflowId, stepId, decision }: { 
    workflowId: string; 
    stepId: string; 
    decision: 'approve' | 'reject';
  }) => {
    const result = await workflowService.processApproval(workflowId, stepId, decision);
    return result;
  }
);

const workflowSlice = createSlice({
  name: 'workflow',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWorkflows.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchWorkflows.fulfilled, (state, action) => {
        state.isLoading = false;
        state.workflows = action.payload;
      })
      .addCase(fetchWorkflows.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch workflows';
      });
  },
});

export const { clearError } = workflowSlice.actions;
export default workflowSlice.reducer;