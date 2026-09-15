const express = require("express");
const {
  getMyEnrollments,
  enroll,
  updateProgress,
  unenroll,
} = require("../controllers/enrollmentController");
const { authMiddleware } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/me", authMiddleware, getMyEnrollments);
router.post("/", authMiddleware, enroll);
router.put("/:id", authMiddleware, updateProgress);
router.delete("/:id", authMiddleware, unenroll);

module.exports = router;
