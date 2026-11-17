import { Link } from 'react-router-dom';

import './Sidebar.css';

function Sidebar() {

    return (

        <aside className="admin-sidebar">

            <h2>Painel Admin</h2>

<nav>

                <Link to="/admin">
                    <i className="fas fa-chart-line"></i>
                    Dashboard
                </Link>

                <Link to="/admin/books">
                    <i className="fas fa-book"></i>
                    Livros
                </Link>

                <Link to="/admin/categories">
                    <i className="fas fa-tags"></i>
                    Categorias
                </Link>

                <Link to="/admin/orders">
                    <i className="fas fa-shopping-bag"></i>
                    Pedidos
                </Link>

                <Link to="/admin/customers">
                    <i className="fas fa-users"></i>
                    Clientes
                </Link>

                <Link to="/admin/comments">
                    <i className="fas fa-comments"></i>
                    Comentários
                </Link>

                <Link to="/admin/banners">
                    <i className="fas fa-images"></i>
                    Banners
                </Link>

                <Link to="/admin/authors">
                    <i className="fas fa-user-pen"></i>
                    Autores
                </Link>

            </nav>

        </aside>

    );

}

export default Sidebar;
