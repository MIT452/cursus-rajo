const express = require("express");
const authRoutes = require("./authRoutes");
const userRoutes = require("./userRoutes");
const courseRoutes = require("./courseRoutes");
const categoryRoutes = require("./categoryRoutes");
const enrollmentRoutes = require("./enrollmentRoutes");
const dashboardRoutes = require("./dashboardRoutes");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/courses", courseRoutes);
router.use("/categories", categoryRoutes);
router.use("/enrollments", enrollmentRoutes);
router.use("/dashboard", dashboardRoutes);

module.exports = router;
