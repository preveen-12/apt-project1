import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import mongoose from 'mongoose';
import User from '../models/User.js';

const router = express.Router();

// 1. Grab secrets from the vault
const JWT_SECRET = process.env.JWT_SECRET;

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // Must be false for port 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false
  }
});

const verificationCodes = new Map();

// A. Send Verification Code
router.post('/send-code', async (req, res) => {
    try {
        const { email } = req.body;
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        verificationCodes.set(email, code);
        await transporter.sendMail({
            // 3. Use the variable for the "from" address
            from: `"APT-PROJECT" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Verification Code",
            text: `Your code is: ${code}`
        });
        res.json({ message: "Code sent!" });
    } catch (err) { 
        console.error("Email Error:", err);
        res.status(500).json({ error: "Email failed" }); 
    }
});

// B. Register
router.post('/register', async (req, res) => {
    try {
        const { name, username, email, password, code } = req.body;
        if (verificationCodes.get(email) !== code) return res.status(400).json({ error: "Invalid code" });
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, username, email, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: "Success" });
    } catch (err) { res.status(400).json({ error: "User exists" }); }
});

// C. Login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user || !(await bcrypt.compare(password, user.password))) return res.status(401).json({ error: "Invalid" });
        
        // 4. Use the secure variable for the token
        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1d' });
        res.json({ token, userId: user._id, username: user.username });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// Fetch specific user scan history
router.get('/history/:userId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) return res.status(404).json({ error: "Access Denied: User Not Found" });
        
        const sortedHistory = user.scanHistory.sort((a, b) => new Date(b.date) - new Date(a.date));
        res.json(sortedHistory);
    } catch (err) {
        res.status(500).json({ error: "Database retrieval failed" });
    }
});

export default router;