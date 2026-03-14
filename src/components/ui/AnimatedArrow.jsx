import { motion } from "framer-motion";

const AnimatedArrow = ({ condition, className }) => {
  return (
    <motion.img
      src="/icons/arrow-right.svg"
      alt="arrow"
      animate={
        condition
          ? {
              y: [0, 16, 0],
              opacity: [0.6, 1, 0.6],
            }
          : { y: 0, opacity: 1 }
      }
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className={`drop-shadow-lg ${className || ""}`}
      style={{ 
        filter: "drop-shadow(0 0 10px rgba(255, 122, 0, 0.9)) drop-shadow(0 0 20px rgba(255, 176, 115, 0.7)) drop-shadow(0 0 30px rgba(255, 122, 0, 0.5))",
        marginTop: "0.5rem",
        marginBottom: "0.5rem"
      }}
    />
  );
};

export default AnimatedArrow;