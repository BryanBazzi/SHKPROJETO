(function () {
  "use strict";

  var app = document.getElementById("app");
  var menu = document.getElementById("menu");
  var fundo = document.getElementById("fundo");
  var btnMenu = document.getElementById("btnMenu");
  var tokenRota = 0; // muda a cada troca de página (evita atualizar a página errada)

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
    return String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  }
  /* busca: ignora acento, maiúscula, espaço e pontuação ("astrobot" acha "Astro Bot") */
  function chave(s) { return norm(s).replace(/[^a-z0-9]/g, ""); }
  function acha(p, q) {
    var junto = chave(q);
    if (!junto) return false;
    var feno = chave(p.nome + " " + p.id + " " + (p.versao || "") + " " + p.descricao);
    if (feno.indexOf(junto) !== -1) return true;
    var palavras = norm(q).split(/\s+/).map(chave).filter(Boolean);
    return palavras.length > 1 && palavras.every(function (w) { return feno.indexOf(w) !== -1; });
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
    document.title = (titulo ? titulo + " • " : "") + SITE.nome + " " + SITE.subtitulo;
  }
  function achar(id) {
    for (var i = 0; i < PRODUTOS.length; i++) if (PRODUTOS[i].id === id) return PRODUTOS[i];
    return null;
  }

  /* ---------- links.js: trailers e links de afiliado ----------
     Cada linha do arquivo é:  produto_loja = link   (ou  produto_trailer = link).
     Maiúsculas, hífens e espaços não importam, e a ordem também não
     (amazon_astro-bot é igual a Astro-Bot_Amazon). */
  function limpaChave(s) {
    return String(s || "").toLowerCase().replace(/[^a-z0-9_]/g, "");
  }
  var MAPA_LINKS = {};
  String(typeof LINKS === "string" ? LINKS : "").split(/\r?\n/).forEach(function (linha) {
    linha = linha.trim();
    if (!linha || linha.charAt(0) === "#") return;
    var i = linha.indexOf("=");
    if (i < 1) return;
    MAPA_LINKS[limpaChave(linha.slice(0, i))] = linha.slice(i + 1).trim();
  });
  function linkDe(id, tipo) {
    var base = limpaChave(id);
    return MAPA_LINKS[base + "_" + tipo] || MAPA_LINKS[tipo + "_" + base] || "";
  }

  /* ---------- imagens automáticas pelo nome do arquivo ----------
     {id}_capa.jpg, {id}_print1.jpg, {id}_print2.jpg ...
     O site tenta abrir esses nomes e usa os que existirem. */
  var EXTENSOES = ["jpg", "png", "webp", "jpeg"];
  var cacheImg = {};

  function testar(src) {
    return new Promise(function (resolve) {
      var im = new Image();
      im.onload = function () { resolve(true); };
      im.onerror = function () { resolve(false); };
      im.src = src;
    });
  }

  function acharImagem(base) {
    if (cacheImg[base] !== undefined) return Promise.resolve(cacheImg[base]);
    return EXTENSOES.reduce(function (cadeia, ext) {
      return cadeia.then(function (achada) {
        if (achada) return achada;
        var src = (SITE.pastaImagens ? SITE.pastaImagens + "/" : "") + base + "." + ext;
        return testar(src).then(function (ok) { return ok ? src : ""; });
      });
    }, Promise.resolve("")).then(function (r) {
      cacheImg[base] = r;
      return r;
    });
  }

  /* procura print1, print2, print3... de 4 em 4 e para na primeira que faltar */
  function acharPrints(id) {
    var achadas = [];
    function lote(inicio) {
      var nums = [inicio, inicio + 1, inicio + 2, inicio + 3];
      return Promise.all(nums.map(function (n) { return acharImagem(id + "_print" + n); })).then(function (srcs) {
        for (var i = 0; i < srcs.length; i++) {
          if (!srcs[i]) return achadas;
          achadas.push({ tipo: "imagem", src: srcs[i] });
        }
        return inicio + 4 > 60 ? achadas : lote(inicio + 4);
      });
    }
    return lote(1);
  }

  /* ordem da galeria: capa, trailer, prints */
  function resolverMidia(p) {
    return Promise.all([acharImagem(p.id + "_capa"), acharPrints(p.id)]).then(function (r) {
      var itens = [];
      if (r[0]) itens.push({ tipo: "imagem", src: r[0] });
      var yt = ytId(linkDe(p.id, "trailer"));
      if (yt) itens.push({ tipo: "video", id: yt });
      return itens.concat(r[1]);
    });
  }

  /* ---------- peças de interface ---------- */
  function palcoHTML(m, p) {
    if (m.tipo === "video") {
      return '<div class="video"><iframe src="https://www.youtube-nocookie.com/embed/' + m.id + '" title="Trailer de ' + esc(p.nome) +
        '" referrerpolicy="strict-origin-when-cross-origin" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen" allowfullscreen></iframe></div>';
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

  function montarMidia(itens, p, meu) {
    var box = document.getElementById("midiaBox");
    if (!box || meu !== tokenRota) return;
    if (!itens.length) {
      box.innerHTML = '<div class="video video-vazio"><span>🎬</span><p>Imagens e trailer em breve</p></div>';
      return;
    }
    box.innerHTML = '<div id="palco" class="palco">' + palcoHTML(itens[0], p) + "</div>" +
      (itens.length > 1 ? '<div class="minis">' + itens.map(function (m, i) { return miniHTML(m, i, p); }).join("") + "</div>" : "");
    var palco = document.getElementById("palco");
    var minis = box.querySelectorAll ? box.querySelectorAll(".mini") : [];
    Array.prototype.forEach.call(minis, function (btn) {
      btn.addEventListener("click", function () {
        var i = parseInt(btn.getAttribute("data-i"), 10);
        palco.innerHTML = palcoHTML(itens[i], p);
        Array.prototype.forEach.call(minis, function (b) { b.classList.remove("ativa"); });
        btn.classList.add("ativa");
      });
    });
  }

  /* capa dos cards: começa com a capa neon e troca pela imagem {id}_capa se ela existir */
  function capa(p) {
    return '<div class="capa capa-' + esc(p.plataforma) + '" data-id="' + esc(p.id) + '" data-nome="' + esc(p.nome) + '">' +
      '<span class="capa-ico">' + (p.tipo === "console" ? "🎮" : "💿") + "</span>" +
      '<span class="capa-nome">' + esc(p.nome) + "</span></div>";
  }

  function preencherCapas() {
    var meu = tokenRota;
    var lista = app.querySelectorAll ? app.querySelectorAll(".capa[data-id]") : [];
    Array.prototype.forEach.call(lista, function (c) {
      acharImagem(c.getAttribute("data-id") + "_capa").then(function (src) {
        if (!src || meu !== tokenRota) return;
        c.classList.remove("capa-ps5", "capa-switch");
        c.innerHTML = '<img class="capa-fundo" src="' + esc(src) + '" alt="" aria-hidden="true">' +
          '<img class="capa-foto" src="' + esc(src) + '" alt="' + esc(c.getAttribute("data-nome")) + '">';
      });
    });
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
    var achados = PRODUTOS.filter(function (p) { return acha(p, q); });
    app.innerHTML =
      '<section class="plat-topo"><p class="hero-kicker">Busca</p><h1>Resultados para “' + esc(q) + "”</h1></section>" +
      secao(achados.length + (achados.length === 1 ? " resultado" : " resultados"), grade(achados, "Não achei nada com esse nome. Tente outra palavra."));
  }

  /* botão de uma loja: com link = clicável; sem link = "Link em breve"; link "-" = escondido */
  function botaoLoja(p, k) {
    var v = linkDe(p.id, k);
    if (v === "-") return "";
    var nome = esc(LOJAS[k].nome);
    var pasta = SITE.pastaImagens ? SITE.pastaImagens + "/" : "";
    var ico = '<span class="loja-ico" aria-hidden="true" data-sigla="' + esc(LOJAS[k].sigla) + '">' +
      '<img src="' + pasta + 'loja-' + k + '.png" alt="" onerror="this.parentNode.classList.add(\'sem-logo\');this.remove()"></span>';
    if (urlSegura(v)) {
      return '<a class="loja loja-' + k + '" href="' + esc(v) + '" target="_blank" rel="sponsored noopener noreferrer">' + ico +
        '<span class="loja-txt"><strong>' + nome + "</strong><small>Ver preço atualizado</small></span><em>→</em></a>";
    }
    return '<div class="loja loja-' + k + ' off">' + ico +
      '<span class="loja-txt"><strong>' + nome + "</strong><small>Link em breve</small></span></div>";
  }

  function produto(id) {
    var p = achar(id);
    if (!p) return naoEncontrado();
    setTema(p.plataforma, p.nome);
    var plat = PLAT[p.plataforma];
    var meu = tokenRota;

    var botoes = Object.keys(LOJAS).map(function (k) { return botaoLoja(p, k); }).join("");

    var rel = PRODUTOS.filter(function (x) {
      return x.id !== p.id && x.plataforma === p.plataforma && x.tipo === p.tipo;
    }).slice(0, 4);

    app.innerHTML =
      '<nav class="trilha"><a href="#/">Início</a> › <a href="#/' + p.plataforma + '">' + esc(plat.nome) + "</a> › " +
      '<a href="#/' + p.plataforma + "/" + (p.tipo === "console" ? "consoles" : "jogos") + '">' + (p.tipo === "console" ? "Consoles" : "Jogos") + "</a></nav>" +
      '<article class="produto">' +
      '<div id="midiaBox" class="produto-midia"><div class="video video-vazio"><span>⏳</span><p>Carregando…</p></div></div>' +
      '<div class="produto-info">' +
      '<div class="selos">' +
      (p.promocao ? '<span class="selo selo-promo">🔥 Promoção</span>' : "") +
      '<span class="selo">' + esc(p.versao || plat.curto) + "</span></div>" +
      "<h1>" + esc(p.nome) + "</h1>" +
      "<p class=\"desc\">" + esc(p.descricao) + "</p>" +
      "<h2>Onde comprar</h2>" +
      '<div class="lojas">' + (botoes || '<p class="vazio">Links de compra em breve.</p>') + "</div>" +
      '<p class="nota">Os links abrem na loja com o preço do dia. Posso receber comissão pela compra, sem custo extra pra você.</p>' +
      "</div></article>" +
      (rel.length ? secao("Veja também", grade(rel)) : "");

    resolverMidia(p).then(function (itens) { montarMidia(itens, p, meu); });
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
    tokenRota++;
    var h = location.hash.replace(/^#\/?/, "");
    var partes;
    try { partes = h.split("/").map(decodeURIComponent); } catch (e) { partes = [""]; }
    abrirMenu(false);
    window.scrollTo(0, 0);
    var a = partes[0], b = partes[1];
    if (!a) home();
    else if (a === "ps5" || a === "switch") plataforma(a, b || "");
    else if (a === "promocoes") promocoes();
    else if (a === "produto") produto(b);
    else if (a === "busca") busca(b || "");
    else naoEncontrado();
    /* na página inicial, deixa o endereço limpo (sem o "#") */
    if (!a && location.hash && window.history && history.replaceState) {
      history.replaceState(null, "", location.pathname + location.search);
    }
    preencherCapas();
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
