import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import Home from './Component/HomepageClient/Home';
import Footer from './Component/Footer';
import { useState } from 'react';

function App() {
    const [user, setUser] = useState(null);
    return (
        <div>
            <BrowserRouter>
                <AppRoutes user={user} setUser={setUser} />
            </BrowserRouter>
        </div>
    );
}

export default App;
