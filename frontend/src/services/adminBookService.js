import api from './api';

function getToken() {
    return localStorage.getItem('bookstore_token');
}

export async function getBooks() {
    const response = await api.get('/admin/books', {
        headers: {
            Authorization: `Bearer ${getToken()}`
        }
    });

    return response.data;
}

export async function getBookById(id) {
    const response = await api.get(`/books/${id}`, {
        headers: {
            Authorization: `Bearer ${getToken()}`
        }
    });

    return response.data;
}

export async function createBook(formData) {
    const response = await api.post(
        '/books',
        formData,
        {
            headers: {
                Authorization: `Bearer ${getToken()}`,
                'Content-Type': 'multipart/form-data'
            }
        }
    );

    return response.data;
}

export async function updateBook(id, formData) {
    const response = await api.put(
        `/books/${id}`,
        formData,
        {
            headers: {
                Authorization: `Bearer ${getToken()}`,
                'Content-Type': 'multipart/form-data'
            }
        }
    );

    return response.data;
}

export async function deleteBook(id) {
    const response = await api.delete(
        `/books/${id}`,
        {
            headers: {
                Authorization: `Bearer ${getToken()}`
            }
        }
    );

    return response.data;
}

