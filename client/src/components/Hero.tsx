import { motion } from "framer-motion";
import { Layers, BrainCircuit, MoveRight } from "lucide-react";

const Hero = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="hero" className="hero-gradient text-white min-h-[90vh] flex items-center relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 right-10 w-8 h-8 opacity-50">
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 2L2 16L16 30L30 16L16 2Z" stroke="white" strokeWidth="2"/>
        </svg>
      </div>
      
      <div className="container mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="font-heading font-bold text-4xl md:text-6xl mb-6 leading-tight">
                Upgrade your business
                <br />
                with <span className="accent-text">real-time insights</span>
                <br />
                and automation
              </h1>
              
              {/* Decorative line */}
              <div className="w-20 h-1 bg-white/30 rounded-full my-8"></div>
              
              <p className="text-lg mb-10 text-white/80 max-w-xl">
                Track spending, set goals, and automate investments — everything you need to build wealth and stay financially confident. From budgeting to investing, get complete control over your business.
              </p>
              
              <div className="flex flex-wrap gap-4 mt-8">
                <a
                  href="#agents-section"
                  className="btn-light"
                >
                  Get Started
                  <MoveRight className="w-4 h-4" />
                </a>
                <a
                  href="/consultation"
                  className="btn-accent"
                >
                  Learn More
                  <MoveRight className="w-4 h-4" />
                </a>
              </div>
            </motion.div>
          </div>
          
          <div className="lg:col-span-5">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative"
            >
              {/* Dashboard/Analytics card */}
              <div className="bg-blue-900/40 backdrop-blur-sm p-5 rounded-xl border border-white/10">
                <div className="text-sm text-white/70 mb-2">Monthly Stats</div>
                <div className="text-5xl font-bold mb-2">192</div>
                <div className="text-xs text-white/50 mb-3">active users</div>
                
                {/* Simplified chart bars */}
                <div className="flex items-end h-20 gap-1 mb-2">
                  {[0.5, 0.7, 0.4, 0.8, 0.6, 0.9, 0.7, 0.5, 0.3, 0.6, 0.8, 0.7].map((height, i) => (
                    <div 
                      key={i} 
                      className="flex-1 bg-primary/50 rounded-sm" 
                      style={{height: `${height * 100}%`}}
                    ></div>
                  ))}
                </div>
                
                <div className="flex justify-between text-xs text-white/50">
                  <span>$8,000</span>
                  <span>$2,500</span>
                </div>
              </div>
              
              {/* Decorative orbit lines */}
              <div className="absolute -bottom-20 -left-20 w-40 h-40 opacity-30">
                <svg className="w-full h-full" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="50" cy="50" r="49" stroke="white" strokeOpacity="0.2" />
                  <circle cx="50" cy="50" r="30" stroke="white" strokeOpacity="0.2" />
                </svg>
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Stats Section */}
        <div className="stats-container mt-20 border-t border-white/10 pt-10">
          <div className="stat-item">
            <div className="stat-number">100%</div>
            <div className="stat-label">Client satisfaction</div>
          </div>
          
          <div className="stat-item">
            <div className="stat-number">300+</div>
            <div className="stat-label">Active clients</div>
          </div>
          
          <div className="stat-item">
            <div className="stat-number">24/7</div>
            <div className="stat-label">We available</div>
          </div>
        </div>
        
        {/* Partner Logos Section */}
        <motion.div 
          className="mt-20 accent-bg-light p-8 rounded-xl flex flex-wrap justify-around items-center gap-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {['FOX6 MILWAUKEE', 'BARRON\'S', 'AMERICAN BANKER', 'NEWSWEEK', 'LUXURY DAILY'].map((partner, index) => (
            <div key={index} className="text-secondary font-bold text-lg">{partner}</div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
