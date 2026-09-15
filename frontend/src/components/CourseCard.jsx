import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Clock, Star, Users, BookOpen } from "lucide-react";

const levelLabels = {
  DEBUTANT: "Debutant",
  INTERMEDIAIRE: "Intermediaire",
  AVANCE: "Avance",
};

const CourseCard = ({ course }) => (
  <motion.div whileHover={{ y: -6 }} transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}>
    <Link
      to={`/cours/${course.slug}`}
      className="group block overflow-hidden rounded-xl2 border border-white/8 bg-ink-800/60 backdrop-blur-sm transition-colors hover:border-white/16"
    >
      <div
        className="flex h-36 items-center justify-center relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${course.thumbnailColor}33, ${course.thumbnailColor}0D)`,
        }}
      >
        <BookOpen size={36} style={{ color: course.thumbnailColor }} className="opacity-80" />
        <div
          className="absolute -right-6 -top-6 h-24 w-24 rounded-full blur-2xl opacity-40"
          style={{ backgroundColor: course.thumbnailColor }}
        />
      </div>

      <div className="p-5">
        <p className="mb-2 text-xs font-medium text-violet-400">{course.category?.name}</p>
        <h3 className="font-display text-lg leading-snug text-paper-50 line-clamp-2">
          {course.title}
        </h3>
        <p className="mt-1 text-sm text-paper-400">{course.instructor}</p>

        <div className="mt-4 flex items-center gap-4 text-xs text-paper-400">
          <span className="flex items-center gap-1">
            <Clock size={13} /> {course.durationHours}h
          </span>
          <span className="flex items-center gap-1">
            <Star size={13} className="text-gold-400" /> {course.rating}
          </span>
          <span className="flex items-center gap-1">
            <Users size={13} /> {course._count?.enrollments ?? 0}
          </span>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-white/8 pt-4">
          <span className="rounded-full border border-white/10 px-2.5 py-1 text-[11px] text-paper-100">
            {levelLabels[course.level]}
          </span>
          <span className="font-display text-lg text-gold-400">
            {course.price === 0 ? "Gratuit" : `${course.price} €`}
          </span>
        </div>
      </div>
    </Link>
  </motion.div>
);

export default CourseCard;
