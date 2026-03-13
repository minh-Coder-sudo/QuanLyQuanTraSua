import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Component/page/Login.jsx';
import Register from './Component/page/Register.jsx';
import Profile from './Component/page/Profile.jsx';
import './App.css';
import Footer from './Component/Footer';
import Header from './Component/Header';
import banner from './assets/logo.png';
import News from './Component/page/News';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

export default function App() {
    return (
        <BrowserRouter>
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
        </BrowserRouter>
    );
}

export default App;
