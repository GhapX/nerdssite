# NERDS — Núcleo Especializado em Reengenharia e Desenvolvimento de Software

Site institucional do projeto NERDS. A página apresenta o núcleo, uma seleção
de projetos do portfólio e seus integrantes. Foi mantida simples para facilitar
a apresentação acadêmica e a publicação em um servidor estático.

## O que o site contém

- Apresentação do projeto e de seus objetivos.
- Portfólio com links para os projetos.
- Lista pesquisável de integrantes.
- Layout responsivo para computador e celular.

## Requisitos

- Node.js 20 ou superior.
- npm.

## Executar localmente

Na pasta do projeto, instale as dependências e inicie o servidor de
desenvolvimento:

```bash
npm install
npm run dev
```

O Vite mostrará no terminal o endereço local para abrir no navegador.

## Atualizar o conteúdo

Edite [`src/data/portfolio.ts`](src/data/portfolio.ts):

- `PROJECTS` guarda o título, a descrição, a categoria, a imagem e o link de
  cada projeto.
- `MEMBER_NAMES` guarda os nomes exibidos na seção de integrantes.


## Gerar e conferir a versão de publicação

```bash
npm run build
npm run preview
```

O comando de build gera o site pronto para publicação na pasta `dist/`. O
preview serve essa versão localmente para uma última conferência.


| Configuração | Valor |
| --- | --- |
| Comando de instalação | `npm install` |
| Comando de build | `npm run build` |
| Diretório de publicação | `dist` |

