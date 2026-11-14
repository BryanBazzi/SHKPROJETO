# SHKN Games — site de links de afiliados

## O que cada arquivo faz
| Arquivo | Para quê |
|---|---|
| `links.js` | **Trailers e links de afiliado** (o que você mais vai editar) |
| `produtos.js` | Lista dos produtos (nome, plataforma, descrição, promoção) |
| imagens (`.jpg`) | Capa e prints de cada produto, pelo nome do arquivo |
| `index.html`, `app.js`, `style.css` | O site em si (normalmente você não mexe) |

## Imagens: automático pelo nome do arquivo, dentro da pasta `imagens`
Todas as imagens ficam numa pasta chamada `imagens` no GitHub, separadas do código.

**Criar a pasta (só uma vez):**
1. No repositório: Add file → Create new file.
2. No campo do nome, digite `imagens/` (ao digitar a barra, o GitHub cria a pasta) e depois `leia-me.txt`.
3. Escreva qualquer coisa no conteúdo e clique em Commit changes.

**Enviar imagens:** abra a pasta `imagens` no GitHub → Add file → Upload files → arraste as imagens → Commit changes.

Use estes nomes (o começo é sempre o **id** do produto, o mesmo do `produtos.js`):

- `gta-6_capa.jpg` → capa do card e primeira imagem da galeria
- `gta-6_print1.jpg`, `gta-6_print2.jpg`, `gta-6_print3.jpg` … → prints do jogo

Regras:
- Tudo em letra minúscula, sem espaço e sem acento.
- Formatos aceitos: `.jpg`, `.png`, `.webp`, `.jpeg`.
- Numere em sequência (1, 2, 3…). Se faltar um número (pular o 4), o site para no 3.
- Não precisa avisar ninguém nem editar código: o site acha as imagens sozinho.

A galeria aparece nesta ordem: **capa → trailer → prints**.

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

## Publicar mudanças
GitHub → Add file → Upload files (ou edite o arquivo direto no GitHub) → Commit changes.
O Vercel atualiza o site sozinho em cerca de 1 minuto.

## Ver o site no seu computador
Dê dois cliques em `index.html`. (O trailer do YouTube só aparece no site publicado ou usando a extensão Live Server do VS Code.)

Cuidado com aspas, vírgulas e chaves no `produtos.js`: se o site ficar em branco depois de editar, quase sempre é uma vírgula ou aspas faltando.

## Avisos importantes
- O aviso de afiliado já está no rodapé e na página de cada produto. Mantenha.
- O site não mostra preço fixo de propósito: o botão leva pra loja, onde o preço está sempre atualizado.
