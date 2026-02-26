import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
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

// Initialize Supabase Client (bypassing RLS with Service Role Key)
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || '';
if (!supabaseUrl || !supabaseKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_KEY in .env");
  process.exit(1);
}
const supabase = createClient(supabaseUrl, supabaseKey);

async function startServer() {
  const app = express();
  app.use(express.json());
  app.use('/uploads', express.static(uploadDir));

  // --- Auth Middleware ---
  const authenticateToken = async (req: any, res: any, next: any) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, async (err: any, user: any) => {
      if (err) return res.sendStatus(403);

      // Verify user still exists in DB
      const { data: dbUser, error } = await supabase
        .from('users')
        .select('id, role, department_id')
        .eq('id', user.id)
        .single();

      if (error || !dbUser) return res.sendStatus(401);

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

  app.post('/api/auth/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
      const hashedPassword = bcrypt.hashSync(password, 10);
      const { data, error } = await supabase
        .from('users')
        .insert([{ name, email, password: hashedPassword, role: 'CITIZEN' }])
        .select()
        .single();

      if (error) throw error;
      res.status(201).json({ id: data.id });
    } catch (e: any) {
      console.error("Supabase Registration Error:", e);
      res.status(400).json({ error: e.message || 'Email already exists or registration failed' });
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;

    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user || !bcrypt.compareSync(password, user.password as string)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user.id, role: user.role, deptId: user.department_id }, JWT_SECRET);
    res.json({ token, user: { id: user.id, name: user.name, role: user.role, deptId: user.department_id } });
  });

  // Complaints
  app.get('/api/complaints/public', authenticateToken, async (req: any, res) => {
    const { data, error } = await supabase
      .from('complaints')
      .select(`
        id, category, description, status, latitude, longitude, image_url, created_at,
        departments:department_id(name)
      `)
      .order('created_at', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });

    // Flatten department name to 'dept_name' to match previous structure
    const mapped = (data || []).map((c: any) => ({
      ...c,
      dept_name: c.departments?.name
    }));

    res.json(mapped);
  });

  app.get('/api/complaints', authenticateToken, async (req: any, res) => {
    let query = supabase
      .from('complaints')
      .select(`
        *,
        users:citizen_id(name),
        departments:department_id(name)
      `)
      .order('created_at', { ascending: false });

    if (req.user.role === 'DEPT_ADMIN') {
      query = query.eq('department_id', req.user.deptId);
    } else if (req.user.role === 'CITIZEN') {
      query = query.eq('citizen_id', req.user.id);
    }
    // SUPER_ADMIN gets all unfiltered

    const { data, error } = await query;
    if (error) return res.status(500).json({ error: error.message });

    const mapped = (data || []).map((c: any) => ({
      ...c,
      citizen_name: c.users?.name,
      dept_name: c.departments?.name
    }));
    res.json(mapped);
  });

  app.get('/api/complaints/:id', authenticateToken, async (req: any, res) => {
    const { data: complaint, error } = await supabase
      .from('complaints')
      .select(`
        *,
        users:citizen_id(name),
        departments:department_id(name)
      `)
      .eq('id', req.params.id)
      .single();

    if (error || !complaint) return res.sendStatus(404);

    // Access control
    if (req.user.role === 'CITIZEN' && complaint.citizen_id !== req.user.id) {
      return res.sendStatus(403);
    }
    if (req.user.role === 'DEPT_ADMIN' && complaint.department_id !== req.user.deptId) {
      return res.sendStatus(403);
    }

    const mapped = {
      ...complaint,
      citizen_name: complaint.users?.name,
      dept_name: complaint.departments?.name
    };
    res.json(mapped);
  });

  app.post('/api/complaints', authenticateToken, async (req: any, res) => {
    const { department_id, category, description, latitude, longitude, image_url } = req.body;
    const { data, error } = await supabase
      .from('complaints')
      .insert([{
        citizen_id: req.user.id,
        department_id,
        category,
        description,
        latitude,
        longitude,
        image_url
      }])
      .select()
      .single();

    if (error) {
      console.error(error);
      return res.status(500).json({ error: 'Failed to create complaint' });
    }
    res.status(201).json({ id: data.id });
  });

  app.patch('/api/complaints/:id', authenticateToken, async (req: any, res) => {
    const { status, resolution_notes } = req.body;
    if (req.user.role === 'CITIZEN') return res.sendStatus(403);

    const { error } = await supabase
      .from('complaints')
      .update({ status, resolution_notes })
      .eq('id', req.params.id);

    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true });
  });

  // Alerts
  app.get('/api/alerts', async (req, res) => {
    const { data, error } = await supabase
      .from('alerts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
  });

  app.post('/api/alerts', authenticateToken, async (req: any, res) => {
    if (req.user.role !== 'SUPER_ADMIN') return res.sendStatus(403);
    const { title, message, type } = req.body;
    const { error } = await supabase
      .from('alerts')
      .insert([{ title, message, type }]);

    if (error) return res.status(500).json({ error: error.message });
    res.status(201).json({ success: true });
  });

  // Jobs
  app.get('/api/jobs', async (req, res) => {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    res.json(data || []);
  });

  app.post('/api/jobs', authenticateToken, async (req: any, res) => {
    if (req.user.role !== 'SUPER_ADMIN') return res.sendStatus(403);
    const { title, department, description, deadline } = req.body;
    const { error } = await supabase
      .from('jobs')
      .insert([{ title, department, description, deadline }]);
    if (error) return res.status(500).json({ error: error.message });
    res.status(201).json({ success: true });
  });

  // Job Applications
  app.post('/api/jobs/:id/apply', authenticateToken, async (req: any, res) => {
    if (req.user.role !== 'CITIZEN') return res.status(403).json({ error: 'Only citizens can apply' });
    const { resume_url } = req.body;
    if (!resume_url) return res.status(400).json({ error: 'Resume URL is required' });
    const { data, error } = await supabase.from('job_applications')
      .insert([{ job_id: req.params.id, citizen_id: req.user.id, resume_url }])
      .select().single();
    if (error) {
      if (error.code === '23505') return res.status(400).json({ error: 'You have already applied for this job' });
      return res.status(500).json({ error: error.message });
    }
    res.status(201).json({ id: data.id });
  });

  app.get('/api/jobs/:id/application', authenticateToken, async (req: any, res) => {
    const { data } = await supabase.from('job_applications')
      .select('id, status, applied_at').eq('job_id', req.params.id).eq('citizen_id', req.user.id).single();
    res.json(data || null);
  });

  app.get('/api/jobs/applications/mine', authenticateToken, async (req: any, res) => {
    const { data } = await supabase.from('job_applications')
      .select('job_id, status').eq('citizen_id', req.user.id);
    res.json(data || []);
  });

  // Departments
  app.get('/api/departments', async (req, res) => {
    const { data, error } = await supabase.from('departments').select('*');
    if (error) return res.status(500).json({ error: error.message });
    res.json(data || []);
  });

  // Users (Super Admin)
  app.get('/api/users', authenticateToken, async (req: any, res) => {
    if (req.user.role !== 'SUPER_ADMIN') return res.sendStatus(403);
    const { data, error } = await supabase
      .from('users')
      .select(`
        id, name, email, role,
        departments:department_id(name)
      `)
      .order('id', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });

    const mapped = (data || []).map((u: any) => ({
      ...u,
      dept_name: u.departments?.name
    }));
    res.json(mapped);
  });

  app.post('/api/users', authenticateToken, async (req: any, res) => {
    if (req.user.role !== 'SUPER_ADMIN') return res.sendStatus(403);
    const { name, email, password, role, department_id } = req.body;

    try {
      const hashedPassword = bcrypt.hashSync(password, 10);
      const { data, error } = await supabase
        .from('users')
        .insert([{
          name,
          email,
          password: hashedPassword,
          role,
          department_id: department_id || null
        }])
        .select()
        .single();

      if (error) throw error;
      res.status(201).json({ id: data.id });
    } catch (e: any) {
      console.error(e);
      res.status(400).json({ error: 'Failed to create user. Email may already exist or department invalid.' });
    }
  });

  app.delete('/api/users/:id', authenticateToken, async (req: any, res) => {
    if (req.user.role !== 'SUPER_ADMIN') return res.sendStatus(403);

    const targetUserId = parseInt(req.params.id);
    if (targetUserId === req.user.id) {
      return res.status(400).json({ error: 'Cannot delete yourself' });
    }

    // Note: If you set ON DELETE CASCADE on your complaints table for citizen_id
    // you wouldn't need to manually delete complaints here. We'll do both just in case.
    await supabase.from('complaints').delete().eq('citizen_id', targetUserId);
    const { error } = await supabase.from('users').delete().eq('id', targetUserId);

    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true });
  });

  // Analytics (Super Admin)
  app.get('/api/analytics', authenticateToken, async (req: any, res) => {
    if (req.user.role !== 'SUPER_ADMIN') return res.sendStatus(403);

    try {
      // Supabase JS doesn't have a single call for complex groupbys easily,
      // so we have alternatives: RPC functions or doing group counts via code.
      // Since data sizes are small, let's pull what we need or do parallel count queries.

      const { count: totalComplaints } = await supabase
        .from('complaints')
        .select('*', { count: 'exact', head: true });

      // Fetch all complaints to group by status & dept locally (viable for small datasets)
      // For large datasets, use a Supabase Database Function (RPC) instead.
      const { data: allComplaints } = await supabase
        .from('complaints')
        .select('status, department_id, departments(name)');

      const byStatus: Record<string, number> = {};
      const byDept: Record<string, number> = {};

      if (allComplaints) {
        allComplaints.forEach((c: any) => {
          byStatus[c.status] = (byStatus[c.status] || 0) + 1;
          const deptName = c.departments?.name || 'Unknown';
          byDept[deptName] = (byDept[deptName] || 0) + 1;
        });
      }

      const statusArr = Object.entries(byStatus).map(([status, count]) => ({ status, count }));
      const deptArr = Object.entries(byDept).map(([name, count]) => ({ name, count }));

      res.json({
        totalComplaints: { count: totalComplaints || 0 },
        byStatus: statusArr,
        byDept: deptArr
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
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
