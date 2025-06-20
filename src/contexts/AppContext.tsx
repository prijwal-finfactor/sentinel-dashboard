import React, { createContext, useContext, useReducer, ReactNode } from 'react';

// Define a flexible state type that can hold anything
interface AppState {
  selectedTenant: any;
  selectedProcess: any;
  user: any;
  theme: any;
  preferences: any;
  cache: any;
  // Authentication state
  isAuthenticated: boolean;
  token: string | null;
  authUser: {
    userId: string;
    username: string;
  } | null;
  [key: string]: any; // Allow any additional properties
}

type AppAction = 
  | { type: 'SET_SELECTED_TENANT'; payload: any }
  | { type: 'SET_SELECTED_PROCESS'; payload: any }
  | { type: 'SET_USER'; payload: any }
  | { type: 'SET_THEME'; payload: any }
  | { type: 'SET_PREFERENCES'; payload: any }
  | { type: 'SET_CACHE'; payload: any }
  | { type: 'SET_CUSTOM'; key: string; payload: any }
  | { type: 'LOGIN'; payload: { token: string; user: { userId: string; username: string } } }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_STATE' };

interface AppContextType {
  state: AppState;
  setSelectedTenant: (tenant: any) => void;
  setSelectedProcess: (process: any) => void;
  setUser: (user: any) => void;
  setTheme: (theme: any) => void;
  setPreferences: (preferences: any) => void;
  setCache: (cache: any) => void;
  setCustom: (key: string, value: any) => void;
  clearState: () => void;
  getState: (key?: string) => any;
  // Authentication methods
  login: (token: string, user: { userId: string; username: string }) => void;
  logout: () => void;
  isAuthenticated: boolean;
  token: string | null;
  authUser: { userId: string; username: string } | null;
}

const initialState: AppState = {
  selectedTenant: null,
  selectedProcess: null,
  user: null,
  theme: 'light',
  preferences: {},
  cache: {},
  // Authentication initial state
  isAuthenticated: false,
  token: null,
  authUser: null,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_SELECTED_TENANT':
      return { ...state, selectedTenant: action.payload };
    case 'SET_SELECTED_PROCESS':
      return { ...state, selectedProcess: action.payload };
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_THEME':
      return { ...state, theme: action.payload };
    case 'SET_PREFERENCES':
      return { ...state, preferences: action.payload };
    case 'SET_CACHE':
      return { ...state, cache: action.payload };
    case 'SET_CUSTOM':
      return { ...state, [action.key]: action.payload };
    case 'LOGIN':
      return {
        ...state,
        isAuthenticated: true,
        token: action.payload.token,
        authUser: action.payload.user,
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        token: null,
        authUser: null,
      };
    case 'CLEAR_STATE':
      return initialState;
    default:
      return state;
  }
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const setSelectedTenant = (tenant: any) => {
    dispatch({ type: 'SET_SELECTED_TENANT', payload: tenant });
  };

  const setSelectedProcess = (process: any) => {
    dispatch({ type: 'SET_SELECTED_PROCESS', payload: process });
  };

  const setUser = (user: any) => {
    dispatch({ type: 'SET_USER', payload: user });
  };

  const setTheme = (theme: any) => {
    dispatch({ type: 'SET_THEME', payload: theme });
  };

  const setPreferences = (preferences: any) => {
    dispatch({ type: 'SET_PREFERENCES', payload: preferences });
  };

  const setCache = (cache: any) => {
    dispatch({ type: 'SET_CACHE', payload: cache });
  };

  const setCustom = (key: string, value: any) => {
    dispatch({ type: 'SET_CUSTOM', key, payload: value });
  };

  const clearState = () => {
    dispatch({ type: 'CLEAR_STATE' });
  };

  const getState = (key?: string) => {
    if (key) {
      return state[key];
    }
    return state;
  };

  // Authentication methods
  const login = (token: string, user: { userId: string; username: string }) => {
    dispatch({ type: 'LOGIN', payload: { token, user } });
    // Store in localStorage for persistence
    localStorage.setItem('auth_token', token);
    localStorage.setItem('auth_user', JSON.stringify(user));
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
    // Remove from localStorage
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  };

  // Initialize auth state from localStorage on app start
  React.useEffect(() => {
    const storedToken = localStorage.getItem('auth_token');
    const storedUser = localStorage.getItem('auth_user');
    
    if (storedToken && storedUser) {
      try {
        const user = JSON.parse(storedUser);
        dispatch({ type: 'LOGIN', payload: { token: storedToken, user } });
      } catch (error) {
        // Clear invalid stored data
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
      }
    }
  }, []);

  const value: AppContextType = {
    state,
    setSelectedTenant,
    setSelectedProcess,
    setUser,
    setTheme,
    setPreferences,
    setCache,
    setCustom,
    clearState,
    getState,
    // Authentication
    login,
    logout,
    isAuthenticated: state.isAuthenticated,
    token: state.token,
    authUser: state.authUser,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}