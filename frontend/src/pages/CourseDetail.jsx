import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Clock, Star, Users, CheckCircle2, PlayCircle } from "lucide-react";
import {
  getCourseBySlug,
  enrollInCourse,
  getMyEnrollments,
  completeLesson,
} from "../services/courseService";
import { getLessonContent, hasLessonContent } from "../data/lessonContent";
import LessonModal from "../components/LessonModal";
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
  const [enrollment, setEnrollment] = useState(null); // { id, progress }
  const [completedIds, setCompletedIds] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);

  const enrolled = Boolean(enrollment);
  const tracked = course ? hasLessonContent(course.slug) : false;

  useEffect(() => {
    setLoading(true);
    getCourseBySlug(slug)
      .then(setCourse)
      .finally(() => setLoading(false));
  }, [slug]);

  // retrouve l'inscription réelle de l'utilisateur (et ses leçons validées)
  const syncEnrollment = async (courseId) => {
    const mine = await getMyEnrollments();
    const found = mine.find((e) => e.courseId === courseId);
    setEnrollment(found ? { id: found.id, progress: found.progress } : null);
    setCompletedIds(found ? found.lessonProgress.map((l) => l.lessonId) : []);
  };

  useEffect(() => {
    if (!user || !course) {
      setEnrollment(null);
      setCompletedIds([]);
      return;
    }
    syncEnrollment(course.id).catch(() => {});
  }, [user, course]);

  const handleEnroll = async () => {
    if (!user) {
      navigate("/connexion");
      return;
    }
    setEnrolling(true);
    try {
      await enrollInCourse(course.id);
    } catch {
      // déjà inscrit (409) ou autre erreur : on resynchronise ci-dessous
    }
    try {
      await syncEnrollment(course.id);
    } finally {
      setEnrolling(false);
    }
  };

  const handleCompleteLesson = async (lesson) => {
    const result = await completeLesson(enrollment.id, lesson.id);
    setEnrollment({ id: result.id, progress: result.progress });
    setCompletedIds(result.completedLessonIds);
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
              {course.lessons.map((lesson, i) => {
                const done = completedIds.includes(lesson.id);
                const clickable = tracked && Boolean(getLessonContent(course.slug, i));
                const Wrapper = clickable ? "button" : "div";
                return (
                  <Wrapper
                    key={lesson.id}
                    {...(clickable ? { type: "button", onClick: () => setOpenIndex(i) } : {})}
                    className={`flex w-full items-center justify-between rounded-xl2 border bg-ink-800/50 px-5 py-4 text-left transition-colors ${
                      done ? "border-teal-400/30" : "border-white/8"
                    } ${clickable ? "cursor-pointer hover:border-violet-400/40 hover:bg-ink-800" : ""}`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`flex h-8 w-8 items-center justify-center rounded-full border text-xs ${
                          done
                            ? "border-teal-400/40 bg-teal-500/15 text-teal-400"
                            : "border-white/10 text-paper-400"
                        }`}
                      >
                        {done ? <CheckCircle2 size={14} /> : i + 1}
                      </span>
                      <span className="text-sm text-paper-50">{lesson.title}</span>
                    </div>
                    <span className="text-xs text-paper-400">{lesson.durationMin} min</span>
                  </Wrapper>
                );
              })}
            </div>
          </FadeIn>

          <FadeIn delay={0.2} direction="left">
            <div className="sticky top-28 rounded-xl2 border border-white/8 bg-ink-800/60 p-6 backdrop-blur-sm">
              <p className="font-display text-3xl text-gold-400">
                {course.price === 0 ? "Gratuit" : `${course.price} Ar`}
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

              {enrolled && tracked && (
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs text-paper-400">
                    <span>{completedIds.length} / {course.lessons.length} leçons</span>
                    <span>{enrollment.progress}%</span>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-violet-500 to-teal-400 transition-all duration-500"
                      style={{ width: `${enrollment.progress}%` }}
                    />
                  </div>
                </div>
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

      {tracked && openIndex !== null && course.lessons[openIndex] && (
        <LessonModal
          open
          onClose={() => setOpenIndex(null)}
          lesson={course.lessons[openIndex]}
          index={openIndex}
          total={course.lessons.length}
          content={getLessonContent(course.slug, openIndex)}
          completed={completedIds.includes(course.lessons[openIndex].id)}
          completedCount={completedIds.length}
          enrolled={enrolled}
          onEnroll={handleEnroll}
          onComplete={handleCompleteLesson}
        />
      )}
    </div>
  );
};

export default CourseDetail;
