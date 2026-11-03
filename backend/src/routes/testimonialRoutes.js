const express = require("express");
const {
  getTestimonials,
  getMyTestimonial,
  saveMyTestimonial,
  deleteMyTestimonial,
} = require("../controllers/testimonialController");
const { authMiddleware, studentOnly } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", getTestimonials);
router.get("/me", authMiddleware, studentOnly, getMyTestimonial);
router.put("/me", authMiddleware, studentOnly, saveMyTestimonial);
router.delete("/me", authMiddleware, studentOnly, deleteMyTestimonial);

module.exports = router;
