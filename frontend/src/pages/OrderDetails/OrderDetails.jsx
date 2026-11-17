import { useEffect, useState } from 'react';
import { showFlash } from '../../utils/flash';
import { useParams } from 'react-router-dom';

import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';

import api from '../../services/api';

import './OrderDetails.css';

function OrderDetails() {

    const { id } = useParams();

    const [order, setOrder] =
        useState(null);

    const [items, setItems] =
        useState([]);

    useEffect(() => {

        loadOrder();

    }, [id]);

    async function loadOrder() {

        try {

            const token =
                localStorage.getItem(
                    'bookstore_token'
                );

            const response =
                await api.get(
                    `/orders/${id}`,
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                );

            setOrder(
                response.data.order
            );

            setItems(
                response.data.items
            );

        } catch (error) {
            showFlash(error.response?.data?.message || 'Não foi possível carregar os detalhes do pedido.', 'error');

        }

    }

    function getStatus(status) {

        switch (status) {

            case 'waiting_payment':
                return 'status waiting';

            case 'processing':
                return 'status processing';

            case 'sent':
                return 'status sent';

            case 'delivered':
                return 'status delivered';

            case 'cancelled':
                return 'status cancelled';

            default:
                return 'status';

        }

    }

    function formatStatus(status) {

        switch (status) {

            case 'waiting_payment':
                return 'Aguardando Pagamento';

            case 'processing':
                return 'Processando';

            case 'sent':
                return 'Enviado';

            case 'delivered':
                return 'Entregue';

            case 'cancelled':
                return 'Cancelado';

            default:
                return status;

        }

    }

    if (!order) {

        return <h2>Carregando pedido...</h2>;

    }

    return (

        <>
            <Header />

            <main className="order-details">

                <div className="order-card">

                    <h1>
                        Pedido #{order.id}
                    </h1>

                    <div className="order-info">

                        <p>

                            <strong>Status:</strong>

                            <span
                                className={
                                    getStatus(
                                        order.order_status
                                    )
                                }
                            >

                                {formatStatus(
                                    order.order_status
                                )}

                            </span>

                        </p>

                        <p>

                            <strong>Pagamento:</strong>
                            {' '}
                            {order.payment_method}

                        </p>

                        <p>

                            <strong>Total:</strong>
                            {' '}
                            R$
                            {' '}
                            {Number(order.total).toFixed(2)}

                        </p>

                        <p>

                            <strong>Data:</strong>
                            {' '}
                            {new Date(
                                order.created_at
                            ).toLocaleString(
                                'pt-BR'
                            )}

                        </p>

                    </div>

                </div>

                <div className="address-card">

                    <h2>
                        Endereço de Entrega
                    </h2>

                    <p>
                        {order.street}
                        ,
                        {' '}
                        {order.number}
                    </p>

                    <p>
                        {order.district}
                    </p>

                    <p>

                        {order.city}

                        {' - '}

                        {order.state}

                    </p>

                    {order.zip_code && (

                        <p>

                            CEP:
                            {' '}
                            {order.zip_code}

                        </p>

                    )}

                </div>

                <div className="items-card">

                    <h2>
                        Itens do Pedido
                    </h2>

                    {items.map(item => (

                        <div
                            key={item.id}
                            className="order-item"
                        >

                            <img
                                src={
                                    item.image
                                        ?
                                        `http://localhost:5000/uploads/books/${item.image}`
                                        :
                                        'https://placehold.co/100x140'
                                }
                                alt={item.title}
                            />

                            <div className="item-info">

                                <h3>
                                    {item.title}
                                </h3>

                                <p>

                                    Quantidade:
                                    {' '}
                                    {item.quantity}

                                </p>

                                <p>

                                    Preço:
                                    {' '}
                                    R$
                                    {' '}
                                    {Number(
                                        item.price
                                    ).toFixed(2)}

                                </p>

                                <p>

                                    Subtotal:
                                    {' '}
                                    R$
                                    {' '}
                                    {Number(
                                        item.subtotal
                                    ).toFixed(2)}

                                </p>

                            </div>

                        </div>

                    ))}

                </div>

            </main>

            <Footer />
        </>

    );

}

export default OrderDetails;