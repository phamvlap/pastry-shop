import React from 'react';
import ReactDOM from 'react-dom/client';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import App from './App.jsx';
import '~/assets/css/main.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import StaffProvider from '~/contexts/StaffContext.jsx';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <React.StrictMode>
        <StaffProvider>
            <>
                <ToastContainer />
                <App />
            </>
        </StaffProvider>
    </React.StrictMode>,
);
