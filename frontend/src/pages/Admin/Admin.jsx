import { useEffect, useState } from 'react';
import { showFlash } from '../../utils/flash';
import AdminLayout from '../../components/Admin/AdminLayout';
import { getDashboard } from '../../services/adminService';

import './Admin.css';

function Admin() {

const [stats, setStats] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        async function loadDashboard() {

            try {

                const data = await getDashboard();

                setStats(data.stats);

                setOrders(data.recentOrders);

            } catch (error) {
                showFlash(error.response?.data?.message || 'Não foi possível carregar os dados do painel.', 'error');

            } finally {

                setLoading(false);

            }

        }

        loadDashboard();

    }, []);

    if (loading) {

        return <h2>Carregando Dashboard...</h2>;

    }

    return (

        <AdminLayout>

            <h1><i className="fa-solid fa-chart-column"></i> Dashboard Administrativo</h1>

            <div className="admin-cards">

                <div className="admin-card">

<h3><i className="fa-solid fa-users"></i> Clientes</h3>

                    <span>{stats.customers}</span>

                </div>

                <div className="admin-card">

                    <h3><i className="fa-solid fa-book-open"></i> Livros</h3>

                    <span>{stats.books}</span>

                </div>

                <div className="admin-card">

                    <h3><i className="fa-solid fa-shopping-cart"></i> Pedidos</h3>

                    <span>{stats.orders}</span>

                </div>

                <div className="admin-card">

                    <h3><i className="fa-solid fa-brazilian-real-sign"></i> Faturamento</h3>

                    <span>

                        R$ {Number(stats.revenue).toFixed(2)}

                    </span>

                </div>

            </div>

            <div className="recent-orders">

                <h2><i className="fa-solid fa-hand-holding-dollar"></i> Últimos Pedidos</h2>

                <table>

                    <thead>

                        <tr>

                            <th>ID</th>
                            <th>Cliente</th>
                            <th>Total</th>
                            <th>Data</th>

                        </tr>

                    </thead>

                    <tbody>

                        {orders.map(order => (

                            <tr key={order.id}>

                                <td>#{order.id}</td>

                                <td>{order.name}</td>

                                <td>

                                    R$ {Number(order.total).toFixed(2)}

                                </td>

                                <td>

                                    {new Date(
                                        order.created_at
                                    ).toLocaleDateString('pt-BR')}

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

        </AdminLayout>

    );

}

export default Admin;