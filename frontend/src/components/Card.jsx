const Card = ({ children, className = "", hover = true }) => (
  <div
    className={`rounded-xl2 border border-white/8 bg-ink-800/60 backdrop-blur-sm p-6 transition-all duration-300 ${
      hover ? "hover:border-white/16 hover:-translate-y-1" : ""
    } ${className}`}
  >
    {children}
  </div>
);

export default Card;
