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
import Footer from './Component/Footer';
import Header from './Component/Header';
import banner from './assets/logo.png';

export default function App() {
    return (
        <div className="min-h-screen bg-black">
            <Header />
            <div className="pt-20"></div>
            <Footer />
        </div>
    );
}
