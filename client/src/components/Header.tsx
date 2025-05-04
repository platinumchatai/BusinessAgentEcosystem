import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Mail, Menu, X } from "lucide-react";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();
  const [scrolled, setScrolled] = useState(false);

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

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    setMobileMenuOpen(false);
    const href = e.currentTarget.getAttribute('href');
    if (href?.startsWith('/#')) {
      e.preventDefault();
      const targetId = href.substring(2);
      const element = document.getElementById(targetId);
      if (element) {
        const headerOffset = 80;
        const elementPosition = element.getBoundingClientRect().top + window.scrollY;
        const offsetPosition = elementPosition - headerOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }
  };

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 w-full bg-white/90 backdrop-blur-md shadow-sm ${scrolled ? 'py-2' : 'py-3'}`}>
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between">
          <Link href="/">
            <div className="font-heading text-lg md:text-xl text-secondary cursor-pointer flex items-center font-normal">
              <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor"/>
                <path d="M2 17L12 22L22 17" fill="currentColor"/>
                <path d="M2 12L12 17L22 12" fill="currentColor"/>
              </svg>
              Platinum Chat AI
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className={`transition-colors ${isActivePath('/') ? 'text-accent font-medium' : 'text-gray-700 hover:text-accent'}`}>
              Home
            </Link>
            <Link href="/consultation" className={`transition-colors ${isActivePath('/consultation') ? 'text-accent font-medium' : 'text-gray-700 hover:text-accent'}`}>
              Consultation
            </Link>
            <Link href="/#workflows" className={`transition-colors ${isActivePath('/#workflows') ? 'text-accent font-medium' : 'text-gray-700 hover:text-accent'}`}>
              Workflows
            </Link>
            <Link href="/#agents" className={`transition-colors ${isActivePath('/#agents') ? 'text-accent font-medium' : 'text-gray-700 hover:text-accent'}`}>
              Agents
            </Link>
            <Link href="/subscribe" className={`transition-colors ${isActivePath('/subscribe') ? 'text-accent font-medium' : 'text-gray-700 hover:text-accent'}`}>
              Subscribe
            </Link>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <a href="mailto:contact@platinumai.com" className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 hover:bg-gray-200 transition-colors">
              <Mail className="w-4 h-4" />
            </a>
            <Link href="/subscribe" className="bg-accent text-white px-4 py-2 rounded-full hover:bg-accent/90 transition-colors">
              Get Started
            </Link>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-full"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4">
            <nav className="flex flex-col gap-4">
              <Link href="/" className="text-gray-700 hover:text-accent transition-colors" onClick={handleNavClick}>
                Home
              </Link>
              <Link href="/consultation" className="text-gray-700 hover:text-accent transition-colors" onClick={handleNavClick}>
                Consultation
              </Link>
              <Link href="/#workflows" className="text-gray-700 hover:text-accent transition-colors" onClick={handleNavClick}>
                Workflows
              </Link>
              <Link href="/#agents" className="text-gray-700 hover:text-accent transition-colors" onClick={handleNavClick}>
                Agents
              </Link>
              <Link href="/subscribe" className="text-gray-700 hover:text-accent transition-colors" onClick={handleNavClick}>
                Subscribe
              </Link>
              <Link href="/subscribe" className="bg-accent text-white px-4 py-2 rounded-full hover:bg-accent/90 transition-colors w-full text-center" onClick={handleNavClick}>
                Get Started
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;