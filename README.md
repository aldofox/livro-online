# BookStore

![React](https://img.shields.io/badge/React-19-149eca?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-ESM-339933?logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-Database-4479A1?logo=mysql&logoColor=white)

Aplicação de livraria online com catálogo de livros e e-books, carrinho, pedidos, área do cliente e painel administrativo. O projeto é dividido em uma API REST em Node.js/Express e uma interface web em React.

## Conteúdo

- [Funcionalidades](#funcionalidades)
- [Tecnologias](#tecnologias)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Pré-requisitos](#pré-requisitos)
- [Configuração](#configuração)
- [Executar localmente](#executar-localmente)
- [Acesso administrativo](#acesso-administrativo)
- [API](#api)
- [Build e qualidade](#build-e-qualidade)
- [Deploy](#deploy)
- [Segurança](#segurança)

## Funcionalidades

### Loja

- Catálogo de livros, e-books, categorias e detalhes de livros.
- Carrinho de compras e favoritos.
- Cadastro e login de clientes.
- Área do cliente, endereços e consulta de pedidos.
- Envio de pedidos e formulário de contato.
- Banners e depoimentos.

### Administração

- Painel administrativo protegido por autenticação e perfil.
- Gerenciamento de livros, autores, categorias e banners.
- Consulta de pedidos e clientes.
- Moderação de depoimentos.

## Tecnologias

| Camada | Tecnologias |
| --- | --- |
| Frontend | React 19, React Router, Axios, Vite 8 |
| Backend | Node.js, Express 5, JWT, bcrypt |
| Banco de dados | MySQL |
| Uploads | Arquivos locais servidos pela API |

## Estrutura do projeto

```text
.
├── backend/
│   ├── src/
│   │   ├── config/       # Conexão com o banco
│   │   ├── controllers/  # Regras das rotas
│   │   ├── middlewares/  # Autenticação e autorização
│   │   └── routes/       # Endpoints da API
│   ├── uploads/          # Arquivos enviados
│   └── package.json
├── database/
│   ├── bookestore.sql    # Esquema e dados iniciais
│   └── authors_tables.sql
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── context/
    │   ├── pages/
    │   ├── routes/
    │   └── services/
    └── package.json
```

## Pré-requisitos

- Node.js e npm compatíveis com as dependências do projeto.
- MySQL em execução.
- Git para clonar o repositório.

## Configuração

### 1. Banco de dados

Crie o banco de dados:

```sql
CREATE DATABASE `livro-online`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
```

Na raiz do projeto, importe o esquema (por exemplo, usando Git Bash/WSL):

```bash
mysql -u seu_usuario -p livro-online < database/bookestore.sql
```

No Windows, também é possível importar `database/bookestore.sql` pelo MySQL Workbench.

O arquivo `bookestore.sql` é destinado à configuração inicial. Ele adiciona a coluna `role` com `ALTER TABLE`; portanto, não o reimporte sem verificar o estado do banco.

### 2. Variáveis do backend

Crie `backend/.env` com os dados do seu ambiente:

```dotenv
PORT=5000
DB_HOST=localhost
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_NAME=livro-online
DB_PORT=3306
JWT_SECRET=gere_uma_chave_longa_e_aleatoria
```

Use valores próprios para seu ambiente e não publique esse arquivo.

### 3. Dependências

Instale as dependências do backend:

```bash
cd backend
npm install
```

Em outro terminal, instale as dependências do frontend:

```bash
cd frontend
npm install
```

## Executar localmente

Inicie a API:

```bash
cd backend
npm run dev
```

A API ficará disponível em `http://localhost:5000`. A rota raiz (`/`) verifica a conexão com o banco.

Inicie a interface em outro terminal:

```bash
cd frontend
npm run dev
```

O Vite informará no terminal o endereço local da aplicação. Atualmente, o frontend aponta para `http://localhost:5000/api`; para usar outra URL, ajuste `frontend/src/services/api.js`.

## Acesso administrativo

1. Cadastre uma conta pela tela de registro.
2. No banco, promova a conta cadastrada:

```sql
UPDATE customers
SET role = 'admin'
WHERE email = 'seu-email@exemplo.com';
```

3. Saia e entre novamente para que a sessão receba o perfil atualizado.
4. Acesse `/admin`.

O login da aplicação consulta a tabela `customers`; alterar uma tabela administrativa separada não concede acesso ao painel dessa conta.

## API

As rotas da API são prefixadas por `/api`.

| Grupo | Exemplos |
| --- | --- |
| Autenticação | `/api/auth/register`, `/api/auth/login` |
| Livros e conteúdo público | `/api/books`, `/api/authors`, `/api/banners` |
| Endereços e pedidos | `/api/addresses`, `/api/orders` |
| Administração | `/api/admin`, `/api/admin/books`, `/api/admin/authors` |
| Contato | `/api/contact` |

As rotas privadas exigem um token de autenticação. As rotas administrativas também verificam o perfil do usuário.

## Build e qualidade

Para validar o frontend:

```bash
cd frontend
npm run lint
npm run build
```

O backend não possui uma suíte de testes automatizados configurada no momento.

## Deploy

Gere os arquivos de produção do frontend com `npm run build` dentro de `frontend` e publique o conteúdo de `frontend/dist`. Execute o backend em um ambiente Node.js com as variáveis de ambiente configuradas e disponibilize a API por um proxy reverso HTTPS.

O endereço da API está atualmente definido em `frontend/src/services/api.js`. Atualize-o para o endereço do ambiente de produção antes de publicar a interface.

O `.htaccess` incluído trata reescritas para arquivos PHP existentes; ele não configura proxy para a API Express nem o fallback de rotas do React Router. Esses ajustes precisam ser configurados no servidor web usado no deploy.

## Segurança

- Nunca versione `backend/.env`, senhas, tokens ou credenciais de banco.
- Gere um `JWT_SECRET` exclusivo e forte para cada ambiente.
- Use HTTPS em produção e restrinja o acesso ao banco de dados.
- Não use contas ou senhas de desenvolvimento em produção.
