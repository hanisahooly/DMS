import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import documentsSlice from './slices/documentsSlice';
import projectsSlice from './slices/projectsSlice';
import workflowSlice from './slices/workflowSlice';
import searchSlice from './slices/searchSlice';
import uiSlice from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    documents: documentsSlice,
    projects: projectsSlice,
    workflow: workflowSlice,
    search: searchSlice,
    ui: uiSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;