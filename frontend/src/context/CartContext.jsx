import {
    createContext,
    useContext,
    useEffect,
    useState
} from 'react';
import { showFlash } from '../utils/flash';

const CartContext = createContext(null);

export function CartProvider({ children }) {

    const [cartItems, setCartItems] = useState(() => {

        try {

            const storageCart =
                localStorage.getItem(
                    'bookstore_cart'
                );

            return storageCart
                ? JSON.parse(storageCart)
                : [];

        } catch {
            window.setTimeout(() => {
                showFlash('Não foi possível carregar os dados salvos do carrinho.', 'error');
            }, 0);

            return [];

        }

    });

    useEffect(() => {

        localStorage.setItem(
            'bookstore_cart',
            JSON.stringify(cartItems)
        );

    }, [cartItems]);

    function addToCart(book) {

        const itemExists =
            cartItems.find(
                item => item.id === book.id
            );

        if (itemExists) {

            const updatedCart =
                cartItems.map(
                    item =>
                        item.id === book.id
                            ? {
                                  ...item,
                                  quantity:
                                      item.quantity + 1
                              }
                            : item
                );

            setCartItems(updatedCart);

            return;

        }

        setCartItems([
            ...cartItems,
            {
                ...book,
                quantity: 1
            }
        ]);

    }

    function removeFromCart(id) {

        const updatedCart =
            cartItems.filter(
                item => item.id !== id
            );

        setCartItems(updatedCart);

    }

    function updateQuantity(
        id,
        quantity
    ) {

        if (quantity <= 0) {

            removeFromCart(id);

            return;

        }

        const updatedCart =
            cartItems.map(
                item =>
                    item.id === id
                        ? {
                              ...item,
                              quantity
                          }
                        : item
            );

        setCartItems(updatedCart);

    }

    function clearCart() {

        setCartItems([]);

        localStorage.removeItem(
            'bookstore_cart'
        );

    }

    const total =
        cartItems.reduce(
            (acc, item) =>
                acc +
                Number(item.price) *
                    item.quantity,
            0
        );

    return (

        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                total
            }}
        >

            {children}

        </CartContext.Provider>

    );

}

export function useCart() {

    const context =
        useContext(CartContext);

    if (!context) {

        throw new Error(
            'useCart deve ser usado dentro de um CartProvider'
        );

    }

    return context;

}
export default CartContext;
