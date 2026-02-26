import express from 'express';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'smart-city-secret-key-2026';
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

// Memory storage for Vercel (no persistent filesystem)
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

const app = express();
app.use(express.json());

// File upload endpoint — uploads to Supabase Storage
app.post('/api/upload', async (req: any, res) => {
    upload.single('image')(req, res as any, async (err) => {
        if (err) return res.status(400).json({ error: err.message });
        if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

        const ext = path.extname(req.file.originalname) || '.pdf';
        const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;

        const { error: uploadError } = await supabase.storage
            .from('resumes')
            .upload(filename, req.file.buffer, {
                contentType: req.file.mimetype,
                upsert: false,
            });

        if (uploadError) return res.status(500).json({ error: uploadError.message });

        const { data: publicUrlData } = supabase.storage.from('resumes').getPublicUrl(filename);
        res.json({ url: publicUrlData.publicUrl });
    });
});

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

// --- OTP Helpers ---
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

const sendEmailOTP = async (email: string, code: string) => {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) throw new Error('Email service not configured');
    const { Resend } = await import('resend');
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
        from: 'CivicPulse <onboarding@resend.dev>',
        to: email,
        subject: 'Your CivicPulse Email Verification Code',
        html: `<div style="font-family:sans-serif;max-width:480px;margin:auto;padding:32px;background:#f8fafc;border-radius:12px">
          <h2 style="color:#3182CE">CivicPulse</h2>
          <p>Your email verification code is:</p>
          <h1 style="font-size:40px;letter-spacing:8px;color:#1a202c">${code}</h1>
          <p style="color:#718096">This code expires in 10 minutes.</p>
        </div>`,
    });
    if (error) throw new Error(error.message);
};

const sendMobileOTP = async (mobile: string, code: string) => {
    const apiKey = process.env.FAST2SMS_API_KEY;
    if (!apiKey) throw new Error('SMS service not configured');
    const resp = await fetch('https://www.fast2sms.com/dev/bulkV2', {
        method: 'POST',
        headers: { authorization: apiKey, 'Content-Type': 'application/json' },
        body: JSON.stringify({ route: 'otp', variables_values: code, numbers: mobile }),
    });
    const data = await resp.json();
    console.error('[Fast2SMS response]', JSON.stringify(data));
    if (!data.return) {
        // data.message is an array of error strings from Fast2SMS
        const reason = Array.isArray(data.message) ? data.message.join(', ') : (data.message || 'Unknown error');
        throw new Error(reason);
    }
};

// OTP Endpoints
app.post('/api/auth/send-email-otp', async (req, res) => {
    const { email } = req.body;
    const code = generateOTP();
    const expires_at = new Date(Date.now() + 10 * 60 * 1000).toISOString();
    await supabase.from('otp_store').delete().eq('identifier', email).eq('type', 'email');
    await supabase.from('otp_store').insert([{ identifier: email, code, type: 'email', expires_at }]);
    try { await sendEmailOTP(email, code); res.json({ success: true }); }
    catch (e: any) { res.status(500).json({ error: 'Failed to send email: ' + e.message }); }
});

app.post('/api/auth/verify-email-otp', async (req, res) => {
    const { email, code } = req.body;
    const { data } = await supabase.from('otp_store')
        .select('*').eq('identifier', email).eq('type', 'email').eq('code', code).single();
    if (!data) return res.status(400).json({ error: 'Invalid OTP' });
    if (new Date(data.expires_at) < new Date()) return res.status(400).json({ error: 'OTP expired' });
    await supabase.from('otp_store').delete().eq('identifier', email).eq('type', 'email');
    res.json({ success: true });
});

app.post('/api/auth/send-mobile-otp', async (req, res) => {
    const { mobile } = req.body;
    const code = generateOTP();
    const expires_at = new Date(Date.now() + 10 * 60 * 1000).toISOString();
    await supabase.from('otp_store').delete().eq('identifier', mobile).eq('type', 'mobile');
    await supabase.from('otp_store').insert([{ identifier: mobile, code, type: 'mobile', expires_at }]);
    try { await sendMobileOTP(mobile, code); res.json({ success: true }); }
    catch (e: any) { res.status(500).json({ error: 'Failed to send SMS: ' + e.message }); }
});

app.post('/api/auth/verify-mobile-otp', async (req, res) => {
    const { mobile, code } = req.body;
    const { data } = await supabase.from('otp_store')
        .select('*').eq('identifier', mobile).eq('type', 'mobile').eq('code', code).single();
    if (!data) return res.status(400).json({ error: 'Invalid OTP' });
    if (new Date(data.expires_at) < new Date()) return res.status(400).json({ error: 'OTP expired' });
    await supabase.from('otp_store').delete().eq('identifier', mobile).eq('type', 'mobile');
    res.json({ success: true });
});

// Auth
app.post('/api/auth/register', async (req, res) => {
    const { name, email, mobile, password } = req.body;
    try {
        const hashedPassword = bcrypt.hashSync(password, 10);
        const { data, error } = await supabase
            .from('users')
            .insert([{ name, email, mobile, password: hashedPassword, role: 'CITIZEN' }])
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
