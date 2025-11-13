import express from "express";
import expressLayouts from "express-ejs-layouts";
import path from "path";
import { fileURLToPath } from "url";
import mysql from "mysql2/promise";
import session from "express-session";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
// Importar locales
import adminRoutes from "./src/routes/adminRoutes.js";
import { readJSON } from "./src/utils/fileRead.js";

dotenv.config();

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
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "a secret key",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === "production" },
  })
);

let db;
try {
  db = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "axotlacuali",
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

// Middleware to make session available to all views
app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

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
    console.log(restaurantes);
    console.log(menus);
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
  res.render("pages/login", { title: "Iniciar Sesión", pageCSS: "style" });
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
    req.session.role = user.rol;
    console.log(`[LOGIN] Successful login for user: ${user.username} (role: ${user.rol})`);
    res.redirect("/");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error en el servidor");
  }
});

app.get("/register", (req, res) => {
  res.render("pages/register", { title: "Registro", pageCSS: "style" });
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
    console.log(`[REGISTER] New user registered: ${username}`);
    res.redirect("/login");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al registrar el usuario");
  }
});

app.get("/logout", (req, res) => {
  if (req.session.username) {
    console.log(`[LOGOUT] User ${req.session.username} (role: ${req.session.role}) logged out`);
  } else {
    console.log("[LOGOUT] Session ended — no active user found");
  }
  req.session.destroy((err) => {
    if (err) {
      console.error("[LOGOUT] Error destroying session:", err);
      return res.redirect("/");
    }
    res.clearCookie("connect.sid");
    res.redirect("/login");
  });
});

// Pagina principal de gestión
// Ruta para el panel de gestion
app.use(express.urlencoded({ extended: true }));
app.use("/admin", adminRoutes(db));

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
