const EmptyState = ({ icon: Icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center gap-3 rounded-xl2 border border-dashed border-white/10 py-16 text-center">
    {Icon && <Icon size={32} className="text-paper-400" />}
    <p className="text-lg font-medium text-paper-50">{title}</p>
    {description && <p className="max-w-sm text-sm text-paper-400">{description}</p>}
    {action}
  </div>
);

export default EmptyState;
