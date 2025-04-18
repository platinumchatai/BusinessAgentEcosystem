import { motion } from "framer-motion";
import { Layers, Globe, BrainCircuit, BarChart } from "lucide-react";

const Hero = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="hero" className="bg-gradient-to-r from-primary to-primary-dark text-white min-h-[90vh] flex items-center py-16 md:py-24">
      <div className="container mx-auto px-4">
        <motion.div 
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="font-heading font-bold text-4xl md:text-6xl mb-8">
            Your Business Growth Powered by AI Agents
          </h1>
          <p className="text-xl mb-10 text-white/90 max-w-3xl mx-auto">
            Access 16 specialized AI agents that work together to help your business thrive from ideation to scaling beyond $10M.
          </p>
          
          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <motion.div 
              className="bg-white/10 backdrop-blur-sm p-6 rounded-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="flex justify-center mb-4">
                <Layers className="w-10 h-10 text-secondary" />
              </div>
              <h3 className="font-medium text-lg mb-2">Phased Approach</h3>
              <p className="text-white/80 text-sm">Strategic agents grouped by business development phase</p>
            </motion.div>
            
            <motion.div 
              className="bg-white/10 backdrop-blur-sm p-6 rounded-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="flex justify-center mb-4">
                <Globe className="w-10 h-10 text-secondary" />
              </div>
              <h3 className="font-medium text-lg mb-2">Ecosystem Integration</h3>
              <p className="text-white/80 text-sm">Agents collaborate seamlessly on complex business challenges</p>
            </motion.div>
            
            <motion.div 
              className="bg-white/10 backdrop-blur-sm p-6 rounded-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="flex justify-center mb-4">
                <BrainCircuit className="w-10 h-10 text-secondary" />
              </div>
              <h3 className="font-medium text-lg mb-2">Advanced AI</h3>
              <p className="text-white/80 text-sm">Powered by the latest AI language models for accurate advice</p>
            </motion.div>
            
            <motion.div 
              className="bg-white/10 backdrop-blur-sm p-6 rounded-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="flex justify-center mb-4">
                <BarChart className="w-10 h-10 text-secondary" />
              </div>
              <h3 className="font-medium text-lg mb-2">Business Growth</h3>
              <p className="text-white/80 text-sm">Expert guidance from ideation through scaling your company</p>
            </motion.div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-center gap-4">
            <motion.button
              onClick={() => scrollToSection("agents")}
              className="bg-white text-primary font-semibold px-8 py-4 rounded-lg shadow hover:bg-opacity-90 transition-all text-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Explore Agents
            </motion.button>
            <motion.button
              onClick={() => scrollToSection("chat")}
              className="bg-secondary text-white font-semibold px-8 py-4 rounded-lg shadow hover:bg-opacity-90 transition-all text-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start a Consultation
            </motion.button>
          </div>
          
          <motion.div 
            className="mt-12 text-white/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <p className="text-sm">Scroll down to begin your business transformation</p>
            <div className="flex justify-center mt-2">
              <svg 
                className="w-6 h-6 animate-bounce" 
                fill="none" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
              </svg>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
