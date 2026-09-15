import { useEffect, useState } from "react";
import { Search, BookX } from "lucide-react";
import { getCourses, getCategories } from "../services/courseService";
import CourseCard from "../components/CourseCard";
import Loading from "../components/Loading";
import EmptyState from "../components/EmptyState";
import FadeIn from "../animations/FadeIn";

const levels = [
  { value: "", label: "Tous niveaux" },
  { value: "DEBUTANT", label: "Debutant" },
  { value: "INTERMEDIAIRE", label: "Intermediaire" },
  { value: "AVANCE", label: "Avance" },
];

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [level, setLevel] = useState("");
  const [sort, setSort] = useState("");

  useEffect(() => {
    getCategories().then(setCategories).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => {
      getCourses({ search, category, level, sort })
        .then(setCourses)
        .finally(() => setLoading(false));
    }, 300);
    return () => clearTimeout(timeout);
  }, [search, category, level, sort]);

  return (
    <div className="min-h-screen bg-ink-950 px-6 pb-24 pt-36">
      <div className="mx-auto max-w-6xl">
        <FadeIn>
          <p className="text-sm font-medium text-violet-400">Catalogue</p>
          <h1 className="mt-2 font-display text-3xl text-paper-50 sm:text-4xl">
            Trouvez le parcours qui correspond a votre objectif
          </h1>
        </FadeIn>

        <FadeIn delay={0.1} className="mt-8 flex flex-col gap-4 rounded-xl2 border border-white/8 bg-ink-800/50 p-4 sm:flex-row sm:items-center">
          <div className="flex flex-1 items-center gap-2 rounded-lg border border-white/10 bg-ink-900/60 px-3 py-2.5">
            <Search size={16} className="text-paper-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un cours, un theme..."
              className="w-full bg-transparent text-sm text-paper-50 outline-none placeholder:text-paper-400"
            />
          </div>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-lg border border-white/10 bg-ink-900/60 px-3 py-2.5 text-sm text-paper-100 outline-none"
          >
            <option value="">Toutes categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>{c.name}</option>
            ))}
          </select>

          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="rounded-lg border border-white/10 bg-ink-900/60 px-3 py-2.5 text-sm text-paper-100 outline-none"
          >
            {levels.map((l) => (
              <option key={l.value} value={l.value}>{l.label}</option>
            ))}
          </select>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="flex items-center rounded-lg border border-white/10 bg-ink-900/60 px-3 py-2.5 text-sm text-paper-100 outline-none"
          >
            <option value="">Plus recents</option>
            <option value="rating">Mieux notes</option>
            <option value="price_asc">Prix croissant</option>
            <option value="price_desc">Prix decroissant</option>
          </select>
        </FadeIn>

        <div className="mt-10">
          {loading ? (
            <Loading label="Recherche des cours" />
          ) : courses.length === 0 ? (
            <EmptyState
              icon={BookX}
              title="Aucun cours ne correspond"
              description="Essayez d'ajuster votre recherche ou vos filtres."
            />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {courses.map((c) => (
                <CourseCard key={c.id} course={c} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Courses;
