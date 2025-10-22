import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// middlewares
app.use(express.static(path.join(__dirname, "public")));

// routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/mapa", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "pages", "mapa.html"));
});

// start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
