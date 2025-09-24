import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import http from 'http';
import { Server } from 'socket.io';
import communityRoutes from './routes/community.js';
import { authRequired, requireRole } from './middleware/auth.js';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: 'http://localhost:5173', credentials: true } });
app.set('io', io);
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));

const mongoUri = 'mongodb+srv://database:8vFm0c7DVItarkCv@cluster0.kdfe9pb.mongodb.net/codeburry?retryWrites=true&w=majority&appName=Cluster0';
const jwtSecret = process.env.JWT_SECRET || 'dev-secret-change-me';

await mongoose.connect(mongoUri);

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, index: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
}, { timestamps: true });

userSchema.methods.toSafeJSON = function() {
  const { _id, name, email, role, createdAt, updatedAt } = this.toObject();
  return { id: _id.toString(), name, email, role, createdAt, updatedAt };
};

const User = mongoose.model('User', userSchema);

function signToken(payload) {
  return jwt.sign(payload, jwtSecret, { expiresIn: '7d' });
}


app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'All fields are required' });
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(409).json({ message: 'Email already in use' });
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const role = email.toLowerCase().startsWith('admin@') ? 'admin' : 'user';
    const user = await User.create({ name, email: email.toLowerCase(), passwordHash, role });
    const token = signToken({ id: user._id.toString(), email: user.email, name: user.name, role: user.role });
    res.cookie('token', token, { httpOnly: true, sameSite: 'lax', secure: false, maxAge: 7 * 24 * 60 * 60 * 1000 });
    return res.status(201).json({ user: user.toSafeJSON() });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: 'Registration failed' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(401).json({ message: 'Invalid credentials' });
    const token = signToken({ id: user._id.toString(), email: user.email, name: user.name, role: user.role });
    res.cookie('token', token, { httpOnly: true, sameSite: 'lax', secure: false, maxAge: 7 * 24 * 60 * 60 * 1000 });
    return res.json({ user: user.toSafeJSON() });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: 'Login failed' });
  }
});

app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out' });
});

app.get('/api/auth/me', authRequired, async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ message: 'Not found' });
  res.json({ user: user.toSafeJSON() });
});

// Admin routes returning real data
app.get('/api/admin/users', authRequired, requireRole('admin'), async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 }).limit(50);
  res.json({ users: users.map(u => u.toSafeJSON()) });
});

app.get('/api/admin/stats', authRequired, requireRole('admin'), async (req, res) => {
  const totalUsers = await User.countDocuments();
  const admins = await User.countDocuments({ role: 'admin' });
  const last7Days = await User.countDocuments({ createdAt: { $gte: new Date(Date.now() - 7*24*60*60*1000) } });
  res.json({ totalUsers, admins, last7Days });
});

app.get('/api/admin/ping', authRequired, requireRole('admin'), (req, res) => {
  res.json({ message: 'pong', role: 'admin' });
});

// Community routes (real-time)
app.use('/api/community', communityRoutes);

const port = process.env.PORT || 4000;
server.listen(port, () => console.log(`API listening on http://localhost:${port}`));
