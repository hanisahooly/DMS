import { User, AuthResult } from '../types/user';

class AuthService {
  private baseUrl = '/api/auth';

  async login(credentials: { email: string; password: string }): Promise<AuthResult> {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user data
      const mockUser: User = {
        id: '1',
        email: credentials.email,
        name: 'John Doe',
        role: {
          id: 'admin',
          name: 'Administrator',
          permissions: [],
          hierarchy: 1,
        },
        permissions: [],
        isActive: true,
        mfaEnabled: false,
        preferences: {
          theme: 'light',
          language: 'en',
          timezone: 'UTC',
          notifications: {
            email: true,
            push: true,
            documentUpdates: true,
            workflowNotifications: true,
            systemAlerts: true,
          },
          defaultView: 'grid',
        },
      };

      // Simulate MFA requirement for certain users
      if (credentials.email.includes('admin')) {
        return {
          status: 'mfa_required',
          tempToken: 'temp_token_123',
        };
      }

      return {
        status: 'success',
        user: mockUser,
        tokens: {
          accessToken: 'access_token_123',
          refreshToken: 'refresh_token_123',
        },
      };
    } catch (error) {
      return {
        status: 'error',
        error: 'Login failed',
      };
    }
  }

  async verifyMFA(tempToken: string, code: string): Promise<AuthResult> {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (code === '123456') {
        const mockUser: User = {
          id: '1',
          email: 'admin@hsgroup.com',
          name: 'Admin User',
          role: {
            id: 'admin',
            name: 'Administrator',
            permissions: [],
            hierarchy: 1,
          },
          permissions: [],
          isActive: true,
          mfaEnabled: true,
          preferences: {
            theme: 'light',
            language: 'en',
            timezone: 'UTC',
            notifications: {
              email: true,
              push: true,
              documentUpdates: true,
              workflowNotifications: true,
              systemAlerts: true,
            },
            defaultView: 'grid',
          },
        };

        return {
          status: 'success',
          user: mockUser,
          tokens: {
            accessToken: 'access_token_123',
            refreshToken: 'refresh_token_123',
          },
        };
      }

      return {
        status: 'error',
        error: 'Invalid MFA code',
      };
    } catch (error) {
      return {
        status: 'error',
        error: 'MFA verification failed',
      };
    }
  }

  async logout(): Promise<void> {
    // Clear tokens from storage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  async refreshToken(): Promise<AuthResult> {
    try {
      // Simulate token refresh
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return {
        status: 'success',
        tokens: {
          accessToken: 'new_access_token_123',
          refreshToken: 'new_refresh_token_123',
        },
      };
    } catch (error) {
      return {
        status: 'error',
        error: 'Token refresh failed',
      };
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      // Check if user is logged in
      const token = localStorage.getItem('accessToken');
      if (!token) return null;

      // Mock current user
      return {
        id: '1',
        email: 'user@hsgroup.com',
        name: 'Current User',
        role: {
          id: 'user',
          name: 'User',
          permissions: [],
          hierarchy: 3,
        },
        permissions: [],
        isActive: true,
        mfaEnabled: false,
        preferences: {
          theme: 'light',
          language: 'en',
          timezone: 'UTC',
          notifications: {
            email: true,
            push: true,
            documentUpdates: true,
            workflowNotifications: true,
            systemAlerts: true,
          },
          defaultView: 'grid',
        },
      };
    } catch (error) {
      return null;
    }
  }
}

export const authService = new AuthService();