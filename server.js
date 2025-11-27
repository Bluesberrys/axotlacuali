import express from "express";
import expressLayouts from "express-ejs-layouts";
import path from "path";
import { readJSON } from "./src/utils/fileRead.js";
import { fileURLToPath } from "url";
import mysql from "mysql2/promise";
import session from "express-session";
import bcrypt from "bcrypt";
import rateLimit from "express-rate-limit";

const app = express();
const PORT = process.env.PORT || 5900;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// middlewares
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(expressLayouts);
app.set("layout", "layouts/main");
app.use(express.static(path.join(__dirname, "public")));
app.use("/fontawesome", express.static(path.join(__dirname, "node_modules/@fortawesome/fontawesome-free")));

// middlewares adicionales de seguridad y parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "a secret key",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.SESSION_SECURE === "production" },
  })
);

let db;
try {
  db = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "root",
    database: process.env.DB_NAME || "axotlacuali",
  });
  console.log("Conectado a la base de datos MySQL");
} catch (err) {
  console.error("Error al conectar a MySQL:", err);
  process.exit(1);
}

// limitador de intentos de inicio de sesión
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10,
  message: { error: "Demasiados intentos, intenta más tarde." },
});

// Middleware para exponer la sesión a todas las vistas
app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

// Middleware para verificar si el usuario es administrador
function checkAdmin(req, res, next) {
  if (!req.session.userId) {
    return res.redirect("/login");
  }
  if (req.session.rol !== "admin") {
    return res.status(403).send("Acceso denegado: No tienes permisos de administrador.");
  }
  next();
}

// rutas existentes
app.get("/", (req, res) => {
  res.render("pages/index", {
    title: "Inicio",
    pageCSS: "index",
  });
});

app.get("/mapa", async (req, res) => {
  const edificios = await readJSON("edificios.json");
  res.render("pages/mapa", {
    title: "Mapa",
    pageCSS: "mapa",
    edificios,
  });
});

app.get("/comida", async (req, res) => {
  try {
    const [restaurantes] = await db.execute("SELECT * FROM restaurantes");
    const [menus] = await db.execute("SELECT * FROM menus");
    res.render("pages/comida", {
      title: "Comida",
      pageCSS: "comida",
      restaurantes: restaurantes,
      menus: menus,
    });
  } catch (error) {
    console.error("Error al obtener datos de la base de datos:", error);
    res.status(500).send("Error al obtener los datos de la base de datos");
  }
});

// Rutas de autenticación
app.get("/login", (req, res) => {
  res.render("pages/login", { title: "Iniciar Sesión", pageCSS: "login" });
});

app.post("/login", loginLimiter, async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).send("Usuario y contraseña son requeridos");
  }
  try {
    const [rows] = await db.execute("SELECT * FROM usuarios WHERE username = ?", [username]);
    const user = rows[0];
    if (!user) {
      return res.status(401).send("Credenciales inválidas");
    }
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).send("Credenciales inválidas");
    }
    req.session.userId = user.id_usuario;
    req.session.username = user.username;
    req.session.rol = user.rol;
    res.redirect("/");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error en el servidor");
  }
});

app.get("/register", (req, res) => {
  res.render("pages/register", { title: "Registro", pageCSS: "login" });
});

app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).send("Todos los campos son requeridos");
  }
  try {
    const [rows] = await db.execute("SELECT * FROM usuarios WHERE username = ? OR email = ?", [
      username,
      email,
    ]);
    if (rows.length > 0) {
      return res.status(409).send("El usuario o email ya existe");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.execute("INSERT INTO usuarios (username, email, password_hash) VALUES (?, ?, ?)", [
      username,
      email,
      hashedPassword,
    ]);
    res.redirect("/login");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al registrar el usuario");
  }
});

app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.redirect("/");
    }
    res.clearCookie("connect.sid");
    res.redirect("/login");
  });
});

// Pagina principal de gestión
// Ruta para el panel de gestion
app.use(express.urlencoded({ extended: true }));

// Página principal de gestión
app.get("/admin", checkAdmin, async (req, res) => {
  const [restaurantes] = await db.execute("SELECT * FROM restaurantes");
  res.render("pages/gestion", {
    title: "Gestión",
    pageCSS: "admin",
    restaurantes,
  });
});

app.post("/admin/restaurantes/agregar", checkAdmin, async (req, res) => {
  const { nombre, descripcion, horario, tipoComida, rangoPrecio, imagen, urlDireccion } = req.body;
  await db.execute(
    "INSERT INTO restaurantes (nombre, descripcion, horario, tipo_comida, rango_precio, imagen, url_direccion) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [nombre, descripcion, horario, tipoComida, rangoPrecio, imagen, urlDireccion]
  );
  res.redirect("/admin");
});

app.post("/admin/restaurantes/:id/editar", checkAdmin, async (req, res) => {
  const { nombre, descripcion, horario, tipoComida, rangoPrecio, imagen, urlDireccion } = req.body;

  await db.execute(
    `UPDATE restaurantes 
     SET nombre = ?, descripcion = ?, horario = ?, tipo_comida = ?, rango_precio = ?, imagen = ?, url_direccion = ?
     WHERE id_restaurantes = ?`,
    [nombre, descripcion, horario, tipoComida, rangoPrecio, imagen, urlDireccion, req.params.id]
  );

  res.redirect("/admin");
});

app.post("/admin/restaurantes/:id/eliminar", checkAdmin, async (req, res) => {
  await db.execute("DELETE FROM restaurantes WHERE id_restaurantes = ?", [req.params.id]);
  res.redirect("/admin");
});

app.get("/admin/restaurantes/:id/menus", checkAdmin, async (req, res) => {
  const [restauranteRows] = await db.execute("SELECT * FROM restaurantes WHERE id_restaurantes = ?", [
    req.params.id,
  ]);
  const [menuRows] = await db.execute("SELECT * FROM menus WHERE id_restaurantes = ?", [req.params.id]);
  res.render("pages/menus", {
    title: "Menus",
    pageCSS: "admin",
    restaurante: restauranteRows[0],
    menu: menuRows,
  });
});

app.post("/admin/restaurantes/:id/menus/agregar", checkAdmin, async (req, res) => {
  const { plato, precio, precioMax } = req.body;
  await db.execute("INSERT INTO menus (id_restaurantes, plato, precio, precio_max) VALUES (?, ?, ?, ?)", [
    req.params.id,
    plato,
    precio,
    precioMax || null,
  ]);
  res.redirect(`/admin/restaurantes/${req.params.id}/menus`);
});

app.post("/admin/menus/:id/editar", checkAdmin, async (req, res) => {
  const { id_restaurante, plato, precio, precioMax } = req.body;

  await db.execute(
    `UPDATE menus 
     SET plato = ?, precio = ?, precio_max = ?
     WHERE id_menu = ?`,
    [plato, precio, precioMax, req.params.id]
  );

  res.redirect(`/admin/restaurantes/${id_restaurante}/menus`);
});

app.post("/admin/menus/:id/eliminar", checkAdmin, async (req, res) => {
  await db.execute("DELETE FROM menus WHERE id_menu = ?", [req.params.id]);
  res.redirect(`/admin/restaurantes/${req.body.id_restaurante}/menus`);
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
