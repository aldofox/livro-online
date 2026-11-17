import { useEffect, useState } from 'react';
import { showFlash } from '../../utils/flash';
import { Link } from 'react-router-dom';

import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';

import api from '../../services/api';

import './Categories.css';

function Categories() {

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    async function loadCategories() {

        try {

            const response =
                await api.get('/books/categories');

            setCategories(
                response.data.categories || []
            );

        } catch (error) {
            showFlash(error.response?.data?.message || 'Não foi possível carregar as categorias.', 'error');

        } finally {

            setLoading(false);

        }

    }

useEffect(() => {

        (async () => {
            await loadCategories();
        })();

    }, []);

    return (

        <>
            <Header />

            <main className="categories-page">

                <div className="page-header">

                    <h1>Categorias</h1>

                    <p>
                        Navegue pelos livros por categoria.
                    </p>

                </div>

                {loading ? (

                    <p className="page-loading">
                        Carregando categorias...
                    </p>

                ) : categories.length === 0 ? (

                    <p className="page-empty">
                        Nenhuma categoria cadastrada.
                    </p>

                ) : (

                    <div className="categories-grid">

                        {categories.map(category => (

                            <div
                                key={category.id}
                                className="category-card"
                            >

                                <div className="category-thumb">

                                    {category.image ? (

                                        <img
                                            src={`http://localhost:5000/uploads/${category.image}`}
                                            alt={category.name}
                                        />

                                    ) : (

                                        <i className="fas fa-book-open"></i>

                                    )}

                                </div>

                                <div className="category-body">

                                    <h3>
                                        {category.name}
                                    </h3>

                                    <span>
                                        {category.book_count || 0}
                                        {' '}
                                        livro(s)
                                    </span>

                                    <Link
                                        to={`/books`}
                                    >
                                        Ver livros
                                        {' '}
                                        <i className="fas fa-arrow-right"></i>
                                    </Link>

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

export default Categories;
