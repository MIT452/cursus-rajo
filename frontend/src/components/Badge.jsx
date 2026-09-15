const tones = {
  violet: "bg-violet-500/15 text-violet-400 border-violet-500/30",
  gold: "bg-gold-400/15 text-gold-400 border-gold-400/30",
  teal: "bg-teal-500/15 text-teal-400 border-teal-500/30",
  neutral: "bg-white/5 text-paper-100 border-white/10",
};

const Badge = ({ children, tone = "neutral", className = "" }) => (
  <span
    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${tones[tone]} ${className}`}
  >
    {children}
  </span>
);

export default Badge;
