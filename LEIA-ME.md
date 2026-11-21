# SHKN Games — site de links de afiliados

## O que cada arquivo faz
| Arquivo | Para quê |
|---|---|
| `links.js` | **Trailers e links de afiliado** (o que você mais vai editar) |
| `produtos.js` | Lista dos produtos (nome, plataforma, descrição, promoção) |
| imagens (`.jpg`) | Capa e prints de cada produto, pelo nome do arquivo |
| `index.html`, `app.js`, `style.css` | O site em si (normalmente você não mexe) |

## Imagens: pastas fixas por categoria (dentro da pasta `imagens`)
Você **não** precisa criar uma pasta para cada jogo! Basta ter estas **8 pastas fixas** dentro de `imagens/`:

```
imagens/
  jogos-ps5/           (todos os jogos de PS5: gta-6_capa.jpg, gta-6_print1.jpg, astro-bot_capa.jpg...)
  jogos-switch/        (todos os jogos de Nintendo Switch 1 e 2)
  jogos-xbox/          (todos os jogos de Xbox Series X|S)
  consoles/            (consoles de PS5, Switch e Xbox + banner consoles_banner.jpg)
  ps5-acessorios/      (controles, headsets e acessórios de PS5)
  switch-acessorios/   (controles e acessórios de Switch)
  xbox-acessorios/     (controles e acessórios de Xbox)
  lojas/               (loja-amazon.png, loja-kabum.png, loja-mercadolivre.png, loja-shopee.png, loja-aliexpress.png)
```
- O site sabe sozinho em qual pasta procurar olhando a `plataforma` (`ps5`, `switch` ou `xbox`) e o `tipo` (`jogo`, `console` ou `acessorio`) no `produtos.js`.
- Os nomes dos arquivos continuam começando com o **id** do produto: `{id}_capa.jpg`, `{id}_print1.jpg`, `{id}_print2.jpg`…
- **Loja nova:** adicione uma linha em `LOJAS` no `produtos.js` e o logo `imagens/lojas/loja-NOME.png`. O botão aparece em todos os produtos ("Link em breve" até você colocar o link no `links.js`).

Regras:
- Tudo em letra minúscula, sem espaço e sem acento.
- Formatos aceitos: `.jpg`, `.png`, `.webp`, `.jpeg`.
- Numere os prints em sequência (1, 2, 3…). Se faltar um número, o site para antes dele.

A galeria aparece nesta ordem: **capa → trailer → prints**.

## Endereços sem "#"
O site usa endereços normais (`/produto/astro-bot`). O arquivo `.htaccess` faz isso funcionar na HostGator (Apache/cPanel): **não apague**.
Para testar no PC não dá mais para só abrir o `index.html`: use um servidor local que mande as rotas para o `index.html`.

## Trailer e links de afiliado: arquivo `links.js`
Cada linha: `produto_loja = seu link`

```
gta-6_trailer = https://www.youtube.com/watch?v=XXXXXXXXXXX
gta-6_amazon = https://amzn.to/seulink
gta-6_kabum = https://...
```

- Lojas: `amazon`, `kabum`, `mercadolivre`, `shopee`, `aliexpress`.
- Link vazio: o botão da loja aparece cinza ("Link em breve").
- Para esconder uma loja de um produto, escreva `-` no lugar do link.
- O arquivo já vem com todos os produtos e as 5 lojas, é só colar os links.

## Produto novo
1. Em `produtos.js`, copie um bloco `{ ... }`, cole abaixo e troque os dados (inclusive o `id`).
2. Em `links.js`, copie as 6 linhas de outro produto e troque o nome pelo novo `id`.
3. Suba as imagens com o nome `{id}_capa.jpg`, `{id}_print1.jpg`…

## Publicar mudanças na HostGator (cPanel)
1. Acesse o **Gerenciador de Arquivos** no cPanel da HostGator e abra a pasta do domínio (`public_html`).
2. Envie apenas os arquivos que você alterou (ex.: `links.js` e `index.html`). Não precisa subir a pasta `imagens/` inteira toda vez.
3. Sempre que editar `style.css`, `produtos.js`, `links.js` ou `app.js`, aumente o número do `?v=` no `index.html` (ex.: `?v=2`, `?v=3`) para forçar o navegador dos visitantes a carregar a versão nova.

## Ver o site no seu computador
Como os endereços não têm mais "#", abrir o `index.html` com dois cliques só mostra a página inicial. Para testar tudo, use um servidor local (como o servidor em Node ou Live Server) apontando para a pasta do projeto.

Cuidado com aspas, vírgulas e chaves no `produtos.js`: se o site ficar em branco depois de editar, quase sempre é uma vírgula ou aspas faltando.

## Avisos importantes
- O aviso de afiliado já está no rodapé e na página de cada produto. Mantenha.
- O site não mostra preço fixo de propósito: o botão leva pra loja, onde o preço está sempre atualizado.
