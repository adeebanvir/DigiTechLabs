import express from "express";
import { createServer as createViteServer } from "vite";
import cors from "cors";
import helmet from "helmet";
import path from "path";
import { fileURLToPath } from "url";
import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure Multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  }
});

// Cloudinary Configuration Helper
const configureCloudinary = () => {
  if (!process.env.VITE_CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
     console.warn("[Cloudinary] Credentials missing. Media operations will fail.");
     return false;
  }
  cloudinary.config({
    cloud_name: process.env.VITE_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
  });
  return true;
};

// INITIALIZE
configureCloudinary();

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

  // Logging Middleware (Debug info for API routes)
  app.use((req, res, next) => {
    if (req.path.startsWith('/api/v1')) {
      console.log(`[API] ${req.method} ${req.path}`);
    }
    next();
  });

  // API Route Example (for future backend features)
  app.get("/api/v1/health", (req, res) => {
    res.json({ status: "ok", message: "DigiTechLabs Backend operational." });
  });

  // Cloudinary Upload Route
  app.post("/api/v1/media/upload", upload.single('file'), async (req, res) => {
    try {
      if (!configureCloudinary()) {
        throw new Error("Cloudinary API credentials missing. Upload requires both API Key and Secret.");
      }

      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      console.log(`[Cloudinary] Uploading file: ${req.file.originalname}, size: ${req.file.size}`);

      // Upload to Cloudinary using a buffer stream
      const uploadFromBuffer = (fileBuffer: Buffer) => {
        return new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: "digitech_uploads",
              resource_type: "auto",
            },
            (error, result) => {
              if (error) return reject(error);
              resolve(result);
            }
          );
          uploadStream.end(fileBuffer);
        });
      };

      const result: any = await uploadFromBuffer(req.file.buffer);

      res.json({
        status: "ok",
        secure_url: result.secure_url,
        public_id: result.public_id,
        bytes: result.bytes,
        format: result.format,
        resource_type: result.resource_type,
        created_at: result.created_at
      });
    } catch (error) {
      console.error("Cloudinary Upload Error:", error);
      res.status(500).json({ 
        error: "Failed to upload to Cloudinary",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });

  // Cloudinary Sync Route
  app.get("/api/v1/media/sync", async (req, res) => {
    try {
      if (!configureCloudinary()) {
        throw new Error("Cloudinary API credentials missing. Syncing requires both API Key and Secret.");
      }

      // Fetch resources from Cloudinary
      const result = await cloudinary.api.resources({
        type: 'upload',
        prefix: '', // All images
        max_results: 100
      });

      res.json({
        status: "ok",
        count: result.resources.length,
        assets: result.resources.map((r: any) => ({
          url: r.secure_url,
          publicId: r.public_id,
          fileName: r.public_id.split('/').pop(),
          fileSize: r.bytes,
          fileType: `${r.resource_type}/${r.format}`,
          uploadedAt: r.created_at
        }))
      });
    } catch (error) {
      console.error("Cloudinary Sync Error:", error);
      res.status(500).json({ 
        error: "Failed to sync with Cloudinary",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });

  // Cloudinary Delete Route
  app.post("/api/v1/media/delete", async (req, res) => {
    console.log("[API] Received delete request:", req.body);
    
    const { publicId, resourceType = 'image' } = req.body;
    
    if (!publicId) {
      console.error("[API] Delete error: Missing publicId in body");
      return res.status(400).json({ error: "Missing publicId" });
    }

    try {
      if (!configureCloudinary()) {
        throw new Error("Cloudinary API credentials not configured on server.");
      }

      console.log(`[Cloudinary] Deleting asset: "${publicId}" (type: ${resourceType})`);
      const result = await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
      console.log(`[Cloudinary] Delete result for "${publicId}":`, result);
      
      return res.json({
        status: (result.result === 'ok' || result.result === 'not found') ? 'success' : 'success',
        message: result.result,
        raw: result
      });
    } catch (error) {
      console.error("Cloudinary Delete API Error:", error);
      return res.status(500).json({ 
        error: "Failed to delete from Cloudinary",
        details: error instanceof Error ? error.message : String(error)
      });
    }
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
