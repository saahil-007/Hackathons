import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ModeToggle } from './mode-toggle';
import { Calendar, LogOut, User, LayoutDashboard } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="relative">
              <Calendar className="h-7 w-7 text-primary transition-transform group-hover:scale-110" />
              <div className="absolute -inset-1 bg-primary/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity rounded-full" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              AppointHQ
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-accent transition-colors"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>
                <Link
                  to="/profile"
                  className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-accent transition-colors"
                >
                  <User className="h-4 w-4" />
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-accent transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-md text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-accent transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Theme Toggle */}
          <div className="flex items-center gap-2">
            <ModeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
