/* eslint-disable react-refresh/only-export-components */

import {
    createContext,
    useContext,
    useEffect,
    useState
} from 'react';

const FavoritesContext =
    createContext(null);

export function FavoritesProvider({
    children
}) {

    const [favorites, setFavorites] =
        useState(() => {

            const storage =
                localStorage.getItem(
                    'bookstore_favorites'
                );

            return storage
                ? JSON.parse(storage)
                : [];

        });

    useEffect(() => {

        localStorage.setItem(
            'bookstore_favorites',
            JSON.stringify(favorites)
        );

    }, [favorites]);

    function addFavorite(book) {

        const exists =
            favorites.find(
                item => item.id === book.id
            );

        if (exists) return;

        setFavorites([
            ...favorites,
            book
        ]);

    }

    function removeFavorite(id) {

        setFavorites(

            favorites.filter(
                item => item.id !== id
            )

        );

    }

    function isFavorite(id) {

        return favorites.some(
            item => item.id === id
        );

    }

    return (

        <FavoritesContext.Provider
            value={{
                favorites,
                addFavorite,
                removeFavorite,
                isFavorite
            }}
        >

            {children}

        </FavoritesContext.Provider>

    );

}

export function useFavorites() {

    return useContext(
        FavoritesContext
    );

}