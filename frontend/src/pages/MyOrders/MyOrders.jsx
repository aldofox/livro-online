import { useEffect, useState } from 'react';
import { showFlash } from '../../utils/flash';
import { Link } from 'react-router-dom';

import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';

import api from '../../services/api';

import './MyOrders.css';

function MyOrders() {

    const [orders, setOrders] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    useEffect(() => {

        loadOrders();

    }, []);

    async function loadOrders() {

        try {

            const token =
                localStorage.getItem(
                    'bookstore_token'
                );

            const response =
                await api.get(
                    '/orders/my-orders',
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                );

            setOrders(
                response.data.orders
            );

        } catch (error) {
            showFlash(error.response?.data?.message || 'Não foi possível carregar seus pedidos.', 'error');

        } finally {

            setLoading(false);

        }

    }

    if (loading) {

        return <h2>Carregando...</h2>;

    }

    return (

        <>
            <Header />

            <main className="my-orders-page">

                <h1>
                    Meus Pedidos
                </h1>

                {orders.length === 0 ? (

                    <div className="empty-orders">

                        <i className="fas fa-box-open"></i>

                        <h2>
                            Nenhum pedido encontrado
                        </h2>

                        <p>
                            Você ainda não realizou compras.
                        </p>

                    </div>

                ) : (

                    <div className="orders-grid">

                        {orders.map(order => (

                            <div
                                key={order.id}
                                className="order-card"
                            >

                                <div className="order-header">

                                    <h3>
                                        Pedido #{order.id}
                                    </h3>

                                    <span>
                                        {new Date(
                                            order.created_at
                                        ).toLocaleDateString(
                                            'pt-BR'
                                        )}
                                    </span>

                                </div>

                                <div className="order-info">

                                    <p>

                                        <strong>
                                            Total:
                                        </strong>

                                        {' '}
                                        R$
                                        {' '}
                                        {Number(
                                            order.total
                                        ).toFixed(2)}

                                    </p>

                                    <p>

                                        <strong>
                                            Pagamento:
                                        </strong>

                                        {' '}
                                        {order.payment_method}

                                    </p>

                                    <p>

                                        <strong>
                                            Status:
                                        </strong>

                                        {' '}
                                        {order.order_status}

                                    </p>

                                </div>

                                <Link
                                    to={`/pedido/${order.id}`}
                                    className="details-btn"
                                >

                                    Ver Detalhes

                                </Link>

                            </div>

                        ))}

                    </div>

                )}

            </main>

            <Footer />
        </>

    );

}

export default MyOrders;