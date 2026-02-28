import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const navigate = useNavigate();

    return (
        <div style={styles.page}>
            <div style={styles.header}>
                // Dashboard.jsx
<h1 style={{ 
  fontSize: '3.5rem', 
  fontWeight: '900', 
  color: 'var(--app-text)', // FIXED: Flips color automatically
  marginBottom: '10px' 
}}>
  Security Command Center
</h1>
                <p style={styles.subtitle}>ADVANCED PERSISTENT THREAT MONITORING</p>
                <div style={styles.badge}>v2.0-STABLE</div>
            </div>

            {/* LIVE FEED TERMINAL */}
            <div style={styles.terminal}>
                <div style={styles.terminalHeader}>
                    <div style={{...styles.dot, background: '#ff5f56'}}></div>
                    <div style={{...styles.dot, background: '#ffbd2e'}}></div>
                    <div style={{...styles.dot, background: '#27c93f'}}></div>
                    <span style={styles.terminalTitle}>SYSTEM LIVE-FEED</span>
                </div>
                <div style={styles.terminalContent}>
                    <div style={{ color: '#60a5fa' }}>[8:45:19 PM] [INFO] Geo-Location database updated</div>
                    <div style={{ color: '#facc15' }}>[8:45:19 PM] [WARN] Suspicious packet detected from 192.168.1.45</div>
                    <div style={{ color: '#a855f7' }}>[8:45:19 PM] [INFO] Heuristic engine running background checks...</div>
                    <div style={{ color: '#f87171' }}>[8:45:19 PM] [CRITICAL] Blocked unauthorized access attempt</div>
                    <div style={{ color: '#fff', marginTop: '10px' }}>_ SYSTEM LISTENING...</div>
                </div>
            </div>

            {/* BIG NAVIGATION BOXES */}
            <div style={styles.grid}>
                <div style={styles.card} onClick={() => navigate('/url-checker')}>
                    <h3 style={styles.cardTitle}>URL Intelligence</h3>
                    <p style={styles.cardDesc}>Analyze links for phishing, malware, and APT signatures.</p>
                    <div style={styles.cardFooter}>LAUNCH MODULE →</div>
                </div>

                <div style={styles.card} onClick={() => navigate('/file-checker')}>
                    <h3 style={styles.cardTitle}>Binary Analysis</h3>
                    <p style={styles.cardDesc}>Deep scan suspicious files and executable binaries.</p>
                    <div style={styles.cardFooter}>LAUNCH MODULE →</div>
                </div>
            </div>
        </div>
    );
};

const styles = {
    page: { padding: '40px', color: '#fff' },
    header: { position: 'relative', marginBottom: '40px' },
    title: { fontSize: '2.8rem', fontWeight: '800', margin: 0 },
    subtitle: { color: '#6b7280', letterSpacing: '3px', fontSize: '0.85rem' },
    badge: { position: 'absolute', right: 0, top: '10px', background: 'rgba(168, 85, 247, 0.1)', color: '#a855f7', padding: '5px 15px', borderRadius: '20px', border: '1px solid #a855f7', fontSize: '0.7rem' },
    terminal: { background: '#000', borderRadius: '15px', border: '1px solid #1e1e30', overflow: 'hidden', marginBottom: '40px' },
    terminalHeader: { background: '#111', padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '8px' },
    dot: { width: '10px', height: '10px', borderRadius: '50%' },
    terminalTitle: { color: '#4b5563', fontSize: '0.7rem', fontWeight: 'bold', marginLeft: '10px' },
    terminalContent: { padding: '25px', fontFamily: 'monospace', fontSize: '0.9rem', lineHeight: '1.6', height: '180px' },
    grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px' },
    card: { background: 'linear-gradient(145deg, #0f0f1a 0%, #07070c 100%)', padding: '40px', borderRadius: '24px', border: '1px solid #1e1e30', cursor: 'pointer' },
    cardTitle: { fontSize: '1.8rem', marginBottom: '15px' },
    cardDesc: { color: '#9ca3af', marginBottom: '30px' },
    cardFooter: { color: '#a855f7', fontWeight: 'bold', fontSize: '0.8rem' }
};

export default Dashboard;