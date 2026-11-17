

## Objetivo
Fazer o Banner exibir produtos reais (livros) e criar área no Painel Admin
para o administrador definir quais produtos aparecem no banner (Opção A).

## Backend
- [x] Analisar estrutura existente (tabela banners, rotas admin, controller)
- [x] `adminController.js`: adicionar métodos listBanners, createBanner, updateBanner, deleteBanner
- [x] `adminRoutes.js`: adicionar rotas /banners (CRUD)
- [x] `bookController.js`: adicionar método público listBanners (banners ativos com dados do livro)
- [x] `bookRoutes.js`: adicionar rota pública GET /banners

## Frontend
- [x] `adminService.js`: adicionar getBanners, createBanner, updateBanner, deleteBanner
- [x] Corrigir página `AdminBanners.jsx` (está truncado - falta fechar JSX)
- [x] Criar `AdminBanners.css` (estilos da página admin)
- [x] `Banner.jsx`: buscar banners ativos da API e exibir livro vinculado
- [x] `AppRoute.jsx`: adicionar rota /admin/banners
- [x] `Sidebar.jsx`: adicionar link "Banners"

## Validação
- [x] Rodar `npm run build` no frontend
- [ ] Testar fluxo: criar banner no admin e ver no site

## Correção - Cadastro de Livro (erro 500)
- [x] `bookController.js` método `create`: adicionar função `clean()` para
  normalizar campos vazios (publication_date, pages, stock, promotional_price,
  category_id, etc.) convertendo "" -> null antes do INSERT
- [ ] Testar cadastro de livro no admin (preencher e salvar)

## Correção - Avisos ESLint (no-use-before-define)
- [x] `Home.jsx`: mover `useEffect(() => { loadData(); }, [])` para depois da
  declaração de `loadData` e usar função async `init()` dentro do effect
- [x] `AdminBooks.jsx`: mover `useEffect()` para depois de `loadBooks` e usar
  função async `init()` dentro do effect
- [x] Rodar `npm run build` - confirmado sem erros nem avisos (NO_ERRORS_OR_WARNINGS)
