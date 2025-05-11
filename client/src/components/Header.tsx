import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { 
  Home,
  MessageSquare,
  Users,
  LayoutDashboard,
  User,
  DollarSign
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useIsMobile } from "@/hooks/use-mobile";

const Header = () => {
  const [location] = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const { user } = useAuth();
  const isMobile = useIsMobile();

  const isActivePath = (path: string) => {
    return location === path;
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
          {/* Navigation Bar exactly matching the screenshot */}
          <nav className="flex justify-between items-center w-full">
            <NavItem 
              href="/" 
              icon={<Home size={22} />} 
              label="Home" 
              isActive={isActivePath('/')} 
            />
            <NavItem 
              href="/consultation" 
              icon={<MessageSquare size={22} />} 
              label={isMobile ? "Consult" : "Start a Consultation"} 
              isActive={isActivePath('/consultation')} 
            />
            <NavItem 
              href="/agents" 
              icon={<Users size={22} />} 
              label={isMobile ? "Agents" : "Explore Agents"} 
              isActive={isActivePath('/agents')} 
            />
            <NavItem 
              href="/dashboard" 
              icon={<LayoutDashboard size={22} />} 
              label="Dashboard" 
              isActive={isActivePath('/dashboard')} 
            />
            <NavItem 
              href="/profile" 
              icon={<User size={22} />} 
              label="Profile" 
              isActive={isActivePath('/profile')} 
            />
            <NavItem 
              href="/pricing" 
              icon={<DollarSign size={22} />} 
              label="Pricing" 
              isActive={isActivePath('/pricing')} 
            />
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
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white"></div>
        )}
      </div>
    </Link>
  );
};

export default Header;