import { motion } from "framer-motion";

interface FloatingActionButtonProps {
  onClick: () => void;
}

const FloatingActionButton = ({ onClick }: FloatingActionButtonProps) => {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <motion.button 
        className="bg-secondary w-14 h-14 rounded-full shadow-elevated flex items-center justify-center text-white hover:bg-secondary-dark transition-colors"
        onClick={onClick}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          type: "spring", 
          duration: 0.6,
          delay: 1
        }}
      >
        <motion.span 
          className="material-icons"
          animate={{ 
            scale: [1, 1.2, 1],
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 2,
            ease: "easeInOut" 
          }}
        >
          chat
        </motion.span>
      </motion.button>
    </div>
  );
};

export default FloatingActionButton;
