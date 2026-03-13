import React from 'react';
import { Link } from 'react-router-dom';

const Login = () => {
  return (
    <div style={styles.container}>
      {/* Reset CSS mặc định của trình duyệt */}
      <style>{`
        body, html { margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden; }
      `}</style>

      <div style={styles.card}>
        <div style={styles.icon}>🧋</div>
        <h2 style={styles.title}>Đăng Nhập</h2>
        <p style={styles.subtitle}>Chào mừng bạn quay trở lại!</p>
        
        <input type="text" placeholder="Tên đăng nhập" style={styles.input} />
        <input type="password" placeholder="Mật khẩu" style={styles.input} />
        
        <button style={styles.button}>ĐĂNG NHẬP NGAY</button>
        
        <p style={styles.footerText}>
          Chưa có tài khoản? <Link to="/register" style={styles.link}>Đăng ký tại đây</Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100vw',
    height: '100vh',
    backgroundColor: '#121212',
    position: 'fixed',
    top: 0,
    left: 0,
  },
  card: {
    padding: '50px 40px',
    borderRadius: '15px',
    backgroundColor: '#1e1e1e',
    boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
    textAlign: 'center',
    width: '90%',
    maxWidth: '380px',
    border: '1px solid #333',
    boxSizing: 'border-box',
  },
  icon: { fontSize: '60px', marginBottom: '15px', color: '#ffd700' },
  title: { marginBottom: '10px', color: '#e0e0e0', fontWeight: 'bold' },
  subtitle: { color: '#a0a0a0', marginBottom: '30px', fontSize: '14px' },
  input: {
    width: '100%',
    padding: '15px',
    marginBottom: '20px',
    borderRadius: '8px',
    border: '1px solid #444',
    backgroundColor: '#2a2a2a',
    color: '#fff',
    fontSize: '16px',
    boxSizing: 'border-box',
    outline: 'none',
  },
  button: {
    width: '100%',
    padding: '15px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#ffd700',
    color: '#000',
    fontWeight: 'bold',
    fontSize: '16px',
    cursor: 'pointer',
  },
  footerText: { marginTop: '25px', color: '#a0a0a0', fontSize: '14px' },
  link: { color: '#ffd700', textDecoration: 'none', fontWeight: 'bold' },
};

export default Login;