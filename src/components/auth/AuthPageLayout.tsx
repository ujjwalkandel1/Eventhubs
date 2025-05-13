
import React from 'react';
import { Link } from 'react-router-dom';

interface AuthPageLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  alternateActionText: string;
  alternateActionLink: string;
  alternateActionLinkText: string;
}

const AuthPageLayout: React.FC<AuthPageLayoutProps> = ({
  children,
  title,
  subtitle,
  alternateActionText,
  alternateActionLink,
  alternateActionLinkText,
}) => {
  return (
    <div className="container max-w-md py-16 px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">{title}</h1>
        <p className="text-muted-foreground">{subtitle}</p>
      </div>
      
      {children}
      
      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground">
          {alternateActionText}{' '}
          <Link to={alternateActionLink} className="text-event hover:underline">
            {alternateActionLinkText}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AuthPageLayout;
