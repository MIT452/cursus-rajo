const prisma = require("../config/prisma");
const asyncHandler = require("../utils/asyncHandler");

const getMyEnrollments = asyncHandler(async (req, res) => {
  const enrollments = await prisma.enrollment.findMany({
    where: { userId: req.user.id },
    include: { course: { include: { category: true } } },
    orderBy: { enrolledAt: "desc" },
  });
  res.json({ success: true, data: enrollments });
});

const enroll = asyncHandler(async (req, res) => {
  const courseId = Number(req.body.courseId);

  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course) {
    res.status(404);
    throw new Error("Cours introuvable");
  }

  const existing = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId: req.user.id, courseId } },
  });
  if (existing) {
    res.status(409);
    throw new Error("Vous etes deja inscrit a ce cours");
  }

  const enrollment = await prisma.enrollment.create({
    data: { userId: req.user.id, courseId },
    include: { course: true },
  });

  res.status(201).json({ success: true, data: enrollment });
});

const updateProgress = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const { progress } = req.body;

  const enrollment = await prisma.enrollment.findUnique({ where: { id } });
  if (!enrollment || enrollment.userId !== req.user.id) {
    res.status(403);
    throw new Error("Acces refuse");
  }

  const clamped = Math.max(0, Math.min(100, Number(progress)));

  const updated = await prisma.enrollment.update({
    where: { id },
    data: {
      progress: clamped,
      completedAt: clamped === 100 ? new Date() : null,
    },
  });

  res.json({ success: true, data: updated });
});

const unenroll = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const enrollment = await prisma.enrollment.findUnique({ where: { id } });
  if (!enrollment || enrollment.userId !== req.user.id) {
    res.status(403);
    throw new Error("Acces refuse");
  }
  await prisma.enrollment.delete({ where: { id } });
  res.json({ success: true, message: "Desinscription effectuee" });
});

module.exports = { getMyEnrollments, enroll, updateProgress, unenroll };
