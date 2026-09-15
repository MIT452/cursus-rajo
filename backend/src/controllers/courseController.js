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

const createCourse = asyncHandler(async (req, res) => {
  const { title, description, instructor, level, durationHours, price, categoryId, thumbnailColor } = req.body;

  const slug = title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  const course = await prisma.course.create({
    data: {
      title,
      slug,
      description,
      instructor,
      level: level || "DEBUTANT",
      durationHours: Number(durationHours) || 1,
      price: Number(price) || 0,
      thumbnailColor: thumbnailColor || "#7C6FF0",
      categoryId: Number(categoryId),
    },
  });

  res.status(201).json({ success: true, data: course });
});

const updateCourse = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const { title, description, instructor, level, durationHours, price, categoryId, published } = req.body;

  const course = await prisma.course.update({
    where: { id },
    data: {
      ...(title && { title }),
      ...(description && { description }),
      ...(instructor && { instructor }),
      ...(level && { level }),
      ...(durationHours && { durationHours: Number(durationHours) }),
      ...(price !== undefined && { price: Number(price) }),
      ...(categoryId && { categoryId: Number(categoryId) }),
      ...(published !== undefined && { published }),
    },
  });

  res.json({ success: true, data: course });
});

const deleteCourse = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  await prisma.course.delete({ where: { id } });
  res.json({ success: true, message: "Cours supprime" });
});

module.exports = { getCourses, getCourseBySlug, createCourse, updateCourse, deleteCourse };
