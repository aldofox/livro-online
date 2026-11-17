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
