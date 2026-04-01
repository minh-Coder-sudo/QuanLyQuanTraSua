import { Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import PageLoader from '../components/ui/PageLoader';
import MainLayout from '../layout/MainLayout';
import ProductList from '../Component/ProductList';
import Login from '../Component/page/Login';
import Register from '../Component/page/Register';
import Profile from '../Component/page/Profile';

const Home = lazy(() => import('../Component/HomepageClient/Home.jsx'));

export default function AppRoutes() {
    return (
        <Suspense fallback={<PageLoader />}>
            <Routes>
                <Route element={<MainLayout />}>
                    <Route path="/" element={<Home />} />
                    {/* Mặc định vào sẽ chuyển đến trang login */}
                    <Route path="/Home" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/products" element={<ProductList />} />
                </Route>
            </Routes>
        </Suspense>
    );
}
