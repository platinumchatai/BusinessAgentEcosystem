import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { 
  Home,
  Users,
  LayoutDashboard,
  User,
  DollarSign,
  LogOut,
  LogIn
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const Header = () => {
  const [location] = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const { user, simulateLogin, simulateLogout } = useAuth();
  const isMobile = useIsMobile();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  // Check if user is authenticated
  const isAuthenticated = !!user;

  const isActivePath = (path: string) => {
    return location === path;
  };

  const handleLogout = async () => {
    try {
      // Use the real logout function
      await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include'
      });
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleLogin = () => {
    // Navigate to the auth page instead of simulating login
    window.location.href = "/auth";
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full bg-[#1a3780] shadow-md">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center">
          {/* Navigation Bar with updated order */}
          <nav className="flex justify-between items-center w-full">
            <NavItem 
              href="/" 
              icon={<Home size={22} />} 
              label="Home" 
              isActive={isActivePath('/')} 
            />
            <NavItem 
              href="/agents" 
              icon={<Users size={22} />} 
              label={isMobile ? "Agents" : "Explore Agents"} 
              isActive={isActivePath('/agents')} 
            />
            
            {/* Only show Dashboard for logged-in users */}
            {isAuthenticated && (
              <NavItem 
                href="/dashboard" 
                icon={<LayoutDashboard size={22} />} 
                label="Dashboard" 
                isActive={isActivePath('/dashboard')} 
              />
            )}
            
            <NavItem 
              href="/subscribe" 
              icon={<DollarSign size={22} />} 
              label="Subscribe" 
              isActive={isActivePath('/subscribe')} 
            />
            
            {/* User profile with dropdown */}
            {isAuthenticated ? (
              <div className="flex flex-col items-center justify-center py-3 px-2 md:px-4 text-white">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="p-0 h-auto flex flex-col items-center hover:bg-transparent focus:outline-none focus:ring-0">
                      <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center cursor-pointer hover:bg-white/30">
                        <User size={18} />
                      </div>
                      <span className="text-xs mt-1">{user?.username}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard" className="flex items-center w-full cursor-pointer">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                    
                    {/* Admin page link - only for admin users */}
                    {user?.isAdmin && (
                      <DropdownMenuItem asChild>
                        <Link href="/admin" className="flex items-center w-full cursor-pointer">
                          <User className="mr-2 h-4 w-4" />
                          <span>Admin Panel</span>
                        </Link>
                      </DropdownMenuItem>
                    )}
                    
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="flex items-center cursor-pointer" 
                      onClick={handleLogout}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sign Out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-3 px-2 md:px-4 text-white">
                <Button 
                  variant="ghost" 
                  className="p-0 h-auto flex flex-col items-center hover:bg-transparent"
                  onClick={handleLogin}
                >
                  <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center cursor-pointer hover:bg-white/30">
                    <LogIn size={18} />
                  </div>
                  <span className="text-xs mt-1">Login/Signup</span>
                </Button>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ href, icon, label, isActive }) => {
  const isMobile = useIsMobile();
  
  return (
    <Link href={href}>
      <div className={`flex flex-col items-center justify-center py-3 px-2 md:px-4 relative ${
        isActive ? 'text-white' : 'text-white/80 hover:text-white'
      }`}>
        <div>
          {icon}
        </div>
        <span className="text-xs mt-1">{label}</span>
        {isActive && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#FF8C30]"></div>
        )}
      </div>
    </Link>
  );
};

export default Header;