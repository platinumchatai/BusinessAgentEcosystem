import { ArrowLeft } from 'lucide-react';

interface BackNavigationProps {
  text: string;
  onClick: () => void;
}

const BackNavigation = ({ text, onClick }: BackNavigationProps) => {
  return (
    <button 
      onClick={onClick}
      className="inline-flex items-center text-[#41a4ff] hover:text-[#3190e8] font-medium text-sm mb-4"
    >
      <ArrowLeft size={16} className="mr-1.5" />
      {text}
    </button>
  );
};

export default BackNavigation;