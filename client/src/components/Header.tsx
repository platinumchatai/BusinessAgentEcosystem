import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";

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
    <header className={`bg-white sticky top-0 z-50 transition-shadow duration-300 ${scrolled ? 'shadow-md' : ''}`}>
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <div className="bg-primary p-2 rounded-lg mr-3">
            <span className="material-icons text-white">business</span>
          </div>
          <Link href="/">
            <h1 className="font-heading font-bold text-lg md:text-2xl text-primary cursor-pointer">
              BusinessAgency.ai
            </h1>
          </Link>
        </div>
        
        <nav className="hidden md:flex items-center space-x-8">
          <a 
            href="#about" 
            className="text-neutral-400 hover:text-primary transition-colors font-medium"
            onClick={handleNavClick}
          >
            About
          </a>
          <a 
            href="#agents" 
            className="text-neutral-400 hover:text-primary transition-colors font-medium"
            onClick={handleNavClick}
          >
            Agents
          </a>
          <a 
            href="#workflows" 
            className="text-neutral-400 hover:text-primary transition-colors font-medium"
            onClick={handleNavClick}
          >
            Workflows
          </a>
          <a 
            href="#chat" 
            className="text-neutral-400 hover:text-primary transition-colors font-medium"
            onClick={handleNavClick}
          >
            Contact
          </a>
        </nav>
        
        <div className="flex items-center md:hidden">
          <button onClick={toggleMenu} className="p-2">
            <span className="material-icons">{mobileMenuOpen ? 'close' : 'menu'}</span>
          </button>
        </div>
      </div>
      
      {/* Mobile navigation */}
      {mobileMenuOpen && (
        <div className="bg-white shadow-lg absolute w-full z-50 md:hidden">
          <div className="container mx-auto px-4 py-3">
            <nav className="flex flex-col space-y-3">
              <a 
                href="#about" 
                className="text-neutral-400 hover:text-primary py-2 transition-colors"
                onClick={handleNavClick}
              >
                About
              </a>
              <a 
                href="#agents" 
                className="text-neutral-400 hover:text-primary py-2 transition-colors"
                onClick={handleNavClick}
              >
                Agents
              </a>
              <a 
                href="#workflows" 
                className="text-neutral-400 hover:text-primary py-2 transition-colors"
                onClick={handleNavClick}
              >
                Workflows
              </a>
              <a 
                href="#chat" 
                className="text-neutral-400 hover:text-primary py-2 transition-colors"
                onClick={handleNavClick}
              >
                Contact
              </a>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
