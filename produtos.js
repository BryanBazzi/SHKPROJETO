/* ==========================================================
   LISTA DE PRODUTOS — aqui ficam só os dados básicos de cada produto.

   Imagens, trailers e links de afiliado NÃO ficam aqui:
   - Imagens: é só enviar o arquivo com o nome certo (veja o LEIA-ME.md)
   - Trailers e links de afiliado: arquivo links.js
   ========================================================== */

/* ---------- Dados gerais do site ---------- */
const SITE = {
  nome: "SHKN",
  subtitulo: "Games",
  pastaImagens: "imagens",   // pasta do GitHub onde ficam as imagens (deixe "" para usar a raiz)
  youtube: "",   // cole o link do seu canal (ex.: "https://youtube.com/@seucanal")
  twitch: ""     // cole o link da sua Twitch (ex.: "https://twitch.tv/seucanal")
};

/* ---------- Lojas ----------
   sigla = a letrinha que aparece no ícone do botão. Não precisa mexer aqui. */
const LOJAS = {
  amazon:       { nome: "Amazon",        sigla: "a" },
  kabum:        { nome: "KaBuM!",        sigla: "K" },
  mercadolivre: { nome: "Mercado Livre", sigla: "ML" },
  shopee:       { nome: "Shopee",        sigla: "S" },
  aliexpress:   { nome: "AliExpress",    sigla: "Ali" }
};

/* ---------- Produtos ----------
   Para adicionar um produto novo:
   1) copie um bloco { ... } inteiro e cole logo abaixo (com vírgula entre os blocos);
   2) troque os dados;
   3) no links.js, adicione as linhas do novo produto (use o mesmo "id").

   id         -> nome curto, minúsculo, sem espaço nem acento (ex.: "gta-6").
                 É ele que você usa nos nomes das imagens e no links.js.
   nome       -> como aparece no site
   plataforma -> "ps5" ou "switch"
   tipo       -> "console" ou "jogo"
   versao     -> (opcional) etiqueta extra, ex.: "Switch 2", "Switch 1", "Switch 1 e 2"
   promocao   -> true se estiver em promoção (aparece na aba Promoções), senão false
   destaque   -> true para aparecer na página inicial
   descricao  -> texto curto sobre o produto
*/
const PRODUTOS = [

  /* ===================== PLAYSTATION 5 ===================== */
  {
    id: "ps5-slim",
    nome: "PlayStation 5 Slim",
    plataforma: "ps5",
    tipo: "console",
    promocao: true,
    destaque: true,
    descricao: "O console da Sony em versão mais compacta, com SSD ultrarrápido, controle DualSense e jogos em 4K."
  },
  {
    id: "gta-6",
    nome: "Grand Theft Auto VI",
    plataforma: "ps5",
    tipo: "jogo",
    promocao: false,
    destaque: true,
    descricao: "O novo capítulo da série da Rockstar. Assista ao trailer e veja onde comprar."
  },
  {
    id: "astro-bot",
    nome: "Astro Bot",
    plataforma: "ps5",
    tipo: "jogo",
    promocao: true,
    destaque: false,
    descricao: "Aventura de plataforma cheia de criatividade, feita para aproveitar tudo do DualSense."
  },
  {
    id: "spider-man-2",
    nome: "Marvel's Spider-Man 2",
    plataforma: "ps5",
    tipo: "jogo",
    promocao: false,
    destaque: false,
    descricao: "Jogue com Peter Parker e Miles Morales numa Nova York ainda maior."
  },
  {
    id: "dualsense",
    nome: "Controle DualSense (PS5)",
    plataforma: "ps5",
    tipo: "console",
    promocao: false,
    destaque: false,
    descricao: "Controle sem fio oficial do PS5, com gatilhos adaptáveis e retorno tátil."
  },

  /* ===================== NINTENDO SWITCH ===================== */
  {
    id: "switch-2",
    nome: "Nintendo Switch 2",
    plataforma: "switch",
    tipo: "console",
    versao: "Switch 2",
    promocao: false,
    destaque: true,
    descricao: "O novo console da Nintendo, com tela maior, mais desempenho e compatibilidade com jogos do Switch."
  },
  {
    id: "switch-oled",
    nome: "Nintendo Switch OLED",
    plataforma: "switch",
    tipo: "console",
    versao: "Switch 1",
    promocao: true,
    destaque: false,
    descricao: "Versão com tela OLED de 7 polegadas, ótima para jogar no modo portátil."
  },
  {
    id: "mario-kart-world",
    nome: "Mario Kart World",
    plataforma: "switch",
    tipo: "jogo",
    versao: "Switch 2",
    promocao: false,
    destaque: true,
    descricao: "Corridas com mundo aberto conectado e muito caos com os amigos."
  },
  {
    id: "zelda-totk",
    nome: "The Legend of Zelda: Tears of the Kingdom",
    plataforma: "switch",
    tipo: "jogo",
    versao: "Switch 1 e 2",
    promocao: true,
    destaque: false,
    descricao: "Explore Hyrule, os céus e as profundezas nesta aventura épica."
  },
  {
    id: "pro-controller",
    nome: "Controle Pro Nintendo Switch",
    plataforma: "switch",
    tipo: "console",
    versao: "Switch 1 e 2",
    promocao: false,
    destaque: false,
    descricao: "Controle oficial, confortável para sessões longas."
  }

];
