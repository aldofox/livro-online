import './Footer.css';

function Footer() {

    return (

        <footer className="footer">

            <div className="footer-container">

                <div>

                    <h3>BookStore</h3>

                    <p>
                        Sua livraria online com os
                        melhores livros e e-books.
                    </p>

                </div>

                <div>

                    <h3>Institucional</h3>

                    <ul>
                        <li>Quem Somos</li>
                        <li>Política Privacidade</li>
                        <li>Termos de Uso</li>
                    </ul>

                </div>

                <div>

                    <h3>Categorias</h3>

                    <ul>
                        <li>Romance</li>
                        <li>Tecnologia</li>
                        <li>Ficção</li>
                    </ul>

                </div>

                <div>

                    <h3>Contato</h3>

                    <ul>
                        <li>(11) 99999-9999</li>
                        <li>contato@bookstore.com</li>
                    </ul>

                </div>

            </div>

            <div className="copyright">

                © 2026 BookStore

            </div>

        </footer>

    );

}

export default Footer;