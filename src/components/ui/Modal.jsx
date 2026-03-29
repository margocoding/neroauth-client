import { motion } from "framer-motion";

const Modal = ({ opened, children, onClose, className }) => {
  if (!opened) return null;
  return (
    <motion.div
      className="bg-black/70 backdrop-blur-sm w-screen h-screen flex justify-center items-center fixed inset-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={2000}
        className="bg-[#111] border z-50 border-gray-700 rounded-xl p-6 space-y-3 min-w-96 relative"
      >
        <header>
          <button onClick={onClose}>
            <span className="absolute right-5 top-5">
              <img src="/icons/cross.svg" alt="cross" height={30} width={30} />
            </span>
          </button>
        </header>

        <main className={`${className} w-full`}>{children}</main>
      </motion.div>
    </motion.div>
  );
};

export default Modal;
