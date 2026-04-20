# Ballet Academy Lumière Étoile — Site institucional + Admin (Supabase)

## 1. Visão geral

Este projeto é um **site institucional** do estúdio com páginas públicas (Home, Aulas/Modalidades, Blog, Galeria etc.) e um **painel administrativo** para gerenciamento do conteúdo.

- **Site público**: conteúdo para visitantes/alunos.
- **Admin**: área restrita para criar/editar posts, eventos, galeria e modalidades (aulas), com persistência no **Supabase**.

## 2. Tecnologias usadas

- **Front-end**: React 18 + TypeScript + Vite
- **UI/Estilo**: Tailwind CSS + shadcn/ui (Radix UI) + Lucide Icons
- **Roteamento**: React Router
- **Back-end (BaaS)**: Supabase (Auth, Database e Storage)
- **Editor (admin/blog)**: Tiptap
- **Animações**: Framer Motion
- **Qualidade**: ESLint
- **Testes**: Vitest (há dependência também de Playwright para e2e, se você quiser configurar)
- **Deploy**: Vercel (recomendado)

## 3. Funcionalidades

### Site (público)
- **Modalidades/Aulas**: listagem e detalhes (consome Supabase)
- **Blog**: listagem e página do post
- **Galeria**: exibição de fotos
- **Eventos**: agenda/listagem

### Painel Admin (restrito)
- **Login admin** (Supabase Auth)

- **Blog**
  - **Criar post**
  - **Editar post**
  - **Publicar / rascunho**
  - **Upload de imagem** (Supabase Storage)
  - **Listagem de posts**

- **Modalidades (Aulas)**
  - **Criar/editar modalidade**
  - **Upload de imagens**
  - (Opcional) professores adicionais, objetivos e sessões/horários

- **Galeria**
  - **Upload e remoção de fotos**

- **Eventos**
  - **Criar/editar/remover eventos**

> Comentários: atualmente **não há** funcionalidade de comentários no blog.

## 4. Como acessar

### URLs
- **URL do site**: `https://SEU-DOMINIO-AQUI`
- **URL do admin**: `https://SEU-DOMINIO-AQUI/admin`

### Login / senha
O login do Admin usa **e-mail e senha** do **Supabase Auth**.

- **Login**: e-mail do usuário admin no Supabase
- **Senha**: senha definida ao criar o usuário

Não existe “senha inicial padrão” no código: ela depende do usuário criado no Supabase.

### Permissão de admin (importante)
O projeto valida permissão de admin de duas formas (veja `src/lib/cms.ts`):

- **Por tabela `profiles`**: campo `is_admin` (quando a tabela/policies estiverem configuradas)
- **Fallback por env**: `VITE_ADMIN_EMAILS` (lista de e-mails admins, separados por vírgula)

## 5. Como usar (muito importante)

Esta seção é pensada para o **cliente/administrador do site**.

### 5.1 Entrar no Admin
1. Acesse `SEU-DOMINIO/admin`
2. Digite **e-mail** e **senha** cadastrados no Supabase
3. Clique em **Entrar**

Se aparecer “Usuário sem permissão”, verifique se o e-mail está:
- com `profiles.is_admin = true`, **ou**
- listado em `VITE_ADMIN_EMAILS` no `.env`

### 5.2 Criar um post no Blog
1. No Admin, clique em **Blog**
2. Clique em **Novo Post**
3. Preencha:
   - **Título**
   - **Resumo/summary**
   - **Conteúdo**
4. Faça o **upload da imagem** do post (quando disponível no formulário)
5. Marque como **Publicado** (se quiser que apareça no site)
6. Clique em **Salvar**

Resultado:
- Se estiver **Publicado**, o post aparece no site em `/blog`
- Se estiver como **Rascunho**, só fica visível no Admin

### 5.3 Editar um post existente
1. No Admin, clique em **Blog**
2. Na lista de posts, clique em **Editar** no post desejado
3. Altere o que precisar (texto, imagem, status)
4. Clique em **Salvar**

### 5.4 Subir/alterar imagens
As imagens são enviadas para o **Supabase Storage** (bucket `media`).

1. No formulário (post/galeria/modalidade), clique em **Upload**
2. Selecione a imagem no computador
3. Salve as alterações

Observação: ao remover um item (ex.: post), o sistema tenta remover também as imagens associadas no Storage.

### 5.5 Criar/editar modalidades (Aulas)
1. No Admin, clique em **Modalidades**
2. Clique em **Nova Modalidade**
3. Preencha informações como:
   - Nome, faixa etária, dias e horário
   - Nível
   - Imagem principal e professor(es)
4. (Opcional) Adicione **Turmas & horários**, **Objetivos** e professor adicional
5. Clique em **Criar/Salvar**

Para aparecer no site, a modalidade deve estar com status **published**.

---

## Rodando o projeto (para desenvolvedores)

### Requisitos
- **Node.js** (recomendado LTS) e npm

### Variáveis de ambiente
Crie `.env` na raiz (ou copie de `.env.example`) com:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_ADMIN_EMAILS` (opcional)

> Importante: não commite chaves reais em repositórios públicos.

### Desenvolvimento

```sh
npm install
npm run dev
```

O servidor de desenvolvimento roda na porta **8080** (configurado no `vite.config.ts`).

### Build e preview (produção)

```sh
npm run build
npm run preview
```

## Scripts

| Comando | Descrição |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento (Vite) |
| `npm run build` | Build de produção |
| `npm run build:dev` | Build usando `--mode development` |
| `npm run preview` | Preview local do build |
| `npm run lint` | ESLint |
| `npm test` | Testes unitários (Vitest run) |
| `npm run test:watch` | Vitest em modo watch |

## Deploy (Vercel)

1. Suba o projeto no GitHub/GitLab
2. Importe o repositório na Vercel
3. Configure as variáveis de ambiente na Vercel:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_ADMIN_EMAILS` (opcional)
4. Faça o deploy

## Estrutura do projeto (resumo)

- `src/pages/`: páginas (rotas). Ex.: `/admin` está em `src/pages/Admin.tsx`
- `src/components/`: componentes do site e do admin
- `src/lib/`: integração com Supabase (ex.: `supabase.ts`, `cms.ts`)
