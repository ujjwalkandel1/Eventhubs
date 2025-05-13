
import React, { createContext, useState, useContext, useEffect } from 'react';
import { getCurrentUser, signIn, signOut, signUp, UserCredentials, UserSignupData } from '@/services/authService';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';

// Define our custom User type extending from Supabase User
interface User {
  id: string;
  email?: string; // Made optional to match Supabase User type
  user_metadata?: {
    full_name?: string;
    user_type?: 'attendee' | 'organizer';
  };
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: UserCredentials) => Promise<void>;
  signup: (userData: UserSignupData) => Promise<void>;
  logout: () => Promise<void>;
  updateUserData: (userData: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const currentUser = await getCurrentUser();
        // Convert Supabase User to our User type
        setUser(currentUser ? {
          id: currentUser.id,
          email: currentUser.email,
          user_metadata: currentUser.user_metadata
        } as User : null);
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();

    // Setup supabase auth listener
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        setUser(null);
        navigate('/');
      } else if (event === 'SIGNED_IN' && session) {
        // Convert Supabase User to our User type
        setUser({
          id: session.user.id,
          email: session.user.email,
          user_metadata: session.user.user_metadata
        } as User);
        // Redirect to home page after successful sign in
        navigate('/');
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [navigate]);

  const updateUserData = (userData: User) => {
    setUser(userData);
  };

  const login = async (credentials: UserCredentials) => {
    setLoading(true);
    try {
      const { user: authUser } = await signIn(credentials);
      // Convert Supabase User to our User type
      setUser(authUser ? {
        id: authUser.id,
        email: authUser.email,
        user_metadata: authUser.user_metadata
      } as User : null);
      
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
      
      navigate('/'); // Redirect to home page after login
      return Promise.resolve();
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Don't show toast here as it's already shown in authService
      // Just pass the error through for components to handle specific error codes
      return Promise.reject(error);
    } finally {
      setLoading(false);
    }
  };

  const signup = async (userData: UserSignupData) => {
    setLoading(true);
    try {
      const { user: authUser } = await signUp(userData);
      
      if (authUser) {
        toast({
          title: "Account created",
          description: "Please check your email for a verification link before logging in.",
        });
        // Redirect to login page instead of home after signup since email verification is required
        navigate('/login');
      }
      
      return Promise.resolve();
    } catch (error) {
      console.error('Signup error:', error);
      // Error toast is already displayed in the authService
      return Promise.reject(error);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await signOut();
      setUser(null);
      toast({
        title: "Logged out",
        description: "You've been logged out successfully.",
      });
      navigate('/'); // Redirect to home page after logout
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, updateUserData }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
