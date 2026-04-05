import { BrowserRouter } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import AppRoutes from './routes/AppRoutes';
import authService from './services/auth';

function App() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const loggedUser = authService.getCurrentUser();
        if (loggedUser) {
            setUser(loggedUser);
        }
    }, []);

    return (
        <div>
            <BrowserRouter>
                <AppRoutes user={user} setUser={setUser} />
            </BrowserRouter>
        </div>
    );
}

export default App;
