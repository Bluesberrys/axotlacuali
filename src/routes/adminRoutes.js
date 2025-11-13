import express from "express";
import { requireAdmin } from "../middleware/auth.js";

export default function adminRoutes(db) {
  const router = express.Router();

  router.use(requireAdmin);

  // Página principal de gestión
  router.get("/", async (req, res) => {
    const [restaurantes] = await db.execute("SELECT * FROM restaurantes");
    res.render("pages/gestion", {
      title: "Gestión",
      pageCSS: "gestion",
      restaurantes: restaurantes,
    });
  });

  // Agregar restaurante
  router.post("/restaurantes/agregar", async (req, res) => {
    const { nombre, descripcion, horario, tipoComida, rangoPrecio, imagen, urlDireccion } = req.body;
    await db.execute(
      "INSERT INTO restaurantes (nombre, descripcion, horario, tipo_comida, rango_precio, imagen, url_direccion) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [nombre, descripcion, horario, tipoComida, rangoPrecio, imagen, urlDireccion]
    );
    res.redirect("/admin");
  });

  //Rutas para funciones CRUD
  // Eliminar restaurante
  router.post("/restaurantes/:id/eliminar", async (req, res) => {
    await db.execute("DELETE FROM restaurantes WHERE id_restaurantes = ?", [req.params.id]);
    res.redirect("/admin");
  });

  // Menús del restaurante
  router.get("/restaurantes/:id/menus", async (req, res) => {
    const [restauranteRows] = await db.execute("SELECT * FROM restaurantes WHERE id_restaurantes = ?", [
      req.params.id,
    ]);
    const [menuRows] = await db.execute("SELECT * FROM menus WHERE id_restaurantes = ?", [req.params.id]);
    res.render("pages/menus", {
      title: "Menús",
      pageCSS: "gestion",
      restaurante: restauranteRows[0],
      menu: menuRows,
    });
  });

  // Agregar menú
  router.post("/restaurantes/:id/menus/agregar", async (req, res) => {
    const { plato, precio, precioMax } = req.body;
    await db.execute("INSERT INTO menu (id_restaurantes, plato, precio, precioMax) VALUES (?, ?, ?, ?)", [
      req.params.id,
      plato,
      precio,
      precioMax || null,
    ]);
    res.redirect(`/admin/restaurantes/${req.params.id}/menus`);
  });

  // Eliminar menú
  router.post("/menus/:id/eliminar", async (req, res) => {
    await db.execute("DELETE FROM menu WHERE id_menu = ?", [req.params.id]);
    res.redirect("back");
  });

  return router;
}
