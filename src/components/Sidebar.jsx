import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = ({ isAuthenticated, setIsAuthenticated }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        localStorage.clear();
        setIsAuthenticated(false);
        navigate('/login');
    };

    const menuItems = [
        { name: 'DASHBOARD', path: '/', icon: '🛡️' },
        { name: 'URL CHECKER', path: '/url-checker', icon: '🌐' },
        { name: 'FILE CHECKER', path: '/file-checker', icon: '📁' },
    ];

    if (isAuthenticated) {
        menuItems.push({ name: 'SCAN HISTORY', path: '/history', icon: '📜' });
    }

    return (
        <div style={styles.sidebar}>
            <h2 style={styles.logo} onClick={() => navigate('/')}>APT-PROJECT</h2>
            
            <div style={styles.menu}>
                {menuItems.map((item) => (
                    <div 
                        key={item.name}
                        onClick={() => navigate(item.path)}
                        style={{
                            ...styles.navItem,
                            // Highlighting uses the brand purple, but default text uses theme variable
                            color: location.pathname === item.path ? 'var(--brand-purple)' : 'var(--app-text)',
                            borderLeft: location.pathname === item.path ? '3px solid var(--brand-purple)' : '3px solid transparent'
                        }}
                    >
                        <span style={{ marginRight: '10px' }}>{item.icon}</span>
                        {item.name}
                    </div>
                ))}
            </div>
            
            <div style={styles.authSection}>
                {!isAuthenticated ? (
                    <div style={styles.authButtonGroup}>
                        <button onClick={() => navigate('/login')} style={styles.loginBtn}>LOGIN</button>
                        <button onClick={() => navigate('/register')} style={styles.registerBtn}>REGISTER</button>
                    </div>
                ) : (
                    <div style={styles.userSection}>
                        <p style={styles.username}>User: {localStorage.getItem('username')}</p>
                        <button onClick={handleLogout} style={styles.logoutBtn}>LOGOUT SESSION</button>
                    </div>
                )}
            </div>
        </div>
    );
};

const styles = {
    sidebar: { 
        width: '260px', 
        background: 'var(--app-card)', 
        borderRight: '1px solid var(--app-border)', 
        display: 'flex', 
        flexDirection: 'column', 
        padding: '40px 20px', 
        height: '100vh', 
        position: 'fixed',
        left: 0,
        top: 0,
        zIndex: 100,
        transition: 'background 0.3s ease, border 0.3s ease'
    },
    logo: { 
        color: 'var(--brand-purple)', 
        fontSize: '1.5rem', 
        fontWeight: 'bold', 
        marginBottom: '50px', 
        cursor: 'pointer', 
        letterSpacing: '2px',
        textAlign: 'center'
    },
    menu: { flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' },
    navItem: { 
        padding: '15px 20px', 
        cursor: 'pointer', 
        fontSize: '0.8rem', 
        fontWeight: 'bold', 
        letterSpacing: '1px', 
        transition: '0.3s', 
        display: 'flex', 
        alignItems: 'center'
    },
    authSection: { 
        marginTop: 'auto', 
        padding: '20px 0', 
        borderTop: '1px solid var(--app-border)' 
    },
    authButtonGroup: { display: 'flex', flexDirection: 'column', gap: '10px' },
    loginBtn: { 
        width: '100%', 
        padding: '12px', 
        background: 'var(--brand-purple)', 
        border: 'none', 
        color: '#fff', 
        borderRadius: '8px', 
        cursor: 'pointer', 
        fontWeight: 'bold', 
        fontSize: '0.75rem' 
    },
    registerBtn: { 
        width: '100%', 
        padding: '12px', 
        background: 'transparent', 
        border: '1px solid var(--brand-purple)', 
        color: 'var(--brand-purple)', 
        borderRadius: '8px', 
        cursor: 'pointer', 
        fontWeight: 'bold', 
        fontSize: '0.75rem' 
    },
    userSection: { textAlign: 'center' },
    username: { 
        color: 'var(--app-text)', 
        opacity: 0.6, 
        fontSize: '0.7rem', 
        marginBottom: '10px', 
        fontFamily: 'monospace' 
    },
    logoutBtn: { 
        width: '100%', 
        padding: '10px', 
        background: 'transparent', 
        border: '1px solid #ef4444', 
        color: '#ef4444', 
        borderRadius: '8px', 
        cursor: 'pointer', 
        fontWeight: 'bold', 
        fontSize: '0.7rem' 
    }
};

export default Sidebar;