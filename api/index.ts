import express from 'express';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'smart-city-secret-key-2026';
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

const app = express();
app.use(express.json());

// --- Auth Middleware ---
const authenticateToken = async (req: any, res: any, next: any) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, async (err: any, user: any) => {
        if (err) return res.sendStatus(403);
        const { data: dbUser, error } = await supabase
            .from('users')
            .select('id, role, department_id')
            .eq('id', user.id)
            .single();
        if (error || !dbUser) return res.sendStatus(401);
        req.user = { ...user, ...dbUser };
        next();
    });
};

// Auth
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
        res.status(400).json({ error: e.message || 'Email already exists or registration failed' });
    }
});

app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    const { data: user, error } = await supabase
        .from('users').select('*').eq('email', email).single();
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
        .select('id, category, description, status, latitude, longitude, image_url, created_at, departments:department_id(name)')
        .order('created_at', { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    res.json((data || []).map((c: any) => ({ ...c, dept_name: c.departments?.name })));
});

app.get('/api/complaints', authenticateToken, async (req: any, res) => {
    let query = supabase.from('complaints')
        .select('*, users:citizen_id(name), departments:department_id(name)')
        .order('created_at', { ascending: false });
    if (req.user.role === 'DEPT_ADMIN') query = query.eq('department_id', req.user.deptId);
    else if (req.user.role === 'CITIZEN') query = query.eq('citizen_id', req.user.id);
    const { data, error } = await query;
    if (error) return res.status(500).json({ error: error.message });
    res.json((data || []).map((c: any) => ({ ...c, citizen_name: c.users?.name, dept_name: c.departments?.name })));
});

app.get('/api/complaints/:id', authenticateToken, async (req: any, res) => {
    const { data: complaint, error } = await supabase
        .from('complaints').select('*, users:citizen_id(name), departments:department_id(name)')
        .eq('id', req.params.id).single();
    if (error || !complaint) return res.sendStatus(404);
    if (req.user.role === 'CITIZEN' && complaint.citizen_id !== req.user.id) return res.sendStatus(403);
    if (req.user.role === 'DEPT_ADMIN' && complaint.department_id !== req.user.deptId) return res.sendStatus(403);
    res.json({ ...complaint, citizen_name: complaint.users?.name, dept_name: complaint.departments?.name });
});

app.post('/api/complaints', authenticateToken, async (req: any, res) => {
    const { department_id, category, description, latitude, longitude, image_url } = req.body;
    const { data, error } = await supabase.from('complaints')
        .insert([{ citizen_id: req.user.id, department_id, category, description, latitude, longitude, image_url }])
        .select().single();
    if (error) return res.status(500).json({ error: 'Failed to create complaint' });
    res.status(201).json({ id: data.id });
});

app.patch('/api/complaints/:id', authenticateToken, async (req: any, res) => {
    if (req.user.role === 'CITIZEN') return res.sendStatus(403);
    const { status, resolution_notes } = req.body;
    const { error } = await supabase.from('complaints').update({ status, resolution_notes }).eq('id', req.params.id);
    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true });
});

// Alerts
app.get('/api/alerts', async (req, res) => {
    const { data, error } = await supabase.from('alerts').select('*').order('created_at', { ascending: false }).limit(10);
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

app.post('/api/alerts', authenticateToken, async (req: any, res) => {
    if (req.user.role !== 'SUPER_ADMIN') return res.sendStatus(403);
    const { title, message, type } = req.body;
    const { error } = await supabase.from('alerts').insert([{ title, message, type }]);
    if (error) return res.status(500).json({ error: error.message });
    res.status(201).json({ success: true });
});

// Jobs
app.get('/api/jobs', async (req, res) => {
    const { data, error } = await supabase.from('jobs').select('*').order('created_at', { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    res.json(data || []);
});

app.post('/api/jobs', authenticateToken, async (req: any, res) => {
    if (req.user.role !== 'SUPER_ADMIN') return res.sendStatus(403);
    const { title, department, description, deadline } = req.body;
    const { error } = await supabase.from('jobs').insert([{ title, department, description, deadline }]);
    if (error) return res.status(500).json({ error: error.message });
    res.status(201).json({ success: true });
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
    const { data, error } = await supabase.from('users')
        .select('id, name, email, role, departments:department_id(name)').order('id', { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    res.json((data || []).map((u: any) => ({ ...u, dept_name: u.departments?.name })));
});

app.post('/api/users', authenticateToken, async (req: any, res) => {
    if (req.user.role !== 'SUPER_ADMIN') return res.sendStatus(403);
    const { name, email, password, role, department_id } = req.body;
    try {
        const hashedPassword = bcrypt.hashSync(password, 10);
        const { data, error } = await supabase.from('users')
            .insert([{ name, email, password: hashedPassword, role, department_id: department_id || null }])
            .select().single();
        if (error) throw error;
        res.status(201).json({ id: data.id });
    } catch (e: any) {
        res.status(400).json({ error: 'Failed to create user. Email may already exist.' });
    }
});

app.delete('/api/users/:id', authenticateToken, async (req: any, res) => {
    if (req.user.role !== 'SUPER_ADMIN') return res.sendStatus(403);
    const targetId = parseInt(req.params.id);
    if (targetId === req.user.id) return res.status(400).json({ error: 'Cannot delete yourself' });
    await supabase.from('complaints').delete().eq('citizen_id', targetId);
    const { error } = await supabase.from('users').delete().eq('id', targetId);
    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true });
});

// Analytics
app.get('/api/analytics', authenticateToken, async (req: any, res) => {
    if (req.user.role !== 'SUPER_ADMIN') return res.sendStatus(403);
    try {
        const { count: totalComplaints } = await supabase.from('complaints').select('*', { count: 'exact', head: true });
        const { data: allComplaints } = await supabase.from('complaints').select('status, department_id, departments(name)');
        const byStatus: Record<string, number> = {};
        const byDept: Record<string, number> = {};
        (allComplaints || []).forEach((c: any) => {
            byStatus[c.status] = (byStatus[c.status] || 0) + 1;
            const deptName = c.departments?.name || 'Unknown';
            byDept[deptName] = (byDept[deptName] || 0) + 1;
        });
        res.json({
            totalComplaints: { count: totalComplaints || 0 },
            byStatus: Object.entries(byStatus).map(([status, count]) => ({ status, count })),
            byDept: Object.entries(byDept).map(([name, count]) => ({ name, count }))
        });
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
});

export default app;
