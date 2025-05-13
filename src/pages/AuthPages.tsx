
import React from 'react';
import AuthPageLayout from '@/components/auth/AuthPageLayout';
import LoginForm from '@/components/auth/LoginForm';
import SignupForm from '@/components/auth/SignupForm';

export const LoginPage = () => {
  return (
    <AuthPageLayout
      title="Welcome Back"
      subtitle="Sign in to your EventHub account"
      alternateActionText="Don't have an account?"
      alternateActionLink="/signup"
      alternateActionLinkText="Sign Up"
    >
      <LoginForm />
    </AuthPageLayout>
  );
};

export const SignupPage = () => {
  return (
    <AuthPageLayout
      title="Create an Account"
      subtitle="Join EventHub to discover and create amazing events"
      alternateActionText="Already have an account?"
      alternateActionLink="/login"
      alternateActionLinkText="Sign In"
    >
      <SignupForm />
    </AuthPageLayout>
  );
};
