const Loading = ({ label = "Chargement en cours" }) => (
  <div className="flex flex-col items-center justify-center gap-3 py-16 text-paper-400">
    <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-violet-400" />
    <span className="text-sm">{label}</span>
  </div>
);

export default Loading;
