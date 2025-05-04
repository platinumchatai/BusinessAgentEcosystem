import { ReactNode, useEffect } from 'react';
import { useLocation } from 'wouter';
import Footer from '@/components/Footer';
import FloatingActionButton from '@/components/FloatingActionButton';

interface ConsultationLayoutProps {
  children: ReactNode;
}

const ConsultationLayout = ({ children }: ConsultationLayoutProps) => {
  const [location] = useLocation();
  
  // Scroll to top on route changes and on initial mount
  useEffect(() => {
    // Force immediate scroll to top
    window.scrollTo(0, 0);
    
    // Use rAF to ensure it happens after render
    requestAnimationFrame(() => {
      window.scrollTo(0, 0);
    });
  }, [location]);
  
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* No header to remove logo as requested */}
      <main id="top" className="flex-grow">
        {children}
      </main>
      <Footer />
      <FloatingActionButton onClick={() => scrollToSection('chat')} />
    </div>
  );
};

export default ConsultationLayout;