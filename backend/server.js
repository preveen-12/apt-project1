import 'dotenv/config'; // Add this at line 1
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.js';
import urlRoutes from './routes/url.js';
import fileRoutes from './routes/file.js';

const app = express();

// 1. Payload Limits (Fixed the 413 "Too Large" error)
app.use(cors());
app.use(express.json({ limit: '200mb' }));
app.use(express.urlencoded({ limit: '200mb', extended: true }));

// 2. Database Connection
// This tells the code: "Go find MONGO_URI inside the secret .env file"
const mongoURI = process.env.MONGO_URI; 

// Now we use that variable to connect
mongoose.connect(mongoURI)
    .then(() => console.log("✅ CLOUD DATABASE CONNECTED"))
    .catch(err => console.error("❌ DB ERROR:", err.message));

// 3. Route Dispatcher
app.use('/api/auth', authRoutes);
app.use('/api/url', urlRoutes);
app.use('/api/file', fileRoutes);

// The "||" means "OR"
const PORT = process.env.PORT || 5000; 

app.listen(PORT, () => console.log(`🚀 PROXY SERVER ONLINE ON PORT ${PORT}`));