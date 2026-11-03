const express = require("express");
const {
  getMyEnrollments,
  enroll,
  updateProgress,
  completeLesson,
  unenroll,
} = require("../controllers/enrollmentController");
const { authMiddleware, studentOnly } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/me", authMiddleware, getMyEnrollments);
router.post("/", authMiddleware, studentOnly, enroll);
router.put("/:id", authMiddleware, studentOnly, updateProgress);
router.post("/:id/lessons/:lessonId/complete", authMiddleware, studentOnly, completeLesson);
router.delete("/:id", authMiddleware, unenroll);

module.exports = router;
