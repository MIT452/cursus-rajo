const express = require("express");
const { getStats, getAdminStats } = require("../controllers/dashboardController");
const { authMiddleware, adminOnly, studentOnly } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/stats", authMiddleware, studentOnly, getStats);
router.get("/admin", authMiddleware, adminOnly, getAdminStats);

module.exports = router;
