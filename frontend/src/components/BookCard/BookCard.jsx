import './BookCard.css';
import { Link } from 'react-router-dom';

import {
    useFavorites
} from '../../context/FavoritesContext';

function BookCard({ book }) {

    const {
        addFavorite,
        removeFavorite,
        isFavorite
    } = useFavorites();

    const favorite =
        isFavorite(book.id);

    function handleFavorite() {

        if (favorite) {

            removeFavorite(
                book.id
            );

        } else {

            addFavorite(book);

        }

    }

    return (

        <div className="book-card">

            <div
                className={`favorite ${
                    favorite
                        ? 'active'
                        : ''
                }`}
                onClick={handleFavorite}
            >

                <i className="fas fa-heart"></i>

            </div>

<img
                className="book-cover"
                src={
                    book.image
                        ? `http://localhost:5000/uploads/books/${book.image}`
                        : 'https://placehold.co/250x350'
                }
                alt={book.title}
            />

            <h3>
                {book.title}
            </h3>

            <p>
                {book.author}
            </p>

            <span>
                R$ {Number(book.price).toFixed(2)}
            </span>

            <Link
                to={`/book/${book.id}`}
                className="details-btn"
            >
                Ver Detalhes
            </Link>

        </div>

    );

}

export default BookCard;