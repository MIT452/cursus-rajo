const prisma = require("../config/prisma");
const asyncHandler = require("../utils/asyncHandler");

const getCategories = asyncHandler(async (req, res) => {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { courses: true } } },
    orderBy: { name: "asc" },
  });
  res.json({ success: true, data: categories });
});

module.exports = { getCategories };
