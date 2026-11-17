import { Link } from 'react-router-dom';

import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';

import { useAuth } from '../../context/AuthContext';

import './MyAccount.css';

function MyAccount() {

    const { user } =
        useAuth();

    return (

        <>
            <Header />

            <main className="account-page">

                <aside className="account-sidebar">

                    <h3>
                        Minha Conta
                    </h3>

                    <Link to="/minha-conta">
                        Dados Pessoais
                    </Link>

                    <Link to="/enderecos">
    Endereços
</Link>

                    <Link to="/meus-pedidos">
                        Meus Pedidos
                    </Link>

                    <Link to="/favorites">
                        Favoritos
                    </Link>

                </aside>

                <section className="account-content">

                    <h1>
                        Dados Pessoais
                    </h1>

                    <div className="info-row">

                        <strong>
                            Nome
                        </strong>

                        {user?.name}

                    </div>

                    <div className="info-row">

                        <strong>
                            E-mail
                        </strong>

                        {user?.email}

                    </div>

                </section>

            </main>

            <Footer />

        </>

    );

}

export default MyAccount;