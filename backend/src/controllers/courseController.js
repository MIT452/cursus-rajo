const prisma = require("../config/prisma");
const asyncHandler = require("../utils/asyncHandler");

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

// L'administrateur ne peut modifier que le prix d'un cours.
const updateCoursePrice = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const price = Number(req.body.price);

  if (!Number.isFinite(price) || price < 0) {
    res.status(400);
    throw new Error("Le prix doit etre un nombre positif ou nul");
  }

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

module.exports = { getCourses, getCourseBySlug, updateCoursePrice };
