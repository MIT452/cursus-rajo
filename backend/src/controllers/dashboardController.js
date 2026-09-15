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

module.exports = { getStats };
