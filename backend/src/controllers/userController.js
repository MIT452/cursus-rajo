const prisma = require("../config/prisma");
const asyncHandler = require("../utils/asyncHandler");

const getUsers = asyncHandler(async (req, res) => {
  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true, avatarColor: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });
  res.json({ success: true, data: users });
});

const getUserById = asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: Number(req.params.id) },
    select: { id: true, name: true, email: true, role: true, avatarColor: true, createdAt: true },
  });
  if (!user) {
    res.status(404);
    throw new Error("Utilisateur introuvable");
  }
  res.json({ success: true, data: user });
});

const updateUser = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  if (req.user.id !== id && req.user.role !== "ADMIN") {
    res.status(403);
    throw new Error("Vous ne pouvez modifier que votre propre profil");
  }
  const { name } = req.body;
  const user = await prisma.user.update({
    where: { id },
    data: { name },
    select: { id: true, name: true, email: true, role: true, avatarColor: true, createdAt: true },
  });
  res.json({ success: true, data: user });
});

module.exports = { getUsers, getUserById, updateUser };
