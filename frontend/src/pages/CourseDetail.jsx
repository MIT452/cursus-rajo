import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Clock, Star, Users, CheckCircle2, PlayCircle } from "lucide-react";
import { getCourseBySlug, enrollInCourse } from "../services/courseService";
import { useAuth } from "../hooks/useAuth";
import Loading from "../components/Loading";
import Badge from "../components/Badge";
import Button from "../components/Button";
import FadeIn from "../animations/FadeIn";

const levelLabels = { DEBUTANT: "Debutant", INTERMEDIAIRE: "Intermediaire", AVANCE: "Avance" };

const CourseDetail = () => {
  const { slug } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [enrolled, setEnrolled] = useState(false);

  useEffect(() => {
    setLoading(true);
    getCourseBySlug(slug)
      .then(setCourse)
      .finally(() => setLoading(false));
  }, [slug]);

  const handleEnroll = async () => {
    if (!user) {
      navigate("/connexion");
      return;
    }
    setEnrolling(true);
    try {
      await enrollInCourse(course.id);
      setEnrolled(true);
    } catch {
      setEnrolled(true);
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-ink-950 pt-36"><Loading label="Chargement du cours" /></div>;
  if (!course) return null;

  return (
    <div className="min-h-screen bg-ink-950 px-6 pb-24 pt-36">
      <div className="mx-auto max-w-5xl">
        <FadeIn>
          <Badge tone="violet">{course.category?.name}</Badge>
          <h1 className="mt-4 font-display text-3xl leading-tight text-paper-50 sm:text-4xl">
            {course.title}
          </h1>
          <p className="mt-4 max-w-2xl text-paper-400 leading-relaxed">{course.description}</p>

          <div className="mt-6 flex flex-wrap items-center gap-6 text-sm text-paper-100">
            <span className="flex items-center gap-1.5"><Clock size={15} /> {course.durationHours}h de contenu</span>
            <span className="flex items-center gap-1.5"><Star size={15} className="text-gold-400" /> {course.rating} / 5</span>
            <span className="flex items-center gap-1.5"><Users size={15} /> {course._count?.enrollments ?? 0} inscrits</span>
            <span>Par {course.instructor}</span>
          </div>
        </FadeIn>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_320px]">
          <FadeIn delay={0.1}>
            <h2 className="font-display text-xl text-paper-50">Programme du cours</h2>
            <div className="mt-5 space-y-3">
              {course.lessons.map((lesson, i) => (
                <div
                  key={lesson.id}
                  className="flex items-center justify-between rounded-xl2 border border-white/8 bg-ink-800/50 px-5 py-4"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-xs text-paper-400">
                      {i + 1}
                    </span>
                    <span className="text-sm text-paper-50">{lesson.title}</span>
                  </div>
                  <span className="text-xs text-paper-400">{lesson.durationMin} min</span>
                </div>
              ))}
            </div>
          </FadeIn>

          <FadeIn delay={0.2} direction="left">
            <div className="sticky top-28 rounded-xl2 border border-white/8 bg-ink-800/60 p-6 backdrop-blur-sm">
              <p className="font-display text-3xl text-gold-400">
                {course.price === 0 ? "Gratuit" : `${course.price} €`}
              </p>
              <p className="mt-1 text-xs text-paper-400">Niveau {levelLabels[course.level]}</p>

              {enrolled ? (
                <div className="mt-6 flex items-center justify-center gap-2 rounded-full bg-teal-500/15 px-5 py-3 text-sm text-teal-400">
                  <CheckCircle2 size={16} /> Vous etes inscrit
                </div>
              ) : (
                <Button className="mt-6 w-full" loading={enrolling} onClick={handleEnroll}>
                  <PlayCircle size={16} /> S'inscrire au cours
                </Button>
              )}

              <ul className="mt-6 space-y-2.5 text-sm text-paper-100">
                <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-teal-400" /> Acces a vie</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-teal-400" /> Suivi de progression</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-teal-400" /> Mises a jour incluses</li>
              </ul>
            </div>
          </FadeIn>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
