import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import UrlChecker from './pages/UrlChecker';
import FileChecker from './pages/FileChecker';
import Register from './pages/Register';
import Login from './pages/Login';
import History from './pages/History';

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
      <div style={{ 
        display: 'flex', 
        gap: '8px', 
        background: 'rgba(255,255,255,0.05)', 
        padding: '6px 12px', 
        borderRadius: '30px',
        border: '1px solid var(--app-border)' 
      }}>
        {['dark', 'light', 'cyber'].map(t => (
          <button 
            key={t}
            onClick={() => setTheme(t)}
            style={{
              width: '14px', height: '14px', borderRadius: '50%', 
              border: theme === t ? '2px solid var(--brand-purple)' : 'none',
              background: t === 'dark' ? '#050509' : t === 'light' ? '#fff' : '#00f5d4', 
              cursor: 'pointer',
              transition: '0.2s'
            }}
          />
        ))}
      </div>
      <span style={{ 
        border: '1px solid var(--brand-purple)', color: 'var(--brand-purple)', 
        padding: '3px 15px', borderRadius: '20px', fontSize: '11px', fontWeight: 'black' 
      }}>
        v2.0-STABLE
      </span>
    </div>
  );
};

function AppContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) setIsAuthenticated(true);
  }, []);

  return (
    <div style={{ 
      display: 'flex', 
      minHeight: '100vh', 
      background: 'var(--app-bg)', // Adapts to background choice
      transition: '0.4s ease-in-out' 
    }}>
      <Sidebar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
      
      <div style={{ flex: 1, padding: '40px', marginLeft: '260px', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '40px' }}>
          <ThemeToggle />
        </div>

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/url-checker" element={<UrlChecker />} />
          <Route path="/file-checker" element={<FileChecker />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/history" element={isAuthenticated ? <History /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
}

export default App;