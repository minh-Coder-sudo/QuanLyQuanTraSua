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
