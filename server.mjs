import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import OpenAI from "openai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

loadEnv(path.join(__dirname, ".env"));

const PORT = Number(process.env.PORT || 8787);
const MODEL = process.env.OPENAI_MODEL || "gpt-5.4";
const API_KEY = process.env.OPENAI_API_KEY || "";
const client = API_KEY ? new OpenAI({ apiKey: API_KEY }) : null;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".ico": "image/x-icon",
};

const server = http.createServer(async (req, res) => {
  try {
    setCors(res);

    if (req.method === "OPTIONS") {
      res.writeHead(204);
      res.end();
      return;
    }

    const url = new URL(req.url || "/", `http://${req.headers.host || "127.0.0.1"}`);

    if (req.method === "GET" && url.pathname === "/health") {
      sendJson(res, 200, {
        ok: true,
        configured: Boolean(API_KEY),
        model: MODEL,
        mode: API_KEY ? "ready" : "missing_key",
      });
      return;
    }

    if (req.method === "POST" && url.pathname === "/api/prompt") {
      if (!client) {
        sendJson(res, 400, {
          ok: false,
          error: "OPENAI_API_KEY no configurada en .env o en el entorno.",
        });
        return;
      }

      const body = await readJson(req);
      const payload = normalizePromptPayload(body);

      const response = await client.responses.create({
        model: MODEL,
        input: [
          {
            role: "system",
            content: [
              {
                type: "input_text",
                text:
                  "Eres un especialista en prompt design para fotografia realista de interiorismo y lifestyle de producto. Devuelve solo el prompt final, sin encabezados ni explicaciones. Conserva todas las reglas visuales obligatorias, el protagonismo del producto, la frontalidad, el realismo fotografico y el balance de blancos neutro. Mejora la fluidez y evita repeticiones, pero no cambies la intencion de la configuracion.",
              },
            ],
          },
          {
            role: "user",
            content: [
              {
                type: "input_text",
                text: buildPromptInstruction(payload),
              },
            ],
          },
        ],
      });

      sendJson(res, 200, {
        ok: true,
        model: MODEL,
        prompt: (response.output_text || "").trim(),
      });
      return;
    }

    if (req.method === "GET") {
      serveStatic(url.pathname, res);
      return;
    }

    sendJson(res, 404, { ok: false, error: "Ruta no encontrada." });
  } catch (error) {
    sendJson(res, 500, {
      ok: false,
      error: error instanceof Error ? error.message : "Error interno del servidor.",
    });
  }
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`PromptStudio local listo en http://127.0.0.1:${PORT}`);
  if (!API_KEY) {
    console.log("Modo IA desactivado: falta OPENAI_API_KEY.");
  }
});

function loadEnv(filePath) {
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, "utf8");
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    const value = trimmed.slice(idx + 1).trim().replace(/^['"]|['"]$/g, "");
    if (!(key in process.env)) process.env[key] = value;
  }
}

function setCors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
}

function sendJson(res, status, body) {
  res.writeHead(status, { "Content-Type": MIME[".json"] });
  res.end(JSON.stringify(body));
}

async function readJson(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }
  const text = Buffer.concat(chunks).toString("utf8");
  return text ? JSON.parse(text) : {};
}

function normalizePromptPayload(body) {
  return {
    lang: body?.lang === "en" ? "en" : "es",
    basePrompt: String(body?.basePrompt || ""),
    shortPrompt: String(body?.shortPrompt || ""),
    negativePrompt: String(body?.negativePrompt || ""),
    configSummary: body?.configSummary || {},
  };
}

function buildPromptInstruction(payload) {
  const language = payload.lang === "en" ? "ingles" : "espanol";
  return [
    `Escribe el prompt final en ${language}.`,
    "Mantiene la estructura visual, la escala del producto y las reglas fijas del sistema.",
    "No incluyas listas ni explicaciones; responde solo con el prompt.",
    "",
    "Resumen de configuracion:",
    JSON.stringify(payload.configSummary, null, 2),
    "",
    "Prompt base local:",
    payload.basePrompt,
    "",
    "Prompt corto de apoyo:",
    payload.shortPrompt,
    "",
    "Negative prompt de referencia:",
    payload.negativePrompt,
  ].join("\n");
}

function serveStatic(requestPath, res) {
  const normalized = requestPath === "/" ? "/index.html" : requestPath;
  const safePath = path.normalize(normalized).replace(/^(\.\.[/\\])+/, "");
  const absolutePath = path.join(__dirname, safePath);

  if (!absolutePath.startsWith(__dirname)) {
    sendJson(res, 403, { ok: false, error: "Acceso denegado." });
    return;
  }

  if (!fs.existsSync(absolutePath) || fs.statSync(absolutePath).isDirectory()) {
    sendJson(res, 404, { ok: false, error: "Archivo no encontrado." });
    return;
  }

  const ext = path.extname(absolutePath).toLowerCase();
  const type = MIME[ext] || "application/octet-stream";
  res.writeHead(200, { "Content-Type": type });
  fs.createReadStream(absolutePath).pipe(res);
}
