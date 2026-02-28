import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// Change the first line of your Sidebar component to this:
const Sidebar = ({ isAuthenticated, setIsAuthenticated, isCollapsed, setIsCollapsed }) => {
    // REMOVE this line since it's now coming from props:
    // const [isCollapsed, setIsCollapsed] = useState(false); 
    
    // ... rest of the code remains the same => {
    const navigate = useNavigate();
    const location = useLocation();
    // New state to manage the sidebar toggle

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
        <div style={{
            ...styles.sidebar,
            // Dynamic width based on state
            width: isCollapsed ? '80px' : '260px',
            padding: isCollapsed ? '40px 10px' : '40px 20px'
        }}>
            {/* Hamburger Menu Button */}
            <div 
                onClick={() => setIsCollapsed(!isCollapsed)} 
                style={styles.toggleBtn}
            >
                ☰
            </div>

            <h2 style={{
                ...styles.logo,
                // Hide or shrink logo text when collapsed
                fontSize: isCollapsed ? '0.7rem' : '1.5rem',
                opacity: isCollapsed ? 0.5 : 1
            }} onClick={() => navigate('/')}>
                {isCollapsed ? 'APT' : 'APT-PROJECT'}
            </h2>
            
            <div style={styles.menu}>
                {menuItems.map((item) => (
                    <div 
                        key={item.name}
                        onClick={() => navigate(item.path)}
                        style={{
                            ...styles.navItem,
                            color: location.pathname === item.path ? 'var(--brand-purple)' : 'var(--app-text)',
                            borderLeft: location.pathname === item.path ? '3px solid var(--brand-purple)' : '3px solid transparent',
                            justifyContent: isCollapsed ? 'center' : 'flex-start'
                        }}
                    >
                        <span style={{ fontSize: '1.2rem', marginRight: isCollapsed ? '0' : '10px' }}>{item.icon}</span>
                        {/* Only show text if NOT collapsed */}
                        {!isCollapsed && <span>{item.name}</span>}
                    </div>
                ))}
            </div>
            
            <div style={styles.authSection}>
                {!isAuthenticated ? (
                    <div style={styles.authButtonGroup}>
                        <button onClick={() => navigate('/login')} style={styles.loginBtn}>
                            {isCollapsed ? 'L' : 'LOGIN'}
                        </button>
                        <button onClick={() => navigate('/register')} style={styles.registerBtn}>
                            {isCollapsed ? 'R' : 'REGISTER'}
                        </button>
                    </div>
                ) : (
                    <div style={styles.userSection}>
                        {!isCollapsed && <p style={styles.username}>User: {localStorage.getItem('username')}</p>}
                        <button onClick={handleLogout} style={styles.logoutBtn}>
                            {isCollapsed ? '✖' : 'LOGOUT SESSION'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

const styles = {
    sidebar: { 
        background: 'var(--app-card)', 
        borderRight: '1px solid var(--app-border)', 
        display: 'flex', 
        flexDirection: 'column', 
        height: '100vh', 
        position: 'fixed',
        left: 0,
        top: 0,
        zIndex: 100,
        transition: 'width 0.3s ease, padding 0.3s ease' // Smooth shrinking animation
    },
    // Styles for the 3-line hamburger button
    toggleBtn: {
        position: 'absolute',
        top: '15px',
        right: '15px',
        cursor: 'pointer',
        fontSize: '1.5rem',
        color: 'var(--brand-purple)',
        zIndex: 101,
        padding: '5px'
    },
    logo: { 
        color: 'var(--brand-purple)', 
        fontWeight: 'bold', 
        marginBottom: '50px', 
        cursor: 'pointer', 
        letterSpacing: '2px',
        textAlign: 'center',
        transition: '0.3s'
    },
    menu: { flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' },
    navItem: { 
        padding: '15px 10px', 
        cursor: 'pointer', 
        fontSize: '0.8rem', 
        fontWeight: 'bold', 
        letterSpacing: '1px', 
        transition: '0.3s', 
        display: 'flex', 
        alignItems: 'center',
        overflow: 'hidden' // Prevents text from leaking out during animation
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
        fontFamily: 'monospace',
        whiteSpace: 'nowrap'
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