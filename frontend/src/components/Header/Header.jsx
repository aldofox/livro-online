import './Header.css';
import { Link } from 'react-router-dom';

import { useCart } from '../../context/CartContext';
import { useFavorites } from '../../context/FavoritesContext';
import { useAuth } from '../../context/AuthContext';

import {
    useState,
    useEffect,
    useRef
} from 'react';

function Header() {

    const { cartItems } = useCart();
    const { favorites } = useFavorites();
    const { user, logout } = useAuth();

    const [menuOpen, setMenuOpen] =
        useState(false);

    const dropdownRef =
        useRef(null);

    const totalItems = cartItems.reduce(
        (acc, item) =>
            acc + item.quantity,
        0
    );

    useEffect(() => {

        function handleClickOutside(
            event
        ) {

            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(
                    event.target
                )
            ) {

                setMenuOpen(false);

            }

        }

        document.addEventListener(
            'mousedown',
            handleClickOutside
        );

        return () => {

            document.removeEventListener(
                'mousedown',
                handleClickOutside
            );

        };

    }, []);

    return (

        <header className="header">

            <div className="top-header">

                <div className="logo">

                    <Link to="/">
                        BookStore
                    </Link>

                </div>

                <div className="search-box">

                    <input
                        type="text"
                        placeholder="Pesquisar livros..."
                    />

                    <button>
                        <i className="fas fa-search"></i>
                    </button>

                </div>

                <div className="header-icons">

                    {user ? (

                        <div
                            className="user-dropdown"
                            ref={dropdownRef}
                        >

                            <button
                                className="user-button"
                                onClick={() =>
                                    setMenuOpen(
                                        !menuOpen
                                    )
                                }
                            >

                                <i className="fas fa-user"></i>

                                {' '}
                                Olá,
                                {' '}
                                {user.name}

                                {' '}

                                <i
                                    className={
                                        menuOpen
                                            ? 'fas fa-chevron-up'
                                            : 'fas fa-chevron-down'
                                    }
                                />

                            </button>

                            {menuOpen && (

                                <div className="dropdown-menu">

                                    <Link
                                        to="/minha-conta"
                                        onClick={() =>
                                            setMenuOpen(false)
                                        }
                                    >
                                        Minha Conta
                                    </Link>

                                    <Link
                                        to="/my-orders"
                                        onClick={() =>
                                            setMenuOpen(false)
                                        }
                                    >
                                        Meus Pedidos
                                    </Link>

                                    <Link
                                        to="/favorites"
                                        onClick={() =>
                                            setMenuOpen(false)
                                        }
                                    >
                                        Favoritos
                                    </Link>

                                    {user?.role ===
                                        'admin' && (

                                        <Link
                                            to="/admin"
                                            onClick={() =>
                                                setMenuOpen(false)
                                            }
                                        >
                                            Painel Admin
                                        </Link>

                                    )}

                                    <button
                                        onClick={() => {

                                            logout();

                                            setMenuOpen(
                                                false
                                            );

                                        }}
                                    >
                                        Sair
                                    </button>

                                </div>

                            )}

                        </div>

                    ) : (

                        <Link to="/login">

                            <i className="fas fa-user"></i>

                            <span>
                                Entrar
                            </span>

                        </Link>

                    )}

                    <Link
                        to="/favorites"
                        className="cart-link"
                    >

                        <i className="fas fa-heart"></i>

                        <span className="cart-count">

                            {favorites.length}

                        </span>

                    </Link>

                    <Link
                        to="/cart"
                        className="cart-link"
                    >

                        <i className="fas fa-shopping-cart"></i>

                        <span className="cart-count">

                            {totalItems}

                        </span>

                    </Link>

                </div>

            </div>

            <nav className="navbar">

                <Link to="/">
                    Home
                </Link>

                <Link to="/books">
                    Livros
                </Link>

                <Link to="/ebooks">
                    E-books
                </Link>

                <Link to="/categories">
                    Categorias
                </Link>

                <Link to="/contact">
                    Contato
                </Link>

            </nav>

        </header>

    );

}

export default Header;