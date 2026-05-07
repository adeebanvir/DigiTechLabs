import express from "express";
import { createServer as createViteServer } from "vite";
import cors from "cors";
import helmet from "helmet";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Security Headers (configured to allow Vite/Firebase needs)
  app.use(helmet({
    contentSecurityPolicy: false, // Vite hmr and firebase scripts need flexibility
    crossOriginEmbedderPolicy: false,
  }));

  // CORS Configuration
  const allowedOrigins = [
    'http://localhost:3000',
    'https://ais-dev-mapswerotjv2ffpync6rpd-68720108802.asia-southeast1.run.app',
    'https://ais-pre-mapswerotjv2ffpync6rpd-68720108802.asia-southeast1.run.app'
  ];

  app.use(cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      // Allow specific origins or any .vercel.app domain
      const isAllowed = allowedOrigins.includes(origin) || 
                       origin.endsWith('.vercel.app') ||
                       origin.includes('asia-southeast1.run.app');

      if (isAllowed) {
        callback(null, true);
      } else {
        // In this specific preview environment, we'll log then allow for high compatibility
        console.log(`[CORS] Origin attempted: ${origin}`);
        callback(null, true); 
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
  }));

  app.use(express.json());

  // API Route Example (for future backend features)
  app.get("/api/v1/health", (req, res) => {
    res.json({ status: "ok", message: "DigiTechLabs Backend operational." });
  });

  // Vite middleware for development or Static files for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files from the dist directory
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[DigiTechLabs] Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Error starting server:", err);
  process.exit(1);
});
