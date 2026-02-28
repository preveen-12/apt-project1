import express from 'express';
import axios from 'axios';
import dns from 'dns';
import User from '../models/User.js'; // Ensure path is correct

const router = express.Router();
const API_KEY = '445cf8e8ccb9e1f94c645e6634d0cbc45f562e3a21235b542f61bb456c8c4aef';

router.post('/check', async (req, res) => {
    try {
        let { url, userId } = req.body;
        console.log(`[SYSTEM] Scanning: ${url}`);
        if (!url.startsWith('http')) url = 'https://' + url;

        const domain = new URL(url).hostname;
        const dnsInfo = await new Promise((resolve, reject) => {
            dns.lookup(domain, (err, address) => err ? reject(err) : resolve(address));
        });

        const geoRes = await axios.get(`http://ip-api.com/json/${dnsInfo}?fields=status,message,country,countryCode,regionName,city,zip,isp,org,as,query`);
        
        const submit = await axios.post('https://www.virustotal.com/api/v3/urls', 
            new URLSearchParams({ url }), { headers: { 'x-apikey': API_KEY } });

        const analysisId = submit.data.data.id;
        let status = 'queued';
        let reportData = null;

        while (status !== 'completed') {
            await new Promise(r => setTimeout(r, 2000));
            const report = await axios.get(`https://www.virustotal.com/api/v3/analyses/${analysisId}`, { headers: { 'x-apikey': API_KEY } });
            status = report.data.data.attributes.status;
            if (status === 'completed') reportData = report.data.data.attributes;
        }

        // --- NEW: SAVE TO DATABASE ---
        if (userId && userId !== "null") {
            console.log(`[SYSTEM] Archiving URL scan for user: ${userId}`);
            await User.findByIdAndUpdate(userId, {
                $push: { 
                    scanHistory: { 
                        type: 'url', 
                        target: domain, 
                        results: reportData.stats,
                        date: new Date() 
                    } 
                }
            });
        }

        res.json({
            stats: reportData.stats,
            results: reportData.results,
            network: {
                ip: dnsInfo,
                country: geoRes.data.country,
                city: geoRes.data.city,
                region: geoRes.data.regionName,
                isp: geoRes.data.isp,
                countryCode: geoRes.data.countryCode
            }
        });
    } catch (err) { 
        console.error("URL MODULE ERROR:", err.message);
        res.status(500).json({ error: err.message }); 
    }
});

export default router;