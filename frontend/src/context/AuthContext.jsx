/* eslint-disable react-refresh/only-export-components */

import {
    createContext,
    useContext,
    useState
} from 'react';

const AuthContext =
    createContext(null);

export function AuthProvider({
    children
}) {

    const [user, setUser] =
        useState(() => {

            const storageUser =
                localStorage.getItem(
                    'bookstore_user'
                );

            return storageUser
                ? JSON.parse(storageUser)
                : null;

        });

    function login(
        userData,
        token
    ) {

        localStorage.setItem(
            'bookstore_token',
            token
        );

        localStorage.setItem(
            'bookstore_user',
            JSON.stringify(userData)
        );

        setUser(userData);

    }

    function logout() {

        localStorage.removeItem(
            'bookstore_token'
        );

        localStorage.removeItem(
            'bookstore_user'
        );

        setUser(null);

    }

    return (

        <AuthContext.Provider
            value={{
                user,
                login,
                logout
            }}
        >

            {children}

        </AuthContext.Provider>

    );

}

export function useAuth() {

    return useContext(
        AuthContext
    );

}