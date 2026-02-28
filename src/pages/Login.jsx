import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = ({ setIsAuthenticated }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    // 1. Grab the base URL from your frontend .env file
    const API_BASE = import.meta.env.VITE_API_URL;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // 2. Use the dynamic API_BASE variable here
            const res = await axios.post(`${API_BASE}/api/auth/login`, formData);
            
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('userId', res.data.userId);
            localStorage.setItem('username', res.data.username);
            
            setIsAuthenticated(true);
            alert(`Welcome back, ${res.data.username}!`);
            navigate('/');
        } catch (err) {
            alert(err.response?.data?.error || "Login failed. Check your credentials.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.title}>Welcome Back</h2>
                <form onSubmit={handleLogin} style={styles.form}>
                    <input 
                        style={styles.input} 
                        name="username" 
                        placeholder="Username" 
                        required 
                        onChange={handleChange} 
                    />
                    <input 
                        style={styles.input} 
                        name="password" 
                        type="password" 
                        placeholder="Password" 
                        required 
                        onChange={handleChange} 
                    />
                    <button style={styles.button} type="submit" disabled={loading}>
                        {loading ? "Verifying..." : "Login"}
                    </button>
                </form>
                <div style={styles.footer}>
                    <p>New here? <span style={styles.link} onClick={() => navigate('/register')}>Create Account</span></p>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: { height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#0f0f0f', color: '#fff' },
    card: { background: 'rgba(255, 255, 255, 0.05)', padding: '40px', borderRadius: '15px', backdropFilter: 'blur(10px)', width: '350px', border: '1px solid rgba(255,255,255,0.1)' },
    title: { textAlign: 'center', marginBottom: '20px', color: '#a855f7' },
    form: { display: 'flex', flexDirection: 'column', gap: '15px' },
    input: { padding: '12px', borderRadius: '8px', border: 'none', background: '#262626', color: '#fff' },
    button: { padding: '12px', borderRadius: '8px', border: 'none', background: '#a855f7', color: '#fff', cursor: 'pointer', fontWeight: 'bold' },
    footer: { marginTop: '20px', textAlign: 'center', fontSize: '0.9rem', color: '#aaa' },
    link: { color: '#a855f7', cursor: 'pointer', fontWeight: 'bold' }
};

export default Login;