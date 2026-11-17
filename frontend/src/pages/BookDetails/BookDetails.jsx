import { useEffect, useState } from 'react';
import { showFlash } from '../../utils/flash';
import { useParams } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';

import api from '../../services/api';

import './BookDetails.css';

function BookDetails() {

    const { id } = useParams();

    const [book, setBook] = useState(null);
    const { addToCart } = useCart();

    useEffect(() => {

        async function loadBook() {

            try {

                const response =
                    await api.get(`/books/${id}`);

                setBook(
                    response.data.book
                );

            } catch (error) {
                showFlash(error.response?.data?.message || 'Não foi possível carregar os detalhes do livro.', 'error');

            }

        }

        loadBook();

    }, [id]);

    if (!book) {

        return (
            <>
                <Header />

                <main
                    style={{
                        maxWidth: '1400px',
                        margin: '50px auto',
                        padding: '20px'
                    }}
                >
                    <h2>Carregando...</h2>
                </main>

                <Footer />
            </>
        );

    }

    return (

        <>
            <Header />

            <main className="book-details">

                <div className="book-container">

                    <div className="book-image">

                        <img
                            src={`http://localhost:5000/uploads/books/${book.image}`}
                            alt={book.title}
                        />

                    </div>

                    <div className="book-info">

                        <h1>
                            {book.title}
                        </h1>

                        <h3>
                            {book.author}
                        </h3>

                        <div className="price">

                            R$ {Number(book.price).toFixed(2)}

                        </div>

                        <p>

                            {book.description_short ||
                                'Descrição não cadastrada.'}

                        </p>

                        <div className="buttons">

                            <button
                                className="buy-btn"
                            >
                                Comprar Agora
                            </button>

                            <button
    className="cart-btn"
    onClick={() => addToCart(book)}
>
    Adicionar ao Carrinho
</button>

                        </div>

                    </div>

                </div>

                <div className="tabs">

                    <div className="tab-section">

                        <h2>Sinopse</h2>

                        <p>

                            {book.description_long ||
                                'Sinopse não cadastrada.'}

                        </p>

                    </div>

                    <div className="tab-section">

                        <h2>Ficha Técnica</h2>

                        <table>

                            <tbody>

                                <tr>
                                    <td>ISBN</td>
                                    <td>
                                        {book.isbn || '-'}
                                    </td>
                                </tr>

                                <tr>
                                    <td>Autor</td>
                                    <td>
                                        {book.author || '-'}
                                    </td>
                                </tr>

                                <tr>
                                    <td>Páginas</td>
                                    <td>
                                        {book.pages || '-'}
                                    </td>
                                </tr>

                                <tr>
                                    <td>Editora</td>
                                    <td>
                                        {book.publisher || '-'}
                                    </td>
                                </tr>

                                <tr>
                                    <td>Idioma</td>
                                    <td>
                                        {book.language || '-'}
                                    </td>
                                </tr>

                                <tr>
                                    <td>Estoque</td>
                                    <td>
                                        {book.stock || '0'}
                                    </td>
                                </tr>

                            </tbody>

                        </table>

                    </div>

                </div>

            </main>

            <Footer />
        </>

    );

}

export default BookDetails;