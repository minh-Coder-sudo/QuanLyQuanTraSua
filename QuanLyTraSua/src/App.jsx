import Footer from './Component/Footer';
import Header from './Component/Header';
import banner from './assets/logo.png';
import News from './Component/page/News';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

export default function App() {
    return (
        <BrowserRouter>
            <Header />

            <Routes>
                <Route path="/news" element={<News />} />
            </Routes>

            <Footer />
        </BrowserRouter>
    );
}
