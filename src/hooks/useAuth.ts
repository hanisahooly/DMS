import { useAppDispatch, useAppSelector } from './redux';
import { login, verifyMFA, logout, clearError } from '../store/slices/authSlice';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, isLoading, error, mfaRequired, tempToken } = useAppSelector(
    state => state.auth
  );

  const handleLogin = async (credentials: { email: string; password: string }) => {
    return dispatch(login(credentials));
  };

  const handleVerifyMFA = async (code: string) => {
    if (!tempToken) {
      throw new Error('No temporary token available');
    }
    return dispatch(verifyMFA({ tempToken, code }));
  };

  const handleLogout = async () => {
    return dispatch(logout());
  };

  const handleClearError = () => {
    dispatch(clearError());
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    mfaRequired,
    login: handleLogin,
    verifyMFA: handleVerifyMFA,
    logout: handleLogout,
    clearError: handleClearError,
  };
};