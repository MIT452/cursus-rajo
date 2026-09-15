const express = require("express");
const { register, login, me } = require("../controllers/authController");
const { authMiddleware } = require("../middlewares/authMiddleware");
const validate = require("../middlewares/validate");

const router = express.Router();

router.post(
  "/register",
  validate({
    name: { required: true, minLength: 2 },
    email: { required: true, type: "email" },
    password: { required: true, minLength: 6 },
  }),
  register
);

router.post(
  "/login",
  validate({
    email: { required: true, type: "email" },
    password: { required: true },
  }),
  login
);

router.get("/me", authMiddleware, me);

module.exports = router;
