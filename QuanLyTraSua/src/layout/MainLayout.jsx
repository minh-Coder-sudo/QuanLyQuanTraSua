import Header from '../components/Header';
import Footer from '../components/Footer';
import { Outlet } from 'react-router-dom';

export default function MainLayout() {
    return (
        <div className='bg-white text-black dark:bg-black dark:text-white transition-colors duration-500 min-h-screen'>
            <Header />

            {/* padding top để tránh bị navbar che */}
            <main className='pt-24'>
                <Outlet />
            </main>

            <Footer />
        </div>
    );
}
