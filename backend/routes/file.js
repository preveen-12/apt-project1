import express from 'express';
import multer from 'multer';
import axios from 'axios';
import FormData from 'form-data';
import User from '../models/User.js';

const router = express.Router();
const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: { fileSize: 200 * 1024 * 1024 } // 200MB Local Server Limit
});
// This matches exactly what you typed in your .env file!
const API_KEY = process.env.VT_API_KEY;

router.post('/check', upload.single('file'), async (req, res) => {
    try {
        const { userId } = req.body;
        if (!req.file) return res.status(400).json({ error: "No file provided" });

        const fileSizeMB = req.file.size / (1024 * 1024);
        console.log(`[MODULE-FILE] Starting Analysis: ${req.file.originalname} (${fileSizeMB.toFixed(2)} MB)`);

        let uploadUrl = 'https://www.virustotal.com/api/v3/files';

        // 1. Handle Large Files (>32MB)
        if (fileSizeMB > 32) {
            console.log(`[MODULE-FILE] Large file detected. Requesting high-capacity upload URL...`);
            const urlRes = await axios.get('https://www.virustotal.com/api/v3/files/upload_url', {
                headers: { 'x-apikey': API_KEY }
            });
            uploadUrl = urlRes.data.data;
        }

        const form = new FormData();
        form.append('file', req.file.buffer, { 
            filename: req.file.originalname,
            contentType: req.file.mimetype 
        });

        // 2. Upload to VirusTotal (Dynamic URL)
        const uploadRes = await axios.post(uploadUrl, form, {
            headers: { 
                ...form.getHeaders(), 
                'x-apikey': API_KEY 
            },
            maxContentLength: Infinity,
            maxBodyLength: Infinity
        });

        const analysisId = uploadRes.data.data.id;
        let status = 'queued';
        let reportData = null;

        // 3. Polling loop for results
        while (status !== 'completed') {
            console.log(`[MODULE-FILE] Polling Status: ${status}...`);
            await new Promise(r => setTimeout(r, 15000)); // Increased delay for large binaries
            
            const report = await axios.get(`https://www.virustotal.com/api/v3/analyses/${analysisId}`, {
                headers: { 'x-apikey': API_KEY }
            });
            
            status = report.data.data.attributes.status;
            if (status === 'completed') reportData = report.data.data.attributes;
        }

        // 4. Archive to Database
        if (userId && userId !== "null") {
            await User.findByIdAndUpdate(userId, {
                $push: { scanHistory: { type: 'file', target: req.file.originalname, results: reportData.stats, date: new Date() } }
            });
        }

        res.json({ stats: reportData.stats, results: reportData.results });

    } catch (err) {
        console.error("❌ FILE ERROR:", err.response?.data || err.message);
        res.status(500).json({ error: "Analysis failed. Ensure file is supported and API key is valid." });
    }
});

export default router;