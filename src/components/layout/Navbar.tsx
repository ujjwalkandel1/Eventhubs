import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import NotificationList from '@/components/notifications/NotificationList';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="bg-background border-b sticky top-0 z-50">
      <div className="flex h-16 items-center px-4">
        <Sheet>
          <SheetTrigger className="md:hidden">
            <Menu />
          </SheetTrigger>
          <SheetContent side="left" className="w-full sm:w-64">
            <SheetHeader>
              <SheetTitle>Evently</SheetTitle>
              <SheetDescription>
                Manage your account settings and set preferences here.
              </SheetDescription>
            </SheetHeader>
            <div className="grid gap-4 py-4">
              {user ? (
                <>
                  <Link to="/dashboard" className="px-4 py-2 hover:bg-secondary rounded-md">
                    Dashboard
                  </Link>
                  <Button variant="outline" onClick={handleLogout} className="w-full">
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login" className="px-4 py-2 hover:bg-secondary rounded-md">
                    Login
                  </Link>
                  <Link to="/signup" className="px-4 py-2 hover:bg-secondary rounded-md">
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </SheetContent>
        </Sheet>

        {/* Logo and Brand */}
        <Link to="/" className="flex items-center space-x-2">
          <img src="/Eventhub.png" alt="Evently Logo" className="h-24 w-60 object-contain" />
    
        </Link>

        <div className="ml-auto flex items-center space-x-4">
          <NotificationList />
          {user ? (
            <>
              <Link to="/dashboard" className="hidden md:block hover:underline">
                Dashboard
              </Link>
              <Button variant="outline" onClick={handleLogout} className="hidden md:block">
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login" className="hidden md:block hover:underline">
                Login
              </Link>
              <Link to="/signup" className="hidden md:block hover:underline">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
