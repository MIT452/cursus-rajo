const prisma = require("../config/prisma");
const asyncHandler = require("../utils/asyncHandler");

const getStats = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const [enrollments, totalCourses, totalHoursAgg] = await Promise.all([
    prisma.enrollment.findMany({ where: { userId }, include: { course: true } }),
    prisma.course.count({ where: { published: true } }),
    prisma.enrollment.findMany({ where: { userId }, include: { course: true } }),
  ]);

  const coursesInProgress = enrollments.filter((e) => e.progress > 0 && e.progress < 100).length;
  const coursesCompleted = enrollments.filter((e) => e.progress === 100).length;
  const hoursLearned = totalHoursAgg.reduce(
    (sum, e) => sum + (e.course.durationHours * e.progress) / 100,
    0
  );

  const monthly = Array.from({ length: 6 }).map((_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (5 - i));
    const label = date.toLocaleDateString("fr-FR", { month: "short" });
    const count = enrollments.filter((e) => {
      const d = new Date(e.enrolledAt);
      return d.getMonth() === date.getMonth() && d.getFullYear() === date.getFullYear();
    }).length;
    return { label, value: count };
  });

  res.json({
    success: true,
    data: {
      enrolledCount: enrollments.length,
      coursesInProgress,
      coursesCompleted,
      hoursLearned: Math.round(hoursLearned * 10) / 10,
      totalCoursesAvailable: totalCourses,
      monthly,
      recentEnrollments: enrollments
        .sort((a, b) => new Date(b.enrolledAt) - new Date(a.enrolledAt))
        .slice(0, 5),
    },
  });
});

// Tableau de bord administrateur : comptes, inscrits par cours, revenus simulés.
// Revenu simulé = prix actuel du cours x nombre d'inscrits (aucun paiement réel).
const getAdminStats = asyncHandler(async (req, res) => {
  const [accounts, courses, enrollments] = await Promise.all([
    prisma.user.count({ where: { role: "USER" } }),
    prisma.course.findMany({
      orderBy: { title: "asc" },
      select: {
        id: true,
        title: true,
        slug: true,
        instructor: true,
        price: true,
        thumbnailColor: true,
        category: { select: { name: true } },
        _count: { select: { enrollments: true } },
      },
    }),
    prisma.enrollment.findMany({
      select: { enrolledAt: true, course: { select: { price: true } } },
    }),
  ]);

  const courseRows = courses.map((c) => ({
    id: c.id,
    title: c.title,
    slug: c.slug,
    instructor: c.instructor,
    category: c.category?.name,
    price: c.price,
    enrollments: c._count.enrollments,
    revenue: c.price * c._count.enrollments,
  }));

  const totalRevenue = courseRows.reduce((sum, c) => sum + c.revenue, 0);
  const totalEnrollments = courseRows.reduce((sum, c) => sum + c.enrollments, 0);

  const monthlyRevenue = Array.from({ length: 6 }).map((_, i) => {
    const date = new Date();
    date.setDate(1);
    date.setMonth(date.getMonth() - (5 - i));
    const label = date.toLocaleDateString("fr-FR", { month: "short" });
    const value = enrollments
      .filter((e) => {
        const d = new Date(e.enrolledAt);
        return d.getMonth() === date.getMonth() && d.getFullYear() === date.getFullYear();
      })
      .reduce((sum, e) => sum + e.course.price, 0);
    return { label, value };
  });

  res.json({
    success: true,
    data: { accounts, totalEnrollments, totalRevenue, monthlyRevenue, courses: courseRows },
  });
});

module.exports = { getStats, getAdminStats };
