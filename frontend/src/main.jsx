import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';

import './index.css';

import { CartProvider } from './context/CartContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { AuthProvider } from './context/AuthContext';
import FlashMessages from './components/FlashMessages';

import '@fortawesome/fontawesome-free/css/all.min.css';

ReactDOM.createRoot(
    document.getElementById('root')
).render(

    <React.StrictMode>

        <AuthProvider>

            <FlashMessages />

    <CartProvider>

        <FavoritesProvider>

            <App />

        </FavoritesProvider>

    </CartProvider>

</AuthProvider>

    </React.StrictMode>

);