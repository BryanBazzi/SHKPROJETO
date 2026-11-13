/* ==========================================================
   ARQUIVO PRINCIPAL DE CONTEÚDO — é aqui que você edita tudo.
   Não precisa mexer no resto do site.
   ========================================================== */

/* ---------- Dados gerais do site ---------- */
const SITE = {
  nome: "É o Bryan",
  subtitulo: "Achados Gamer",
  youtube: "",   // cole o link do seu canal (ex.: "https://youtube.com/@seucanal")
  twitch: ""     // cole o link da sua Twitch (ex.: "https://twitch.tv/seucanal")
};

/* ---------- Lojas ----------
   Não precisa mexer aqui, a não ser que queira mudar o nome exibido. */
const LOJAS = {
  amazon:       { nome: "Amazon" },
  kabum:        { nome: "KaBuM!" },
  mercadolivre: { nome: "Mercado Livre" },
  shopee:       { nome: "Shopee" },
  aliexpress:   { nome: "AliExpress" }
};

/* ---------- Produtos ----------
   Para adicionar um produto, copie um bloco { ... } inteiro, cole logo abaixo
   (sem esquecer da vírgula entre eles) e troque os dados.

   id         -> nome curto sem espaço, acento ou maiúscula (vira o endereço da página)
   nome       -> como aparece no site
   plataforma -> "ps5" ou "switch"
   tipo       -> "console" ou "jogo"
   versao     -> (opcional) etiqueta extra, ex.: "Switch 2", "Switch 1", "Switch 1 e 2"
   promocao   -> true se estiver em promoção (aparece na aba Promoções), senão false
   destaque   -> true para aparecer na página inicial
   descricao  -> texto curto sobre o produto
   midia      -> (opcional) a galeria do produto, NA ORDEM em que você escrever. Pode misturar:
                   - imagens: o caminho do arquivo dentro da pasta "img" (ex.: "img/astro-bot.jpg")
                   - vídeos: o link do YouTube (ex.: "https://www.youtube.com/watch?v=...")
                 A primeira imagem da lista também vira a capa do card. Exemplo:
                   midia: ["img/capa.jpg", "https://youtube.com/watch?v=...", "img/print1.jpg", "img/print2.jpg"]
   trailer    -> (alternativa simples, só se NÃO usar "midia") link do YouTube ou o código do vídeo. Deixe "" se não tiver.
   capa       -> (alternativa simples, só se NÃO usar "midia") imagem de capa. Se ficar "" o site cria uma capa neon automática.
   links      -> seu link de AFILIADO em cada loja. Deixe "" nas lojas que não tiver:
                 o botão dessa loja simplesmente não aparece.

   ATENÇÃO: os links abaixo são só EXEMPLO (levam para a página inicial de cada loja).
   Troque pelos seus links de afiliado.
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
    descricao: "O console da Sony em versão mais compacta, com SSD ultrarrápido, controle DualSense e jogos em 4K.",
    trailer: "",
    capa: "",
    links: {
      amazon: "https://www.amazon.com.br/",
      kabum: "https://www.kabum.com.br/",
      mercadolivre: "https://www.mercadolivre.com.br/",
      shopee: "https://shopee.com.br/",
      aliexpress: ""
    }
  },
  {
    id: "gta-6",
    nome: "Grand Theft Auto VI",
    plataforma: "ps5",
    tipo: "jogo",
    promocao: false,
    destaque: true,
    descricao: "O novo capítulo da série da Rockstar. Assista ao trailer e veja onde comprar.",
    trailer: "",
    capa: "",
    links: {
      amazon: "https://www.amazon.com.br/",
      kabum: "https://www.kabum.com.br/",
      mercadolivre: "https://www.mercadolivre.com.br/",
      shopee: "",
      aliexpress: ""
    }
  },
  {
    id: "astro-bot",
    nome: "Astro Bot",
    plataforma: "ps5",
    tipo: "jogo",
    promocao: true,
    destaque: false,
    descricao: "Aventura de plataforma cheia de criatividade, feita para aproveitar tudo do DualSense.",
    midia: [
      "img/astro-bot.jpg",
      "https://www.youtube.com/watch?v=wHMNQzLG_Jg"
    ],
    links: {
      amazon: "https://www.amazon.com.br/",
      kabum: "https://www.kabum.com.br/",
      mercadolivre: "https://www.mercadolivre.com.br/",
      shopee: "",
      aliexpress: ""
    }
  },
  {
    id: "spider-man-2",
    nome: "Marvel's Spider-Man 2",
    plataforma: "ps5",
    tipo: "jogo",
    promocao: false,
    destaque: false,
    descricao: "Jogue com Peter Parker e Miles Morales numa Nova York ainda maior.",
    trailer: "",
    capa: "",
    links: {
      amazon: "https://www.amazon.com.br/",
      kabum: "https://www.kabum.com.br/",
      mercadolivre: "https://www.mercadolivre.com.br/",
      shopee: "",
      aliexpress: ""
    }
  },
  {
    id: "dualsense",
    nome: "Controle DualSense (PS5)",
    plataforma: "ps5",
    tipo: "console",
    promocao: false,
    destaque: false,
    descricao: "Controle sem fio oficial do PS5, com gatilhos adaptáveis e retorno tátil.",
    trailer: "",
    capa: "",
    links: {
      amazon: "https://www.amazon.com.br/",
      kabum: "https://www.kabum.com.br/",
      mercadolivre: "https://www.mercadolivre.com.br/",
      shopee: "https://shopee.com.br/",
      aliexpress: "https://pt.aliexpress.com/"
    }
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
    descricao: "O novo console da Nintendo, com tela maior, mais desempenho e compatibilidade com jogos do Switch.",
    trailer: "",
    capa: "",
    links: {
      amazon: "https://www.amazon.com.br/",
      kabum: "https://www.kabum.com.br/",
      mercadolivre: "https://www.mercadolivre.com.br/",
      shopee: "",
      aliexpress: ""
    }
  },
  {
    id: "switch-oled",
    nome: "Nintendo Switch OLED",
    plataforma: "switch",
    tipo: "console",
    versao: "Switch 1",
    promocao: true,
    destaque: false,
    descricao: "Versão com tela OLED de 7 polegadas, ótima para jogar no modo portátil.",
    trailer: "",
    capa: "",
    links: {
      amazon: "https://www.amazon.com.br/",
      kabum: "https://www.kabum.com.br/",
      mercadolivre: "https://www.mercadolivre.com.br/",
      shopee: "https://shopee.com.br/",
      aliexpress: ""
    }
  },
  {
    id: "mario-kart-world",
    nome: "Mario Kart World",
    plataforma: "switch",
    tipo: "jogo",
    versao: "Switch 2",
    promocao: false,
    destaque: true,
    descricao: "Corridas com mundo aberto conectado e muito caos com os amigos.",
    trailer: "",
    capa: "",
    links: {
      amazon: "https://www.amazon.com.br/",
      kabum: "https://www.kabum.com.br/",
      mercadolivre: "https://www.mercadolivre.com.br/",
      shopee: "",
      aliexpress: ""
    }
  },
  {
    id: "zelda-totk",
    nome: "The Legend of Zelda: Tears of the Kingdom",
    plataforma: "switch",
    tipo: "jogo",
    versao: "Switch 1 e 2",
    promocao: true,
    destaque: false,
    descricao: "Explore Hyrule, os céus e as profundezas nesta aventura épica.",
    trailer: "",
    capa: "",
    links: {
      amazon: "https://www.amazon.com.br/",
      kabum: "https://www.kabum.com.br/",
      mercadolivre: "https://www.mercadolivre.com.br/",
      shopee: "",
      aliexpress: ""
    }
  },
  {
    id: "pro-controller",
    nome: "Controle Pro Nintendo Switch",
    plataforma: "switch",
    tipo: "console",
    versao: "Switch 1 e 2",
    promocao: false,
    destaque: false,
    descricao: "Controle oficial, confortável para sessões longas.",
    trailer: "",
    capa: "",
    links: {
      amazon: "https://www.amazon.com.br/",
      kabum: "https://www.kabum.com.br/",
      mercadolivre: "https://www.mercadolivre.com.br/",
      shopee: "https://shopee.com.br/",
      aliexpress: "https://pt.aliexpress.com/"
    }
  }

];
