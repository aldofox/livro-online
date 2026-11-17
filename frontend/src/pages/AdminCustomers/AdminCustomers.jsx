import { useEffect, useState } from 'react';
import { showFlash } from '../../utils/flash';

import AdminLayout from '../../components/Admin/AdminLayout';

import { getCustomers } from '../../services/adminService';

import './AdminCustomers.css';

function AdminCustomers() {

    const [customers, setCustomers] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

const [search, setSearch] =
        useState('');

    async function loadCustomers() {

        try {

            const data =
                await getCustomers();

            setCustomers(
                data.customers || []
            );

        } catch (error) {
            showFlash(error.response?.data?.message || 'Não foi possível carregar os clientes.', 'error');

        } finally {

            setLoading(false);

        }

    }

    useEffect(() => {

        (async () => {
            await loadCustomers();
        })();

    }, []);

    const filtered = customers.filter(c => {

        const text = search.toLowerCase();

        return (
            (c.name || '').toLowerCase().includes(text) ||
            (c.email || '').toLowerCase().includes(text)
        );

    });

    function getInitials(name) {

        if (!name) return '?';

        return name
            .split(' ')
            .map(part => part[0])
            .slice(0, 2)
            .join('')
            .toUpperCase();

    }

    if (loading) {

        return (
            <AdminLayout>
                <h2>Carregando clientes...</h2>
            </AdminLayout>
        );

    }

    return (

        <AdminLayout>

            <div className="admin-header">

                <h1>
                    <i className="fa-solid fa-users"></i>
                    {' '}
                    Clientes
                </h1>

            </div>

            <div className="admin-toolbar">

                <input
                    className="admin-search"
                    type="text"
                    placeholder="Buscar por nome ou e-mail..."
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                />

            </div>

            {filtered.length === 0 ? (

                <p>
                    Nenhum cliente encontrado.
                </p>

            ) : (

                <div style={{ overflowX: 'auto' }}>

                    <table className="customers-table">

                        <thead>

                            <tr>

                                <th></th>
                                <th>Nome</th>
                                <th>E-mail</th>
                                <th>Telefone</th>
                                <th>Pedidos</th>
                                <th>Status</th>
                                <th>Cadastro</th>

                            </tr>

                        </thead>

                        <tbody>

                            {filtered.map(customer => (

                                <tr key={customer.id}>

                                    <td>

                                        <div className="customer-avatar">

                                            {getInitials(
                                                customer.name
                                            )}

                                        </div>

                                    </td>

                                    <td>
                                        {customer.name}
                                    </td>

                                    <td>
                                        {customer.email}
                                    </td>

                                    <td>
                                        {customer.phone || '-'}
                                    </td>

                                    <td>
                                        {customer.total_orders || 0}
                                    </td>

                                    <td>

                                        <span
                                            className={
                                                `badge ${
                                                    customer.status === 'active'
                                                        ? 'badge-success'
                                                        : 'badge-danger'
                                                }`
                                            }
                                        >
                                            {customer.status === 'active'
                                                ? 'Ativo'
                                                : 'Inativo'}
                                        </span>

                                    </td>

                                    <td>

                                        {new Date(
                                            customer.created_at
                                        ).toLocaleDateString('pt-BR')}

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

export default AdminCustomers;
