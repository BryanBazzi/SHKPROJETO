(function () {
  "use strict";

  var app = document.getElementById("app");
  var menu = document.getElementById("menu");
  var fundo = document.getElementById("fundo");
  var btnMenu = document.getElementById("btnMenu");

  var PLAT = {
    ps5: { nome: "PlayStation 5", curto: "PS5" },
    "switch": { nome: "Nintendo Switch", curto: "Switch" }
  };
  var ABAS = [
    { chave: "", rotulo: "Tudo" },
    { chave: "consoles", rotulo: "Consoles" },
    { chave: "jogos", rotulo: "Jogos" },
    { chave: "promocoes", rotulo: "Promoções" }
  ];

  /* ---------- utilidades ---------- */
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function norm(s) {
    return String(s || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  }
  function urlSegura(u) {
    return /^https?:\/\//i.test(u || "") ? u : "";
  }
  function ytId(v) {
    if (!v) return "";
    v = String(v);
    var m = v.match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([\w-]{11})/);
    if (m) return m[1];
    return /^[\w-]{11}$/.test(v) ? v : "";
  }
  function setTema(t, titulo) {
    document.body.setAttribute("data-tema", t);
    document.title = (titulo ? titulo + " • " : "") + SITE.nome + " • " + SITE.subtitulo;
  }
  function achar(id) {
    for (var i = 0; i < PRODUTOS.length; i++) if (PRODUTOS[i].id === id) return PRODUTOS[i];
    return null;
  }

  /* ---------- peças de interface ---------- */
  function imgOk(s) {
    s = String(s || "");
    if (s.indexOf("..") !== -1) return false;
    return /^(https?:\/\/\S+|[\w][\w\-\/.]*\.(png|jpe?g|webp|gif|avif))$/i.test(s);
  }

  /* Monta a lista de mídia do produto, na ordem em que você escreveu em `midia`.
     Se o produto não tiver `midia`, usa `capa` (imagem) e depois `trailer` (vídeo). */
  function itensMidia(p) {
    var brutos = Array.isArray(p.midia) ? p.midia : [p.capa, p.trailer];
    var out = [];
    brutos.forEach(function (m) {
      if (!m) return;
      var id = ytId(m);
      if (id) out.push({ tipo: "video", id: id });
      else if (imgOk(m)) out.push({ tipo: "imagem", src: String(m) });
    });
    return out;
  }

  function palcoHTML(m, p) {
    if (m.tipo === "video") {
      return '<div class="video"><iframe src="https://www.youtube-nocookie.com/embed/' + m.id + '" title="Trailer de ' + esc(p.nome) +
        '" referrerpolicy="strict-origin-when-cross-origin" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen" allowfullscreen></iframe></div>' +
        '<a class="yt-link" href="https://www.youtube.com/watch?v=' + m.id + '" target="_blank" rel="noopener noreferrer">▶ Assistir no YouTube</a>';
    }
    return '<div class="video palco-img">' +
      '<img class="palco-fundo" src="' + esc(m.src) + '" alt="" aria-hidden="true">' +
      '<img class="palco-foto" src="' + esc(m.src) + '" alt="' + esc(p.nome) + '">' +
      "</div>";
  }

  function miniHTML(m, i, p) {
    var img = m.tipo === "video" ? "https://i.ytimg.com/vi/" + m.id + "/mqdefault.jpg" : m.src;
    return '<button type="button" class="mini' + (i === 0 ? " ativa" : "") + '" data-i="' + i + '" aria-label="' +
      (m.tipo === "video" ? "Ver trailer" : "Ver imagem " + (i + 1)) + " de " + esc(p.nome) + '">' +
      '<img src="' + esc(img) + '" alt="" loading="lazy">' +
      (m.tipo === "video" ? '<span class="mini-play">▶</span>' : "") + "</button>";
  }

  function capa(p) {
    var primeira = itensMidia(p).filter(function (m) { return m.tipo === "imagem"; })[0];
    if (primeira) {
      return '<div class="capa"><img src="' + esc(primeira.src) + '" alt="' + esc(p.nome) + '" loading="lazy"></div>';
    }
    return '<div class="capa capa-' + esc(p.plataforma) + '">' +
      '<span class="capa-ico">' + (p.tipo === "console" ? "🎮" : "💿") + "</span>" +
      '<span class="capa-nome">' + esc(p.nome) + "</span></div>";
  }

  function card(p) {
    var plat = PLAT[p.plataforma] || { curto: "" };
    return '<a class="card tema-' + esc(p.plataforma) + '" href="#/produto/' + esc(p.id) + '">' +
      capa(p) +
      '<div class="card-corpo">' +
      '<div class="selos">' +
      (p.promocao ? '<span class="selo selo-promo">🔥 Promoção</span>' : "") +
      '<span class="selo">' + esc(p.versao || plat.curto) + "</span>" +
      "</div>" +
      "<h3>" + esc(p.nome) + "</h3>" +
      '<span class="ver">Ver onde comprar →</span>' +
      "</div></a>";
  }

  function grade(lista, vazio) {
    if (!lista.length) return '<p class="vazio">' + esc(vazio || "Nada por aqui ainda.") + "</p>";
    return '<div class="grade">' + lista.map(card).join("") + "</div>";
  }

  function secao(titulo, html, extra) {
    return '<section class="secao"><div class="secao-topo"><h2>' + esc(titulo) + "</h2>" + (extra || "") + "</div>" + html + "</section>";
  }

  /* ---------- páginas ---------- */
  function home() {
    setTema("neutro");
    var promos = PRODUTOS.filter(function (p) { return p.promocao; }).slice(0, 6);
    var destaques = PRODUTOS.filter(function (p) { return p.destaque; }).slice(0, 6);
    app.innerHTML =
      '<section class="hero">' +
      '<p class="hero-kicker">Direto das minhas lives</p>' +
      "<h1>Ache seu próximo game <span>com o melhor caminho de compra</span></h1>" +
      "<p>Escolha a plataforma, veja o trailer e vá direto pra loja: Amazon, KaBuM!, Mercado Livre, Shopee e AliExpress.</p>" +
      '<div class="hero-botoes">' +
      '<a class="plat-btn tema-ps5" href="#/ps5"><small>Plataforma</small><strong>PlayStation 5</strong></a>' +
      '<a class="plat-btn tema-switch" href="#/switch"><small>Plataforma</small><strong>Nintendo Switch</strong></a>' +
      "</div></section>" +
      secao("🔥 Promoções em destaque", grade(promos, "Sem promoções no momento."),
        '<a class="mais" href="#/promocoes">Ver todas →</a>') +
      secao("⭐ Destaques", grade(destaques, "Marque produtos com destaque: true para eles aparecerem aqui."));
  }

  function plataforma(plat, aba) {
    if (!PLAT[plat]) return naoEncontrado();
    setTema(plat, PLAT[plat].nome);
    var lista = PRODUTOS.filter(function (p) { return p.plataforma === plat; });

    var tabs = '<div class="abas">' + ABAS.map(function (a) {
      var href = "#/" + plat + (a.chave ? "/" + a.chave : "");
      return '<a class="aba' + (a.chave === aba ? " ativa" : "") + '" href="' + href + '">' + a.rotulo + "</a>";
    }).join("") + "</div>";

    var corpo = "";
    var consoles = lista.filter(function (p) { return p.tipo === "console"; });
    var jogos = lista.filter(function (p) { return p.tipo === "jogo"; });
    var promos = lista.filter(function (p) { return p.promocao; });

    if (aba === "consoles") corpo = secao("Consoles e acessórios", grade(consoles, "Nenhum console cadastrado ainda."));
    else if (aba === "jogos") corpo = secao("Jogos", grade(jogos, "Nenhum jogo cadastrado ainda."));
    else if (aba === "promocoes") corpo = secao("🔥 Promoções", grade(promos, "Sem promoções no momento."));
    else corpo =
      secao("Consoles e acessórios", grade(consoles, "Nenhum console cadastrado ainda.")) +
      secao("Jogos", grade(jogos, "Nenhum jogo cadastrado ainda."));

    app.innerHTML =
      '<section class="plat-topo"><p class="hero-kicker">Plataforma</p><h1>' + esc(PLAT[plat].nome) + "</h1></section>" +
      tabs + corpo;
  }

  function promocoes() {
    setTema("neutro", "Promoções");
    var promos = PRODUTOS.filter(function (p) { return p.promocao; });
    app.innerHTML =
      '<section class="plat-topo"><p class="hero-kicker">Aproveite</p><h1>🔥 Promoções</h1></section>' +
      secao("Todas as promoções", grade(promos, "Sem promoções no momento."));
  }

  function busca(q) {
    setTema("neutro", "Busca");
    var t = norm(q);
    var achados = PRODUTOS.filter(function (p) {
      return norm(p.nome).indexOf(t) !== -1 || norm(p.descricao).indexOf(t) !== -1;
    });
    app.innerHTML =
      '<section class="plat-topo"><p class="hero-kicker">Busca</p><h1>Resultados para “' + esc(q) + "”</h1></section>" +
      secao(achados.length + (achados.length === 1 ? " resultado" : " resultados"), grade(achados, "Não achei nada com esse nome. Tente outra palavra."));
  }

  function produto(id) {
    var p = achar(id);
    if (!p) return naoEncontrado();
    setTema(p.plataforma, p.nome);
    var plat = PLAT[p.plataforma];

    var itens = itensMidia(p);
    var midia = '<div id="palco" class="palco">' +
      (itens.length ? palcoHTML(itens[0], p) : '<div class="video video-vazio"><span>🎬</span><p>Imagens e trailer em breve</p></div>') +
      "</div>" +
      (itens.length > 1 ? '<div class="minis">' + itens.map(function (m, i) { return miniHTML(m, i, p); }).join("") + "</div>" : "");

    var lojas = Object.keys(LOJAS).filter(function (k) { return p.links && urlSegura(p.links[k]); });
    var botoes = lojas.length
      ? lojas.map(function (k) {
          return '<a class="loja loja-' + k + '" href="' + esc(p.links[k]) + '" target="_blank" rel="sponsored noopener noreferrer">' +
            "<span><strong>" + esc(LOJAS[k].nome) + "</strong><small>Ver preço atualizado</small></span><em>→</em></a>";
        }).join("")
      : '<p class="vazio">Links de compra em breve.</p>';

    var rel = PRODUTOS.filter(function (x) {
      return x.id !== p.id && x.plataforma === p.plataforma && x.tipo === p.tipo;
    }).slice(0, 4);

    app.innerHTML =
      '<nav class="trilha"><a href="#/">Início</a> › <a href="#/' + p.plataforma + '">' + esc(plat.nome) + "</a> › " +
      '<a href="#/' + p.plataforma + "/" + (p.tipo === "console" ? "consoles" : "jogos") + '">' + (p.tipo === "console" ? "Consoles" : "Jogos") + "</a></nav>" +
      '<article class="produto">' +
      '<div class="produto-midia">' + midia + "</div>" +
      '<div class="produto-info">' +
      '<div class="selos">' +
      (p.promocao ? '<span class="selo selo-promo">🔥 Promoção</span>' : "") +
      '<span class="selo">' + esc(p.versao || plat.curto) + "</span></div>" +
      "<h1>" + esc(p.nome) + "</h1>" +
      "<p class=\"desc\">" + esc(p.descricao) + "</p>" +
      "<h2>Onde comprar</h2>" +
      '<div class="lojas">' + botoes + "</div>" +
      '<p class="nota">Os links abrem na loja com o preço do dia. Posso receber comissão pela compra, sem custo extra pra você.</p>' +
      "</div></article>" +
      (rel.length ? secao("Veja também", grade(rel)) : "");

    /* troca a mídia exibida ao clicar nas miniaturas */
    var palco = document.getElementById("palco");
    var minis = app.querySelectorAll ? app.querySelectorAll(".mini") : [];
    Array.prototype.forEach.call(minis, function (btn) {
      btn.addEventListener("click", function () {
        var i = parseInt(btn.getAttribute("data-i"), 10);
        palco.innerHTML = palcoHTML(itens[i], p);
        Array.prototype.forEach.call(minis, function (b) { b.classList.remove("ativa"); });
        btn.classList.add("ativa");
      });
    });
  }

  function naoEncontrado() {
    setTema("neutro", "Não encontrado");
    app.innerHTML = '<section class="plat-topo"><h1>Página não encontrada</h1><p><a class="mais" href="#/">← Voltar ao início</a></p></section>';
  }

  /* ---------- menu ---------- */
  function abrirMenu(abrir) {
    menu.classList.toggle("aberto", abrir);
    fundo.classList.toggle("aberto", abrir);
    btnMenu.setAttribute("aria-expanded", abrir ? "true" : "false");
    btnMenu.classList.toggle("ativo", abrir);
  }
  btnMenu.addEventListener("click", function () { abrirMenu(!menu.classList.contains("aberto")); });
  fundo.addEventListener("click", function () { abrirMenu(false); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") abrirMenu(false); });

  /* ---------- busca ---------- */
  document.getElementById("formBusca").addEventListener("submit", function (e) {
    e.preventDefault();
    var q = document.getElementById("campoBusca").value.trim();
    if (q) location.hash = "#/busca/" + encodeURIComponent(q);
  });

  /* ---------- rotas ---------- */
  function rota() {
    var h = location.hash.replace(/^#\/?/, "");
    var partes;
    try { partes = h.split("/").map(decodeURIComponent); } catch (e) { partes = [""]; }
    abrirMenu(false);
    window.scrollTo(0, 0);
    var a = partes[0], b = partes[1];
    if (!a) return home();
    if (a === "ps5" || a === "switch") return plataforma(a, b || "");
    if (a === "promocoes") return promocoes();
    if (a === "produto") return produto(b);
    if (a === "busca") return busca(b || "");
    return naoEncontrado();
  }

  /* ---------- início ---------- */
  document.getElementById("marcaNome").textContent = SITE.nome;
  document.getElementById("marcaSub").textContent = SITE.subtitulo;
  var redes = [];
  if (urlSegura(SITE.youtube)) redes.push('<a href="' + esc(SITE.youtube) + '" target="_blank" rel="noopener">▶ YouTube</a>');
  if (urlSegura(SITE.twitch)) redes.push('<a href="' + esc(SITE.twitch) + '" target="_blank" rel="noopener">🟣 Twitch</a>');
  document.getElementById("redes").innerHTML = redes.join("");

  window.addEventListener("hashchange", rota);
  rota();
})();
