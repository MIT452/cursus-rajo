const prisma = require("../config/prisma");
const asyncHandler = require("../utils/asyncHandler");

const getMyEnrollments = asyncHandler(async (req, res) => {
  const enrollments = await prisma.enrollment.findMany({
    where: { userId: req.user.id },
    include: {
      course: {
        include: { category: true, _count: { select: { lessons: true } } },
      },
      lessonProgress: { select: { lessonId: true } },
    },
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

// Valide une leçon et recalcule la progression : leçons terminées / total leçons.
// Ex. 5 leçons => +20% par leçon, 4 leçons => +25%, etc.
const completeLesson = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const lessonId = Number(req.params.lessonId);

  const enrollment = await prisma.enrollment.findUnique({ where: { id } });
  if (!enrollment || enrollment.userId !== req.user.id) {
    res.status(403);
    throw new Error("Acces refuse");
  }

  const lesson = await prisma.lesson.findUnique({ where: { id: lessonId } });
  if (!lesson || lesson.courseId !== enrollment.courseId) {
    res.status(404);
    throw new Error("Lecon introuvable pour ce cours");
  }

  // upsert : valider deux fois la meme leçon ne compte qu'une fois
  await prisma.lessonProgress.upsert({
    where: { enrollmentId_lessonId: { enrollmentId: id, lessonId } },
    update: {},
    create: { enrollmentId: id, lessonId },
  });

  const [totalLessons, completed] = await Promise.all([
    prisma.lesson.count({ where: { courseId: enrollment.courseId } }),
    prisma.lessonProgress.findMany({
      where: { enrollmentId: id },
      select: { lessonId: true },
    }),
  ]);

  const progress = Math.min(100, Math.round((completed.length / totalLessons) * 100));

  const updated = await prisma.enrollment.update({
    where: { id },
    data: { progress, completedAt: progress === 100 ? new Date() : null },
  });

  res.json({
    success: true,
    data: {
      ...updated,
      completedLessonIds: completed.map((c) => c.lessonId),
      totalLessons,
    },
  });
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

module.exports = { getMyEnrollments, enroll, updateProgress, completeLesson, unenroll };
