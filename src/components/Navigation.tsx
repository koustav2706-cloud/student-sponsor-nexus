import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import NotificationCenter from "@/components/notifications/NotificationCenter";
import MessageCenter from "@/components/messaging/MessageCenter";
import { Menu, X, Sparkles, LogOut } from "lucide-react";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();

  return (
    <nav className="fixed top-0 w-full glass-nav backdrop-blur-xl border-b border-primary/20 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-all duration-300 group">
            <div className="p-2 bg-gradient-primary rounded-xl shadow-lg group-hover:shadow-primary/25 transition-all duration-300 group-hover:scale-110">
              <Sparkles className="h-6 w-6 text-primary-foreground animate-pulse" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              SponsorSync
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link 
              to="/" 
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              Home
            </Link>
            <Link 
              to="/for-students" 
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              For Students
            </Link>
            <Link 
              to="/for-sponsors" 
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              For Sponsors
            </Link>
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            {user && (
              <>
                <NotificationCenter />
                <MessageCenter />
              </>
            )}
            {user ? (
              <>
                <Button variant="ghost" size="sm" asChild className="glass-effect">
                  <Link to="/dashboard">Dashboard</Link>
                </Button>
                <Button variant="ghost" size="sm" onClick={signOut} className="gap-2 glass-effect hover:bg-destructive/20">
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </Button>
              </>
            ) : (
              <Button variant="premium" size="sm" asChild>
                <Link to="/auth">Join Now</Link>
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-foreground hover:text-primary transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden border-t border-primary/20 glass-nav backdrop-blur-xl">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                to="/"
                className="block px-3 py-2 text-foreground hover:text-primary transition-colors font-medium"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/for-students"
                className="block px-3 py-2 text-foreground hover:text-primary transition-colors font-medium"
                onClick={() => setIsOpen(false)}
              >
                For Students
              </Link>
              <Link
                to="/for-sponsors"
                className="block px-3 py-2 text-foreground hover:text-primary transition-colors font-medium"
                onClick={() => setIsOpen(false)}
              >
                For Sponsors
              </Link>
              <div className="flex gap-2 px-3 py-2">
                {user ? (
                  <>
                    <Button variant="ghost" size="sm" className="flex-1" asChild>
                      <Link to="/dashboard" onClick={() => setIsOpen(false)}>Dashboard</Link>
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => {signOut(); setIsOpen(false);}}>
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <Button variant="premium" size="sm" className="w-full" asChild>
                    <Link to="/auth" onClick={() => setIsOpen(false)}>Join Now</Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;