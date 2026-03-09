import React from 'react';

const Profile = () => {
  return (
    <div style={styles.container}>
      {/* Global reset để đảm bảo không bị lệch do body/html */}
      <style>{`
        body, html {
          margin: 0;
          padding: 0;
          width: 100%;
          height: 100%;
          overflow: hidden; /* Ngăn hiện thanh cuộn thừa */
        }
      `}</style>

      <div style={styles.card}>
        <div style={styles.icon}>🧑‍⚖️</div>
        <h2 style={styles.title}>Thông Tin Người Dùng</h2>
        <div style={styles.avatar}>🧋</div>
        
        <div style={styles.infoGroup}>
          <p style={styles.infoLabel}>Họ tên:</p>
          <p style={styles.infoValue}>Nguyễn Ngô Đức Mạnh</p>
        </div>
        
        <div style={styles.infoGroup}>
          <p style={styles.infoLabel}>Vai trò:</p>
          <p style={{...styles.infoValue, color: '#ffd700'}}>Quản lý tối cao (Admin)</p>
        </div>
        
        <div style={styles.infoGroup}>
          <p style={styles.infoLabel}>Email:</p>
          <p style={styles.infoValue}>manh.duc.nguyen@gmail.com</p>
        </div>
        
        <button style={styles.logoutButton}>Đăng xuất</button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center', // Căn giữa ngang
    alignItems: 'center',     // Căn giữa dọc
    width: '100vw',           // Chiều rộng bằng toàn bộ màn hình
    height: '100vh',          // Chiều cao bằng toàn bộ màn hình
    backgroundColor: '#121212',
    position: 'fixed',        // Cố định để đè lên mọi lề mặc định
    top: 0,
    left: 0,
  },
  card: {
    padding: '40px 30px',
    borderRadius: '15px',
    backgroundColor: '#1e1e1e',
    boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
    textAlign: 'center',
    width: '90%',             // Co dãn linh hoạt trên mobile
    maxWidth: '380px',        // Không quá to trên PC
    border: '1px solid #333',
  },
  icon: { fontSize: '40px', marginBottom: '10px', color: '#ffd700' },
  title: { marginBottom: '20px', color: '#e0e0e0', fontWeight: 'bold' },
  avatar: { 
    fontSize: '80px', 
    marginBottom: '30px', 
    backgroundColor: '#2a2a2a', 
    width: '120px', 
    height: '120px', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    borderRadius: '50%', 
    margin: '0 auto 30px auto', 
    border: '3px solid #ffd700' 
  },
  infoGroup: { textAlign: 'left', marginBottom: '15px', borderBottom: '1px solid #333', paddingBottom: '10px' },
  infoLabel: { color: '#a0a0a0', fontSize: '12px', margin: '0 0 5px 0', textTransform: 'uppercase' },
  infoValue: { color: '#fff', fontSize: '16px', margin: '0', fontWeight: '500' },
  logoutButton: { 
    width: '100%', 
    padding: '12px', 
    borderRadius: '8px', 
    border: 'none', 
    backgroundColor: '#ff4d4d', 
    color: 'white', 
    fontWeight: 'bold', 
    cursor: 'pointer', 
    marginTop: '30px',
    fontSize: '16px'
  },
};

export default Profile;