import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import AdminLayout from "../../components/Admin/AdminLayout";
import { showFlash } from "../../utils/flash";
import { createBook } from "../../services/adminBookService";
import { getCategories } from "../../services/adminService";

function BookForm() {

    const navigate = useNavigate();

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [file, setFile] = useState(null);

    const [form, setForm] = useState({
        title: "",
        author: "",
        publisher: "",
        isbn: "",
        pages: "",
        language: "",
        publication_date: "",
        description_short: "",
        description_long: "",
        price: "",
        promotional_price: "",
        stock: "",
        category_id: "",
        featured: "no",
        release_book: "no",
        status: "active"
    });

    async function loadCategories() {

        try {

            const data = await getCategories();

            setCategories(data.categories || []);

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

    function handleChange(e) {

        setForm({
            ...form,
            [e.target.name]: e.target.value
        });

    }

    function handleFile(e) {

        setFile(e.target.files[0]);

    }

    async function handleSubmit(e) {

        e.preventDefault();

        const formData = new FormData();

        Object.keys(form).forEach(key => {
            formData.append(key, form[key]);
        });

        if (file) {

            formData.append("image", file);

        }

        try {

            await createBook(formData);

            showFlash("Livro cadastrado com sucesso!", 'success');

            navigate("/admin/books");

        } catch (error) {
            showFlash(error.response?.data?.message || "Erro ao cadastrar livro.", 'error');

        }

    }

    if (loading) {

        return (
            <AdminLayout>
                <h2>Carregando...</h2>
            </AdminLayout>
        );

    }

    return (

        <AdminLayout>

<h1>
                <i className="fas fa-book-medical"></i>
                {' '}
                Novo Livro
            </h1>

            <form
                onSubmit={handleSubmit}
                className="admin-form"
            >

                <label>Categoria</label>
                <select
                    name="category_id"
                    value={form.category_id}
                    onChange={handleChange}
                    required
                >
                    <option value="">
                        Selecione a categoria
                    </option>
                    {categories.map(cat => (

                        <option
                            key={cat.id}
                            value={cat.id}
                        >
                            {cat.name}
                        </option>

                    ))}
                </select>

                <label>Título</label>
                <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    required
                />

                <label>Autor</label>
                <input
                    name="author"
                    value={form.author}
                    onChange={handleChange}
                    required
                />

                <label>Editora</label>
                <input
                    name="publisher"
                    value={form.publisher}
                    onChange={handleChange}
                />

                <label>ISBN</label>
                <input
                    name="isbn"
                    value={form.isbn}
                    onChange={handleChange}
                />

                <label>Páginas</label>
                <input
                    type="number"
                    name="pages"
                    value={form.pages}
                    onChange={handleChange}
                />

                <label>Idioma</label>
                <input
                    name="language"
                    value={form.language}
                    onChange={handleChange}
                />

                <label>Data de Publicação</label>
                <input
                    type="date"
                    name="publication_date"
                    value={form.publication_date}
                    onChange={handleChange}
                />

                <label>Descrição Curta</label>
                <textarea
                    name="description_short"
                    value={form.description_short}
                    onChange={handleChange}
                    rows="3"
                />

                <label>Descrição Longa</label>
                <textarea
                    name="description_long"
                    value={form.description_long}
                    onChange={handleChange}
                    rows="5"
                />

                <label>Preço (R$)</label>
                <input
                    type="number"
                    step="0.01"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    required
                />

                <label>Preço Promocional (R$)</label>
                <input
                    type="number"
                    step="0.01"
                    name="promotional_price"
                    value={form.promotional_price}
                    onChange={handleChange}
                />

                <label>Estoque</label>
                <input
                    type="number"
                    name="stock"
                    value={form.stock}
                    onChange={handleChange}
                />

                <label>Capa do Livro</label>
                <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleFile}
                />

                <label>Destaque</label>
                <select
                    name="featured"
                    value={form.featured}
                    onChange={handleChange}
                >
                    <option value="no">Não</option>
                    <option value="yes">Sim</option>
                </select>

                <label>Lançamento</label>
                <select
                    name="release_book"
                    value={form.release_book}
                    onChange={handleChange}
                >
                    <option value="no">Não</option>
                    <option value="yes">Sim</option>
                </select>

                <label>Status</label>
                <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                >
                    <option value="active">Ativo</option>
                    <option value="inactive">Inativo</option>
                </select>

                <br />

<button
                    type="submit"
                    className="btn-primary"
                >
                    <i className="fas fa-save"></i>
                    {' '}
                    Cadastrar Livro
                </button>

            </form>

        </AdminLayout>

    );

}

export default BookForm;
