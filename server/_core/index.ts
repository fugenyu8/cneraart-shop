import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";
import { uploadRouter } from "../upload";
import { uploadFortuneImageHandler, handleFortuneImageUpload } from "../uploadFortuneImage";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  const server = createServer(app);
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  // OAuth callback under /api/oauth/callback
  registerOAuthRoutes(app);
  // File upload API
  app.use("/api", uploadRouter);
  // Fortune service image upload
  app.post("/api/upload-fortune-image", uploadFortuneImageHandler, handleFortuneImageUpload);
  // CDN & Cache headers for static assets
  app.use((req, res, next) => {
    const url = req.url;
    // Images and fonts: cache 1 year (immutable)
    if (/\.(jpg|jpeg|png|gif|webp|svg|ico|woff2?|ttf|eot)$/i.test(url)) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      res.setHeader('Vary', 'Accept-Encoding');
    }
    // JS/CSS with hash: cache 1 year
    else if (/\.[a-f0-9]{8}\.(js|css)$/i.test(url)) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    }
    // Other static assets: cache 1 day
    else if (/\.(js|css|json)$/i.test(url)) {
      res.setHeader('Cache-Control', 'public, max-age=86400');
    }
    // Enable CORS for CDN assets
    if (/\.(jpg|jpeg|png|gif|webp|svg|woff2?|ttf|eot|js|css)$/i.test(url)) {
      res.setHeader('Access-Control-Allow-Origin', '*');
    }
    next();
  });

  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // System health check API for monitoring
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      system: 'cneraart-shop',
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      timestamp: Date.now(),
      version: process.env.RAILWAY_GIT_COMMIT_SHA || 'dev',
    });
  });

  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
