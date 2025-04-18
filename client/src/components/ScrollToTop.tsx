import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled down
  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Set the scroll event listener
  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  // Simple scroll to top without smooth scrolling or focus manipulation
  const scrollToTop = () => {
    window.scrollTo(0, 0);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed bottom-16 right-24 z-[9999]"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.2 }}
        >
          <button
            onClick={scrollToTop}
            className="bg-white/90 backdrop-blur-sm text-primary p-4 rounded-full shadow-lg hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300 focus:outline-none border border-gray-100"
            aria-label="Scroll to top"
          >
            <ArrowUp size={24} strokeWidth={2.5} className="text-primary" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ScrollToTop;