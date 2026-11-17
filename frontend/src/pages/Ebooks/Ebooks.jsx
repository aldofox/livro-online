import { useEffect, useState } from 'react';
import { showFlash } from '../../utils/flash';

import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';

import api from '../../services/api';

import './Ebooks.css';

function Ebooks() {

    const [ebooks, setEbooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    async function loadEbooks() {

        try {

            const response =
                await api.get('/books/ebooks');

            setEbooks(
                response.data.ebooks || []
            );

        } catch (error) {
            showFlash(error.response?.data?.message || 'Não foi possível carregar os e-books.', 'error');

        } finally {

            setLoading(false);

        }

    }

useEffect(() => {

        (async () => {
            await loadEbooks();
        })();

    }, []);

    const filtered = ebooks.filter(ebook => {

        const text = search.toLowerCase();

        return (
            (ebook.title || '').toLowerCase().includes(text) ||
            (ebook.author || '').toLowerCase().includes(text)
        );

    });

    return (

        <>
            <Header />

            <main className="ebooks-page">

                <div className="page-header">

                    <h1>E-books</h1>

                    <p>
                        Leia onde quiser com nossos e-books digitais.
                    </p>

                </div>

                <div className="page-toolbar">

                    <input
                        type="text"
                        placeholder="Buscar e-book por título ou autor..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                    />

                </div>

                {loading ? (

                    <p className="page-loading">
                        Carregando e-books...
                    </p>

                ) : filtered.length === 0 ? (

                    <p className="page-empty">
                        Nenhum e-book encontrado.
                    </p>

                ) : (

                    <div className="ebooks-grid">

                        {filtered.map(ebook => (

                            <div
                                key={ebook.id}
                                className="ebook-card"
                            >

                                <img
                                    className="ebook-cover"
                                    src={
                                        ebook.image
                                            ? `http://localhost:5000/uploads/ebooks/${ebook.image}`
                                            : 'https://placehold.co/250x350'
                                    }
                                    alt={ebook.title}
                                />

                                <div className="ebook-body">

                                    <h3>
                                        {ebook.title}
                                    </h3>

                                    <p>
                                        {ebook.author}
                                    </p>

                                    <span>
                                        R$ {Number(ebook.price).toFixed(2)}
                                    </span>

                                    <button>
                                        Em breve
                                    </button>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </main>

            <Footer />
        </>

    );

}

export default Ebooks;
