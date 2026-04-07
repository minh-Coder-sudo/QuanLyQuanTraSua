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
import Location from '../Component/page/Location';

const Home = lazy(() => import('../Component/HomepageClient/Home.jsx'));

export default function AppRoutes({ user, setUser }) {
    return (
        <Suspense fallback={<PageLoader />}>
            <Routes>
                <Route element={<MainLayout user={user} setUser={setUser} />}>
                    <Route path='/' element={<Home />} />
                    {/* Mặc định vào sẽ chuyển đến trang login */}
                    <Route path='/Home' element={<Home />} />
                    <Route path='/login' element={<Login />} />
                    <Route path='/register' element={<Register />} />
                    <Route path='/profile' element={<Profile />} />
                    <Route path='/menu' element={<Menu />} />
                    <Route path='/location' element={<Location />} />
                    <Route path='/news' element={<News />} />
                    <Route path='/products' element={<ProductList />} />
                </Route>
            </Routes>
        </Suspense>
    );
}
