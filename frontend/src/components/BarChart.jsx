import { motion } from "framer-motion";

const BarChart = ({ data, height = 160 }) => {
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="flex items-end gap-3" style={{ height }}>
      {data.map((d, i) => (
        <div key={d.label} className="flex flex-1 flex-col items-center gap-2">
          <motion.div
            className="w-full rounded-t-md bg-gradient-to-t from-violet-500 to-violet-400"
            initial={{ height: 0 }}
            animate={{ height: `${(d.value / max) * (height - 30)}px` }}
            transition={{ duration: 0.6, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
          />
          <span className="text-[11px] text-paper-400">{d.label}</span>
        </div>
      ))}
    </div>
  );
};

export default BarChart;
