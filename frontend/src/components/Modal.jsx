import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

const Modal = ({ open, onClose, title, children }) => (
  <AnimatePresence>
    {open && (
      <>
        <motion.div
          className="fixed inset-0 z-40 bg-ink-950/70 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            className="w-full max-w-md rounded-xl2 border border-white/10 bg-ink-800 p-6 shadow-2xl"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-xl text-paper-50">{title}</h3>
              <button
                onClick={onClose}
                className="rounded-full p-1.5 text-paper-400 hover:bg-white/5 hover:text-paper-50"
                aria-label="Fermer"
              >
                <X size={18} />
              </button>
            </div>
            {children}
          </motion.div>
        </div>
      </>
    )}
  </AnimatePresence>
);

export default Modal;
