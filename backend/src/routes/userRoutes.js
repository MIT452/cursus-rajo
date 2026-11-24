const express = require("express");
const { getUsers, getUserById, updateUser, setSuspension } = require("../controllers/userController");
const { authMiddleware, adminOnly } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", authMiddleware, adminOnly, getUsers);
router.get("/:id", authMiddleware, getUserById);
router.put("/:id/suspend", authMiddleware, adminOnly, setSuspension);
router.put("/:id", authMiddleware, updateUser);

module.exports = router;
