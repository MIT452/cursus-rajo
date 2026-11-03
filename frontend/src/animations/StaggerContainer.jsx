import { motion } from "framer-motion";

const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1 },
  },
};

export const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

const StaggerContainer = ({ children, className = "" }) => (
  <motion.div
    className={className}
    variants={containerVariants}
    initial="hidden"
    whileInView="show"
    viewport={{ once: true, margin: "-60px" }}
  >
    {children}
  </motion.div>
);

export default StaggerContainer;
