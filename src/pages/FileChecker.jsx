import { useState } from 'react';

export default function FileChecker() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 1. Grab the base URL from your frontend .env file
  const API_BASE = import.meta.env.VITE_API_URL;

  const checkFile = async () => {
    if (!file) return alert("Please select a binary for analysis.");
    
    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', localStorage.getItem('userId'));

    try {
      // 2. Use the dynamic API_BASE variable here
      const response = await fetch(`${API_BASE}/api/file/check`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Binary analysis failed');
      const data = await response.json();

      setResult({
        safeSignals: data.stats.harmless + (data.stats.undetected || 0),
        maliciousSignals: data.stats.malicious + data.stats.suspicious,
        isAptDetected: data.stats.malicious > 0,
        details: data.results || {},
        fileName: file.name,
        size: (file.size / 1024 / 1024).toFixed(2) + " MB"
      });
    } catch (err) {
      // Updated error message since we increased the server limit to 200MB
      setError("Analysis Failed: Check if backend is running or if the file is corrupted.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in duration-700 pb-20">
      <h2 className="text-3xl font-black mb-2">Binary Integrity Scanner</h2>
      <p className="text-slate-500 mb-8 font-mono text-xs uppercase tracking-widest">APT-Project Static Analysis</p>

      <div className="bg-slate-900/40 p-10 rounded-3xl border border-purple-500/20 shadow-2xl backdrop-blur-md">
        <div className="border-2 border-dashed border-purple-500/30 rounded-2xl p-10 mb-6 text-center cursor-pointer hover:border-purple-500 transition-all bg-black/20">
          <input 
            type="file" 
            id="fileInput" 
            className="hidden" 
            onChange={(e) => setFile(e.target.files[0])} 
          />
          <label htmlFor="fileInput" className="cursor-pointer block">
            <span className="text-5xl block mb-4">📤</span>
            <p className="font-mono text-sm font-bold">
              {file ? file.name : "DRAG & DROP OR CLICK TO UPLOAD BINARY"}
            </p>
            {file && <p className="text-purple-400 text-xs mt-2">Ready for deep heuristic scan</p>}
          </label>
        </div>

        <button 
          onClick={checkFile}
          disabled={loading}
          className="w-full bg-purple-600 py-4 rounded-xl font-bold hover:bg-purple-500 transition-all shadow-[0_0_20px_rgba(147,51,234,0.3)] disabled:opacity-50 text-white"
        >
          {loading ? "EXECUTING HEURISTIC ANALYSIS..." : "EXECUTE FULL SCAN"}
        </button>

        {error && <div className="mt-6 p-4 bg-red-900/20 border border-red-500/50 rounded-xl text-red-400 text-xs font-mono">⚠️ {error}</div>}

        {result && (
          <div className="mt-10 space-y-8 animate-in zoom-in duration-500">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-950/80 p-5 rounded-2xl border border-purple-500/10">
                <p className="text-[10px] uppercase text-slate-500 font-mono mb-1">Target Name</p>
                <p className="text-purple-400 font-mono font-bold text-sm truncate">{result.fileName}</p>
              </div>
              <div className="bg-slate-950/80 p-5 rounded-2xl border border-purple-500/10">
                <p className="text-[10px] uppercase text-slate-500 font-mono mb-1">Total Size</p>
                <p className="text-purple-400 font-mono font-bold text-sm">{result.size}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="bg-slate-950 p-6 rounded-2xl border border-green-500/20 text-center">
                <p className="text-green-500 text-4xl font-black">{result.safeSignals}</p>
                <p className="text-[10px] uppercase text-slate-500 mt-2 tracking-widest text-xs">Safe Signatures</p>
              </div>
              <div className="bg-slate-950 p-6 rounded-2xl border border-red-500/20 text-center">
                <p className="text-red-500 text-4xl font-black">{result.maliciousSignals}</p>
                <p className="text-[10px] uppercase text-slate-500 mt-2 tracking-widest text-xs">Malicious Engines</p>
              </div>
            </div>

            {result.isAptDetected && (
              <div className="bg-red-600 p-4 rounded-xl text-center font-bold animate-pulse uppercase tracking-widest text-sm shadow-xl border-2 border-red-400 text-white">
                CRITICAL THREAT: MALICIOUS PAYLOAD DETECTED
              </div>
            )}

            <div className="mt-10">
              <h3 className="text-sm font-mono uppercase text-slate-500 mb-4 tracking-widest border-b border-white/5 pb-2">AV Vendor Breakdown</h3>
              <div className="bg-slate-950/50 rounded-2xl border border-white/5 overflow-hidden">
                <div className="max-h-80 overflow-y-auto">
                  <table className="w-full text-left text-[11px] font-mono">
                    <thead className="bg-white/5 text-slate-400 sticky top-0 backdrop-blur-md">
                      <tr><th className="p-4">Antivirus Engine</th><th className="p-4">Category</th><th className="p-4">Detection</th></tr>
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
                          <td className={`p-4 ${data.category === 'malicious' ? 'text-red-400 font-bold' : ''}`}>{data.result || 'Clean'}</td>
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