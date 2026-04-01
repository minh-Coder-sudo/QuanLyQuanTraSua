import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import Home from './Component/HomepageClient/Home';
import Footer from './Component/Footer';

function App() {
    return (
        <div>
            <BrowserRouter>
                <AppRoutes />
            </BrowserRouter>
        </div>
    );
}

export default App;
