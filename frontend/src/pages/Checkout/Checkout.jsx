import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';

import { useCart } from '../../context/CartContext';

import api from '../../services/api';
import { showFlash } from '../../utils/flash';

import './Checkout.css';

function Checkout() {
   
    const navigate = useNavigate();

    const {
        cartItems,
        total,
        clearCart
    } = useCart();

    const [addresses, setAddresses] =
        useState([]);

    const [addressId, setAddressId] =
        useState('');

    const [paymentMethod, setPaymentMethod] =
        useState('pix');

    const [loading, setLoading] =
        useState(false);

    useEffect(() => {

        loadAddresses();

    }, []);

    async function loadAddresses() {

        try {

            const token =
                localStorage.getItem(
                    'bookstore_token'
                );
            
            const response =
                await api.get(
                    '/addresses',
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                );
            setAddresses(
                response.data.addresses
            );

            if (
                response.data.addresses
                    .length > 0
            ) {

                setAddressId(
                    response.data.addresses[0].id
                );

            }

        } catch (error) {
            showFlash(error.response?.data?.message || 'Não foi possível carregar os endereços.', 'error');

        }

    }

    async function finishOrder() {

        if (!addressId) {

            showFlash('Selecione um endereço.', 'warning');

            return;

        }

        try {

            setLoading(true);

            const token =
                localStorage.getItem(
                    'bookstore_token'
                );

            const items =
                cartItems.map(item => ({

                    book_id:
                        item.id,

                    quantity:
                        item.quantity,

                    price:
                        item.price

                }));

            await api.post(
                '/orders',
                {
                    address_id:
                        Number(addressId),

                    payment_method:
                        paymentMethod,

                    installments: 1,

                    items
                },
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

            clearCart();

            showFlash('Pedido realizado com sucesso!', 'success');

            navigate(
                '/my-orders'
            );

        } catch (error) {
            showFlash(error.response?.data?.message || 'Erro ao finalizar pedido.', 'error');

        } finally {

            setLoading(false);

        }

    }

    return (

        <>
            <Header />

            <main className="checkout-page">

                <div className="checkout-grid">

                    <div className="checkout-left">

                        <div className="checkout-card">

                            <h2>
                                Endereço de Entrega
                            </h2>

                            {addresses.map(
                                address => (

                                    <label
                                        key={
                                            address.id
                                        }
                                        className="address-option"
                                    >

                                        <input
                                            type="radio"
                                            name="address"
                                            value={
                                                address.id
                                            }
                                            checked={
                                                Number(
                                                    addressId
                                                ) ===
                                                address.id
                                            }
                                            onChange={() =>
                                                setAddressId(
                                                    address.id
                                                )
                                            }
                                        />

                                        <span>

                                            {
                                                address.street
                                            },
                                            {' '}
                                            {
                                                address.number
                                            }

                                            <br />

                                            {
                                                address.district
                                            }

                                            {' - '}

                                            {
                                                address.city
                                            }

                                        </span>

                                    </label>

                                )
                            )}

                        </div>

                        <div className="checkout-card">

                            <h2>
                                Forma de Pagamento
                            </h2>

                            <label>

                                <input
                                    type="radio"
                                    value="pix"
                                    checked={
                                        paymentMethod ===
                                        'pix'
                                    }
                                    onChange={() =>
                                        setPaymentMethod(
                                            'pix'
                                        )
                                    }
                                />

                                PIX

                            </label>

                            <label>

                                <input
                                    type="radio"
                                    value="credit_card"
                                    checked={
                                        paymentMethod ===
                                        'credit_card'
                                    }
                                    onChange={() =>
                                        setPaymentMethod(
                                            'credit_card'
                                        )
                                    }
                                />

                                Cartão

                            </label>

                            <label>

                                <input
                                    type="radio"
                                    value="boleto"
                                    checked={
                                        paymentMethod ===
                                        'boleto'
                                    }
                                    onChange={() =>
                                        setPaymentMethod(
                                            'boleto'
                                        )
                                    }
                                />

                                Boleto

                            </label>

                        </div>

                    </div>

                    <div className="checkout-right">

                        <div className="checkout-card">
                            <h2>
                                Resumo do Pedido
                            </h2>
                            {cartItems.map(
                                item => (
                        <div key={item.id} className="summary-item">
            <div className="summary-product">
            <img src={ item.image ? `http://localhost:5000/uploads/books/${item.image}`: 'https://placehold.co/80x120'} alt={item.title}
/>

        <div>

            <h4>
                {item.title}
            </h4>

            <p>
                Quantidade:
                {' '}
                {item.quantity}
            </p>

        </div>

    </div>

    <div className="summary-price">

        R$
        {' '}
        {(
            Number(item.price) *
            item.quantity
        ).toFixed(2)}

    </div>

</div>

                                )
                            )}

                            <hr />

                            <h3>

                                Total:
                                {' '}
                                R$
                                {' '}
                                {total.toFixed(2)}

                            </h3>

                            <button
                                className="finish-btn"
                                onClick={
                                    finishOrder
                                }
                                disabled={
                                    loading
                                }
                            >

                                {
                                    loading
                                        ? 'Processando...'
                                        : 'Finalizar Compra'
                                }

                            </button>

                        </div>

                    </div>

                </div>

            </main>

            <Footer />
        </>

    );

}

export default Checkout;