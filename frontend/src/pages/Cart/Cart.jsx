import { Link } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';

import { useCart } from '../../context/CartContext';

import './Cart.css';

function Cart() {

    const {
        cartItems,
        removeFromCart,
        updateQuantity,
        total
    } = useCart();

    return (

        <>
            <Header />

            <main className="cart-page">

                <h1>
                    Meu Carrinho
                </h1>

                {cartItems.length === 0 ? (

                    <div className="empty-cart">

                        <h2>
                            Seu carrinho está vazio
                        </h2>

                    </div>

                ) : (

                    <>

                        {cartItems.map(item => (

                            <div
                                key={item.id}
                                className="cart-item"
                            >

<img
                                    className="cart-img"
                                    src={`http://localhost:5000/uploads/books/${item.image}`}
                                    alt={item.title}
                                />

                                <div className="cart-info">

                                    <h3>
                                        {item.title}
                                    </h3>

                                    <p>
                                        Autor:
                                        {' '}
                                        {item.author}
                                    </p>

                                    <p>
                                        R$
                                        {' '}
                                        {Number(item.price).toFixed(2)}
                                    </p>

                                </div>

                                <div className="quantity">

                                    <button
                                        onClick={() =>
                                            updateQuantity(
                                                item.id,
                                                item.quantity - 1
                                            )
                                        }
                                    >
                                        -
                                    </button>

                                    <span>
                                        {item.quantity}
                                    </span>

                                    <button
                                        onClick={() =>
                                            updateQuantity(
                                                item.id,
                                                item.quantity + 1
                                            )
                                        }
                                    >
                                        +
                                    </button>

                                </div>

                                <div className="subtotal">

                                    R$
                                    {' '}
                                    {(
                                        Number(item.price) *
                                        item.quantity
                                    ).toFixed(2)}

                                </div>

                                <button
                                    className="remove-btn"
                                    onClick={() =>
                                        removeFromCart(item.id)
                                    }
                                >
                                    Remover
                                </button>

                            </div>

                        ))}

                        <div className="cart-total">

                            <h2>

                                Total:
                                {' '}
                                R$
                                {' '}
                                {total.toFixed(2)}

                            </h2>

                        <Link to="/checkout" className="checkout-btn">
                            Finalizar Compra
                        </Link>
                        </div>
                    </>
                )}
            </main>
            <Footer />
        </>
    );
}

export default Cart;