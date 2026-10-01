# NERDS — Núcleo Especializado em Reengenharia e Desenvolvimento de Software

Site institucional do projeto NERDS. A página apresenta o núcleo, uma seleção
de projetos do portfólio e seus integrantes. Foi mantida simples para facilitar
a apresentação acadêmica e a publicação em um servidor estático.

## O que o site contém

- Apresentação do projeto e de seus objetivos.
- Portfólio com links para os projetos.
- Lista pesquisável de integrantes.
- Layout responsivo para computador e celular.

O conteúdo é carregado de arquivos locais do projeto. Não há API, banco de
dados, login, painel administrativo ou serviço de IA. As imagens de exemplo
usam URLs públicas; para publicar, substitua-as por imagens autorizadas e
hospedadas no próprio servidor ou em uma CDN.

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

Antes de publicar, confirme com a equipe que os nomes, as descrições, os links
e as imagens estão corretos e que há autorização para divulgá-los. Substitua
as imagens demonstrativas por arquivos próprios ou URLs diretas e permanentes
de uma CDN; nenhuma integração ou chave de API é necessária para exibi-las.

## Gerar e conferir a versão de publicação

```bash
npm run build
npm run preview
```

O comando de build gera o site pronto para publicação na pasta `dist/`. O
preview serve essa versão localmente para uma última conferência.

## Publicar no servidor da faculdade

O servidor precisa apenas servir arquivos estáticos. Envie o conteúdo de
`dist/` para a pasta pública do servidor (por exemplo, `public_html`, conforme
a configuração da faculdade). Não é necessário instalar Node.js no servidor,
configurar banco de dados ou manter um processo de API em execução.

Se a hospedagem exigir um diretório de publicação, use `dist`. Em plataformas
com build automático, configure:

| Configuração | Valor |
| --- | --- |
| Comando de instalação | `npm install` |
| Comando de build | `npm run build` |
| Diretório de publicação | `dist` |

Confira com a equipe de infraestrutura da faculdade se o servidor aceita
hospedagem estática e qual é o procedimento para enviar os arquivos. Depois da
publicação, teste os links e as imagens usando a rede e os dispositivos da
apresentação.
