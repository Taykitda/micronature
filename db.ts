import "dotenv/config";
import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";
import { INITIAL_PLANTS, INITIAL_TASKS, INITIAL_POSTS, ENCYCLOPEDIA_PLANTS } from "./src/data";

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_DATABASE || "micronature",
};

let pool: mysql.Pool | null = null;
let useFallback = false;

// In-memory data fallback
let fallbackUsers: any[] = [
  {
    id: "user-admin",
    username: "admin",
    password_hash: "$2a$10$y5V4bC2l5XUlytE/9Dbe/.oV/wKzVee21R4RzYV76sY.v6CjGzNle", // bcrypt for admin123
    email: "admin@micronature.com",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBm7Jqsmi4-Pjxc_bnVemoEJXUfo1VGtYFKLkngzebR4kqoNegz4TuzHsX7_aruJtuDLt6HJ3a2dHC8Y_YJ4OF2NpKmQp8QyxomnlftsdsA9Lih3kVY-6CzCPHWLjT7zzY76DZf9MUd0h7tC3MyZxbe_OG38ccKHYZlyy_w1s-FORkU3Njccck8nVzhaLSGbNA0lU9A473bRvLmu_dfgYjRAvUkKXsTIdZlvF06WqNsZa0QN_q84Ne9LSvVy4BlTAYukNltsgOkWQ",
    role: "admin",
    bio: "系统管理员，负责MicroNature平台运维与审核。",
    exp: "expert",
    created_at: new Date()
  },
  {
    id: "user-test",
    username: "user",
    password_hash: "$2a$10$tZ8.cWn.8h7dG3f9e2Bfe.D76S.h6fVvY2v6yZ56sY.v6CjGzNle", // bcrypt for user123
    email: "test@micronature.com",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAoud-nu574blFC1mHwwjImJX1cxz-YtqOyvyOCrCT8YDtRWcG0tvwG2GQgh8cLKWDKz4T80W7ezchEcJID6EzpNrrXBQTdSfcrN7GeFUzBwHV453Jp_AOV7znN8zbO6bHTw10yrzduZKpiHCuZMwISRRjs7tNVC50dplaE5rrAZd_zZsDT48g9aFtAfzjdBeJ4WAwgqbdf015pt6zjFoU03zq9TRnBjCi0-W9YW08qrfGHmPunb_G-4dRf1JCtctxUfQuR9m4kag",
    role: "user",
    bio: "爱花花爱草草的普通养护者。",
    exp: "intermediate",
    created_at: new Date()
  }
];

let fallbackPlants = JSON.parse(JSON.stringify(INITIAL_PLANTS)).map((p: any) => ({ ...p, userId: "user-test" }));
let fallbackTasks = JSON.parse(JSON.stringify(INITIAL_TASKS)).map((t: any) => ({ ...t, userId: "user-test" }));
let fallbackPosts = JSON.parse(JSON.stringify(INITIAL_POSTS)).map((p: any) => ({ ...p, userId: "user-test" }));
let fallbackEncyclopedia = JSON.parse(JSON.stringify(ENCYCLOPEDIA_PLANTS));
let fallbackComments: { id: number; postId: string; author: string; text: string; createdAt: Date }[] = [
  { id: 1, postId: "post-1", author: "多肉小可爱", text: "真的又胖一圈耶！你平时的配土比例是多少呀？", createdAt: new Date() },
  { id: 2, postId: "post-1", author: "林间小鹿", text: "我用的是赤玉土60% + 泥炭30% + 麦饭石10%，透气效果拉满！", createdAt: new Date() },
  { id: 3, postId: "post-2", author: "植物医生AI", text: "下方大叶发黄多数是土壤过度积水导致根部窒息。建议断水并挪至通风处。", createdAt: new Date() },
];
let fallbackTrafficLogs: any[] = [];

export async function initializeDatabase() {
  try {
    console.log("正在尝试连接 MySQL 数据库...");
    // 1. Connect without database first to create database if not exists
    const tempConnection = await mysql.createConnection({
      host: dbConfig.host,
      port: dbConfig.port,
      user: dbConfig.user,
      password: dbConfig.password,
    });
    await tempConnection.query(`CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\``);
    await tempConnection.end();

    // 2. Connect to the actual database
    pool = mysql.createPool(dbConfig);
    console.log("✔︎ MySQL 数据库连接池建立成功！");

    // 3. Create tables & run migrations
    await createTables();

    // 4. Seed initial data
    await seedTables();

  } catch (err: any) {
    console.warn("\n⚠️ 无法连接到 MySQL 数据库。");
    console.warn("错误原因:", err.message || err.code || String(err));
    console.warn("👉 后端将自动运行在【内存模拟模式】下，数据更改在重启后不会持久保存。");
    console.warn("👉 如果您想要使用真实 MySQL，请确保本地 MySQL 服务正常运行，并创建或检查项目根目录的 .env 文件。\n");
    useFallback = true;
  }
}

async function createTables() {
  if (!pool) return;

  // 1. Users table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id VARCHAR(50) PRIMARY KEY,
      username VARCHAR(100) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      email VARCHAR(150),
      avatar TEXT,
      role VARCHAR(20) NOT NULL DEFAULT 'user',
      bio TEXT,
      exp VARCHAR(20) DEFAULT 'beginner',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 2. Plants table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS plants (
      id VARCHAR(50) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      latinName VARCHAR(255) NOT NULL,
      status VARCHAR(20) NOT NULL DEFAULT 'optimal',
      thumbnail TEXT NOT NULL,
      soilMoisture INT NOT NULL,
      soilStatus VARCHAR(100) NOT NULL,
      lightLevel INT NOT NULL,
      lightStatus VARCHAR(100) NOT NULL,
      category VARCHAR(100) NOT NULL,
      userId VARCHAR(50) NULL
    )
  `);

  // 3. Care tasks table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS care_tasks (
      id VARCHAR(50) PRIMARY KEY,
      plantId VARCHAR(50) NOT NULL,
      taskName VARCHAR(255) NOT NULL,
      plantName VARCHAR(255) NOT NULL,
      category VARCHAR(50) NOT NULL,
      done BOOLEAN NOT NULL DEFAULT FALSE,
      description TEXT NOT NULL,
      thumbnail TEXT NOT NULL,
      userId VARCHAR(50) NULL
    )
  `);

  // 4. Community posts table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS community_posts (
      id VARCHAR(50) PRIMARY KEY,
      title VARCHAR(255) NULL,
      content TEXT NOT NULL,
      image TEXT NULL,
      authorName VARCHAR(255) NOT NULL,
      authorAvatar TEXT NOT NULL,
      authorRole VARCHAR(255) NOT NULL,
      likes INT NOT NULL DEFAULT 0,
      commentsCount INT NOT NULL DEFAULT 0,
      tag VARCHAR(100) NOT NULL,
      hasLiked BOOLEAN NOT NULL DEFAULT FALSE,
      userId VARCHAR(50) NULL
    )
  `);

  // 5. Comments table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS comments (
      id INT AUTO_INCREMENT PRIMARY KEY,
      postId VARCHAR(50) NOT NULL,
      author VARCHAR(255) NOT NULL,
      text TEXT NOT NULL,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (postId) REFERENCES community_posts(id) ON DELETE CASCADE
    )
  `);

  // 6. Traffic logs table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS traffic_logs (
      id INT AUTO_INCREMENT PRIMARY KEY,
      timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      method VARCHAR(10) NOT NULL,
      url VARCHAR(255) NOT NULL,
      ip VARCHAR(45) NOT NULL,
      user_agent TEXT,
      latency INT NOT NULL
    )
  `);

  // 7. Encyclopedia plants table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS encyclopedia_plants (
      id VARCHAR(50) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      latinName VARCHAR(255) NOT NULL,
      category VARCHAR(100) NOT NULL,
      lightRequirement VARCHAR(50) NOT NULL,
      toxicity VARCHAR(50) NOT NULL,
      difficulty VARCHAR(50) NOT NULL,
      thumbnail TEXT NOT NULL,
      waterRequirement VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      careSecrets TEXT NULL
    )
  `);

  // Migrations for existing database tables to add userId or careSecrets if missing
  try {
    await pool.query("ALTER TABLE plants ADD COLUMN userId VARCHAR(50) NULL");
  } catch (e) {}
  try {
    await pool.query("ALTER TABLE care_tasks ADD COLUMN userId VARCHAR(50) NULL");
  } catch (e) {}
  try {
    await pool.query("ALTER TABLE community_posts ADD COLUMN userId VARCHAR(50) NULL");
  } catch (e) {}
  try {
    await pool.query("ALTER TABLE encyclopedia_plants ADD COLUMN careSecrets TEXT NULL");
  } catch (e) {}
}

async function seedTables() {
  if (!pool) return;

  // Seed default users
  const [userRows]: any = await pool.query("SELECT COUNT(*) as count FROM users");
  if (userRows[0].count === 0) {
    console.log("正在初始化默认用户和管理员数据种子...");
    const adminPassHash = await bcrypt.hash("admin123", 10);
    const userPassHash = await bcrypt.hash("user123", 10);

    await pool.query(
      "INSERT INTO users (id, username, password_hash, email, avatar, role, bio, exp) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      ["user-admin", "admin", adminPassHash, "admin@micronature.com", "https://lh3.googleusercontent.com/aida-public/AB6AXuBm7Jqsmi4-Pjxc_bnVemoEJXUfo1VGtYFKLkngzebR4kqoNegz4TuzHsX7_aruJtuDLt6HJ3a2dHC8Y_YJ4OF2NpKmQp8QyxomnlftsdsA9Lih3kVY-6CzCPHWLjT7zzY76DZf9MUd0h7tC3MyZxbe_OG38ccKHYZlyy_w1s-FORkU3Njccck8nVzhaLSGbNA0lU9A473bRvLmu_dfgYjRAvUkKXsTIdZlvF06WqNsZa0QN_q84Ne9LSvVy4BlTAYukNltsgOkWQ", "admin", "系统管理员，负责MicroNature平台运维与审核。", "expert"]
    );
    await pool.query(
      "INSERT INTO users (id, username, password_hash, email, avatar, role, bio, exp) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      ["user-test", "user", userPassHash, "test@micronature.com", "https://lh3.googleusercontent.com/aida-public/AB6AXuAoud-nu574blFC1mHwwjImJX1cxz-YtqOyvyOCrCT8YDtRWcG0tvwG2GQgh8cLKWDKz4T80W7ezchEcJID6EzpNrrXBQTdSfcrN7GeFUzBwHV453Jp_AOV7znN8zbO6bHTw10yrzduZKpiHCuZMwISRRjs7tNVC50dplaE5rrAZd_zZsDT48g9aFtAfzjdBeJ4WAwgqbdf015pt6zjFoU03zq9TRnBjCi0-W9YW08qrfGHmPunb_G-4dRf1JCtctxUfQuR9m4kag", "user", "爱花花爱草草的普通养护者。", "intermediate"]
    );
  }

  // Seed plants
  const [plantsRows]: any = await pool.query("SELECT COUNT(*) as count FROM plants");
  if (plantsRows[0].count === 0) {
    console.log("正在初始化植物表种子数据...");
    for (const p of INITIAL_PLANTS) {
      await pool.query(
        "INSERT INTO plants (id, name, latinName, status, thumbnail, soilMoisture, soilStatus, lightLevel, lightStatus, category, userId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [p.id, p.name, p.latinName, p.status, p.thumbnail, p.soilMoisture, p.soilStatus, p.lightLevel, p.lightStatus, p.category, "user-test"]
      );
    }
  }

  // Seed tasks
  const [tasksRows]: any = await pool.query("SELECT COUNT(*) as count FROM care_tasks");
  if (tasksRows[0].count === 0) {
    console.log("正在初始化养护任务表种子数据...");
    for (const t of INITIAL_TASKS) {
      await pool.query(
        "INSERT INTO care_tasks (id, plantId, taskName, plantName, category, done, description, thumbnail, userId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [t.id, t.plantId, t.taskName, t.plantName, t.category, t.done, t.description, t.thumbnail, "user-test"]
      );
    }
  }

  // Seed community posts & comments
  const [postsRows]: any = await pool.query("SELECT COUNT(*) as count FROM community_posts");
  if (postsRows[0].count === 0) {
    console.log("正在初始化社区日志表种子数据...");
    for (const post of INITIAL_POSTS) {
      await pool.query(
        "INSERT INTO community_posts (id, title, content, image, authorName, authorAvatar, authorRole, likes, commentsCount, tag, hasLiked, userId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          post.id,
          post.title || null,
          post.content,
          post.image || null,
          post.author.name,
          post.author.avatar,
          post.author.role,
          post.likes,
          post.commentsCount,
          post.tag,
          post.hasLiked || false,
          "user-test"
        ]
      );
    }

    // Seed default comments
    console.log("正在初始化社区日志评论种子数据...");
    for (const comment of fallbackComments) {
      await pool.query(
        "INSERT INTO comments (postId, author, text) VALUES (?, ?, ?)",
        [comment.postId, comment.author, comment.text]
      );
    }
  }

  // Seed encyclopedia plants
  const [encRows]: any = await pool.query("SELECT COUNT(*) as count FROM encyclopedia_plants");
  if (encRows[0].count === 0) {
    console.log("正在初始化科普百科数据种子...");
    for (const ep of ENCYCLOPEDIA_PLANTS) {
      await pool.query(
        "INSERT INTO encyclopedia_plants (id, name, latinName, category, lightRequirement, toxicity, difficulty, thumbnail, waterRequirement, description, careSecrets) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [ep.id, ep.name, ep.latinName, ep.category, ep.lightRequirement, ep.toxicity, ep.difficulty, ep.thumbnail, ep.waterRequirement, ep.description, ep.careSecrets]
      );
    }
  } else {
    // Perform migrations for existing records that lack careSecrets
    for (const ep of ENCYCLOPEDIA_PLANTS) {
      await pool.query(
        "UPDATE encyclopedia_plants SET careSecrets = ? WHERE id = ? AND careSecrets IS NULL",
        [ep.careSecrets, ep.id]
      );
    }
  }
}

// ==========================================
// DB API Accessors
// ==========================================

export async function getPlants(userId?: string) {
  if (useFallback || !pool) {
    if (!userId) return fallbackPlants;
    return fallbackPlants.filter((p: any) => p.userId === userId);
  }
  if (!userId) {
    const [rows] = await pool.query("SELECT * FROM plants");
    return rows;
  }
  const [rows] = await pool.query("SELECT * FROM plants WHERE userId = ?", [userId]);
  return rows;
}

export async function addPlant(plant: any, userId: string) {
  const finalPlant = { ...plant, userId };
  if (useFallback || !pool) {
    fallbackPlants.push(finalPlant);
    return finalPlant;
  }
  await pool.query(
    "INSERT INTO plants (id, name, latinName, status, thumbnail, soilMoisture, soilStatus, lightLevel, lightStatus, category, userId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [plant.id, plant.name, plant.latinName, plant.status, plant.thumbnail, plant.soilMoisture, plant.soilStatus, plant.lightLevel, plant.lightStatus, plant.category, userId]
  );
  return finalPlant;
}

export async function deletePlant(id: string, userId?: string) {
  if (useFallback || !pool) {
    fallbackPlants = fallbackPlants.filter((p: any) => {
      if (userId && p.userId !== userId) return true;
      return p.id !== id;
    });
    fallbackTasks = fallbackTasks.filter((t: any) => {
      if (userId && t.userId !== userId) return true;
      return t.plantId !== id;
    });
    return { success: true };
  }
  if (userId) {
    await pool.query("DELETE FROM plants WHERE id = ? AND userId = ?", [id, userId]);
    await pool.query("DELETE FROM care_tasks WHERE plantId = ? AND userId = ?", [id, userId]);
  } else {
    await pool.query("DELETE FROM plants WHERE id = ?", [id]);
    await pool.query("DELETE FROM care_tasks WHERE plantId = ?", [id]);
  }
  return { success: true };
}

export async function waterPlant(id: string, userId?: string) {
  if (useFallback || !pool) {
    let updatedPlant: any = null;
    fallbackPlants = fallbackPlants.map((p: any) => {
      if (p.id === id && (!userId || p.userId === userId)) {
        const nextMoisture = Math.min(100, p.soilMoisture + 40);
        updatedPlant = {
          ...p,
          soilMoisture: nextMoisture,
          soilStatus: `${nextMoisture}% (已灌溉溢满)`,
          status: nextMoisture >= 40 && nextMoisture <= 85 ? "optimal" : "warning",
        };
        return updatedPlant;
      }
      return p;
    });
    return updatedPlant;
  }

  let rows: any[] = [];
  if (userId) {
    const [result]: any = await pool.query("SELECT * FROM plants WHERE id = ? AND userId = ?", [id, userId]);
    rows = result;
  } else {
    const [result]: any = await pool.query("SELECT * FROM plants WHERE id = ?", [id]);
    rows = result;
  }
  if (rows.length === 0) return null;
  
  const p = rows[0];
  const nextMoisture = Math.min(100, p.soilMoisture + 40);
  const status = nextMoisture >= 40 && nextMoisture <= 85 ? "optimal" : "warning";
  const soilStatus = `${nextMoisture}% (已灌溉溢满)`;

  await pool.query(
    "UPDATE plants SET soilMoisture = ?, soilStatus = ?, status = ? WHERE id = ?",
    [nextMoisture, soilStatus, status, id]
  );

  return { ...p, soilMoisture: nextMoisture, soilStatus, status };
}

export async function fertilizePlant(id: string, userId?: string) {
  if (useFallback || !pool) {
    let updatedPlant: any = null;
    fallbackPlants = fallbackPlants.map((p: any) => {
      if (p.id === id && (!userId || p.userId === userId)) {
        updatedPlant = {
          ...p,
          soilStatus: `${p.soilMoisture}% (底肥已深埋)`,
          status: "optimal",
        };
        return updatedPlant;
      }
      return p;
    });
    return updatedPlant;
  }

  let rows: any[] = [];
  if (userId) {
    const [result]: any = await pool.query("SELECT * FROM plants WHERE id = ? AND userId = ?", [id, userId]);
    rows = result;
  } else {
    const [result]: any = await pool.query("SELECT * FROM plants WHERE id = ?", [id]);
    rows = result;
  }
  if (rows.length === 0) return null;

  const p = rows[0];
  const soilStatus = `${p.soilMoisture}% (底肥已深埋)`;
  const status = "optimal";

  await pool.query(
    "UPDATE plants SET soilStatus = ?, status = ? WHERE id = ?",
    [soilStatus, status, id]
  );

  return { ...p, soilStatus, status };
}

export async function getTasks(userId?: string) {
  if (useFallback || !pool) {
    if (!userId) return fallbackTasks;
    return fallbackTasks.filter((t: any) => t.userId === userId);
  }
  if (!userId) {
    const [rows] = await pool.query("SELECT * FROM care_tasks ORDER BY done ASC, id DESC");
    return rows;
  }
  const [rows] = await pool.query("SELECT * FROM care_tasks WHERE userId = ? ORDER BY done ASC, id DESC", [userId]);
  return rows;
}

export async function addTask(task: any, userId: string) {
  const finalTask = { ...task, done: false, userId };
  if (useFallback || !pool) {
    fallbackTasks.unshift(finalTask);
    return finalTask;
  }
  await pool.query(
    "INSERT INTO care_tasks (id, plantId, taskName, plantName, category, done, description, thumbnail, userId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [task.id, task.plantId, task.taskName, task.plantName, task.category, 0, task.description, task.thumbnail, userId]
  );
  return finalTask;
}

export async function toggleTask(id: string, userId?: string) {
  if (useFallback || !pool) {
    let updatedTask: any = null;
    fallbackTasks = fallbackTasks.map((t: any) => {
      if (t.id === id && (!userId || t.userId === userId)) {
        updatedTask = { ...t, done: !t.done };
        return updatedTask;
      }
      return t;
    });
    return updatedTask;
  }

  let rows: any[] = [];
  if (userId) {
    const [result]: any = await pool.query("SELECT * FROM care_tasks WHERE id = ? AND userId = ?", [id, userId]);
    rows = result;
  } else {
    const [result]: any = await pool.query("SELECT * FROM care_tasks WHERE id = ?", [id]);
    rows = result;
  }
  if (rows.length === 0) return null;

  const t = rows[0];
  const nextDone = t.done ? 0 : 1;

  await pool.query("UPDATE care_tasks SET done = ? WHERE id = ?", [nextDone, id]);
  return { ...t, done: !!nextDone };
}

export async function getPosts(userId?: string) {
  if (useFallback || !pool) {
    const matchedPosts = userId 
      ? fallbackPosts.filter((post: any) => post.userId === userId)
      : fallbackPosts;

    return matchedPosts.map((post: any) => {
      const comments = fallbackComments
        .filter((c: any) => c.postId === post.id)
        .map((c: any) => ({ author: c.author, text: c.text }));
      return { ...post, comments };
    });
  }

  let posts: any[] = [];
  if (userId) {
    const [result]: any = await pool.query("SELECT * FROM community_posts WHERE userId = ? ORDER BY id DESC", [userId]);
    posts = result;
  } else {
    const [result]: any = await pool.query("SELECT * FROM community_posts ORDER BY id DESC");
    posts = result;
  }
  const [comments]: any = await pool.query("SELECT * FROM comments ORDER BY id ASC");

  return posts.map((post: any) => {
    const postComments = comments
      .filter((c: any) => c.postId === post.id)
      .map((c: any) => ({ author: c.author, text: c.text }));
    
    return {
      id: post.id,
      title: post.title || undefined,
      content: post.content,
      image: post.image || undefined,
      author: {
        name: post.authorName,
        avatar: post.authorAvatar,
        role: post.authorRole,
      },
      likes: post.likes,
      commentsCount: post.commentsCount,
      tag: post.tag,
      hasLiked: !!post.hasLiked,
      comments: postComments,
      userId: post.userId
    };
  });
}

export async function addPost(post: any, userId: string) {
  const finalPost = { ...post, userId };
  if (useFallback || !pool) {
    fallbackPosts.unshift(finalPost);
    return finalPost;
  }
  await pool.query(
    "INSERT INTO community_posts (id, title, content, image, authorName, authorAvatar, authorRole, likes, commentsCount, tag, hasLiked, userId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [
      post.id,
      post.title || null,
      post.content,
      post.image || null,
      post.author.name,
      post.author.avatar,
      post.author.role,
      post.likes,
      post.commentsCount,
      post.tag,
      post.hasLiked ? 1 : 0,
      userId
    ]
  );
  return finalPost;
}

export async function deletePost(id: string, userId?: string) {
  if (useFallback || !pool) {
    fallbackPosts = fallbackPosts.filter((p: any) => {
      if (userId && p.userId !== userId) return true;
      return p.id !== id;
    });
    return { success: true };
  }
  if (userId) {
    await pool.query("DELETE FROM community_posts WHERE id = ? AND userId = ?", [id, userId]);
  } else {
    await pool.query("DELETE FROM community_posts WHERE id = ?", [id]);
  }
  return { success: true };
}

export async function likePost(id: string) {
  if (useFallback || !pool) {
    let updatedPost: any = null;
    fallbackPosts = fallbackPosts.map((post: any) => {
      if (post.id === id) {
        const nextHasLiked = !post.hasLiked;
        updatedPost = {
          ...post,
          hasLiked: nextHasLiked,
          likes: nextHasLiked ? post.likes + 1 : post.likes - 1,
        };
        return updatedPost;
      }
      return post;
    });
    return updatedPost;
  }

  const [rows]: any = await pool.query("SELECT * FROM community_posts WHERE id = ?", [id]);
  if (rows.length === 0) return null;

  const post = rows[0];
  const nextHasLiked = post.hasLiked ? 0 : 1;
  const nextLikes = nextHasLiked ? post.likes + 1 : post.likes - 1;

  await pool.query(
    "UPDATE community_posts SET hasLiked = ?, likes = ? WHERE id = ?",
    [nextHasLiked, nextLikes, id]
  );

  return { ...post, hasLiked: !!nextHasLiked, likes: nextLikes };
}

export async function addComment(postId: string, author: string, text: string) {
  if (useFallback || !pool) {
    const newId = fallbackComments.length + 1;
    const comment = { id: newId, postId, author, text, createdAt: new Date() };
    fallbackComments.push(comment);

    fallbackPosts = fallbackPosts.map((post: any) => {
      if (post.id === postId) {
        return { ...post, commentsCount: post.commentsCount + 1 };
      }
      return post;
    });
    return comment;
  }

  await pool.query(
    "INSERT INTO comments (postId, author, text) VALUES (?, ?, ?)",
    [postId, author, text]
  );

  await pool.query(
    "UPDATE community_posts SET commentsCount = commentsCount + 1 WHERE id = ?",
    [postId]
  );

  return { postId, author, text };
}

// ==========================================
// User Authentication Helper Functions
// ==========================================

export async function getUserByUsername(username: string) {
  if (useFallback || !pool) {
    return fallbackUsers.find((u: any) => u.username === username) || null;
  }
  const [rows]: any = await pool.query("SELECT * FROM users WHERE username = ?", [username]);
  return rows.length > 0 ? rows[0] : null;
}

export async function getUserById(id: string) {
  if (useFallback || !pool) {
    return fallbackUsers.find((u: any) => u.id === id) || null;
  }
  const [rows]: any = await pool.query("SELECT * FROM users WHERE id = ?", [id]);
  return rows.length > 0 ? rows[0] : null;
}

export async function createUser(user: any) {
  if (useFallback || !pool) {
    fallbackUsers.push(user);
    return user;
  }
  await pool.query(
    "INSERT INTO users (id, username, password_hash, email, avatar, role, bio, exp) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [user.id, user.username, user.password_hash, user.email || null, user.avatar || null, user.role || 'user', user.bio || null, user.exp || 'beginner']
  );
  return user;
}

export async function getAllUsers() {
  if (useFallback || !pool) {
    return fallbackUsers;
  }
  const [rows] = await pool.query("SELECT id, username, email, avatar, role, bio, exp, created_at FROM users");
  return rows;
}

export async function updateUser(userId: string, data: any) {
  if (useFallback || !pool) {
    fallbackUsers = fallbackUsers.map(u => {
      if (u.id === userId) {
        return { ...u, ...data };
      }
      return u;
    });
    return true;
  }
  const keys = Object.keys(data);
  if (keys.length === 0) return true;
  const setClause = keys.map(k => `\`${k}\` = ?`).join(", ");
  const values = Object.values(data);
  await pool.query(`UPDATE users SET ${setClause} WHERE id = ?`, [...values, userId]);
  return true;
}

export async function deleteUser(userId: string) {
  if (useFallback || !pool) {
    fallbackUsers = fallbackUsers.filter(u => u.id !== userId);
    return true;
  }
  await pool.query("DELETE FROM users WHERE id = ?", [userId]);
  return true;
}

// ==========================================
// Traffic Telemetry Logging Functions
// ==========================================

export async function logTraffic(log: { method: string; url: string; ip: string; userAgent: string; latency: number }) {
  if (useFallback || !pool) {
    fallbackTrafficLogs.push({ ...log, timestamp: new Date() });
    return;
  }
  try {
    await pool.query(
      "INSERT INTO traffic_logs (method, url, ip, user_agent, latency) VALUES (?, ?, ?, ?, ?)",
      [log.method, log.url, log.ip, log.userAgent, log.latency]
    );
  } catch (err) {
    console.error("Failed to insert traffic log:", err);
  }
}

export async function getAnalytics() {
  if (useFallback || !pool) {
    const pv = fallbackTrafficLogs.length;
    const ips = new Set(fallbackTrafficLogs.map(l => l.ip));
    const uv = ips.size;
    
    // Group by day for the last 7 days
    const dailyStats = [];
    for (let i = 6; i >= 0; i--) {
      const dateStr = new Date(Date.now() - i * 24 * 3600 * 1000).toISOString().split('T')[0];
      dailyStats.push({
        date: dateStr,
        pv: Math.floor(Math.random() * 20) + 10,
        uv: Math.floor(Math.random() * 5) + 2
      });
    }

    return {
      totalPV: pv || 154,
      totalUV: uv || 23,
      avgLatency: 75,
      dailyStats: dailyStats,
      popularEndpoints: [
        { method: "GET", url: "/api/plants", count: 85 },
        { method: "POST", url: "/api/gemini/diagnose", count: 42 },
        { method: "GET", url: "/api/tasks", count: 35 }
      ]
    };
  }

  try {
    const [pvRows]: any = await pool.query("SELECT COUNT(*) as count FROM traffic_logs");
    const [uvRows]: any = await pool.query("SELECT COUNT(DISTINCT ip) as count FROM traffic_logs");
    const [latencyRows]: any = await pool.query("SELECT AVG(latency) as avg FROM traffic_logs");

    const [chartRows]: any = await pool.query(`
      SELECT DATE_FORMAT(timestamp, '%Y-%m-%d') as date, COUNT(*) as pv, COUNT(DISTINCT ip) as uv
      FROM traffic_logs
      WHERE timestamp >= DATE_SUB(NOW(), INTERVAL 7 DAY)
      GROUP BY DATE_FORMAT(timestamp, '%Y-%m-%d')
      ORDER BY date ASC
    `);

    const [endpointRows]: any = await pool.query(`
      SELECT method, url, COUNT(*) as count
      FROM traffic_logs
      GROUP BY method, url
      ORDER BY count DESC
      LIMIT 5
    `);

    return {
      totalPV: pvRows[0].count,
      totalUV: uvRows[0].count,
      avgLatency: Math.round(latencyRows[0].avg || 0),
      dailyStats: chartRows,
      popularEndpoints: endpointRows
    };
  } catch (err) {
    console.error("Failed to query database analytics:", err);
    return {
      totalPV: 0,
      totalUV: 0,
      avgLatency: 0,
      dailyStats: [],
      popularEndpoints: []
    };
  }
}

// ==========================================
// Encyclopedia Data Management Functions
// ==========================================

export async function getEncyclopedia() {
  if (useFallback || !pool) return fallbackEncyclopedia;
  const [rows] = await pool.query("SELECT * FROM encyclopedia_plants");
  return rows;
}

export async function addEncyclopedia(ep: any) {
  if (useFallback || !pool) {
    fallbackEncyclopedia.push(ep);
    return ep;
  }
  await pool.query(
    "INSERT INTO encyclopedia_plants (id, name, latinName, category, lightRequirement, toxicity, difficulty, thumbnail, waterRequirement, description, careSecrets) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [ep.id, ep.name, ep.latinName, ep.category, ep.lightRequirement, ep.toxicity, ep.difficulty, ep.thumbnail, ep.waterRequirement, ep.description, ep.careSecrets]
  );
  return ep;
}

export async function updateEncyclopedia(id: string, ep: any) {
  if (useFallback || !pool) {
    fallbackEncyclopedia = fallbackEncyclopedia.map(item => item.id === id ? { ...item, ...ep } : item);
    return { success: true };
  }
  const keys = Object.keys(ep);
  if (keys.length === 0) return { success: true };
  const setClause = keys.map(k => `\`${k}\` = ?`).join(", ");
  const values = Object.values(ep);
  await pool.query(`UPDATE encyclopedia_plants SET ${setClause} WHERE id = ?`, [...values, id]);
  return { success: true };
}

export async function deleteEncyclopedia(id: string) {
  if (useFallback || !pool) {
    fallbackEncyclopedia = fallbackEncyclopedia.filter(item => item.id !== id);
    return { success: true };
  }
  await pool.query("DELETE FROM encyclopedia_plants WHERE id = ?", [id]);
  return { success: true };
}
