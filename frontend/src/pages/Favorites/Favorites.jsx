import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { Link } from 'react-router-dom';

import {
    useFavorites
} from '../../context/FavoritesContext';

import './Favorites.css';

function Favorites() {

    const {
        favorites,
        removeFavorite
    } = useFavorites();

    return (

        <>
            <Header />

            <main className="favorites-page">

                <h1>
                    Meus Favoritos
                </h1>

                {favorites.length === 0 ? (

                    <p>
                        Nenhum livro favoritado.
                    </p>

                ) : (

                    <div className="favorites-list">

                        {favorites.map(book => (

                            <div
                                key={book.id}
                                className="favorite-item"
                            >

                                <img
                                    src={
                                        book.image
                                            ? `http://localhost:5000/uploads/books/${book.image}`
                                            : 'https://placehold.co/100x140'
                                    }
                                    alt={book.title}
                                />

                                <div className="item-info">

                                    <h3>
                                        {book.title}
                                    </h3>

                                    {book.author && (
                                        <p>
                                            {book.author}
                                        </p>
                                    )}

                                    <p className="item-price">

                                        R$
                                        {' '}
                                        {Number(
                                            book.price
                                        ).toFixed(2)}

                                    </p>

                                    <Link
                                        to={`/book/${book.id}`}
                                    >
                                        Ver Detalhes
                                    </Link>

                                    <button
                                        className="remove-fav"
                                        onClick={() =>
                                            removeFavorite(
                                                book.id
                                            )
                                        }
                                    >
                                        Remover
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

export default Favorites;
