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
    <header className={`sticky top-4 z-50 transition-all duration-300 max-w-6xl mx-auto px-4`}>
      <div className="navbar">
        <div className="flex items-center">
          <Link href="/">
            <h1 className="font-heading text-lg md:text-xl text-white cursor-pointer flex items-center">
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
            className="nav-link"
            onClick={handleNavClick}
          >
            Who We Serve
          </a>
          <a 
            href="/#agents-section" 
            className="nav-link"
            onClick={handleNavClick}
          >
            Agents
          </a>
          <a 
            href="/#workflows" 
            className="nav-link"
            onClick={handleNavClick}
          >
            Services
          </a>
          <Link 
            href="/consultation" 
            className="nav-link"
            onClick={handleNavClick}
          >
            Insights
          </Link>
          <Link 
            href="/about" 
            className="nav-link"
            onClick={handleNavClick}
          >
            About
          </Link>
          <Link 
            href="/contact" 
            className="nav-link"
            onClick={handleNavClick}
          >
            Career
          </Link>
        </nav>
        
        <div className="hidden md:flex items-center space-x-3">
          <a href="tel:+1234567890" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors">
            <Phone className="w-4 h-4" />
          </a>
          <a href="mailto:contact@platinumai.com" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors">
            <Mail className="w-4 h-4" />
          </a>
          <Link 
            href="/subscribe" 
            className="btn-accent ml-2"
            onClick={handleNavClick}
          >
            LET'S TALK
          </Link>
        </div>
        
        <div className="flex items-center md:hidden">
          <button onClick={toggleMenu} className="p-2 text-white">
            <span className="material-icons">{mobileMenuOpen ? 'close' : 'menu'}</span>
          </button>
        </div>
      </div>
      
      {/* Mobile navigation */}
      {mobileMenuOpen && (
        <div className="bg-secondary shadow-lg absolute w-full z-50 md:hidden mt-2 rounded-lg">
          <div className="container mx-auto px-4 py-3">
            <nav className="flex flex-col space-y-3">
              <a 
                href="/#about" 
                className="text-white hover:text-accent py-2 transition-colors font-semibold"
                onClick={handleNavClick}
              >
                Who We Serve
              </a>
              <a 
                href="/#agents-section" 
                className="text-white hover:text-accent py-2 transition-colors font-semibold"
                onClick={handleNavClick}
              >
                Agents
              </a>
              <a 
                href="/#workflows" 
                className="text-white hover:text-accent py-2 transition-colors font-semibold"
                onClick={handleNavClick}
              >
                Services
              </a>
              <Link 
                href="/consultation" 
                className="text-white hover:text-accent py-2 transition-colors font-semibold"
                onClick={handleNavClick}
              >
                Insights
              </Link>
              <Link 
                href="/about" 
                className="text-white hover:text-accent py-2 transition-colors font-semibold"
                onClick={handleNavClick}
              >
                About
              </Link>
              <Link 
                href="/contact" 
                className="text-white hover:text-accent py-2 transition-colors font-semibold"
                onClick={handleNavClick}
              >
                Career
              </Link>
              <Link 
                href="/subscribe" 
                className="text-accent font-bold py-2 transition-colors"
                onClick={handleNavClick}
              >
                LET'S TALK
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
