import React from 'react';
import ReactDOM from 'react-dom/client';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'normalize.css';

import App from '~/App';
import UserProvider from '~/contexts/UserContext.jsx';
import CartProvider from '~/contexts/CartContext.jsx';
import '~/index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <UserProvider>
            <CartProvider>
                <ToastContainer />
                <App />
            </CartProvider>
        </UserProvider>
    </React.StrictMode>,
);
