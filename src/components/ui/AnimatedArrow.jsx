import { motion } from "framer-motion";

const AnimatedArrow = ({ condition }) => {
  return (
    <motion.img
      src="/icons/arrow-right.svg"
      alt="arrow"
      style={{ marginLeft: 8 }}
      animate={condition ? { x: [0, 6, 0] } : { x: 0 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
};

export default AnimatedArrow;
