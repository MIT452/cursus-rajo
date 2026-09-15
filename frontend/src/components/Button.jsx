import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

const variants = {
  primary:
    "bg-gradient-to-b from-gold-400 to-gold-500 text-ink-950 shadow-goldglow hover:brightness-110",
  secondary:
    "bg-ink-700/60 text-paper-50 border border-white/10 hover:bg-ink-700 backdrop-blur-sm",
  ghost: "text-paper-50 hover:bg-white/5",
};

const sizes = {
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3.5 text-base",
};

const Button = ({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  className = "",
  as: As = "button",
  ...props
}) => {
  const MotionComp = motion(As);
  return (
    <MotionComp
      whileHover={{ y: disabled || loading ? 0 : -2 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      className={`inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 size={16} className="animate-spin" />}
      {children}
    </MotionComp>
  );
};

export default Button;
