import { motion } from "framer-motion";

const Hero = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="bg-gradient-to-r from-primary to-primary-dark text-white py-16 md:py-24">
      <div className="container mx-auto px-4">
        <motion.div 
          className="max-w-3xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="font-heading font-bold text-3xl md:text-5xl mb-6">
            Your Business Growth Powered by AI Agents
          </h1>
          <p className="text-lg mb-8 text-white/90">
            Access 16 specialized AI agents that work together to help your business thrive from ideation to scaling beyond $10M.
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-4">
            <motion.button
              onClick={() => scrollToSection("agents")}
              className="bg-white text-primary font-semibold px-6 py-3 rounded-lg shadow hover:bg-opacity-90 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Explore Agents
            </motion.button>
            <motion.button
              onClick={() => scrollToSection("chat")}
              className="bg-secondary text-white font-semibold px-6 py-3 rounded-lg shadow hover:bg-opacity-90 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start a Consultation
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
