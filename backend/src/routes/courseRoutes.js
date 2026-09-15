const express = require("express");
const {
  getCourses,
  getCourseBySlug,
  createCourse,
  updateCourse,
  deleteCourse,
} = require("../controllers/courseController");
const { authMiddleware, adminOnly } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", getCourses);
router.get("/:slug", getCourseBySlug);
router.post("/", authMiddleware, adminOnly, createCourse);
router.put("/:id", authMiddleware, adminOnly, updateCourse);
router.delete("/:id", authMiddleware, adminOnly, deleteCourse);

module.exports = router;
