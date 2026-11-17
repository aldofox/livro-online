import api from './api';

function getToken() {
    return localStorage.getItem('bookstore_token');
}

function authHeaders() {
    return {
        Authorization: `Bearer ${getToken()}`
    };
}

// =========================================================
// DASHBOARD
// =========================================================

export async function getDashboard() {

    const response =
        await api.get(
            '/admin/dashboard',
            { headers: authHeaders() }
        );

    return response.data;

}

// =========================================================
// CATEGORIAS
// =========================================================

export async function getCategories() {

    const response =
        await api.get(
            '/admin/categories',
            { headers: authHeaders() }
        );

    return response.data;

}

export async function createCategory(data) {

    const response =
        await api.post(
            '/admin/categories',
            data,
            { headers: authHeaders() }
        );

    return response.data;

}

export async function updateCategory(id, data) {

    const response =
        await api.put(
            `/admin/categories/${id}`,
            data,
            { headers: authHeaders() }
        );

    return response.data;

}

export async function deleteCategory(id) {

    const response =
        await api.delete(
            `/admin/categories/${id}`,
            { headers: authHeaders() }
        );

    return response.data;

}

// =========================================================
// PEDIDOS (ADMIN)
// =========================================================

export async function getAdminOrders() {

    const response =
        await api.get(
            '/admin/orders',
            { headers: authHeaders() }
        );

    return response.data;

}

export async function updateOrderStatus(id, status) {

    const response =
        await api.put(
            `/admin/orders/${id}/status`,
            { order_status: status },
            { headers: authHeaders() }
        );

    return response.data;

}

// =========================================================
// CLIENTES (ADMIN)
// =========================================================

export async function getCustomers() {

    const response =
        await api.get(
            '/admin/customers',
            { headers: authHeaders() }
        );

    return response.data;

}

// =========================================================
// COMENTÁRIOS / DEPOIMENTOS
// =========================================================

export async function getTestimonials() {

    const response =
        await api.get(
            '/admin/testimonials',
            { headers: authHeaders() }
        );

    return response.data;

}

export async function updateTestimonialStatus(id, status) {

    const response =
        await api.put(
            `/admin/testimonials/${id}/status`,
            { status },
            { headers: authHeaders() }
        );

    return response.data;

}

// =========================================================
// BANNERS (ADMIN)
// =========================================================

export async function getBanners() {

    const response =
        await api.get(
            '/admin/banners',
            { headers: authHeaders() }
        );

    return response.data;

}

export async function createBanner(data) {

    const response =
        await api.post(
            '/admin/banners',
            data,
            { headers: authHeaders() }
        );

    return response.data;

}

export async function updateBanner(id, data) {

    const response =
        await api.put(
            `/admin/banners/${id}`,
            data,
            { headers: authHeaders() }
        );

    return response.data;

}

export async function deleteBanner(id) {

    const response =
        await api.delete(
            `/admin/banners/${id}`,
            { headers: authHeaders() }
        );

    return response.data;

}

// =========================================================
// AUTORES (ADMIN)
// =========================================================

export async function getAuthors() {

    const response =
        await api.get(
            '/admin/authors',
            { headers: authHeaders() }
        );

    return response.data;

}

export async function createAuthor(data) {

    const response =
        await api.post(
            '/admin/authors',
            data,
            { headers: authHeaders() }
        );

    return response.data;

}

export async function updateAuthor(id, data) {

    const response =
        await api.put(
            `/admin/authors/${id}`,
            data,
            { headers: authHeaders() }
        );

    return response.data;

}

export async function deleteAuthor(id) {

    const response =
        await api.delete(
            `/admin/authors/${id}`,
            { headers: authHeaders() }
        );

    return response.data;

}

