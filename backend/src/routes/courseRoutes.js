const express = require("express");
const {
  getCourses,
  getCourseBySlug,
  updateCoursePrice,
} = require("../controllers/courseController");
const { authMiddleware, adminOnly } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", getCourses);
router.get("/:slug", getCourseBySlug);
// seule action d'écriture possible pour l'admin : fixer le prix
router.put("/:id/price", authMiddleware, adminOnly, updateCoursePrice);

module.exports = router;
