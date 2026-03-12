import { Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import PageLoader from '../components/ui/PageLoader';
import MainLayout from '../layout/MainLayout';

const Home = lazy(() => import('../pages/client/Home'));

export default function AppRoutes() {
    return (
        <Suspense fallback={<PageLoader />}>
            <Routes>
                <Route element={<MainLayout />}>
                    <Route path='/' element={<Home />} />
                </Route>
            </Routes>
        </Suspense>
    );
}
