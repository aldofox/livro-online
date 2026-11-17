import { useEffect, useState } from 'react';
import { showFlash } from '../../utils/flash';
import { Link } from 'react-router-dom';

import AdminLayout from '../../components/Admin/AdminLayout';

import {
    getBooks,
    deleteBook
} from '../../services/adminBookService';

function AdminBooks() {

    const [books, setBooks] = useState([]);
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

const booksPerPage = 10;

    async function loadBooks() {

        try {

            const data = await getBooks();

            setBooks(data.books || []);

        } catch (error) {
            showFlash(error.response?.data?.message || 'Não foi possível carregar os livros.', 'error');

        }

    }

useEffect(() => {

        async function init() {
            await loadBooks();
        }

        init();

    }, []);

    async function handleDelete(id) {

        const confirmDelete = window.confirm(
            'Deseja realmente excluir este livro?'
        );

        if (!confirmDelete) {

            return;

        }

        try {

            await deleteBook(id);

            loadBooks();

        } catch (error) {
            showFlash(error.response?.data?.message || 'Não foi possível excluir o livro.', 'error');

        }

    }

 const filteredBooks = books.filter(book => {

    const text = search.toLowerCase();

    return (
        (book.title || '').toLowerCase().includes(text) ||
        (book.author || '').toLowerCase().includes(text)
    );

});
    

    const totalPages = Math.max(
        1,
        Math.ceil(filteredBooks.length / booksPerPage)
    );

    const indexOfLastBook =
        currentPage * booksPerPage;

    const indexOfFirstBook =
        indexOfLastBook - booksPerPage;

    const currentBooks =
        filteredBooks.slice(
            indexOfFirstBook,
            indexOfLastBook
        );

    return (

        <AdminLayout>

<div className="admin-header">

                <h1>
                    <i className="fas fa-book-open"></i>
                    {' '}
                    Gerenciar Livros
                </h1>

                <Link
                    to="/admin/books/new"
                    className="btn-primary"
                >
                    <i className="fas fa-plus"></i>
                    {' '}
                    Novo Livro
                </Link>

            </div>

            <div className="admin-toolbar">

                <input
                    className="admin-search"
                    type="text"
                    placeholder="Pesquisar por título ou autor..."
                    value={search}
                    onChange={(e) => {

                        setSearch(e.target.value);
                        setCurrentPage(1);

                    }}
                />

            </div>

            <table className="admin-table">

                <thead>

                    <tr>

                        <th>Capa</th>
                        <th>ID</th>
                        <th>Título</th>
                        <th>Autor</th>
                        <th>Preço</th>
                        <th>Estoque</th>
                        <th>Status</th>
                        <th>Ações</th>

                    </tr>

                </thead>

                <tbody>

                    {currentBooks.map(book => (

                        <tr key={book.id}>

                            <td>

                                <img
                                    className="book-thumb"
                                    src={
                                        book.image
                                            ? `http://localhost:5000/uploads/books/${book.image}`
                                            : 'https://placehold.co/60x80?text=Livro'
                                    }
                                    alt={book.title}
                                />

                            </td>

                            <td>{book.id}</td>

                            <td>{book.title}</td>

                            <td>{book.author}</td>

                            <td>

                                R$ {Number(book.price).toFixed(2)}

                            </td>

                            <td>

                                {book.stock <= 0 ? (

                                    <span className="badge badge-danger">
                                        Esgotado
                                    </span>

                                ) : book.stock <= 5 ? (

                                    <span className="badge badge-warning">
                                        {book.stock}
                                    </span>

                                ) : (

                                    <span className="badge badge-success">
                                        {book.stock}
                                    </span>

                                )}

                            </td>

                            <td>

                                {book.status === 'inactive' ? (

                                    <span className="badge badge-danger">
                                        Inativo
                                    </span>

                                ) : (

                                    <span className="badge badge-success">
                                        Ativo
                                    </span>

                                )}

                            </td>

                            <td>

<Link
                                    to={`/admin/books/edit/${book.id}`}
                                    className="btn-edit"
                                >
                                    <i className="fas fa-pen"></i>
                                    {' '}
                                    Editar
                                </Link>

                                <button
                                    className="btn-delete"
                                    onClick={() =>
                                        handleDelete(book.id)
                                    }
                                >
                                    <i className="fas fa-trash"></i>
                                    {' '}
                                    Excluir
                                </button>

                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

            <div className="pagination">

<button
                    disabled={currentPage === 1}
                    onClick={() =>
                        setCurrentPage(currentPage - 1)
                    }
                >
                    <i className="fas fa-chevron-left"></i>
                    {' '}
                    Anterior
                </button>

                <span>

                    Página {currentPage} de {totalPages}

                </span>

<button
                    disabled={currentPage >= totalPages}
                    onClick={() =>
                        setCurrentPage(currentPage + 1)
                    }
                >
                    Próxima
                    {' '}
                    <i className="fas fa-chevron-right"></i>
                </button>
            </div>
        </AdminLayout>
    );
}
export default AdminBooks;
