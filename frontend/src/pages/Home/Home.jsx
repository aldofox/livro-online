import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import Banner from '../../components/Banner/Banner';
import BookCard from '../../components/BookCard/BookCard';

import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { showFlash } from '../../utils/flash';

import './Home.css';

function Home() {
    const { user } = useAuth();

const [books, setBooks] = useState([]);
    const [ebooks, setEbooks] = useState([]);
    const [authors, setAuthors] = useState([]);
    const [testimonials, setTestimonials] = useState([]);
    const [bestSellers, setBestSellers] = useState([]);

    const [commentMessage, setCommentMessage] = useState('');
    const [commentRating, setCommentRating] = useState(5);
    const [submitting, setSubmitting] = useState(false);

    async function loadData() {
        try {
            const [bookRes, ebookRes, authorRes, testimonialRes, bestSellerRes] =
                await Promise.all([
                    api.get('/books'),
                    api.get('/books/ebooks'),
                    api.get('/authors'),
                    api.get('/books/testimonials'),
                    api.get('/books/best-sellers')
                ]);

            setBooks(bookRes.data.books || []);
            setEbooks(ebookRes.data.ebooks || []);
            setAuthors(authorRes.data.authors || []);
            setTestimonials(testimonialRes.data.testimonials || []);
            setBestSellers(bestSellerRes.data.bestSellers || []);
} catch (error) {
            showFlash(error.response?.data?.message || 'Não foi possível carregar o conteúdo da página.', 'error');
        }
    }

useEffect(() => {
        async function init() {
            await loadData();
        }
        init();
    }, []);

    function imgSrc(image) {
        return image
            ? 'http://localhost:5000/uploads/books/' + image
            : 'https://placehold.co/200x260';
    }

    function authorImg(photo) {
        return photo
            ? 'http://localhost:5000/uploads/authors/' + photo
            : 'https://placehold.co/120x120?text=Autor';
    }

    async function handleCommentSubmit(e) {
        e.preventDefault();

        if (!commentMessage.trim()) {
            showFlash('Escreva seu comentário antes de enviar.', 'warning');
            return;
        }

        setSubmitting(true);

        try {
            const token = localStorage.getItem('bookstore_token');

            await api.post(
                '/books/testimonials',
                {
                    message: commentMessage.trim(),
                    rating: commentRating
                },
                {
                    headers: {
                        Authorization: 'Bearer ' + token
                    }
                }
            );

            showFlash(
                'Comentário enviado com sucesso! Ele aparecerá na página após a aprovação do administrador.',
                'success'
            );

            setCommentMessage('');
            setCommentRating(5);
        } catch (error) {
            showFlash(error.response?.data?.message || 'Erro ao enviar comentário.', 'error');
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div>
            <Header />
            <Banner />

            <main className="home-main">
                <section className="home-section">
                    <h2>Livros</h2>
                    <div className="books-grid">
                        {books.map(book => (
                            <BookCard key={book.id} book={book} />
                        ))}
                    </div>
                </section>

                {ebooks.length > 0 && (
                    <section className="home-section">
                        <h2>E-books</h2>
                        <div className="books-grid">
                            {ebooks.map(ebook => (
                                <BookCard key={ebook.id} book={ebook} />
                            ))}
                        </div>
                    </section>
                )}

                {authors.length > 0 && (
                    <section className="home-section">
                        <h2>Nossos Autores</h2>
                        <div className="authors-grid">
                            {authors.map(author => (
                                <div key={author.id} className="author-card">
                                    <img
                                        src={authorImg(author.photo)}
                                        alt={author.name}
                                        className="author-photo"
                                    />
                                    <h3>{author.name}</h3>
                                    <span className="author-category">
                                        {author.category_name || 'Autor'}
                                    </span>
                                    <div className="author-books">
                                        {author.books && author.books.length > 0
                                            ? author.books.map(book => (
                                                <div key={book.id} className="author-book-item">
                                                    <img src={imgSrc(book.image)} alt={book.title} />
                                                    <span>{book.title}</span>
                                                </div>
                                            ))
: <p className="author-no-books">Sem livros cadastrados</p>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {testimonials.length > 0 && (
                    <section className="home-section">
                        <h2>O que dizem nossos clientes</h2>
                        <div className="testimonials-grid">
                            {testimonials.map(t => (
                                <div key={t.id} className="testimonial-card">
                                    <div className="testimonial-stars">
                                        {'★'.repeat(t.rating)}
                                        {'☆'.repeat(5 - t.rating)}
                                    </div>
                                    <p className="testimonial-message">
                                        "{t.message}"
                                    </p>
                                    <span className="testimonial-author">
                                        - {t.customer_name || 'Cliente'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                <section className="home-section comment-section">
                    <h2>Deixe seu comentário</h2>

                    {user && user.role === 'admin' && (
                        <p className="comment-login-hint">
                            Acesse o Painel Admin{' '}
                            <Link to="/admin/comments">aqui</Link>{' '}
                            para gerenciar os comentários.
                        </p>
                    )}

                    {user && user.role !== 'admin' && (
                        <form
                            className="comment-form"
                            onSubmit={handleCommentSubmit}
                        >
                            <label>Avaliação</label>
                            <div className="comment-rating">
                                {[1, 2, 3, 4, 5].map(star => (
                                    <button
                                        type="button"
                                        key={star}
                                        className={
                                            star <= commentRating
                                                ? 'rating-star active'
                                                : 'rating-star'
                                        }
                                        onClick={() => setCommentRating(star)}
                                    >
                                        ★
                                    </button>
                                ))}
                            </div>

                            <label>Seu comentário ou reclamação *</label>
                            <textarea
                                rows="4"
                                value={commentMessage}
                                onChange={e => setCommentMessage(e.target.value)}
                                placeholder="Conte sua experiência, tire dúvidas ou registre uma reclamação..."
                                required
                            />

                            <button
                                type="submit"
                                className="comment-submit-btn"
                                disabled={submitting}
                            >
                                {submitting ? 'Enviando...' : 'Enviar Comentário'}
                            </button>
                        </form>
                    )}

                    {!user && (
                        <div className="comment-login-prompt">
                            <p>
                                Para deixar um comentário ou enviar uma
                                reclamação, você precisa estar logado.
                            </p>
                            <div className="comment-login-actions">
                                <Link to="/login" className="comment-login-btn">
                                    Entrar
                                </Link>
                                <Link to="/register" className="comment-register-btn">
                                    Criar conta
                                </Link>
                            </div>
                        </div>
                    )}
                </section>

                <section className="home-section home-contact">
                    <div className="contact-banner">
                        <div className="contact-banner-info">
                            <h2>Fale conosco</h2>
                            <p>
                                Tem alguma dúvida sobre nossos produtos,
                                entregas ou devoluções? Estamos à disposição!
                            </p>
<a href="/contact" className="contact-banner-btn">
                                Ir para Contato
                            </a>
                        </div>
                    </div>
                </section>

                {bestSellers.length > 0 && (
                    <section className="home-section best-sellers-section">
                        <h2>Livros Mais Vendidos</h2>
                        <div className="best-sellers-grid">
                            {bestSellers.map(book => (
                                <div key={book.id} className="best-seller-card">
                                    <span className="best-seller-badge">
                                        🔥 Mais Vendido
                                    </span>
                                    <img
                                        className="best-seller-cover"
                                        src={imgSrc(book.image)}
                                        alt={book.title}
                                    />
                                    <h3>{book.title}</h3>
                                    <p className="best-seller-author">
                                        {book.author}
                                    </p>
                                    <p className="best-seller-desc">
                                        {book.description_short ||
                                            'Descrição não cadastrada.'}
                                    </p>
                                    <span className="best-seller-price">
                                        R$ {Number(book.price).toFixed(2)}
                                    </span>
                                    <div className="best-seller-actions">
                                        <Link
                                            to={`/book/${book.id}`}
                                            className="best-seller-details-btn"
                                        >
                                            Ver Detalhes
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </main>

            <Footer />
        </div>
    );
}

export default Home;
