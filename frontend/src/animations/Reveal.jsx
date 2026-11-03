import { motion } from "framer-motion";

const Reveal = ({ children, className = "", delay = 0 }) => (
  <motion.div
    className={`overflow-hidden ${className}`}
    initial={{ clipPath: "inset(0 0 100% 0)", opacity: 0 }}
    whileInView={{ clipPath: "inset(0 0 0% 0)", opacity: 1 }}
    viewport={{ once: true, margin: "-60px" }}
    transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
  >
    {children}
  </motion.div>
);

export default Reveal;
