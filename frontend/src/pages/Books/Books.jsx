import { useEffect, useState } from 'react';
import { showFlash } from '../../utils/flash';

import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import BookCard from '../../components/BookCard/BookCard';

import api from '../../services/api';

import './Books.css';

function Books() {

    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    async function loadBooks() {

        try {

            const response =
                await api.get('/books');

            setBooks(
                response.data.books || []
            );

        } catch (error) {
            showFlash(error.response?.data?.message || 'Não foi possível carregar os livros.', 'error');

        } finally {

            setLoading(false);

        }

    }

useEffect(() => {

        (async () => {
            await loadBooks();
        })();

    }, []);

    const filtered = books.filter(book => {

        const text = search.toLowerCase();

        return (
            (book.status === 'active') &&
            (
                (book.title || '').toLowerCase().includes(text) ||
                (book.author || '').toLowerCase().includes(text)
            )
        );

    });

    return (

        <>
            <Header />

            <main className="books-page">

                <div className="page-header">

                    <h1>Livros</h1>

                    <p>
                        Explore todo o nosso catálogo de livros.
                    </p>

                </div>

                <div className="page-toolbar">

                    <input
                        type="text"
                        placeholder="Buscar livro por título ou autor..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                    />

                </div>

                {loading ? (

                    <p className="page-loading">
                        Carregando livros...
                    </p>

                ) : filtered.length === 0 ? (

                    <p className="page-empty">
                        Nenhum livro encontrado.
                    </p>

                ) : (

                    <div className="books-grid">

                        {filtered.map(book => (

                            <BookCard
                                key={book.id}
                                book={book}
                            />

                        ))}

                    </div>

                )}

            </main>

            <Footer />
        </>

    );

}

export default Books;
