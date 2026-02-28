import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1); 
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        code: ''
    });

    // 1. Grab the base URL from your frontend .env file
    const API_BASE = import.meta.env.VITE_API_URL;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSendCode = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            return alert("Passwords do not match!");
        }
        
        setLoading(true);
        try {
            // 2. Use the dynamic API_BASE variable here
            await axios.post(`${API_BASE}/api/auth/send-code`, { email: formData.email });
            setStep(2);
            alert("Verification code sent to " + formData.email);
        } catch (err) {
            alert(err.response?.data?.error || "Error sending code. Is your backend running?");
        } finally {
            setLoading(false);
        }
    };

    const handleFinalRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // 2. Use the dynamic API_BASE variable here
            await axios.post(`${API_BASE}/api/auth/register`, formData);
            alert("Registration Successful!");
            navigate('/login');
        } catch (err) {
            alert(err.response?.data?.error || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.title}>{step === 1 ? "Create Account" : "Verify Email"}</h2>
                
                {step === 1 ? (
                    <form onSubmit={handleSendCode} style={styles.form}>
                        <input style={styles.input} name="name" placeholder="Full Name" required onChange={handleChange} />
                        <input style={styles.input} name="username" placeholder="Username" required onChange={handleChange} />
                        <input style={styles.input} name="email" type="email" placeholder="Email Address" required onChange={handleChange} />
                        <input style={styles.input} name="password" type="password" placeholder="Password" required onChange={handleChange} />
                        <input style={styles.input} name="confirmPassword" type="password" placeholder="Confirm Password" required onChange={handleChange} />
                        <button style={styles.button} type="submit" disabled={loading}>
                            {loading ? "Sending..." : "Get Verification Code"}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleFinalRegister} style={styles.form}>
                        <p style={{textAlign: 'center', color: '#ccc', fontSize: '0.9rem'}}>Enter code sent to your email</p>
                        <input style={styles.input} name="code" placeholder="6-Digit Code" required onChange={handleChange} />
                        <button style={styles.button} type="submit" disabled={loading}>
                            {loading ? "Verifying..." : "Register"}
                        </button>
                        <button style={styles.backLink} onClick={() => setStep(1)}>Back</button>
                    </form>
                )}
            </div>
        </div>
    );
};

const styles = {
    container: { height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#0a0a0a', color: '#fff' },
    card: { background: 'rgba(255, 255, 255, 0.05)', padding: '40px', borderRadius: '15px', backdropFilter: 'blur(10px)', width: '350px', border: '1px solid rgba(255,255,255,0.1)' },
    title: { textAlign: 'center', marginBottom: '20px', color: '#a855f7', fontWeight: 'bold' },
    form: { display: 'flex', flexDirection: 'column', gap: '15px' },
    input: { padding: '12px', borderRadius: '8px', background: '#1a1a1a', color: '#fff', border: '1px solid #333' },
    button: { padding: '12px', borderRadius: '8px', border: 'none', background: '#a855f7', color: '#fff', cursor: 'pointer', fontWeight: 'bold' },
    backLink: { background: 'none', border: 'none', color: '#777', cursor: 'pointer', fontSize: '0.8rem', marginTop: '10px' }
};

export default Register;