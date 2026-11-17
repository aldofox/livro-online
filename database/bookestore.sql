-- =====================================================
-- TABELA USERS (ADMINISTRADORES / FUNCIONÁRIOS)
-- =====================================================

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'employee') DEFAULT 'employee',
    image VARCHAR(255),
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TABELA CLIENTES
-- =====================================================

CREATE TABLE customers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    cpf VARCHAR(20),
    birth_date DATE,
    image VARCHAR(255),
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- ENDEREÇOS CLIENTES
-- =====================================================

CREATE TABLE customer_addresses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    zip_code VARCHAR(20),
    street VARCHAR(255),
    number VARCHAR(20),
    complement VARCHAR(255),
    district VARCHAR(150),
    city VARCHAR(150),
    state VARCHAR(100),
    reference_point VARCHAR(255),

    CONSTRAINT fk_customer_address
        FOREIGN KEY (customer_id)
        REFERENCES customers(id)
        ON DELETE CASCADE
);

-- =====================================================
-- CATEGORIAS
-- =====================================================

CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    slug VARCHAR(150) UNIQUE,
    image VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- LIVROS
-- =====================================================

CREATE TABLE books (
    id INT AUTO_INCREMENT PRIMARY KEY,

    category_id INT,

    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE,

    author VARCHAR(255),
    publisher VARCHAR(255),

    isbn VARCHAR(50),

    pages INT,

    language VARCHAR(100),

    publication_date DATE,

    description_short TEXT,

    description_long LONGTEXT,

    price DECIMAL(10,2) NOT NULL,

    promotional_price DECIMAL(10,2),

    stock INT DEFAULT 0,

    image VARCHAR(255),

    featured ENUM('yes', 'no') DEFAULT 'no',

    release_book ENUM('yes', 'no') DEFAULT 'no',

    status ENUM('active', 'inactive') DEFAULT 'active',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_books_category
        FOREIGN KEY (category_id)
        REFERENCES categories(id)
        ON DELETE SET NULL
);

-- =====================================================
-- EBOOKS
-- =====================================================

CREATE TABLE ebooks (
    id INT AUTO_INCREMENT PRIMARY KEY,

    category_id INT,

    title VARCHAR(255) NOT NULL,

    slug VARCHAR(255) UNIQUE,

    author VARCHAR(255),

    isbn VARCHAR(50),

    description_short TEXT,

    description_long LONGTEXT,

    price DECIMAL(10,2),

    promotional_price DECIMAL(10,2),

    image VARCHAR(255),

    file VARCHAR(255),

    featured ENUM('yes', 'no') DEFAULT 'no',

    release_book ENUM('yes', 'no') DEFAULT 'no',

    status ENUM('active', 'inactive') DEFAULT 'active',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_ebooks_category
        FOREIGN KEY (category_id)
        REFERENCES categories(id)
        ON DELETE SET NULL
);

-- =====================================================
-- BANNERS
-- =====================================================

CREATE TABLE banners (
    id INT AUTO_INCREMENT PRIMARY KEY,

    title VARCHAR(255),

    subtitle VARCHAR(255),

    description TEXT,

    button_text VARCHAR(100),

    button_link VARCHAR(255),

    image VARCHAR(255),

    type ENUM('book', 'ebook'),

    reference_id INT,

    status ENUM('active', 'inactive') DEFAULT 'active',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- FAVORITOS
-- =====================================================

CREATE TABLE favorites (
    id INT AUTO_INCREMENT PRIMARY KEY,

    customer_id INT NOT NULL,

    book_id INT,

    ebook_id INT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_favorites_customer
        FOREIGN KEY (customer_id)
        REFERENCES customers(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_favorites_book
        FOREIGN KEY (book_id)
        REFERENCES books(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_favorites_ebook
        FOREIGN KEY (ebook_id)
        REFERENCES ebooks(id)
        ON DELETE CASCADE
);

-- =====================================================
-- CARRINHO
-- =====================================================

CREATE TABLE carts (
    id INT AUTO_INCREMENT PRIMARY KEY,

    customer_id INT NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_cart_customer
        FOREIGN KEY (customer_id)
        REFERENCES customers(id)
        ON DELETE CASCADE
);

-- =====================================================
-- ITENS CARRINHO
-- =====================================================

CREATE TABLE cart_items (
    id INT AUTO_INCREMENT PRIMARY KEY,

    cart_id INT NOT NULL,

    book_id INT,

    ebook_id INT,

    quantity INT DEFAULT 1,

    price DECIMAL(10,2),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_cart_items_cart
        FOREIGN KEY (cart_id)
        REFERENCES carts(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_cart_items_book
        FOREIGN KEY (book_id)
        REFERENCES books(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_cart_items_ebook
        FOREIGN KEY (ebook_id)
        REFERENCES ebooks(id)
        ON DELETE CASCADE
);

-- =====================================================
-- PEDIDOS
-- =====================================================

CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,

    customer_id INT NOT NULL,

    order_number VARCHAR(30) NOT NULL,

    total DECIMAL(10,2) NOT NULL,

    payment_method VARCHAR(50),

    status ENUM(
        'pending',
        'paid',
        'processing',
        'shipped',
        'delivered',
        'cancelled'
    ) DEFAULT 'pending',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_order_customer
        FOREIGN KEY (customer_id)
        REFERENCES customers(id)
        ON DELETE CASCADE
);

-- =====================================================
-- ITENS PEDIDOS
-- =====================================================

CREATE TABLE order_items (

    id INT AUTO_INCREMENT PRIMARY KEY,

    order_id INT NOT NULL,

    book_id INT NOT NULL,

    quantity INT NOT NULL,

    price DECIMAL(10,2) NOT NULL,

    subtotal DECIMAL(10,2) NOT NULL,

    CONSTRAINT fk_item_order
        FOREIGN KEY (order_id)
        REFERENCES orders(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_item_book
        FOREIGN KEY (book_id)
        REFERENCES books(id)
        ON DELETE CASCADE
);

-- =====================================================
-- PAGAMENTOS
-- =====================================================

CREATE TABLE payments (
    id INT AUTO_INCREMENT PRIMARY KEY,

    order_id INT NOT NULL,

    transaction_id VARCHAR(255),

    payment_gateway VARCHAR(100),

    amount DECIMAL(10,2),

    status VARCHAR(100),

    qr_code TEXT,

    boleto_url TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_payments_order
        FOREIGN KEY (order_id)
        REFERENCES orders(id)
        ON DELETE CASCADE
);

-- =====================================================
-- DEPOIMENTOS
-- =====================================================

CREATE TABLE testimonials (
    id INT AUTO_INCREMENT PRIMARY KEY,

    customer_id INT,

    message TEXT,

    rating INT DEFAULT 5,

    status ENUM('approved', 'pending') DEFAULT 'pending',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_testimonials_customer
        FOREIGN KEY (customer_id)
        REFERENCES customers(id)
        ON DELETE SET NULL
);

-- =====================================================
-- CUPONS
-- =====================================================

CREATE TABLE coupons (
    id INT AUTO_INCREMENT PRIMARY KEY,

    code VARCHAR(100) UNIQUE,

    discount DECIMAL(10,2),

    expiration_date DATE,

    status ENUM('active', 'inactive') DEFAULT 'active',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- CONTATOS
-- =====================================================

CREATE TABLE contacts (
    id INT AUTO_INCREMENT PRIMARY KEY,

    name VARCHAR(150),

    email VARCHAR(150),

    subject VARCHAR(255),

    message TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- LOG EMAILS
-- =====================================================

CREATE TABLE email_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,

    customer_id INT,

    subject VARCHAR(255),

    message TEXT,

    status VARCHAR(100),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_email_logs_customer
        FOREIGN KEY (customer_id)
        REFERENCES customers(id)
        ON DELETE SET NULL
);

-- =====================================================
-- TABELA AUTORES
-- =====================================================

CREATE TABLE IF NOT EXISTS authors (
    id INT AUTO_INCREMENT PRIMARY KEY,

    name VARCHAR(255) NOT NULL,

    bio TEXT,

    photo VARCHAR(255),

    category_id INT,

    status ENUM('active', 'inactive') DEFAULT 'active',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_authors_category
        FOREIGN KEY (category_id)
        REFERENCES categories(id)
        ON DELETE SET NULL
);

-- =====================================================
-- TABELA RELACIONAMENTO AUTORES x LIVROS
-- =====================================================

CREATE TABLE IF NOT EXISTS author_books (
    id INT AUTO_INCREMENT PRIMARY KEY,

    author_id INT NOT NULL,

    book_id INT NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_author_books_author
        FOREIGN KEY (author_id)
        REFERENCES authors(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_author_books_book
        FOREIGN KEY (book_id)
        REFERENCES books(id)
        ON DELETE CASCADE
);

ALTER TABLE customers
ADD COLUMN role ENUM('customer','admin')
DEFAULT 'customer';

UPDATE customers
SET role = 'admin'
WHERE email = 'admin@loja.com';