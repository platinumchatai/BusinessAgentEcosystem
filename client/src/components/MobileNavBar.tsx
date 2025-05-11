import React from 'react';
import { Link, useLocation } from 'wouter';
import { 
  Home,
  MessageSquare,
  Users,
  LayoutDashboard,
  User,
  DollarSign
} from 'lucide-react';

const MobileNavBar: React.FC = () => {
  const [location] = useLocation();
  
  const isActive = (path: string) => location === path;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white shadow-lg md:hidden">
      <div className="flex justify-between items-center">
        <NavItem 
          href="/" 
          icon={<Home size={20} />} 
          label="Home" 
          isActive={isActive('/')} 
        />
        <NavItem 
          href="/consultation" 
          icon={<MessageSquare size={20} />} 
          label="Consultation" 
          isActive={isActive('/consultation')} 
        />
        <NavItem 
          href="/agents" 
          icon={<Users size={20} />} 
          label="Agents" 
          isActive={isActive('/agents')} 
        />
        <NavItem 
          href="/dashboard" 
          icon={<LayoutDashboard size={20} />} 
          label="Dashboard" 
          isActive={isActive('/dashboard')} 
        />
        <NavItem 
          href="/profile" 
          icon={<User size={20} />} 
          label="Profile" 
          isActive={isActive('/profile')} 
        />
        <NavItem 
          href="/pricing" 
          icon={<DollarSign size={20} />} 
          label="Pricing" 
          isActive={isActive('/pricing')} 
        />
      </div>
    </div>
  );
};

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ href, icon, label, isActive }) => {
  return (
    <Link href={href}>
      <a className={`flex flex-col items-center justify-center py-2 px-3 ${
        isActive ? 'text-indigo-600' : 'text-gray-500'
      }`}>
        <div className={`p-1 ${isActive ? 'bg-indigo-100 rounded-full' : ''}`}>
          {icon}
        </div>
        <span className="text-xs mt-1">{label}</span>
        {isActive && (
          <div className="absolute bottom-0 w-full h-1 bg-indigo-600" style={{ left: 0 }}></div>
        )}
      </a>
    </Link>
  );
};

export default MobileNavBar;