import { useEffect, useState } from 'react';

import AdminLayout from '../../components/Admin/AdminLayout';
import { showFlash } from '../../utils/flash';

import {
    getAdminOrders,
    updateOrderStatus
} from '../../services/adminService';

import './AdminOrders.css';

const STATUS_OPTIONS = [
    { value: 'waiting_payment', label: 'Aguardando Pagamento' },
    { value: 'processing', label: 'Processando' },
    { value: 'sent', label: 'Enviado' },
    { value: 'delivered', label: 'Entregue' },
    { value: 'cancelled', label: 'Cancelado' }
];

function statusClass(status) {

    const map = {
        waiting_payment: 'waiting_payment',
        pending: 'pending',
        processing: 'processing',
        paid: 'paid',
        shipped: 'shipped',
        sent: 'sent',
        delivered: 'delivered',
        cancelled: 'cancelled'
    };

    return map[status] || 'pending';

}

function formatStatus(status) {

    const map = {
        waiting_payment: 'Aguardando Pagamento',
        pending: 'Pendente',
        processing: 'Processando',
        paid: 'Pago',
        shipped: 'Enviado',
        sent: 'Enviado',
        delivered: 'Entregue',
        cancelled: 'Cancelado'
    };

    return map[status] || status;

}

function formatPayment(method) {

    const map = {
        pix: 'PIX',
        credit_card: 'Cartão',
        boleto: 'Boleto'
    };

    return map[method] || method;

}

function AdminOrders() {

    const [orders, setOrders] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    async function loadOrders() {

        try {

            const data =
                await getAdminOrders();

            setOrders(data.orders || []);

        } catch (error) {
            showFlash(error.response?.data?.message || 'Não foi possível carregar os pedidos.', 'error');

} finally {

            setLoading(false);

        }

    }

    useEffect(() => {

        (async () => {
            await loadOrders();
        })();

    }, []);

    async function handleStatusChange(
        id,
        status
    ) {

        try {

            await updateOrderStatus(
                id,
                status
            );

            setOrders(prev =>
                prev.map(order =>
                    order.id === id
                        ? {
                            ...order,
                            order_status: status
                        }
                        : order
                )
            );
            showFlash('Status do pedido atualizado.', 'success');

        } catch (error) {
            showFlash(error.response?.data?.message || 'Erro ao atualizar status.', 'error');

        }

    }

    if (loading) {

        return (
            <AdminLayout>
                <h2>Carregando pedidos...</h2>
            </AdminLayout>
        );

    }

    return (

        <AdminLayout>

            <div className="admin-header">

                <h1>
                    <i className="fa-solid fa-boxes-stacked"></i>
                    {' '}
                    Pedidos
                </h1>

            </div>

            {orders.length === 0 ? (

                <p>
                    Nenhum pedido encontrado.
                </p>

            ) : (

                <div style={{ overflowX: 'auto' }}>

                    <table className="admin-orders-table">

                        <thead>

                            <tr>

                                <th>ID</th>
                                <th>Cliente</th>
                                <th>E-mail</th>
                                <th>Total</th>
                                <th>Pagamento</th>
                                <th>Status</th>
                                <th>Data</th>

                            </tr>

                        </thead>

                        <tbody>

                            {orders.map(order => (

                                <tr key={order.id}>

                                    <td>#{order.id}</td>
                                    <td>{order.customer_name}</td>
                                    <td>{order.customer_email}</td>

                                    <td>
                                        R$
                                        {' '}
                                        {Number(
                                            order.total
                                        ).toFixed(2)}
                                    </td>

                                    <td>
                                        {formatPayment(
                                            order.payment_method
                                        )}
                                    </td>

                                    <td>

                                        <span
                                            className={
                                                `order-status ${statusClass(
                                                    order.order_status
                                                )}`
                                            }
                                        >
                                            {formatStatus(
                                                order.order_status
                                            )}
                                        </span>

                                    </td>

                                    <td>

                                        <select
                                            className="status-select"
                                            value={
                                                order.order_status
                                            }
                                            onChange={(e) =>
                                                handleStatusChange(
                                                    order.id,
                                                    e.target.value
                                                )
                                            }
                                        >

                                            {STATUS_OPTIONS.map(
                                                option => (

                                                    <option
                                                        key={
                                                            option.value
                                                        }
                                                        value={
                                                            option.value
                                                        }
                                                    >
                                                        {
                                                            option.label
                                                        }
                                                    </option>

                                                )
                                            )}

                                        </select>

                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

            )}

        </AdminLayout>

    );

}

export default AdminOrders;
