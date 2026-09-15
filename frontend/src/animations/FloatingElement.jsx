const FloatingElement = ({ className = "", delay = "0s", duration = "6s" }) => (
  <div
    className={`absolute rounded-full blur-3xl opacity-40 animate-float ${className}`}
    style={{ animationDelay: delay, animationDuration: duration }}
  />
);

export default FloatingElement;
