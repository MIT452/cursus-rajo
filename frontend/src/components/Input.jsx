const Input = ({ label, error, className = "", ...props }) => (
  <label className="block">
    {label && <span className="mb-1.5 block text-sm text-paper-100">{label}</span>}
    <input
      className={`w-full rounded-lg border border-white/10 bg-ink-900/60 px-4 py-2.5 text-paper-50 placeholder:text-paper-400 outline-none transition-colors focus:border-violet-400 ${className}`}
      {...props}
    />
    {error && <span className="mt-1.5 block text-xs text-rose-400">{error}</span>}
  </label>
);

export default Input;
