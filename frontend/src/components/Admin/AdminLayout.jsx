import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import Sidebar from './Sidebar';

import './AdminLayout.css';

function AdminLayout({ children }) {

    return (

        <>
            <Header />

            <div className="admin-layout">

                <Sidebar />

                <main className="admin-content">

                    {children}

                </main>

            </div>

            <Footer />

        </>

    );

}

export default AdminLayout;