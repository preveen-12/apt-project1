import { useState } from 'react';

export default function UrlChecker() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 1. Grab the base URL from your frontend .env file
  const API_BASE = import.meta.env.VITE_API_URL;

  const checkUrl = async () => {
    if (!url) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // 2. Use backticks (`) and ${API_BASE} to build the URL
      const response = await fetch(`${API_BASE}/api/url/check`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          url: url,
          userId: localStorage.getItem('userId') 
        })
      });

      if (!response.ok) throw new Error('Analysis failed');
      const data = await response.json();

      setResult({
        safeSignals: data.stats.harmless + (data.stats.undetected || 0),
        maliciousSignals: data.stats.malicious + data.stats.suspicious,
        isAptDetected: data.stats.malicious > 0,
        details: data.results || {},
        ip: data.network.ip,
        location: `${data.network.city || "Unknown City"}, ${data.network.country || "Unknown Country"}`,
        isp: data.network.isp,
        flag: data.network.countryCode ? `https://flagcdn.com/w40/${data.network.countryCode.toLowerCase()}.png` : null
      });
    } catch (err) {
      setError("Connection Error: Backend unreachable or scan timed out.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in duration-700 pb-20">
      <h2 className="text-3xl font-black mb-2">Live URL Intelligence</h2>
      <p className="text-slate-500 mb-8 font-mono text-xs uppercase tracking-widest">APT-Project Security Module</p>

      <div className="p-8 rounded-3xl border border-purple-500/20 shadow-2xl backdrop-blur-md bg-slate-900/40">
        <div className="flex gap-4 mb-6">
          <input 
            type="text" 
            placeholder="Enter URL (e.g., google.com)"
            className="flex-1 bg-black/40 border border-purple-500/30 rounded-xl p-4 focus:outline-none focus:border-purple-500 font-mono text-sm"
            style={{ color: 'var(--app-text)' }}
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <button 
            onClick={checkUrl}
            disabled={loading}
            className="bg-purple-600 px-8 py-4 rounded-xl font-bold hover:bg-purple-500 transition-all disabled:opacity-50 shadow-[0_0_20px_rgba(147,51,234,0.3)] text-white"
          >
            {loading ? "Analyzing..." : "Analyze Link"}
          </button>
        </div>

        {error && <div className="p-4 bg-red-900/20 border border-red-500/50 rounded-xl text-red-400 text-xs font-mono mb-6">⚠️ {error}</div>}

        {result && (
          <div className="space-y-8 animate-in zoom-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-950/80 p-5 rounded-2xl border border-purple-500/10">
                <p className="text-[10px] uppercase text-slate-500 font-mono mb-1">Target IP</p>
                <p className="text-purple-400 font-mono font-bold text-sm truncate">{result.ip}</p>
              </div>
              <div className="bg-slate-950/80 p-5 rounded-2xl border border-purple-500/10">
                <p className="text-[10px] uppercase text-slate-500 font-mono mb-1">Location</p>
                <div className="flex items-center gap-2">
                  {result.flag && <img src={result.flag} alt="flag" className="w-5 h-3 object-cover rounded-sm" />}
                  <p className="text-purple-400 font-mono font-bold text-sm">{result.location}</p>
                </div>
              </div>
              <div className="bg-slate-950/80 p-5 rounded-2xl border border-purple-500/10">
                <p className="text-[10px] uppercase text-slate-500 font-mono mb-1">Provider (ISP)</p>
                <p className="text-purple-400 font-mono font-bold text-sm truncate">{result.isp}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="bg-slate-950 p-6 rounded-2xl border border-green-500/20 text-center">
                <p className="text-green-500 text-4xl font-black">{result.safeSignals}</p>
                <p className="text-[10px] uppercase text-slate-500 mt-2 tracking-widest text-xs">Safe Engines</p>
              </div>
              <div className="bg-slate-950 p-6 rounded-2xl border border-red-500/20 text-center">
                <p className="text-red-500 text-4xl font-black">{result.maliciousSignals}</p>
                <p className="text-[10px] uppercase text-slate-500 mt-2 tracking-widest text-xs">Malicious Engines</p>
              </div>
            </div>

            {result.isAptDetected && (
              <div className="bg-red-600 p-4 rounded-xl text-center font-bold animate-pulse uppercase tracking-widest text-sm shadow-xl border-2 border-red-400 text-white">
                Critical Threat: APT Signature Detected
              </div>
            )}

            <div className="mt-10">
              <h3 className="text-sm font-mono uppercase text-slate-500 mb-4 tracking-widest border-b border-white/5 pb-2">Forensic Breakdown</h3>
              <div className="bg-slate-950/50 rounded-2xl border border-white/5 overflow-hidden">
                <div className="max-h-80 overflow-y-auto">
                  <table className="w-full text-left text-[11px] font-mono">
                    <thead className="bg-white/5 text-slate-400 sticky top-0 backdrop-blur-md">
                      <tr><th className="p-4">Vendor</th><th className="p-4">Category</th><th className="p-4">Result</th></tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {Object.entries(result.details).map(([engine, data]) => (
                        <tr key={engine} className="hover:bg-white/5 transition-colors">
                          <td className="p-4 font-bold" style={{ color: 'var(--app-text)' }}>{engine}</td>
                          <td className="p-4">
                            <span className={`px-2 py-1 rounded text-[9px] uppercase ${data.category === 'malicious' ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                              {data.category}
                            </span>
                          </td>
                          <td className={`p-4 ${data.category === 'malicious' ? 'text-red-400 font-bold' : 'text-slate-500'}`}>
                            {data.result || 'Clean'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}