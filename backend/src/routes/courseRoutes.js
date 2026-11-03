const express = require("express");
const {
  getCourses,
  getCourseBySlug,
  createCourse,
  updateCourse,
  updateCoursePrice,
  deleteCourse,
} = require("../controllers/courseController");
const { authMiddleware, adminOnly } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", getCourses);
router.get("/:slug", getCourseBySlug);

// l'administrateur (propriétaire) gère entièrement le catalogue
router.post("/", authMiddleware, adminOnly, createCourse);
router.put("/:id", authMiddleware, adminOnly, updateCourse);
router.put("/:id/price", authMiddleware, adminOnly, updateCoursePrice);
router.delete("/:id", authMiddleware, adminOnly, deleteCourse);

module.exports = router;
