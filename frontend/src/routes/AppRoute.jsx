import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home from '../pages/Home/Home';
import Login from '../pages/Login/Login';
import Register from '../pages/Register/Register';
import Cart from '../pages/Cart/Cart';
import Contact from '../pages/Contact/Contact';
import Books from '../pages/Books/Books';
import Ebooks from '../pages/Ebooks/Ebooks';
import Categories from '../pages/Categories/Categories';
import BookDetails from '../pages/BookDetails/BookDetails';
import Favorites from '../pages/Favorites/Favorites';
import MyAccount from '../pages/MyAccount/MyAccount';
import MyOrders from '../pages/MyOrders/MyOrders';
import ProtectedRoute from '../components/ProtectedRoute';
import Addresses from '../pages/Addresses/Addresses';
import Checkout from '../pages/Checkout/Checkout';
import OrderDetails from '../pages/OrderDetails/OrderDetails';
import AdminRoute from './AdminRoute';
import Admin from '../pages/Admin/Admin';
import AdminBooks from '../pages/AdminBooks/AdminBooks';
import BookForm from '../pages/AdminBooks/BookForm';
import EditBook from '../pages/EditBook/EditBook';
import AdminCategories from '../pages/AdminCategories/AdminCategories';
import AdminOrders from '../pages/AdminOrders/AdminOrders';
import AdminCustomers from '../pages/AdminCustomers/AdminCustomers';
import AdminComments from '../pages/AdminComments/AdminComments';
import AdminBanners from '../pages/AdminBanners/AdminBanners';
import AdminAuthors from '../pages/AdminAuthors/AdminAuthors';

function AppRoutes() {

    return (

        <BrowserRouter>

            <Routes>

                <Route
                    path="/"
                    element={<Home />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />

                <Route
                    path="/cart"
                    element={<Cart />}
                />

                <Route
                    path="/books"
                    element={<Books />}
                />

                <Route
                    path="/ebooks"
                    element={<Ebooks />}
                />

                <Route
                    path="/categories"
                    element={<Categories />}
                />

                <Route
                    path="/contact"
                    element={<Contact />}
                />

                <Route
                    path="/book/:id"
                    element={<BookDetails />}
                />

                <Route
                    path="/pedido/:id"
                    element={<OrderDetails />}
                />

                <Route
                    path="/favorites"
                    element={<Favorites />}
                />

                <Route
                    path="/minha-conta"
                    element={
                        <ProtectedRoute>
                            <MyAccount />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/meus-pedidos"
                    element={
                        <ProtectedRoute>
                            <MyOrders />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/enderecos"
                    element={
                        <ProtectedRoute>
                            <Addresses />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/my-orders"
                    element={
                        <ProtectedRoute>
                            <MyOrders />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/checkout"
                    element={<Checkout />}
                />

                <Route
                    path="/admin"
                    element={
                        <AdminRoute>
                            <Admin />
                        </AdminRoute>
                    }
                />

                <Route
                    path="/admin/books"
                    element={
                        <AdminRoute>
                            <AdminBooks />
                        </AdminRoute>
                    }
                />

                <Route
                    path="/admin/books/new"
                    element={
                        <AdminRoute>
                            <BookForm />
                        </AdminRoute>
                    }
                />

                <Route
                    path="/admin/books/edit/:id"
                    element={<EditBook />}
                />

                <Route
                    path="/admin/categories"
                    element={
                        <AdminRoute>
                            <AdminCategories />
                        </AdminRoute>
                    }
                />

                <Route
                    path="/admin/orders"
                    element={
                        <AdminRoute>
                            <AdminOrders />
                        </AdminRoute>
                    }
                />

                <Route
                    path="/admin/customers"
                    element={
                        <AdminRoute>
                            <AdminCustomers />
                        </AdminRoute>
                    }
                />

                <Route
                    path="/admin/comments"
                    element={
                        <AdminRoute>
                            <AdminComments />
                        </AdminRoute>
                    }
                />

                <Route
                    path="/admin/banners"
                    element={
                        <AdminRoute>
                            <AdminBanners />
                        </AdminRoute>
                    }
                />

                <Route
                    path="/admin/authors"
                    element={
                        <AdminRoute>
                            <AdminAuthors />
                        </AdminRoute>
                    }
                />

            </Routes>

        </BrowserRouter>

    );

}

export default AppRoutes;
