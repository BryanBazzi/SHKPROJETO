# Site de links de afiliados — É o Bryan

## Como ver o site no seu computador
Dê dois cliques em `index.html`. Ele abre no navegador, sem instalar nada.

## Como editar (tudo no arquivo `produtos.js`)
1. Abra `produtos.js` com o Bloco de Notas (ou, melhor, o VS Code, que é grátis).
2. No topo, em `SITE`, coloque o link do seu YouTube e da sua Twitch.
3. Em `PRODUTOS`, troque os links de exemplo pelos seus links de afiliado.
4. Para adicionar um jogo/console novo: copie um bloco `{ ... }` inteiro, cole abaixo (com vírgula entre os blocos) e mude os dados.
5. Trailer: cole o link do vídeo do YouTube no campo `trailer`.
6. Link vazio (`""`) = o botão daquela loja não aparece.

Cuidado com aspas, vírgulas e chaves: se o site ficar em branco depois de editar, quase sempre é uma vírgula ou aspas faltando.

## Como colocar no ar (grátis)
1. Crie uma conta em https://pages.cloudflare.com (ou Netlify).
2. Escolha enviar os arquivos direto ("Upload assets" / arrastar a pasta) e envie esta pasta inteira.
3. Depois registre o domínio em https://registro.br e aponte para o site seguindo as instruções da própria hospedagem.

## Avisos importantes
- O aviso de afiliado já está no rodapé e na página de cada produto. Mantenha.
- O site não mostra preço fixo de propósito: o botão leva pra loja, onde o preço está sempre atualizado.
