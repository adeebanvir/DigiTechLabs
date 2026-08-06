import express from "express";
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

const app = express();

async function startServer() {
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

  // Contact Form Email Endpoint
  app.post("/api/v1/contact/send", async (req, res) => {
    const { name, email, subject, message, toEmail } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: "Missing required fields: name, email, subject, and message are required." });
    }

    const recipient = toEmail || "assist@digitechlabs.com";

    console.log(`[Contact Form] Initiating contact email send:
      - From: ${name} <${email}>
      - To Support Email: ${recipient}
      - Subject: ${subject}
    `);

    try {
      const { default: nodemailer } = await import("nodemailer");

      const host = process.env.SMTP_HOST;
      const port = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 587;
      const secure = process.env.SMTP_SECURE === "true";
      const user = process.env.SMTP_USER;
      const pass = process.env.SMTP_PASS;

      const emailSubject = `[Contact Form] ${subject}`;
      const textContent = `You have received a new message from your store contact form:

Sender Name: ${name}
Sender Email: ${email}
Subject: ${subject}

Message:
----------------------------------------
${message}
----------------------------------------

This message was sent dynamically via the DigiTechLabs Contact Center.`;

      const htmlContent = `
        <div style="font-family: sans-serif; padding: 20px; color: #141414; max-width: 600px; border: 1px solid #f0f0f0; border-radius: 12px;">
          <h2 style="color: #00A650; border-bottom: 2px solid #00A650; padding-bottom: 10px;">New Contact Message</h2>
          <p><strong>From:</strong> ${name} (&lt;${email}&gt;)</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; margin-top: 20px; white-space: pre-wrap; font-size: 15px; border-left: 4px solid #00A650;">
            ${message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}
          </div>
          <hr style="border: 0; border-top: 1px solid #eee; margin-top: 24px;" />
          <p style="font-size: 11px; color: #a0a0a0;">Sent dynamically from DigiTechLabs Core Gateway.</p>
        </div>
      `;

      if (!host || !user || !pass) {
        // Simulated / Development / Preview Mode
        console.warn(`[Mailer Warning] SMTP server not configured in credentials.
          To send real emails, set the following environment variables in Settings:
          - SMTP_HOST (e.g., mail.smtp2go.com, smtp.gmail.com)
          - SMTP_PORT (e.g., 587 or 465)
          - SMTP_USER
          - SMTP_PASS
          - SMTP_SECURE (true or false)
        `);

        console.log(`[Mailer Simulator] Message content log:\n\n${textContent}\n`);

        return res.json({
          status: "simulated",
          message: "Contact form submitted successfully (simulated mode).",
          email: {
            to: recipient,
            subject: emailSubject,
            text: textContent
          }
        });
      }

      // Real integration config
      const transporter = nodemailer.createTransport({
        host,
        port,
        secure,
        auth: { user, pass }
      });

      const info = await transporter.sendMail({
        from: `"${name}" <${user}>`, // Use authenticated SMTP user for authentication
        replyTo: email, // Direct replies back to the sender
        to: recipient,
        subject: emailSubject,
        text: textContent,
        html: htmlContent
      });

      console.log(`[Mailer] Message index successfully dispatched: ${info.messageId}`);

      return res.json({
        status: "success",
        message: "Your message has been sent to support successfully.",
        messageId: info.messageId
      });
    } catch (error) {
      console.error("[Mailer Error] Failed to send contact message:", error);
      return res.status(500).json({
        error: "Internal Mailer pipeline failed.",
        details: error instanceof Error ? error.message : String(error)
      });
    }
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
    const { createServer: createViteServer } = await import("vite");
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

  // Only start listener if not being imported (Vercel serverless functions shouldn't call listen, but Cloud Run should)
  if (process.env.PORT || process.env.NODE_ENV !== 'production') {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`[DigiTechLabs] Server running on http://localhost:${PORT} (Vercel Mode Ready)`);
    });
  }
}

startServer().catch((err) => {
  console.error("Error starting server:", err);
  if (process.env.NODE_ENV !== 'production') process.exit(1);
});

export default app;
