import { useEffect, useRef, useState } from "react";
import { motion, useInView, animate } from "framer-motion";

const StatCounter = ({ value, suffix = "", label }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      duration: 1.6,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, value]);

  return (
    <div ref={ref}>
      <motion.p className="font-display text-4xl text-paper-50 sm:text-5xl">
        {display}
        {suffix}
      </motion.p>
      <p className="mt-2 text-sm text-paper-400">{label}</p>
    </div>
  );
};

export default StatCounter;
