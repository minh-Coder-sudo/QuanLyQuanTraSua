import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Component/page/Login.jsx';
import Register from './Component/page/Register.jsx';
import Profile from './Component/page/Profile.jsx';
import './App.css';
import Footer from './Component/Footer';
import Header from './Component/Header';
function App() {
    return (
        <div className="min-h-screen bg-black">
            <Header />
            <Router className="pt-20">
                <Routes>
                    {/* Mặc định vào sẽ chuyển đến trang login */}
                    <Route path="/" element={<Navigate to="/login" />} />

                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/profile" element={<Profile />} />
                </Routes>
            </Router>
            <Footer />
        </div>
    );
}

export default App;
