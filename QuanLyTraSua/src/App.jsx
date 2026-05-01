import { BrowserRouter } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import AppRoutes from './routes/AppRoutes';
import authService from './services/auth';

// 🔥 THÊM 2 STORE
import useCartStore from './store/cartStore';
import useAddressStore from './store/addressStore';

function App() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const initApp = async () => {
            const loggedUser = authService.getCurrentUser();
            const token = localStorage.getItem('token');

            if (loggedUser && token) {
                setUser(loggedUser);

                try {
                    // 🔥 LOAD LẠI CART + ADDRESS KHI RELOAD
                    await useCartStore.getState().fetchCart();
                    await useAddressStore.getState().fetchAddress();
                } catch (err) {
                    console.error('❌ Load user data lỗi:', err);
                }
            }
        };

        initApp();
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
