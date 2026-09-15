const jwt = require("jsonwebtoken");
const prisma = require("../config/prisma");

const authMiddleware = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
      res.status(401);
      throw new Error("Non autorise, token manquant");
    }

    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, name: true, email: true, role: true, avatarColor: true, createdAt: true },
    });

    if (!user) {
      res.status(401);
      throw new Error("Utilisateur introuvable");
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401);
    next(new Error("Non autorise, token invalide"));
  }
};

const adminOnly = (req, res, next) => {
  if (req.user?.role !== "ADMIN") {
    res.status(403);
    return next(new Error("Acces reserve aux administrateurs"));
  }
  next();
};

module.exports = { authMiddleware, adminOnly };
