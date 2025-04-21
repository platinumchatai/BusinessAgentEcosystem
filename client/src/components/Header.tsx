import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Phone, Mail } from "lucide-react";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Close mobile menu when clicking a link
  const handleNavClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 w-full bg-white/90 backdrop-blur-md shadow-sm ${scrolled ? 'py-2' : 'py-3'}`}>
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/">
              <h1 className="font-heading text-lg md:text-xl text-secondary cursor-pointer flex items-center">
                <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor"/>
                  <path d="M2 17L12 22L22 17" fill="currentColor"/>
                  <path d="M2 12L12 17L22 12" fill="currentColor"/>
                </svg>
                PlatinumAI
              </h1>
            </Link>
          </div>
          
          <nav className="hidden md:flex items-center space-x-2">
            <a 
              href="/#about" 
              className="text-gray-800 hover:text-accent font-medium px-4 py-2 rounded-full transition-colors"
              onClick={handleNavClick}
            >
              Who We Serve
            </a>
            <a 
              href="/#agents-section" 
              className="text-gray-800 hover:text-accent font-medium px-4 py-2 rounded-full transition-colors"
              onClick={handleNavClick}
            >
              Agents
            </a>
            <a 
              href="/#workflows" 
              className="text-gray-800 hover:text-accent font-medium px-4 py-2 rounded-full transition-colors"
              onClick={handleNavClick}
            >
              Services
            </a>
            <Link 
              href="/consultation" 
              className="text-gray-800 hover:text-accent font-medium px-4 py-2 rounded-full transition-colors"
              onClick={handleNavClick}
            >
              Insights
            </Link>
            <Link 
              href="/about" 
              className="text-gray-800 hover:text-accent font-medium px-4 py-2 rounded-full transition-colors"
              onClick={handleNavClick}
            >
              About
            </Link>
            <Link 
              href="/contact" 
              className="text-gray-800 hover:text-accent font-medium px-4 py-2 rounded-full transition-colors"
              onClick={handleNavClick}
            >
              Career
            </Link>
          </nav>
          
          <div className="hidden md:flex items-center space-x-3">
            <a href="tel:+1234567890" className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 hover:bg-gray-200 transition-colors">
              <Phone className="w-4 h-4" />
            </a>
            <a href="mailto:contact@platinumai.com" className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 hover:bg-gray-200 transition-colors">
              <Mail className="w-4 h-4" />
            </a>
            <Link 
              href="/subscribe" 
              className="bg-accent text-white rounded-full px-5 py-2 font-semibold transition-all hover:bg-accent/90 shadow-sm"
              onClick={handleNavClick}
            >
              LET'S TALK
            </Link>
          </div>
          
          <div className="flex items-center md:hidden">
            <button onClick={toggleMenu} className="p-2 text-gray-700 hover:bg-gray-100 rounded-full">
              <span className="material-icons">{mobileMenuOpen ? 'close' : 'menu'}</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile navigation */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white shadow-lg z-50 md:hidden mt-1 rounded-b-lg border-t border-gray-100">
          <div className="container mx-auto px-4 py-3">
            <nav className="flex flex-col space-y-2">
              <a 
                href="/#about" 
                className="text-gray-800 hover:text-accent py-2.5 px-3 rounded-lg transition-colors font-medium"
                onClick={handleNavClick}
              >
                Who We Serve
              </a>
              <a 
                href="/#agents-section" 
                className="text-gray-800 hover:text-accent py-2.5 px-3 rounded-lg transition-colors font-medium"
                onClick={handleNavClick}
              >
                Agents
              </a>
              <a 
                href="/#workflows" 
                className="text-gray-800 hover:text-accent py-2.5 px-3 rounded-lg transition-colors font-medium"
                onClick={handleNavClick}
              >
                Services
              </a>
              <Link 
                href="/consultation" 
                className="text-gray-800 hover:text-accent py-2.5 px-3 rounded-lg transition-colors font-medium"
                onClick={handleNavClick}
              >
                Insights
              </Link>
              <Link 
                href="/about" 
                className="text-gray-800 hover:text-accent py-2.5 px-3 rounded-lg transition-colors font-medium"
                onClick={handleNavClick}
              >
                About
              </Link>
              <Link 
                href="/contact" 
                className="text-gray-800 hover:text-accent py-2.5 px-3 rounded-lg transition-colors font-medium"
                onClick={handleNavClick}
              >
                Career
              </Link>
              <div className="mt-2 pt-2 border-t border-gray-100">
                <Link 
                  href="/subscribe" 
                  className="block w-full bg-accent text-white rounded-lg font-medium py-2.5 px-3 text-center"
                  onClick={handleNavClick}
                >
                  LET'S TALK
                </Link>
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
