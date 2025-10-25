import { readFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const cache = new Map();

/**
 * Reads and parses a JSON file from the src/data directory.
 * @param {string} filename - The name of the JSON file (e.g., 'users.json')
 * @returns {Promise<Object>} Parsed JSON data
 */

export async function readJSON(filename) {
  if (cache.has(filename)) return cache.get(filename);

  try {
    const filePath = path.join(__dirname, "..", "data", filename);
    const data = await readFile(filePath, "utf-8");
    const parsed = JSON.parse(data);
    cache.set(filename, parsed);
    return parsed;
  } catch (error) {
    console.error(`Error reading JSON file ${filename}:`, error.message);
    return null;
  }
}
