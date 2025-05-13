import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';

export interface UserCredentials {
  email: string;
  password: string;
}

export interface UserSignupData extends UserCredentials {
  name?: string;
  userType?: 'attendee' | 'organizer';
}

export const signIn = async ({ email, password }: UserCredentials) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      // Check if this is an email not confirmed error
      if (error.message?.toLowerCase().includes('email not confirmed')) {
        const customError = new Error('Email not confirmed');
        customError.name = 'AuthError';
        (customError as any).code = 'email_not_confirmed';
        throw customError;
      }
      throw error;
    }

    return data;
  } catch (error: any) {
    toast({
      title: "Login failed",
      description: error.message || "An error occurred during login",
      variant: "destructive",
    });
    throw error; // Pass through the original error with code intact
  }
};

export const signUp = async ({ email, password, name, userType }: UserSignupData) => {
  try {
    // First create the auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
          user_type: userType || 'attendee',
        },
        emailRedirectTo: window.location.origin + '/login',
      },
    });

    if (authError) {
      throw authError;
    }

    return authData;
  } catch (error: any) {
    toast({
      title: "Signup failed",
      description: error.message || "An error occurred during signup",
      variant: "destructive",
    });
    throw error;
  }
};

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw error;
    }
  } catch (error: any) {
    toast({
      title: "Sign out failed",
      description: error.message || "An error occurred during sign out",
      variant: "destructive",
    });
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      throw error;
    }
    return data?.session?.user || null;
  } catch (error: any) {
    toast({
      title: "Error fetching user",
      description: error.message || "An error occurred while fetching user data",
      variant: "destructive",
    });
    return null;
  }
};

export const resendVerificationEmail = async (email: string) => {
  try {
    // Use the proper Supabase method to resend verification
    const { data, error } = await supabase.auth.resend({
      type: 'signup',
      email: email,
      options: {
        emailRedirectTo: window.location.origin + '/login',
      }
    });

    if (error) throw error;
    
    return data;
  } catch (error: any) {
    toast({
      title: "Failed to resend verification",
      description: error.message || "An error occurred while sending verification email",
      variant: "destructive",
    });
    throw error;
  }
};
