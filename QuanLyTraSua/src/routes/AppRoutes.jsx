import { Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';

import MainLayout from '../layout/MainLayout';
import ProductList from '../Component/ProductList';
import Login from '../Component/page/Login';
import Register from '../Component/page/Register';
import Profile from '../Component/page/Profile';
import News from '../Component/page/News';
import PageLoader from '../Component/ui/PageLoader';
import Menu from '../Component/Menu';
import ProductManagement from '../Component/page/ProductManagement';
import Location from '../Component/page/Location';
import MemberManagement from '../Component/page/MemberManagement';

const Home = lazy(() => import('../Component/HomepageClient/Home.jsx'));

export default function AppRoutes({ user, setUser }) {
    return (
        <Suspense fallback={<PageLoader />}>
            <Routes>
                <Route element={<MainLayout user={user} setUser={setUser} />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/Home" element={<Home />} />
                    <Route path="/login" element={<Login setUser={setUser} />} />
                    <Route path="/register" element={<Register />} />
                    <Route 
                        path="/profile" 
                        element={user ? <Profile user={user} setUser={setUser} /> : <Navigate to="/login" />} 
                    />
                    <Route path="/menu" element={<Menu />} />
                    <Route path="/location" element={<Location />} />
                    <Route path="/news" element={<News />} />
                    <Route path="/products" element={<ProductList />} />
                    
                    {/* Admin/Staff Routes */}
                    <Route 
                        path="/admin/products" 
                        element={(user?.role === 'ADMIN' || user?.role === 'EMPLOYEE') ? <ProductManagement /> : <Navigate to="/" />} 
                    />
                    <Route 
                        path="/admin/members" 
                        element={user?.role === 'ADMIN' ? <MemberManagement /> : <Navigate to="/" />} 
                    />
                </Route>
            </Routes>
        </Suspense>
    );
}
