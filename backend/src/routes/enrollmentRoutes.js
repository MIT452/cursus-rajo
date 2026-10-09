const express = require("express");
const {
  getMyEnrollments,
  enroll,
  updateProgress,
  completeLesson,
  unenroll,
} = require("../controllers/enrollmentController");
const { authMiddleware } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/me", authMiddleware, getMyEnrollments);
router.post("/", authMiddleware, enroll);
router.put("/:id", authMiddleware, updateProgress);
router.post("/:id/lessons/:lessonId/complete", authMiddleware, completeLesson);
router.delete("/:id", authMiddleware, unenroll);

module.exports = router;
