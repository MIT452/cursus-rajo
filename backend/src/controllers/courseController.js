const prisma = require("../config/prisma");
const asyncHandler = require("../utils/asyncHandler");

const LEVELS = ["DEBUTANT", "INTERMEDIAIRE", "AVANCE"];

const badRequest = (res, message) => {
  res.status(400);
  throw new Error(message);
};

const slugify = (text) =>
  String(text)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const uniqueSlug = async (title) => {
  const base = slugify(title) || "cours";
  let slug = base;
  let n = 2;
  while (await prisma.course.findUnique({ where: { slug } })) {
    slug = `${base}-${n++}`;
  }
  return slug;
};

// Vérifie la mini-leçon : intro, exemple optionnel, exercice à choix multiple.
const cleanContent = (res, raw, label) => {
  const c = raw || {};
  const intro = String(c.intro || "").trim();
  const ex = c.exercise || {};
  const options = Array.isArray(ex.options) ? ex.options.map((o) => String(o).trim()) : [];

  if (!intro) badRequest(res, `${label} : l'explication est requise`);
  if (!String(ex.prompt || "").trim()) badRequest(res, `${label} : la question de l'exercice est requise`);
  if (options.length < 2 || options.length > 4 || options.some((o) => !o))
    badRequest(res, `${label} : l'exercice doit avoir entre 2 et 4 reponses non vides`);
  if (!Number.isInteger(ex.answer) || ex.answer < 0 || ex.answer >= options.length)
    badRequest(res, `${label} : la bonne reponse est invalide`);

  const sections = (Array.isArray(c.sections) ? c.sections : [])
    .map((s) => ({
      title: String(s.title || "").trim(),
      text: String(s.text || "").trim(),
      code: String(s.code || "").trim(),
    }))
    .filter((s) => s.title || s.text || s.code)
    .map((s) => ({ title: s.title || "Exemple", text: s.text, ...(s.code && { code: s.code }) }));

  return {
    intro,
    sections,
    practice: String(c.practice || "").trim(),
    exercise: {
      prompt: String(ex.prompt).trim(),
      options,
      answer: ex.answer,
      explanation: String(ex.explanation || "").trim(),
    },
  };
};

const cleanLessons = (res, raw) => {
  if (!Array.isArray(raw) || raw.length === 0) badRequest(res, "Ajoutez au moins une lecon");
  if (raw.length > 12) badRequest(res, "12 lecons maximum par cours");
  return raw.map((l, i) => {
    const label = `Lecon ${i + 1}`;
    const title = String(l.title || "").trim();
    const durationMin = Number(l.durationMin);
    if (!title) badRequest(res, `${label} : le titre est requis`);
    if (!Number.isInteger(durationMin) || durationMin < 1 || durationMin > 240)
      badRequest(res, `${label} : la duree doit etre entre 1 et 240 minutes`);
    return {
      id: l.id ? Number(l.id) : null,
      title,
      durationMin,
      content: cleanContent(res, l.content, label),
    };
  });
};

// Champs communs à la création et à la modification.
const cleanCourseFields = async (res, body, { partial = false } = {}) => {
  const data = {};
  const text = (key, label, min = 1) => {
    if (body[key] === undefined && partial) return;
    const v = String(body[key] ?? "").trim();
    if (v.length < min) badRequest(res, `${label} est requis`);
    data[key] = v;
  };
  text("title", "Le titre", 3);
  text("description", "La description", 10);
  text("instructor", "Le nom de l'instructeur");

  if (body.level !== undefined || !partial) {
    if (!LEVELS.includes(body.level)) badRequest(res, "Niveau invalide");
    data.level = body.level;
  }
  if (body.price !== undefined || !partial) {
    const price = Number(body.price);
    if (!Number.isFinite(price) || price < 0) badRequest(res, "Le prix doit etre un nombre positif ou nul");
    data.price = price;
  }
  if (body.categoryId !== undefined || !partial) {
    const categoryId = Number(body.categoryId);
    const cat = await prisma.category.findUnique({ where: { id: categoryId } });
    if (!cat) badRequest(res, "Categorie introuvable");
    data.categoryId = categoryId;
  }
  if (body.thumbnailColor !== undefined) {
    if (!/^#[0-9a-fA-F]{6}$/.test(body.thumbnailColor)) badRequest(res, "Couleur invalide");
    data.thumbnailColor = body.thumbnailColor;
  }
  if (body.published !== undefined) data.published = Boolean(body.published);
  return data;
};

const hoursFor = (lessons) => Math.max(1, Math.ceil(lessons.reduce((n, l) => n + l.durationMin, 0) / 60));


const getCourses = asyncHandler(async (req, res) => {
  const { search, category, level, sort } = req.query;

  const where = {
    published: true,
    ...(search && {
      OR: [
        { title: { contains: search } },
        { description: { contains: search } },
      ],
    }),
    ...(category && { category: { slug: category } }),
    ...(level && { level }),
  };

  const orderBy =
    sort === "price_asc" ? { price: "asc" } :
    sort === "price_desc" ? { price: "desc" } :
    sort === "rating" ? { rating: "desc" } :
    { createdAt: "desc" };

  const courses = await prisma.course.findMany({
    where,
    orderBy,
    include: {
      category: true,
      _count: { select: { enrollments: true, lessons: true } },
    },
  });

  res.json({ success: true, data: courses });
});

const getCourseBySlug = asyncHandler(async (req, res) => {
  const course = await prisma.course.findUnique({
    where: { slug: req.params.slug },
    include: {
      category: true,
      lessons: { orderBy: { order: "asc" } },
      _count: { select: { enrollments: true } },
    },
  });

  if (!course) {
    res.status(404);
    throw new Error("Cours introuvable");
  }

  res.json({ success: true, data: course });
});

// ---- Administration (propriétaire de la plateforme) ----

const createCourse = asyncHandler(async (req, res) => {
  const data = await cleanCourseFields(res, req.body);
  const lessons = cleanLessons(res, req.body.lessons);

  const course = await prisma.course.create({
    data: {
      ...data,
      slug: await uniqueSlug(data.title),
      durationHours: hoursFor(lessons),
      tracked: true,
      lessons: {
        create: lessons.map((l, i) => ({
          title: l.title,
          durationMin: l.durationMin,
          order: i + 1,
          content: l.content,
        })),
      },
    },
    include: { category: true, lessons: { orderBy: { order: "asc" } } },
  });

  res.status(201).json({ success: true, data: course });
});

const updateCourse = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const existing = await prisma.course.findUnique({ where: { id } });
  if (!existing) {
    res.status(404);
    throw new Error("Cours introuvable");
  }

  const data = await cleanCourseFields(res, req.body, { partial: true });
  const lessons = req.body.lessons !== undefined ? cleanLessons(res, req.body.lessons) : null;

  if (lessons) {
    const current = await prisma.lesson.findMany({ where: { courseId: id }, select: { id: true } });
    const currentIds = current.map((l) => l.id);
    if (lessons.some((l) => l.id && !currentIds.includes(l.id))) badRequest(res, "Lecon inconnue pour ce cours");
    data.durationHours = hoursFor(lessons);
    data.tracked = true;
  } else if (req.body.durationHours !== undefined) {
    const h = Number(req.body.durationHours);
    if (!Number.isInteger(h) || h < 1) badRequest(res, "La duree doit etre un nombre d'heures entier");
    data.durationHours = h;
  }

  await prisma.$transaction(async (tx) => {
    await tx.course.update({ where: { id }, data });

    if (lessons) {
      const keepIds = lessons.filter((l) => l.id).map((l) => l.id);
      await tx.lesson.deleteMany({ where: { courseId: id, id: { notIn: keepIds } } });
      for (let i = 0; i < lessons.length; i++) {
        const l = lessons[i];
        const fields = { title: l.title, durationMin: l.durationMin, order: i + 1, content: l.content };
        if (l.id) await tx.lesson.update({ where: { id: l.id }, data: fields });
        else await tx.lesson.create({ data: { ...fields, courseId: id } });
      }

      // Le nombre de leçons a pu changer : on recalcule la progression des
      // étudiants qui suivent ce cours par leçons.
      const total = lessons.length;
      const enrollments = await tx.enrollment.findMany({
        where: { courseId: id, lessonProgress: { some: {} } },
        include: { _count: { select: { lessonProgress: true } } },
      });
      for (const e of enrollments) {
        const progress = Math.min(100, Math.round((e._count.lessonProgress / total) * 100));
        await tx.enrollment.update({
          where: { id: e.id },
          data: { progress, completedAt: progress === 100 ? e.completedAt || new Date() : null },
        });
      }
    }
  });

  const course = await prisma.course.findUnique({
    where: { id },
    include: { category: true, lessons: { orderBy: { order: "asc" } } },
  });
  res.json({ success: true, data: course });
});

// Modification rapide du prix depuis le tableau de bord admin.
const updateCoursePrice = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const price = Number(req.body.price);

  if (!Number.isFinite(price) || price < 0) badRequest(res, "Le prix doit etre un nombre positif ou nul");

  const exists = await prisma.course.findUnique({ where: { id } });
  if (!exists) {
    res.status(404);
    throw new Error("Cours introuvable");
  }

  const course = await prisma.course.update({
    where: { id },
    data: { price },
    select: { id: true, title: true, price: true },
  });

  res.json({ success: true, data: course });
});

const deleteCourse = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const exists = await prisma.course.findUnique({ where: { id } });
  if (!exists) {
    res.status(404);
    throw new Error("Cours introuvable");
  }
  // les leçons, inscriptions et progressions sont supprimées en cascade
  await prisma.course.delete({ where: { id } });
  res.json({ success: true, message: "Cours supprime" });
});

module.exports = {
  getCourses,
  getCourseBySlug,
  createCourse,
  updateCourse,
  updateCoursePrice,
  deleteCourse,
};
