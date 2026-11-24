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
      select: { id: true, name: true, email: true, role: true, avatarColor: true, createdAt: true, suspended: true },
    });

    if (!user) {
      res.status(401);
      throw new Error("Utilisateur introuvable");
    }

    if (user.suspended) {
      res.status(403);
      throw new Error("Compte suspendu. Contactez l'administrateur.");
    }

    req.user = user;
    next();
  } catch (error) {
    // Un compte suspendu garde son code 403 et son message ; le reste reste une erreur 401.
    if (res.statusCode === 403) return next(error);
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

// Les administrateurs gèrent la plateforme : ils ne suivent pas de cours.
const studentOnly = (req, res, next) => {
  if (req.user?.role === "ADMIN") {
    res.status(403);
    return next(new Error("Les administrateurs ne peuvent pas suivre de cours"));
  }
  next();
};

module.exports = { authMiddleware, adminOnly, studentOnly };
