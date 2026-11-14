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
    { chave: "acessorios", rotulo: "Acessórios" },
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

  /* ---------- imagens automáticas por pasta de categoria ----------
     As imagens ficam agrupadas por categoria dentro de "imagens/":
     - jogos-ps5           (jogos de PlayStation 5)
     - jogos-switch        (jogos de Nintendo Switch 1 e 2)
     - consoles            (consoles PS5 e Nintendo Switch)
     - ps5-acessorios      (controles e acessórios de PS5)
     - switch-acessorios   (controles e acessórios de Nintendo Switch)
     - lojas               (logos das lojas) */
  var EXTENSOES = ["jpg", "png", "webp", "jpeg"];
  var cacheImg = {};

  function pastaCategoria(p) {
    if (!p) return "";
    if (p.tipo === "jogo") return p.plataforma === "ps5" ? "jogos-ps5" : "jogos-switch";
    if (p.tipo === "acessorio") return p.plataforma === "ps5" ? "ps5-acessorios" : "switch-acessorios";
    return "consoles";
  }

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
    var idProd = base.replace(/_(capa|print\d+)$/, "");
    var prod = achar(idProd);
    var cat = pastaCategoria(prod);
    var prefixo = "/" + (SITE.pastaImagens ? SITE.pastaImagens + "/" : "") + (cat ? cat + "/" : "");
    return EXTENSOES.reduce(function (cadeia, ext) {
      return cadeia.then(function (achada) {
        if (achada) return achada;
        var src = prefixo + base + "." + ext;
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
    return '<div class="video palco-img" role="button" tabindex="0" aria-label="Ampliar imagem de ' + esc(p.nome) + '">' +
      '<img class="palco-fundo" src="' + esc(m.src) + '" alt="" aria-hidden="true">' +
      '<img class="palco-foto" src="' + esc(m.src) + '" alt="' + esc(p.nome) + '" draggable="false">' +
      '<span class="palco-ampliar" aria-hidden="true">⤢ Ampliar</span>' +
      "</div>";
  }

  /* ---------- galeria em tela cheia (clicar na imagem para expandir) ----------
     - setas / teclado ← → / arrastar para o lado: troca de imagem
     - clique ou toque na imagem: zoom (clique de novo para sair)
     - rodinha do mouse ou pinça no celular: zoom; arrastar com zoom: mover a imagem
     - Esc, ✕ ou clique fora da imagem: fecha */
  var LB = (function () {
    var el = document.createElement("div");
    el.className = "lb";
    el.hidden = true;
    el.setAttribute("role", "dialog");
    el.setAttribute("aria-modal", "true");
    el.setAttribute("aria-label", "Galeria de imagens");
    el.innerHTML =
      '<div class="lb-topo"><span class="lb-cont"></span><div class="lb-acoes">' +
      '<button type="button" class="lb-btn lb-menos" aria-label="Diminuir zoom">−</button>' +
      '<button type="button" class="lb-btn lb-mais" aria-label="Aumentar zoom">+</button>' +
      '<button type="button" class="lb-btn lb-fechar" aria-label="Fechar">✕</button></div></div>' +
      '<div class="lb-area"><img class="lb-img" alt="" draggable="false"></div>' +
      '<button type="button" class="lb-seta lb-ant" aria-label="Imagem anterior">‹</button>' +
      '<button type="button" class="lb-seta lb-prox" aria-label="Próxima imagem">›</button>' +
      '<p class="lb-dica"><span class="dica-pc">Clique na imagem para dar zoom • ← → para trocar • Esc para fechar</span>' +
      '<span class="dica-cel">Toque para dar zoom • deslize para trocar</span></p>' +
      '<div class="lb-minis"></div>';
    document.body.appendChild(el);

    function q(s) { return el.querySelector(s); }
    var area = q(".lb-area"), img = q(".lb-img"), cont = q(".lb-cont"), minisBox = q(".lb-minis");
    var lista = [], idx = 0, nome = "", aoTrocar = null, focoAntes = null;
    var s = 1, tx = 0, ty = 0, MAX = 5;

    function aplicar() {
      img.style.transform = "translate(" + tx + "px," + ty + "px) scale(" + s + ")";
      el.classList.toggle("zoom", s > 1);
    }
    function limitar() {
      var mx = Math.max(0, (img.offsetWidth * s - area.clientWidth) / 2);
      var my = Math.max(0, (img.offsetHeight * s - area.clientHeight) / 2);
      tx = Math.min(mx, Math.max(-mx, tx));
      ty = Math.min(my, Math.max(-my, ty));
    }
    /* zoom mantendo parado o ponto (cx, cy) da tela */
    function zoomEm(novo, cx, cy) {
      novo = Math.min(MAX, Math.max(1, novo));
      if (novo < 1.03) novo = 1;
      var r = area.getBoundingClientRect();
      var px = (cx == null ? r.left + r.width / 2 : cx) - (r.left + r.width / 2);
      var py = (cy == null ? r.top + r.height / 2 : cy) - (r.top + r.height / 2);
      var ux = (px - tx) / s, uy = (py - ty) / s;
      s = novo;
      tx = px - s * ux;
      ty = py - s * uy;
      if (s === 1) tx = ty = 0;
      limitar();
      aplicar();
    }
    function mostrar(i) {
      idx = (i + lista.length) % lista.length;
      s = 1; tx = ty = 0; aplicar();
      img.classList.remove("lb-entrou");
      void img.offsetWidth; // reinicia a animação
      img.classList.add("lb-entrou");
      img.src = lista[idx];
      img.alt = nome + " – imagem " + (idx + 1) + " de " + lista.length;
      cont.textContent = (idx + 1) + " / " + lista.length;
      Array.prototype.forEach.call(minisBox.children, function (b, k) {
        b.classList.toggle("ativa", k === idx);
        if (k === idx && b.scrollIntoView) b.scrollIntoView({ block: "nearest", inline: "center" });
      });
      [idx + 1, idx - 1].forEach(function (k) { (new Image()).src = lista[(k + lista.length) % lista.length]; });
      if (aoTrocar) aoTrocar(idx);
    }
    function abrir(srcs, i, nomeProd, cb) {
      if (!srcs.length) return;
      lista = srcs; nome = nomeProd || ""; aoTrocar = cb || null;
      focoAntes = document.activeElement;
      el.classList.toggle("unica", srcs.length < 2);
      minisBox.innerHTML = srcs.length > 1 ? srcs.map(function (src, k) {
        return '<button type="button" class="lb-mini" data-k="' + k + '" aria-label="Ver imagem ' + (k + 1) + '">' +
          '<img src="' + esc(src) + '" alt="" loading="lazy"></button>';
      }).join("") : "";
      el.hidden = false;
      document.body.classList.add("lb-aberto");
      mostrar(i || 0);
      q(".lb-fechar").focus();
    }
    function fechar() {
      if (el.hidden) return;
      el.hidden = true;
      document.body.classList.remove("lb-aberto");
      aoTrocar = null;
      if (focoAntes && focoAntes.focus) focoAntes.focus();
    }

    q(".lb-fechar").addEventListener("click", fechar);
    q(".lb-ant").addEventListener("click", function () { mostrar(idx - 1); });
    q(".lb-prox").addEventListener("click", function () { mostrar(idx + 1); });
    q(".lb-mais").addEventListener("click", function () { zoomEm(s * 1.5); });
    q(".lb-menos").addEventListener("click", function () { zoomEm(s / 1.5); });
    minisBox.addEventListener("click", function (e) {
      var b = e.target.closest ? e.target.closest(".lb-mini") : null;
      if (b) mostrar(parseInt(b.getAttribute("data-k"), 10));
    });
    img.addEventListener("load", function () { limitar(); aplicar(); });
    window.addEventListener("resize", function () { if (!el.hidden) { limitar(); aplicar(); } });
    area.addEventListener("wheel", function (e) {
      e.preventDefault();
      zoomEm(s * (e.deltaY < 0 ? 1.25 : 0.8), e.clientX, e.clientY);
    }, { passive: false });
    document.addEventListener("keydown", function (e) {
      if (el.hidden) return;
      if (e.key === "Escape") fechar();
      else if (e.key === "ArrowRight") mostrar(idx + 1);
      else if (e.key === "ArrowLeft") mostrar(idx - 1);
      else if (e.key === "+" || e.key === "=") zoomEm(s * 1.5);
      else if (e.key === "-") zoomEm(s / 1.5);
      else if (e.key === "0") zoomEm(1);
      else if (e.key === "Tab") { // mantém o foco dentro da galeria
        var f = el.querySelectorAll("button"), pri = f[0], ult = f[f.length - 1];
        if (e.shiftKey && document.activeElement === pri) { e.preventDefault(); ult.focus(); }
        else if (!e.shiftKey && document.activeElement === ult) { e.preventDefault(); pri.focus(); }
      }
    });

    /* mouse e toque: toque = zoom, arrastar = mover/trocar, dois dedos = pinça */
    var ptrs = {}, ini = null, pinca = null, moveu = false;
    function dist(a, b) { return Math.hypot(a.x - b.x, a.y - b.y) || 1; }
    area.addEventListener("pointerdown", function (e) {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      if (area.setPointerCapture) area.setPointerCapture(e.pointerId);
      ptrs[e.pointerId] = { x: e.clientX, y: e.clientY };
      var ids = Object.keys(ptrs);
      if (ids.length === 1) { ini = { x: e.clientX, y: e.clientY, tx: tx, ty: ty, alvo: e.target }; moveu = false; }
      else if (ids.length === 2) { pinca = { d: dist(ptrs[ids[0]], ptrs[ids[1]]), s: s }; moveu = true; }
      el.classList.add("arrastando");
    });
    area.addEventListener("pointermove", function (e) {
      if (!ptrs[e.pointerId]) return;
      ptrs[e.pointerId] = { x: e.clientX, y: e.clientY };
      var ids = Object.keys(ptrs);
      if (ids.length >= 2 && pinca) {
        var a = ptrs[ids[0]], b = ptrs[ids[1]];
        zoomEm(pinca.s * dist(a, b) / pinca.d, (a.x + b.x) / 2, (a.y + b.y) / 2);
        return;
      }
      if (!ini) return;
      var dx = e.clientX - ini.x, dy = e.clientY - ini.y;
      if (Math.abs(dx) + Math.abs(dy) > 6) moveu = true;
      if (s > 1) { tx = ini.tx + dx; ty = ini.ty + dy; limitar(); aplicar(); }
      else if (moveu && lista.length > 1) img.style.transform = "translateX(" + dx + "px)";
    });
    function soltar(e) {
      if (!ptrs[e.pointerId]) return;
      delete ptrs[e.pointerId];
      var resto = Object.keys(ptrs);
      if (resto.length) { // terminou a pinça e sobrou um dedo
        var r = ptrs[resto[0]];
        ini = { x: r.x, y: r.y, tx: tx, ty: ty, alvo: null };
        pinca = null;
        return;
      }
      el.classList.remove("arrastando");
      if (ini && e.type === "pointerup") {
        var dx = e.clientX - ini.x;
        if (!moveu) {
          if (ini.alvo === img) { if (s > 1) zoomEm(1); else zoomEm(2.5, e.clientX, e.clientY); }
          else fechar();
        } else if (s === 1 && lista.length > 1 && Math.abs(dx) > 60) mostrar(idx + (dx < 0 ? 1 : -1));
        else if (s === 1) aplicar();
      } else if (s === 1) aplicar();
      ini = null; pinca = null;
    }
    area.addEventListener("pointerup", soltar);
    area.addEventListener("pointercancel", soltar);

    return { abrir: abrir, fechar: fechar };
  })();

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
    var varios = itens.length > 1;
    box.innerHTML = '<div id="palco" class="palco"><div id="palcoConteudo"></div>' +
      (varios ? '<button type="button" class="palco-seta palco-ant" aria-label="Anterior">‹</button>' +
        '<button type="button" class="palco-seta palco-prox" aria-label="Próxima">›</button>' +
        '<span class="palco-cont" id="palcoCont"></span>' : "") +
      "</div>" +
      (varios ? '<div class="minis">' + itens.map(function (m, i) { return miniHTML(m, i, p); }).join("") + "</div>" : "");

    var palco = document.getElementById("palco");
    var conteudo = document.getElementById("palcoConteudo");
    var contador = document.getElementById("palcoCont");
    var minis = box.querySelectorAll(".mini");
    var atual = 0;

    /* só as imagens vão para a tela cheia (o trailer fica no palco) */
    var idxImgs = [];
    itens.forEach(function (m, i) { if (m.tipo === "imagem") idxImgs.push(i); });
    var srcsImgs = idxImgs.map(function (i) { return itens[i].src; });

    function mostrar(i) {
      i = (i + itens.length) % itens.length;
      if (i === atual && conteudo.innerHTML) return;
      atual = i;
      conteudo.innerHTML = palcoHTML(itens[i], p);
      if (contador) contador.textContent = (i + 1) + " / " + itens.length;
      Array.prototype.forEach.call(minis, function (b) {
        b.classList.toggle("ativa", parseInt(b.getAttribute("data-i"), 10) === i);
      });
    }
    function ampliar() {
      var k = idxImgs.indexOf(atual);
      if (k < 0) return;
      LB.abrir(srcsImgs, k, p.nome, function (n) { mostrar(idxImgs[n]); });
    }

    conteudo.innerHTML = "";
    mostrar(0);

    Array.prototype.forEach.call(minis, function (btn) {
      btn.addEventListener("click", function () { mostrar(parseInt(btn.getAttribute("data-i"), 10)); });
    });
    if (varios) {
      palco.querySelector(".palco-ant").addEventListener("click", function () { mostrar(atual - 1); });
      palco.querySelector(".palco-prox").addEventListener("click", function () { mostrar(atual + 1); });
    }
    conteudo.addEventListener("click", function (e) {
      if (e.target.closest && e.target.closest(".palco-img")) ampliar();
    });
    conteudo.addEventListener("keydown", function (e) {
      if ((e.key === "Enter" || e.key === " ") && e.target.classList.contains("palco-img")) { e.preventDefault(); ampliar(); }
    });

    /* celular: deslizar o dedo no palco troca a imagem */
    var toqueX = null, toqueY = 0;
    palco.addEventListener("touchstart", function (e) {
      if (e.touches.length === 1) { toqueX = e.touches[0].clientX; toqueY = e.touches[0].clientY; }
    }, { passive: true });
    palco.addEventListener("touchend", function (e) {
      if (toqueX === null || !varios) return;
      var dx = e.changedTouches[0].clientX - toqueX, dy = e.changedTouches[0].clientY - toqueY;
      toqueX = null;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) mostrar(atual + (dx < 0 ? 1 : -1));
    }, { passive: true });
  }

  /* capa dos cards: começa com a capa neon e troca pela imagem {id}_capa se ela existir */
  function capa(p) {
    var ico = p.tipo === "console" ? "🎮" : (p.tipo === "acessorio" ? "🎧" : "💿");
    return '<div class="capa capa-' + esc(p.plataforma) + '" data-id="' + esc(p.id) + '" data-nome="' + esc(p.nome) + '">' +
      '<span class="capa-ico">' + ico + "</span>" +
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
    return '<a class="card tema-' + esc(p.plataforma) + '" href="/produto/' + esc(p.id) + '">' +
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
      '<a class="plat-btn tema-ps5" href="/ps5"><small>Plataforma</small><strong>PlayStation 5</strong></a>' +
      '<a class="plat-btn tema-switch" href="/switch"><small>Plataforma</small><strong>Nintendo Switch</strong></a>' +
      "</div></section>" +
      secao("🔥 Promoções em destaque", grade(promos, "Sem promoções no momento."),
        '<a class="mais" href="/promocoes">Ver todas →</a>') +
      secao("⭐ Destaques", grade(destaques, "Marque produtos com destaque: true para eles aparecerem aqui."));
  }

  function plataforma(plat, aba) {
    if (!PLAT[plat]) return naoEncontrado();
    setTema(plat, PLAT[plat].nome);
    var lista = PRODUTOS.filter(function (p) { return p.plataforma === plat; });

    var tabs = '<div class="abas">' + ABAS.map(function (a) {
      var href = "/" + plat + (a.chave ? "/" + a.chave : "");
      return '<a class="aba' + (a.chave === aba ? " ativa" : "") + '" href="' + href + '">' + a.rotulo + "</a>";
    }).join("") + "</div>";

    var corpo = "";
    var consoles = lista.filter(function (p) { return p.tipo === "console"; });
    var acessorios = lista.filter(function (p) { return p.tipo === "acessorio"; });
    var jogos = lista.filter(function (p) { return p.tipo === "jogo"; });
    var promos = lista.filter(function (p) { return p.promocao; });

    if (aba === "consoles") corpo = secao("Consoles", grade(consoles, "Nenhum console cadastrado ainda."));
    else if (aba === "acessorios") corpo = secao("Acessórios", grade(acessorios, "Nenhum acessório cadastrado ainda."));
    else if (aba === "jogos") corpo = secao("Jogos", grade(jogos, "Nenhum jogo cadastrado ainda."));
    else if (aba === "promocoes") corpo = secao("🔥 Promoções", grade(promos, "Sem promoções no momento."));
    else corpo =
      secao("Consoles", grade(consoles, "Nenhum console cadastrado ainda.")) +
      secao("Acessórios", grade(acessorios, "Nenhum acessório cadastrado ainda.")) +
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
    var pasta = "/" + (SITE.pastaImagens ? SITE.pastaImagens + "/" : "") + "lojas/";
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

    var catRota = p.tipo === "console" ? "consoles" : (p.tipo === "acessorio" ? "acessorios" : "jogos");
    var catNome = p.tipo === "console" ? "Consoles" : (p.tipo === "acessorio" ? "Acessórios" : "Jogos");

    app.innerHTML =
      '<nav class="trilha"><a href="/">Início</a> › <a href="/' + p.plataforma + '">' + esc(plat.nome) + "</a> › " +
      '<a href="/' + p.plataforma + "/" + catRota + '">' + catNome + "</a></nav>" +
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
    app.innerHTML = '<section class="plat-topo"><h1>Página não encontrada</h1><p><a class="mais" href="/">← Voltar ao início</a></p></section>';
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
    if (q) { irPara("/busca/" + encodeURIComponent(q)); document.getElementById("campoBusca").blur(); }
  });

  /* ---------- navegação sem "#": usa o endereço normal (/produto/astro-bot) ---------- */
  function irPara(url) {
    if (url === location.pathname + location.search) { rota(); return; }
    history.pushState(null, "", url);
    rota();
  }
  document.addEventListener("click", function (e) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var a = e.target.closest ? e.target.closest("a[href]") : null;
    if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
    var h = a.getAttribute("href");
    if (!h || h.charAt(0) !== "/" || h.charAt(1) === "/") return; // só links internos
    e.preventDefault();
    irPara(h);
  });
  window.addEventListener("popstate", rota);

  /* ---------- rotas ---------- */
  function rota() {
    tokenRota++;
    /* links antigos com "#/produto/x" são convertidos para "/produto/x" */
    if (/^#\//.test(location.hash) && history.replaceState) {
      history.replaceState(null, "", location.hash.slice(1));
    }
    var h = location.pathname.replace(/^\/+|\/+$/g, "").replace(/^index\.html$/, "");
    var partes;
    try { partes = h.split("/").map(decodeURIComponent); } catch (e) { partes = [""]; }
    abrirMenu(false);
    LB.fechar();
    window.scrollTo(0, 0);
    var a = partes[0], b = partes[1];
    if (!a) home();
    else if (a === "ps5" || a === "switch") plataforma(a, b || "");
    else if (a === "promocoes") promocoes();
    else if (a === "produto") produto(b);
    else if (a === "busca") busca(b || "");
    else naoEncontrado();
    marcarNav(a === "produto" && achar(b) ? achar(b).plataforma : a || "inicio");
    preencherCapas();
  }

  /* destaca no topo a seção em que você está */
  function marcarNav(chave) {
    Array.prototype.forEach.call(document.querySelectorAll("[data-nav]"), function (l) {
      var on = l.getAttribute("data-nav") === chave;
      l.classList.toggle("ativo", on);
      if (on) l.setAttribute("aria-current", "page"); else l.removeAttribute("aria-current");
    });
  }

  /* ---------- início ---------- */
  document.getElementById("marcaNome").textContent = SITE.nome;
  document.getElementById("marcaSub").textContent = SITE.subtitulo;
  var redes = [];
  if (urlSegura(SITE.youtube)) redes.push('<a href="' + esc(SITE.youtube) + '" target="_blank" rel="noopener">▶ YouTube</a>');
  if (urlSegura(SITE.twitch)) redes.push('<a href="' + esc(SITE.twitch) + '" target="_blank" rel="noopener">🟣 Twitch</a>');
  document.getElementById("redes").innerHTML = redes.join("");

  rota();
})();
