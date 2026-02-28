import { useState, useEffect } from 'react';
import axios from 'axios';

export default function History() {
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Grab the base URL from your frontend .env file
  const API_BASE = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const userId = localStorage.getItem('userId');
        
        // 2. Use the dynamic API_BASE variable in the axios call
        const res = await axios.get(`${API_BASE}/api/auth/history/${userId}`);
        setScans(res.data);
      } catch (err) {
        console.error("Failed to fetch scan history", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [API_BASE]); // Added API_BASE to dependency array for safety

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in duration-700 pb-20">
      <h2 className="text-3xl font-black mb-2">Scan Archives</h2>
      <p className="text-slate-500 mb-8 font-mono text-xs uppercase tracking-widest">Forensic Activity Logs</p>

      <div className="bg-slate-950/50 rounded-2xl border border-white/5 overflow-hidden shadow-2xl backdrop-blur-md">
        {loading ? (
          <p className="p-10 text-center text-slate-500 animate-pulse font-mono">RETRIEVING ENCRYPTED LOGS...</p>
        ) : scans.length === 0 ? (
          <p className="p-10 text-center text-slate-500 font-mono text-sm">NO PREVIOUS SCAN RECORDS DETECTED</p>
        ) : (
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-purple-900/20 text-purple-400">
              <tr>
                <th className="p-5">THREAT TYPE</th>
                <th className="p-5">TARGET IDENTIFIER</th>
                <th className="p-5">RISK ASSESSMENT</th>
                <th className="p-5">TIMESTAMP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {scans.map((scan, index) => (
                <tr key={index} className="hover:bg-white/5 transition-colors group">
                  <td className="p-5">
                    <span className={`px-2 py-1 rounded-sm uppercase text-[9px] font-bold ${scan.type === 'url' ? 'bg-blue-500/10 text-blue-400' : 'bg-orange-500/10 text-orange-400'}`}>
                      {scan.type}
                    </span>
                  </td>
                  <td className="p-5 font-bold truncate max-w-62.5">{scan.target}</td>
                  <td className="p-5">
                    <span className={scan.results?.malicious > 0 ? "text-red-500 font-black" : "text-green-500 font-bold"}>
                      {scan.results?.malicious > 0 ? `⚠️ CRITICAL: ${scan.results.malicious} THREATS` : "✅ VERIFIED CLEAN"}
                    </span>
                  </td>
                  <td className="p-5 opacity-60">{new Date(scan.date).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}