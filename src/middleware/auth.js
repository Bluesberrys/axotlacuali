export function requireAdmin(req, res, next) {
  if (!req.session.userId) {
    return res.redirect("/login");
  }

  if (req.session.role !== "admin") {
    return res.status(403).send("Acceso denegado: No tienes permisos de administrador.");
  }

  next();
}
