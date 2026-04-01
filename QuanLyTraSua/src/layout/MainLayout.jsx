import Header from '../Component/Header';
import Footer from '../Component/Footer';
import { Outlet } from 'react-router-dom';

export default function MainLayout() {
    return (
        <div className="bg-white text-black dark:bg-black dark:text-white transition-colors duration-500 min-h-screen">
            <Header />

            {/* padding top để tránh bị navbar che */}
            <main className="">
                <Outlet />
            </main>

            <Footer />
        </div>
    );
}
