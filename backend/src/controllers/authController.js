const bcrypt = require("bcrypt");
const prisma = require("../config/prisma");
const generateToken = require("../utils/generateToken");
const asyncHandler = require("../utils/asyncHandler");

const publicUser = (u) => ({
  id: u.id,
  name: u.name,
  email: u.email,
  role: u.role,
  avatarColor: u.avatarColor,
  createdAt: u.createdAt,
});

const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    res.status(409);
    throw new Error("Un compte existe deja avec cet email");
  }

  const hashed = await bcrypt.hash(password, 10);
  const colors = ["#7C6FF0", "#F2B441", "#2DD4BF", "#EF6B6B"];
  const avatarColor = colors[Math.floor(Math.random() * colors.length)];

  const user = await prisma.user.create({
    data: { name, email, password: hashed, avatarColor },
  });

  const token = generateToken({ id: user.id, role: user.role });
  res.status(201).json({ success: true, token, user: publicUser(user) });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    res.status(401);
    throw new Error("Identifiants invalides");
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    res.status(401);
    throw new Error("Identifiants invalides");
  }

  const token = generateToken({ id: user.id, role: user.role });
  res.json({ success: true, token, user: publicUser(user) });
});

const me = asyncHandler(async (req, res) => {
  res.json({ success: true, user: req.user });
});

module.exports = { register, login, me };
