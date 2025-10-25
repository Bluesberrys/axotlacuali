import express from "express";
import expressLayouts from "express-ejs-layouts";
import path from "path";
import { readJSON } from "./src/utils/fileRead.js";
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// middlewares
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(expressLayouts);
app.set("layout", "layouts/main");
app.use(express.static(path.join(__dirname, "public")));

// routes
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
  const lugaresComida = await readJSON("lugares_comida.json");
  res.render("pages/comida", {
    title: "Comida",
    pageCSS: "comida",
    lugaresComida,
  });
});

// start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
