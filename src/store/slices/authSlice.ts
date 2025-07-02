import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User, AuthResult } from '../../types/user';
import { authService } from '../../services/authService';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  mfaRequired: boolean;
  tempToken: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  mfaRequired: false,
  tempToken: null,
};

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }) => {
    const result = await authService.login(credentials);
    return result;
  }
);

export const verifyMFA = createAsyncThunk(
  'auth/verifyMFA',
  async ({ tempToken, code }: { tempToken: string; code: string }) => {
    const result = await authService.verifyMFA(tempToken, code);
    return result;
  }
);

export const logout = createAsyncThunk('auth/logout', async () => {
  await authService.logout();
});

export const refreshToken = createAsyncThunk('auth/refreshToken', async () => {
  const result = await authService.refreshToken();
  return result;
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        const result = action.payload;
        
        if (result.status === 'success' && result.user) {
          state.user = result.user;
          state.isAuthenticated = true;
          state.mfaRequired = false;
        } else if (result.status === 'mfa_required') {
          state.mfaRequired = true;
          state.tempToken = result.tempToken || null;
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Login failed';
      })
      .addCase(verifyMFA.fulfilled, (state, action) => {
        const result = action.payload;
        if (result.status === 'success' && result.user) {
          state.user = result.user;
          state.isAuthenticated = true;
          state.mfaRequired = false;
          state.tempToken = null;
        }
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.mfaRequired = false;
        state.tempToken = null;
      });
  },
});

export const { clearError, setUser } = authSlice.actions;
export default authSlice.reducer;