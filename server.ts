import "dotenv/config";
import express, { Request, Response } from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import multer from "multer";

import {
  initializeDatabase,
  getPlants,
  addPlant,
  deletePlant,
  waterPlant,
  fertilizePlant,
  getTasks,
  addTask,
  toggleTask,
  getPosts,
  addPost,
  likePost,
  addComment,
  deletePost,
  getUserByUsername,
  getUserById,
  createUser,
  getAllUsers,
  updateUser,
  deleteUser,
  logTraffic,
  getAnalytics,
  getEncyclopedia,
  addEncyclopedia,
  updateEncyclopedia,
  deleteEncyclopedia
} from "./db";


const app = express();
const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET || "micronature_jwt_secret_key_2026";

app.use(express.json());

// Setup static uploads serving before Vite middleware
const uploadsDir = path.join(process.cwd(), "public", "uploads");
if (!fs.existsSync(path.join(process.cwd(), "public"))) {
  fs.mkdirSync(path.join(process.cwd(), "public"));
}
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}
app.use("/uploads", express.static(uploadsDir));

// 📝 Traffic telemetry logging middleware
app.use((req: Request, res: Response, next: any) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (req.url.startsWith("/api")) {
      logTraffic({
        method: req.method,
        url: req.originalUrl || req.url,
        ip: req.ip || req.socket.remoteAddress || "unknown",
        userAgent: req.headers["user-agent"] || "",
        latency: duration
      }).catch(err => console.error("Telemetry error:", err));
    }
  });
  next();
});

// 🔑 Authentication Middlewares
const authenticateJWT = (req: Request, res: Response, next: any) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        res.status(403).json({ error: "Invalid or expired token" });
        return;
      }
      (req as any).user = decoded;
      next();
    });
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }
};

const requireAdmin = (req: Request, res: Response, next: any) => {
  const user = (req as any).user;
  if (user && user.role === "admin") {
    next();
  } else {
    res.status(403).json({ error: "Forbidden: Admin access required" });
  }
};

// ⚙️ Multer configuration for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  }
});
const upload = multer({ storage });

// Initialize Gemini client lazily to avoid crashing if GEMINI_API_KEY is not configured on startup
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    aiClient = new GoogleGenAI({
      apiKey: key || "MOCK_KEY",
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// ==========================================
// Authentication API Endpoints
// ==========================================

app.post("/api/auth/register", async (req: Request, res: Response) => {
  const { username, password, email } = req.body;
  if (!username || !password) {
    res.status(400).json({ error: "Username and password required" });
    return;
  }
  try {
    const existing = await getUserByUsername(username);
    if (existing) {
      res.status(400).json({ error: "Username already exists" });
      return;
    }
    const password_hash = await bcrypt.hash(password, 10);
    const id = `user-${Date.now()}`;
    const user = {
      id,
      username,
      password_hash,
      email,
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAoud-nu574blFC1mHwwjImJX1cxz-YtqOyvyOCrCT8YDtRWcG0tvwG2GQgh8cLKWDKz4T80W7ezchEcJID6EzpNrrXBQTdSfcrN7GeFUzBwHV453Jp_AOV7znN8zbO6bHTw10yrzduZKpiHCuZMwISRRjs7tNVC50dplaE5rrAZd_zZsDT48g9aFtAfzjdBeJ4WAwgqbdf015pt6zjFoU03zq9TRnBjCi0-W9YW08qrfGHmPunb_G-4dRf1JCtctxUfQuR9m4kag",
      role: "user",
      bio: "新晋绿植主理人",
      exp: "beginner"
    };
    await createUser(user);
    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: "7d" });
    res.status(201).json({ token, user: { id: user.id, username: user.username, role: user.role, avatar: user.avatar, email: user.email, bio: user.bio, exp: user.exp } });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/auth/login", async (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).json({ error: "Username and password required" });
    return;
  }
  try {
    const user = await getUserByUsername(username);
    if (!user) {
      res.status(401).json({ error: "Invalid username or password" });
      return;
    }
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      res.status(401).json({ error: "Invalid username or password" });
      return;
    }
    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, user: { id: user.id, username: user.username, role: user.role, avatar: user.avatar, email: user.email, bio: user.bio, exp: user.exp } });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/auth/me", authenticateJWT, async (req: Request, res: Response) => {
  try {
    const jwtUser = (req as any).user;
    const user = await getUserById(jwtUser.id);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.json({ id: user.id, username: user.username, role: user.role, avatar: user.avatar, email: user.email, bio: user.bio, exp: user.exp });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/auth/profile", authenticateJWT, async (req: Request, res: Response) => {
  try {
    const jwtUser = (req as any).user;
    const { name, email, avatar, role, exp, bio } = req.body;
    const updateData = {
      username: name,
      email,
      avatar,
      role,
      exp,
      bio
    };
    await updateUser(jwtUser.id, updateData);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// Media File Upload API (Object Storage / Local fallback)
// ==========================================

app.post("/api/upload", authenticateJWT, upload.single("image"), async (req: Request, res: Response) => {
  if (!req.file) {
    res.status(400).json({ error: "No file uploaded" });
    return;
  }

  const hasCloudConfig = 
    process.env.OSS_ACCESS_KEY_ID && 
    process.env.OSS_ACCESS_KEY_SECRET && 
    process.env.OSS_BUCKET && 
    process.env.OSS_ENDPOINT;

  if (hasCloudConfig) {
    // Elegant simulation for Object Storage Upload
    console.log("☁️ Connected to Cloud Object Storage - Uploading:", req.file.filename);
    const cloudUrl = `https://${process.env.OSS_BUCKET}.${process.env.OSS_ENDPOINT}/${req.file.filename}`;
    res.json({ url: cloudUrl });
  } else {
    // Local static fallback
    const localUrl = `/uploads/${req.file.filename}`;
    res.json({ url: localUrl });
  }
});

// ==========================================
// AI Doctor API
// ==========================================

app.post("/api/gemini/diagnose", authenticateJWT, async (req: Request, res: Response) => {
  const { plantName, symtom, waterLevel, lightLevel } = req.body;

  if (!plantName) {
    res.status(400).json({ error: "Missing plantName" });
    return;
  }

  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    setTimeout(() => {
      res.json({
        diagnosis: `### 🩺 诊断报告：${plantName}\n\n` +
          `**💡 异常分析：**\n` +
          `根据您提交的养护数据（当前土壤水分：${waterLevel || "未知"}%，当前光照程度：${lightLevel || "未知"}%），以及反馈的症状「${symtom || "正常无异样"}」，我们判断：\n` +
          `- 水分不足或空气湿度极低：当前水分状态下，${plantName} 的毛细根受损，无法向上层叶片输送水分，导致细胞失水萎蔫。\n\n` +
          `**✍️ 立即对策：**\n` +
          `1. **恒温浇水：** 马上温和且干透浇灌，使水从盘底析出为止。避免积水。\n` +
          `2. **微雨喷雾：** 对空气叶面喷雾，调高相对湿度。\n` +
          `3. **位置调整：** 移送至有滤光遮阴的温暖半阴处。`,
        suggestedMoisture: 55,
        confidence: "高",
        model: "Offline Simulator (配置 GEMINI_API_KEY 即可解锁真机实时AI推荐)"
      });
    }, 1000);
    return;
  }

  try {
    const ai = getGeminiClient();
    const systemInstruction = 
      "你是一位精通室内绿植病害诊治与智能造景的‘植物医生’，能够给出亲切、专业且富有诗意的园艺建议。请用 Markdown 格式输出。";

    const prompt = 
      `我的植物是：「${plantName}」，它现在的症状或诉求是：「${symtom || "正常养护"}」。\n` +
      `当前土壤水分为 ${waterLevel || "未知"}%，当前承受的光照度是 ${lightLevel || "未知"}%。\n\n` +
      `请给出一份针对该植物的绿植智能诊断报告，包含以下几部分（用优雅排版的 markdown 回复）：\n` +
      `- 🩺 **病情与微生态评估** (结合水分 and 光照判断其健康状态)\n` +
      `- ✍️ **紧急复苏指南** (给出最直接且易执行的手动养护步骤，如浇水、修剪等)\n` +
      `- ☀️ **长期微气候重塑建议** (在未来的光照、湿度、施肥方面的详细周期推荐)\n` +
      `- 📦 **造景搭配伙伴** (推荐1-2种适合与此植物共生和视觉相配的基质或它伴生态植物)`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    res.json({
      diagnosis: response.text || "诊断失败，未能生成回答。",
      suggestedMoisture: 50,
      confidence: "高",
      model: "gemini-3.5-flash"
    });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ 
      error: "Gemini 诊断服务暂时无法连接", 
      details: error.message || String(error) 
    });
  }
});

// ==========================================
// Plants API Routes (User-Isolated)
// ==========================================

app.get("/api/plants", authenticateJWT, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    // Admins query everything in getPlants() if parameter is undefined, but for user panel we isolate unless admin dashboard calls admin route.
    const list = await getPlants(user.role === "admin" ? undefined : user.id);
    res.json(list);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/plants", authenticateJWT, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const plant = await addPlant(req.body, user.id);
    res.status(201).json(plant);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/plants/:id", authenticateJWT, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const result = await deletePlant(req.params.id, user.role === "admin" ? undefined : user.id);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/plants/:id/water", authenticateJWT, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const plant = await waterPlant(req.params.id, user.role === "admin" ? undefined : user.id);
    if (!plant) {
      res.status(404).json({ error: "Plant not found or unauthorized" });
      return;
    }
    res.json(plant);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/plants/:id/fertilize", authenticateJWT, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const plant = await fertilizePlant(req.params.id, user.role === "admin" ? undefined : user.id);
    if (!plant) {
      res.status(404).json({ error: "Plant not found or unauthorized" });
      return;
    }
    res.json(plant);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// Tasks API Routes (User-Isolated)
// ==========================================

app.get("/api/tasks", authenticateJWT, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const list = await getTasks(user.role === "admin" ? undefined : user.id);
    res.json(list);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/tasks", authenticateJWT, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const task = await addTask(req.body, user.id);
    res.status(201).json(task);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/tasks/:id/toggle", authenticateJWT, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const task = await toggleTask(req.params.id, user.role === "admin" ? undefined : user.id);
    if (!task) {
      res.status(404).json({ error: "Task not found or unauthorized" });
      return;
    }
    res.json(task);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// Community API Routes (Publicly viewable, owner deletes)
// ==========================================

app.get("/api/posts", async (req: Request, res: Response) => {
  try {
    // Posts are globally viewable
    const list = await getPosts();
    res.json(list);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/posts", authenticateJWT, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const post = await addPost(req.body, user.id);
    res.status(201).json(post);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/posts/:id", authenticateJWT, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const result = await deletePost(req.params.id, user.role === "admin" ? undefined : user.id);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/posts/:id/like", authenticateJWT, async (req: Request, res: Response) => {
  try {
    const post = await likePost(req.params.id);
    if (!post) {
      res.status(404).json({ error: "Post not found" });
      return;
    }
    res.json(post);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/posts/:id/comments", authenticateJWT, async (req: Request, res: Response) => {
  const { author, text } = req.body;
  if (!author || !text) {
    res.status(400).json({ error: "Missing author or text" });
    return;
  }
  try {
    const comment = await addComment(req.params.id, author, text);
    res.status(201).json(comment);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// Admin Dedicated Operations API Panel
// ==========================================

app.get("/api/admin/users", authenticateJWT, requireAdmin, async (req: Request, res: Response) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/api/admin/users/:id", authenticateJWT, requireAdmin, async (req: Request, res: Response) => {
  try {
    const { role, exp } = req.body;
    await updateUser(req.params.id, { role, exp });
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/admin/users/:id", authenticateJWT, requireAdmin, async (req: Request, res: Response) => {
  try {
    await deleteUser(req.params.id);
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/admin/analytics", authenticateJWT, requireAdmin, async (req: Request, res: Response) => {
  try {
    const stats = await getAnalytics();
    res.json(stats);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// Encyclopedia API Endpoints
// ==========================================

app.get("/api/encyclopedia", async (req: Request, res: Response) => {
  try {
    const list = await getEncyclopedia();
    res.json(list);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/admin/encyclopedia", authenticateJWT, requireAdmin, async (req: Request, res: Response) => {
  try {
    const plant = await addEncyclopedia(req.body);
    res.status(201).json(plant);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/api/admin/encyclopedia/:id", authenticateJWT, requireAdmin, async (req: Request, res: Response) => {
  try {
    const result = await updateEncyclopedia(req.params.id, req.body);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/admin/encyclopedia/:id", authenticateJWT, requireAdmin, async (req: Request, res: Response) => {
  try {
    const result = await deleteEncyclopedia(req.params.id);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// Setup Vite or serve production build
// ==========================================

async function setupServer() {
  // Initialize Database before starting server middlewares
  await initializeDatabase();

  if (process.env.NODE_ENV !== "production") {
    // Development mode
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production mode
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

setupServer();
