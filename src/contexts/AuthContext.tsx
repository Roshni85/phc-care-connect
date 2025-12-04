import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthState, LoginCredentials, UserProfile, UserRole } from '@/types/auth';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demonstration
const MOCK_USERS: Record<string, { password: string; profile: UserProfile }> = {
  '9876543210': {
    password: '1234',
    profile: {
      id: 'lhv-001',
      name: 'Dr. Priya Sharma',
      phone: '9876543210',
      role: 'LHV',
      phc_id: 'PHC-001',
      phc_name: 'Primary Health Centre, Rampur',
      sub_centres: ['SC-001', 'SC-002', 'SC-003'],
    },
  },
  '9876543211': {
    password: '1234',
    profile: {
      id: 'pharm-001',
      name: 'Rajesh Kumar',
      phone: '9876543211',
      role: 'PHARMACIST',
      phc_id: 'PHC-001',
      phc_name: 'Primary Health Centre, Rampur',
    },
  },
  '9876543212': {
    password: '1234',
    profile: {
      id: 'admin-001',
      name: 'Suresh Verma',
      phone: '9876543212',
      role: 'ADMIN',
      phc_id: 'PHC-001',
      phc_name: 'Primary Health Centre, Rampur',
    },
  },
  '9876543213': {
    password: '1234',
    profile: {
      id: 'anm-001',
      name: 'Sunita Devi',
      phone: '9876543213',
      role: 'ANM',
      phc_id: 'PHC-001',
      phc_name: 'Primary Health Centre, Rampur',
      sub_centres: ['SC-001'],
      villages: ['Rampur', 'Sundarpur'],
    },
  },
};

const STORAGE_KEY = 'phc_auth_state';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    token: null,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored auth state
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setState(parsed);
      } catch (e) {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUser = MOCK_USERS[credentials.phone];
    
    if (!mockUser) {
      setIsLoading(false);
      return { success: false, error: 'User not found. Please check your phone number.' };
    }
    
    if (mockUser.password !== credentials.password) {
      setIsLoading(false);
      return { success: false, error: 'Invalid password. Please try again.' };
    }
    
    const newState: AuthState = {
      isAuthenticated: true,
      user: mockUser.profile,
      token: `mock-token-${Date.now()}`,
    };
    
    setState(newState);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
    setIsLoading(false);
    
    return { success: true };
  };

  const logout = () => {
    setState({
      isAuthenticated: false,
      user: null,
      token: null,
    });
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
