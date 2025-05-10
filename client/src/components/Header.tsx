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
    <header className={`sticky top-0 z-50 transition-all duration-300 w-full bg-gradient-to-r from-[#1e4388] to-[#2a549e] text-white shadow-sm ${scrolled ? 'py-2' : 'py-3'}`}>
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between">
          <Link href="/">
            <div className="font-heading text-lg md:text-xl text-white cursor-pointer flex items-center font-normal">
              Platinum Chat AI Business Builders
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className={`transition-colors text-white hover:text-gray-200 ${isActivePath('/') ? 'font-medium bg-[#41a4ff] px-2 py-1 rounded' : ''}`}>
              Home
            </Link>
            <Link href="/consultation" className={`transition-colors text-white hover:text-gray-200 ${isActivePath('/consultation') ? 'font-medium bg-[#41a4ff] px-2 py-1 rounded' : ''}`}>
              Consultation
            </Link>
            <Link href="/#workflows" className={`transition-colors text-white hover:text-gray-200 ${isActivePath('/#workflows') ? 'font-medium bg-[#41a4ff] px-2 py-1 rounded' : ''}`}>
              Workflows
            </Link>
            <Link href="/agents" className={`transition-colors text-white hover:text-gray-200 ${isActivePath('/agents') ? 'font-medium bg-[#41a4ff] px-2 py-1 rounded' : ''}`}>
              Agents
            </Link>
            <Link href="/subscribe" className={`transition-colors text-white hover:text-gray-200 ${isActivePath('/subscribe') ? 'font-medium bg-[#41a4ff] px-2 py-1 rounded' : ''}`}>
              Subscribe
            </Link>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <a href="mailto:contact@platinumai.com" className="w-9 h-9 rounded-full bg-[#41a4ff] flex items-center justify-center text-white hover:bg-[#3190e8] transition-colors">
              <Mail className="w-4 h-4" />
            </a>
            <Link href="/subscribe" className="bg-[#41a4ff] text-white px-4 py-2 rounded-full hover:bg-[#3190e8] transition-colors">
              Get Started
            </Link>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-white hover:bg-[#3a64ae] rounded-full"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4">
            <nav className="flex flex-col gap-4">
              <Link href="/" className={`transition-colors text-white hover:text-gray-200 ${isActivePath('/') ? 'font-medium bg-[#41a4ff] px-2 py-1 rounded' : ''}`} onClick={handleNavClick}>
                Home
              </Link>
              <Link href="/consultation" className={`transition-colors text-white hover:text-gray-200 ${isActivePath('/consultation') ? 'font-medium bg-[#41a4ff] px-2 py-1 rounded' : ''}`} onClick={handleNavClick}>
                Consultation
              </Link>
              <Link href="/#workflows" className={`transition-colors text-white hover:text-gray-200 ${isActivePath('/#workflows') ? 'font-medium bg-[#41a4ff] px-2 py-1 rounded' : ''}`} onClick={handleNavClick}>
                Workflows
              </Link>
              <Link href="/#agents" className={`transition-colors text-white hover:text-gray-200 ${isActivePath('/#agents') ? 'font-medium bg-[#41a4ff] px-2 py-1 rounded' : ''}`} onClick={handleNavClick}>
                Agents
              </Link>
              <Link href="/subscribe" className={`transition-colors text-white hover:text-gray-200 ${isActivePath('/subscribe') ? 'font-medium bg-[#41a4ff] px-2 py-1 rounded' : ''}`} onClick={handleNavClick}>
                Subscribe
              </Link>
              <Link href="/subscribe" className="bg-[#41a4ff] text-white px-4 py-2 rounded-full hover:bg-[#3190e8] transition-colors w-full text-center" onClick={handleNavClick}>
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