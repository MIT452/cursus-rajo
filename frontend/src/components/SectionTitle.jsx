const SectionTitle = ({ eyebrow, title, description, align = "left" }) => (
  <div className={`max-w-2xl ${align === "center" ? "mx-auto text-center" : ""}`}>
    {eyebrow && <p className="mb-3 text-sm font-medium text-violet-400">{eyebrow}</p>}
    <h2 className="font-display text-3xl leading-tight text-paper-50 sm:text-4xl">{title}</h2>
    {description && <p className="mt-4 text-paper-400 leading-relaxed">{description}</p>}
  </div>
);

export default SectionTitle;
