const prisma = require("../config/prisma");
const asyncHandler = require("../utils/asyncHandler");

const publicSelect = {
  id: true,
  content: true,
  rating: true,
  role: true,
  createdAt: true,
  user: { select: { name: true, avatarColor: true } },
};

// Liste publique (page d'accueil) : les plus récents.
const getTestimonials = asyncHandler(async (req, res) => {
  const data = await prisma.testimonial.findMany({
    orderBy: { createdAt: "desc" },
    take: 6,
    select: publicSelect,
  });
  res.json({ success: true, data });
});

const getMyTestimonial = asyncHandler(async (req, res) => {
  const data = await prisma.testimonial.findUnique({
    where: { userId: req.user.id },
    select: publicSelect,
  });
  res.json({ success: true, data });
});

// Un étudiant a un seul témoignage : l'envoyer à nouveau le met à jour.
const saveMyTestimonial = asyncHandler(async (req, res) => {
  const content = String(req.body.content || "").trim();
  const rating = Number(req.body.rating);
  const role = String(req.body.role || "").trim();

  if (content.length < 20 || content.length > 500) {
    res.status(400);
    throw new Error("Le temoignage doit contenir entre 20 et 500 caracteres");
  }
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    res.status(400);
    throw new Error("La note doit etre comprise entre 1 et 5");
  }
  if (role.length > 80) {
    res.status(400);
    throw new Error("Le titre ou la profession est limite a 80 caracteres");
  }

  const data = await prisma.testimonial.upsert({
    where: { userId: req.user.id },
    update: { content, rating, role: role || null },
    create: { userId: req.user.id, content, rating, role: role || null },
    select: publicSelect,
  });
  res.json({ success: true, data });
});

const deleteMyTestimonial = asyncHandler(async (req, res) => {
  await prisma.testimonial.deleteMany({ where: { userId: req.user.id } });
  res.json({ success: true, message: "Temoignage supprime" });
});

module.exports = { getTestimonials, getMyTestimonial, saveMyTestimonial, deleteMyTestimonial };
