
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { resendVerificationEmail } from '@/services/authService';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailNotConfirmed, setEmailNotConfirmed] = useState(false);
  const [resendDialogOpen, setResendDialogOpen] = useState(false);
  const { login, loading } = useAuth();
  const { toast } = useToast();
  const [isResending, setIsResending] = useState(false);
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailNotConfirmed(false); // Reset the error state
    
    try {
      await login({ email, password });
      // No need to navigate here as the AuthContext will handle it
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Check if this is an email not confirmed error
      if (error.code === 'email_not_confirmed' || 
          (error.message && error.message.toLowerCase().includes('email not confirmed'))) {
        setEmailNotConfirmed(true);
      }
    }
  };

  const handleResendVerification = async () => {
    try {
      setIsResending(true);
      await resendVerificationEmail(email);
      setResendDialogOpen(false);
      toast({
        title: "Verification email sent",
        description: "Please check your inbox for the verification link",
      });
    } catch (error: any) {
      console.error('Error sending verification email:', error);
      toast({
        title: "Failed to send verification email",
        description: error.message || "An error occurred",
        variant: "destructive",
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <>
      <form onSubmit={handleLogin} className="space-y-4">
        {emailNotConfirmed && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4 mr-2" />
            <AlertDescription className="flex flex-col space-y-2">
              <span>Email not confirmed. Please check your inbox and verify your email address before logging in.</span>
              <div className="flex flex-wrap gap-2 mt-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setResendDialogOpen(true)}
                >
                  Resend verification email
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                >
                  <a 
                    href="https://supabase.com/dashboard/project/ngorxbxczdsygceszsjw/auth/providers" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    Configure email verification
                  </a>
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}
        
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="password">Password</Label>
            <Link to="/forgot-password" className="text-sm text-event hover:underline">
              Forgot password?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        
        <Button type="submit" className="w-full bg-event hover:bg-event-dark" disabled={loading}>
          {loading ? 'Signing in...' : 'Sign In'}
        </Button>
      </form>

      <Dialog open={resendDialogOpen} onOpenChange={setResendDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Resend Verification Email</DialogTitle>
            <DialogDescription>
              We'll send a new verification email to {email || "your email address"}.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setResendDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleResendVerification} disabled={isResending}>
              {isResending ? 'Sending...' : 'Send Verification Email'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LoginForm;
