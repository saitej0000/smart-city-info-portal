import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import multer from 'multer';
import fs from 'fs';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

const JWT_SECRET = process.env.JWT_SECRET || 'smart-city-secret-key-2026';
const db = new Database('city.db');

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS departments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT
  );

  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL CHECK(role IN ('CITIZEN', 'DEPT_ADMIN', 'SUPER_ADMIN')),
    department_id INTEGER,
    FOREIGN KEY(department_id) REFERENCES departments(id)
  );

  CREATE TABLE IF NOT EXISTS complaints (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    citizen_id INTEGER NOT NULL,
    department_id INTEGER NOT NULL,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT DEFAULT 'PENDING' CHECK(status IN ('PENDING', 'IN_PROGRESS', 'RESOLVED')),
    latitude REAL,
    longitude REAL,
    image_url TEXT,
    resolution_notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(citizen_id) REFERENCES users(id),
    FOREIGN KEY(department_id) REFERENCES departments(id)
  );

  CREATE TABLE IF NOT EXISTS alerts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL CHECK(type IN ('EMERGENCY', 'WEATHER', 'TRAFFIC', 'HEALTH')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS jobs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    department TEXT NOT NULL,
    description TEXT NOT NULL,
    deadline DATE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Seed initial data if empty
const deptCount = db.prepare('SELECT COUNT(*) as count FROM departments').get() as { count: number };
if (deptCount.count === 0) {
  const insertDept = db.prepare('INSERT INTO departments (name, description) VALUES (?, ?)');
  insertDept.run('Waste Management', 'Handles city-wide garbage collection and recycling.');
  insertDept.run('Transport', 'Manages public transit, roads, and traffic signals.');
  insertDept.run('Water & Power', 'Ensures stable supply of water and electricity.');
  insertDept.run('Public Safety', 'Police, fire, and emergency response services.');

  // Create Super Admin
  const hashedPassword = bcrypt.hashSync('admin123', 10);
  db.prepare('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)').run(
    'Super Admin', 'admin@smartcity.gov', hashedPassword, 'SUPER_ADMIN'
  );

  // Create a Dept Admin
  db.prepare('INSERT INTO users (name, email, password, role, department_id) VALUES (?, ?, ?, ?, ?)').run(
    'Waste Manager', 'waste@smartcity.gov', hashedPassword, 'DEPT_ADMIN', 1
  );
}

async function startServer() {
  const app = express();
  app.use(express.json());
  app.use('/uploads', express.static(uploadDir));

  // --- Auth Middleware ---
  const authenticateToken = (req: any, res: any, next: any) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
      if (err) return res.sendStatus(403);
      
      // Verify user still exists in DB
      const dbUser = db.prepare('SELECT id, role, department_id FROM users WHERE id = ?').get(user.id);
      if (!dbUser) return res.sendStatus(401);

      req.user = { ...user, ...dbUser }; // Refresh role/dept in case it changed
      next();
    });
  };

  // --- API Routes ---

  // Auth
  app.post('/api/upload', authenticateToken, upload.single('image'), (req: any, res) => {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    const imageUrl = `/uploads/${req.file.filename}`;
    res.json({ url: imageUrl });
  });

  app.post('/api/auth/register', (req, res) => {
    const { name, email, password } = req.body;
    try {
      const hashedPassword = bcrypt.hashSync(password, 10);
      const result = db.prepare('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)').run(
        name, email, hashedPassword, 'CITIZEN'
      );
      res.status(201).json({ id: result.lastInsertRowid });
    } catch (e) {
      res.status(400).json({ error: 'Email already exists' });
    }
  });

  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as any;
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user.id, role: user.role, deptId: user.department_id }, JWT_SECRET);
    res.json({ token, user: { id: user.id, name: user.name, role: user.role, deptId: user.department_id } });
  });

  // Complaints
  app.get('/api/complaints/public', authenticateToken, (req: any, res) => {
    const complaints = db.prepare(`
      SELECT c.id, c.category, c.description, c.status, c.latitude, c.longitude, c.image_url, c.created_at, d.name as dept_name
      FROM complaints c
      JOIN departments d ON c.department_id = d.id
      ORDER BY created_at DESC
    `).all();
    res.json(complaints);
  });

  app.get('/api/complaints', authenticateToken, (req: any, res) => {
    let complaints;
    if (req.user.role === 'SUPER_ADMIN') {
      complaints = db.prepare(`
        SELECT c.*, u.name as citizen_name, d.name as dept_name 
        FROM complaints c 
        JOIN users u ON c.citizen_id = u.id 
        JOIN departments d ON c.department_id = d.id
        ORDER BY created_at DESC
      `).all();
    } else if (req.user.role === 'DEPT_ADMIN') {
      complaints = db.prepare(`
        SELECT c.*, u.name as citizen_name, d.name as dept_name 
        FROM complaints c 
        JOIN users u ON c.citizen_id = u.id 
        JOIN departments d ON c.department_id = d.id
        WHERE c.department_id = ?
        ORDER BY created_at DESC
      `).all(req.user.deptId);
    } else {
      complaints = db.prepare(`
        SELECT c.*, d.name as dept_name 
        FROM complaints c 
        JOIN departments d ON c.department_id = d.id
        WHERE citizen_id = ?
        ORDER BY created_at DESC
      `).all(req.user.id);
    }
    res.json(complaints);
  });

  app.get('/api/complaints/:id', authenticateToken, (req: any, res) => {
    const complaint = db.prepare(`
      SELECT c.*, u.name as citizen_name, d.name as dept_name 
      FROM complaints c 
      JOIN users u ON c.citizen_id = u.id 
      JOIN departments d ON c.department_id = d.id
      WHERE c.id = ?
    `).get(req.params.id);

    if (!complaint) return res.sendStatus(404);

    // Access control
    if (req.user.role === 'CITIZEN' && (complaint as any).citizen_id !== req.user.id) {
      return res.sendStatus(403);
    }
    if (req.user.role === 'DEPT_ADMIN' && (complaint as any).department_id !== req.user.deptId) {
      return res.sendStatus(403);
    }

    res.json(complaint);
  });

  app.post('/api/complaints', authenticateToken, (req: any, res) => {
    const { department_id, category, description, latitude, longitude, image_url } = req.body;
    try {
      const result = db.prepare(`
        INSERT INTO complaints (citizen_id, department_id, category, description, latitude, longitude, image_url)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(req.user.id, department_id, category, description, latitude, longitude, image_url);
      res.status(201).json({ id: result.lastInsertRowid });
    } catch (e: any) {
      if (e.code === 'SQLITE_CONSTRAINT_FOREIGNKEY') {
        // Could be invalid department OR invalid user (if check skipped)
        return res.status(400).json({ error: 'Invalid department or user reference' });
      }
      res.status(500).json({ error: 'Failed to create complaint' });
    }
  });

  app.patch('/api/complaints/:id', authenticateToken, (req: any, res) => {
    const { status, resolution_notes } = req.body;
    if (req.user.role === 'CITIZEN') return res.sendStatus(403);
    
    db.prepare('UPDATE complaints SET status = ?, resolution_notes = ? WHERE id = ?')
      .run(status, resolution_notes, req.params.id);
    res.json({ success: true });
  });

  // Alerts
  app.get('/api/alerts', (req, res) => {
    const alerts = db.prepare('SELECT * FROM alerts ORDER BY created_at DESC LIMIT 10').all();
    res.json(alerts);
  });

  app.post('/api/alerts', authenticateToken, (req: any, res) => {
    if (req.user.role !== 'SUPER_ADMIN') return res.sendStatus(403);
    const { title, message, type } = req.body;
    db.prepare('INSERT INTO alerts (title, message, type) VALUES (?, ?, ?)').run(title, message, type);
    res.status(201).json({ success: true });
  });

  // Jobs
  app.get('/api/jobs', (req, res) => {
    const jobs = db.prepare('SELECT * FROM jobs ORDER BY created_at DESC').all();
    res.json(jobs);
  });

  app.post('/api/jobs', authenticateToken, (req: any, res) => {
    if (req.user.role !== 'SUPER_ADMIN') return res.sendStatus(403);
    const { title, department, description, deadline } = req.body;
    db.prepare('INSERT INTO jobs (title, department, description, deadline) VALUES (?, ?, ?, ?)').run(title, department, description, deadline);
    res.status(201).json({ success: true });
  });

  // Departments
  app.get('/api/departments', (req, res) => {
    const depts = db.prepare('SELECT * FROM departments').all();
    res.json(depts);
  });

  // Users (Super Admin)
  app.get('/api/users', authenticateToken, (req: any, res) => {
    if (req.user.role !== 'SUPER_ADMIN') return res.sendStatus(403);
    const users = db.prepare(`
      SELECT u.id, u.name, u.email, u.role, d.name as dept_name 
      FROM users u 
      LEFT JOIN departments d ON u.department_id = d.id
      ORDER BY u.id DESC
    `).all();
    res.json(users);
  });

  app.post('/api/users', authenticateToken, (req: any, res) => {
    if (req.user.role !== 'SUPER_ADMIN') return res.sendStatus(403);
    const { name, email, password, role, department_id } = req.body;
    
    try {
      const hashedPassword = bcrypt.hashSync(password, 10);
      const result = db.prepare('INSERT INTO users (name, email, password, role, department_id) VALUES (?, ?, ?, ?, ?)').run(
        name, email, hashedPassword, role, department_id || null
      );
      res.status(201).json({ id: result.lastInsertRowid });
    } catch (e: any) {
      if (e.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        return res.status(400).json({ error: 'Email already exists' });
      }
      if (e.code === 'SQLITE_CONSTRAINT_FOREIGNKEY') {
        return res.status(400).json({ error: 'Invalid department selected' });
      }
      res.status(500).json({ error: 'Failed to create user' });
    }
  });

  app.delete('/api/users/:id', authenticateToken, (req: any, res) => {
    if (req.user.role !== 'SUPER_ADMIN') return res.sendStatus(403);
    // Prevent deleting self
    if (parseInt(req.params.id) === req.user.id) {
      return res.status(400).json({ error: 'Cannot delete yourself' });
    }
    
    // Manually cascade delete complaints first
    db.prepare('DELETE FROM complaints WHERE citizen_id = ?').run(req.params.id);
    
    db.prepare('DELETE FROM users WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  });

  // Analytics (Super Admin)
  app.get('/api/analytics', authenticateToken, (req: any, res) => {
    if (req.user.role !== 'SUPER_ADMIN') return res.sendStatus(403);
    const stats = {
      totalComplaints: db.prepare('SELECT COUNT(*) as count FROM complaints').get(),
      byStatus: db.prepare('SELECT status, COUNT(*) as count FROM complaints GROUP BY status').all(),
      byDept: db.prepare(`
        SELECT d.name, COUNT(c.id) as count 
        FROM departments d 
        LEFT JOIN complaints c ON d.id = c.department_id 
        GROUP BY d.name
      `).all()
    };
    res.json(stats);
  });

  // Vite integration
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  const PORT = 3000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
