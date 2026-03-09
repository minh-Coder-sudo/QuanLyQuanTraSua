import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Component/page/Login';
import Register from './Component/page/Register';
import Profile from './Component/page/Profile';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Mặc định vào sẽ chuyển đến trang login */}
        <Route path="/" element={<Navigate to="/login" />} />
        
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;