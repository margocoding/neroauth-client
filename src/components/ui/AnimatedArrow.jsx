import { motion } from "framer-motion";

const AnimatedArrow = ({ condition, className }) => {
  return (
    <motion.img
      src="/icons/arrow-right.svg"
      alt="arrow"
      style={{ marginLeft: 8 }}
      animate={condition ? { x: [0, 8, 0] } : { x: 0 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className={className}
    />
  );
};

export default AnimatedArrow;
