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

/* ---------- Banners rotativos do topo da Página Inicial (passam a cada 5s) ----------
   Cada item pode ter "link" (qualquer rota do site, ex.: "/produto/gta-6" ou "/consoles"). */
const HOME_BANNERS = [
  {
    link: "/produto/gta-6",
    estilo: "gta",
    imagem: "jogos-ps5/gta-6_banner.jpg",
    selo: "🔥 Super Lançamento • PlayStation 5 & Xbox",
    chamada: "Compare os preços e garanta seu GTA 6 no menor preço!",
    subtexto: "Assista ao trailer, veja os prints em tela cheia e compre nas lojas oficiais verificadas.",
    botao: "Ver onde comprar agora →"
  },
  {
    link: "/produto/zelda-ocarina-remake",
    estilo: "zelda",
    imagem: "jogos-switch/zelda-ocarina-remake_banner.jpg",
    selo: "✨ Lançamento Exclusivo • Nintendo Switch 2",
    chamada: "The Legend of Zelda: Ocarina of Time Remake",
    subtexto: "A lenda de Hyrule reconstruída do zero para o Nintendo Switch 2. Veja o trailer e garanta o seu!",
    botao: "Ver lojas e trailer →"
  },
  {
    link: "/consoles",
    estilo: "consoles",
    imagem: "consoles/consoles_banner.jpg",
    selo: "🎮 Nova Geração • PS5 • Switch 1 & 2 • Xbox",
    chamada: "Consoles e Acessórios Oficiais nas Melhores Lojas",
    subtexto: "PlayStation 5 Slim, Nintendo Switch 2, Switch OLED e Xbox Series X|S com links diretos e seguros.",
    botao: "Explorar todos os consoles →"
  }
];

/* ---------- Ordem da página inicial ----------
   Basta colocar os IDs dos produtos na ordem exata em que você quer que apareçam! */
const HOME_DESTAQUES = [
  "gta-6",
  "zelda-ocarina-remake",
  "phantom-blade-zero",
  "astro-bot"
];

const HOME_LANCAMENTOS = [
  "gta-6",
  "zelda-ocarina-remake",
  "phantom-blade-zero",
  "death-stranding-2"
];

/* ---------- Produtos ----------
   Para adicionar um produto novo:
   1) copie um bloco { ... } inteiro e cole logo abaixo (com vírgula entre os blocos);
   2) troque os dados;
   3) no links.js, adicione as linhas do novo produto (use o mesmo "id").

   id         -> nome curto, minúsculo, sem espaço nem acento (ex.: "gta-6").
                 É ele que você usa nos nomes das imagens e no links.js.
   nome       -> como aparece no site
   plataforma -> "ps5", "switch" ou "xbox"
   tipo       -> "console", "acessorio" ou "jogo"
   versao     -> (opcional) etiqueta extra, ex.: "Switch 2", "Series X", "Series S"
   promocao   -> true se estiver em promoção, senão false
   destaque   -> true para aparecer em Destaques
   lancamento -> true para aparecer em Lançamentos
   descricao  -> texto curto sobre o produto
*/
const PRODUTOS = [

  /* ===================== PLAYSTATION 5 ===================== */
  {
    id: "ps5-slim",
    nome: "PlayStation 5 Slim",
    plataforma: "ps5",
    tipo: "console",
    promocao: false,
    destaque: false,
    lancamento: false,
    descricao: "O console da Sony em versão mais compacta, com SSD ultrarrápido, controle DualSense e jogos em 4K."
  },
  {
    id: "gta-6",
    nome: "Grand Theft Auto VI",
    plataforma: "ps5",
    tipo: "jogo",
    promocao: false,
    destaque: true,
    lancamento: true,
    descricao: "O novo capítulo da série da Rockstar em Vice City. Assista ao trailer e veja onde comprar."
  },
  {
    id: "astro-bot",
    nome: "Astro Bot",
    plataforma: "ps5",
    tipo: "jogo",
    promocao: false,
    destaque: true,
    lancamento: false,
    descricao: "Aventura de plataforma cheia de criatividade, eleita Jogo do Ano e feita para aproveitar tudo do DualSense."
  },
  {
    id: "phantom-blade-zero",
    nome: "Phantom Blade Zero",
    plataforma: "ps5",
    tipo: "jogo",
    promocao: false,
    destaque: true,
    lancamento: true,
    descricao: "RPG de ação frenético em estilo kung-fu punk sombrio, com combates de espada cinematográficos no PS5."
  },
  {
    id: "death-stranding-2",
    nome: "Death Stranding 2: On the Beach",
    plataforma: "ps5",
    tipo: "jogo",
    promocao: false,
    destaque: false,
    lancamento: true,
    descricao: "A nova superprodução de Hideo Kojima para o PlayStation 5, expandindo a jornada de Sam Bridges."
  },
  {
    id: "spider-man-2",
    nome: "Marvel's Spider-Man 2",
    plataforma: "ps5",
    tipo: "jogo",
    promocao: false,
    destaque: false,
    lancamento: false,
    descricao: "Jogue com Peter Parker e Miles Morales numa Nova York ainda maior."
  },
  {
    id: "dualsense",
    nome: "Controle DualSense (PS5)",
    plataforma: "ps5",
    tipo: "acessorio",
    promocao: false,
    destaque: false,
    lancamento: false,
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
    destaque: false,
    lancamento: false,
    descricao: "O novo console da Nintendo, com tela maior, mais desempenho e compatibilidade com jogos do Switch."
  },
  {
    id: "zelda-ocarina-remake",
    nome: "The Legend of Zelda: Ocarina of Time Remake",
    plataforma: "switch",
    tipo: "jogo",
    versao: "Switch 2",
    promocao: false,
    destaque: true,
    lancamento: true,
    descricao: "O clássico lendário de Hyrule totalmente reconstruído para a nova geração no Nintendo Switch 2."
  },
  {
    id: "switch-oled",
    nome: "Nintendo Switch OLED",
    plataforma: "switch",
    tipo: "console",
    versao: "Switch 1",
    promocao: false,
    destaque: false,
    lancamento: false,
    descricao: "Versão com tela OLED de 7 polegadas, ótima para jogar no modo portátil."
  },
  {
    id: "mario-kart-world",
    nome: "Mario Kart World",
    plataforma: "switch",
    tipo: "jogo",
    versao: "Switch 2",
    promocao: false,
    destaque: false,
    lancamento: false,
    descricao: "Corridas com mundo aberto conectado e muito caos com os amigos."
  },
  {
    id: "zelda-totk",
    nome: "The Legend of Zelda: Tears of the Kingdom",
    plataforma: "switch",
    tipo: "jogo",
    versao: "Switch 1 e 2",
    promocao: false,
    destaque: false,
    lancamento: false,
    descricao: "Explore Hyrule, os céus e as profundezas nesta aventura épica."
  },
  {
    id: "pro-controller",
    nome: "Controle Pro Nintendo Switch",
    plataforma: "switch",
    tipo: "acessorio",
    versao: "Switch 1 e 2",
    promocao: false,
    destaque: false,
    lancamento: false,
    descricao: "Controle oficial, confortável para sessões longas."
  },

  /* ===================== XBOX ===================== */
  {
    id: "xbox-series-x",
    nome: "Xbox Series X",
    plataforma: "xbox",
    tipo: "console",
    versao: "Series X",
    promocao: false,
    destaque: false,
    lancamento: false,
    descricao: "O Xbox mais rápido e poderoso de todos os tempos, com 1 TB de SSD e jogos em verdadeiro 4K a até 120 FPS."
  },
  {
    id: "xbox-series-s",
    nome: "Xbox Series S",
    plataforma: "xbox",
    tipo: "console",
    versao: "Series S",
    promocao: false,
    destaque: false,
    lancamento: false,
    descricao: "Desempenho de nova geração no menor Xbox de todos, 100% digital e perfeito para o Game Pass."
  },
  {
    id: "forza-horizon-5",
    nome: "Forza Horizon 5",
    plataforma: "xbox",
    tipo: "jogo",
    versao: "Series X|S",
    promocao: false,
    destaque: false,
    lancamento: false,
    descricao: "Explore as paisagens vibrantes do México em mundo aberto com centenas dos melhores carros do mundo."
  },
  {
    id: "controle-xbox",
    nome: "Controle Sem Fio Xbox",
    plataforma: "xbox",
    tipo: "acessorio",
    versao: "Series X|S & PC",
    promocao: false,
    destaque: false,
    lancamento: false,
    descricao: "Design modernizado com superfícies esculpidas, gatilhos texturizados e botão dedicado de compartilhamento."
  }

];
