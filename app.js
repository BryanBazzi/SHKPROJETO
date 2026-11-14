(function () {
  "use strict";

  var app = document.getElementById("app");
  var menu = document.getElementById("menu");
  var fundo = document.getElementById("fundo");
  var btnMenu = document.getElementById("btnMenu");
  var campoBusca = document.getElementById("campoBusca");
  var tokenRota = 0;

  var PLAT = {
    ps5: { nome: "PlayStation 5", curto: "PS5", abas: [{ chave: "", rotulo: "Tudo" }, { chave: "consoles", rotulo: "Consoles" }, { chave: "jogos", rotulo: "Jogos" }] },
    "switch": { nome: "Nintendo Switch", curto: "Switch", abas: [{ chave: "", rotulo: "Tudo" }, { chave: "consoles", rotulo: "Consoles" }, { chave: "jogos", rotulo: "Jogos" }] },
    pc: { nome: "PC & Setup", curto: "PC", abas: [{ chave: "", rotulo: "Tudo" }, { chave: "hardware", rotulo: "Hardware" }, { chave: "perifericos", rotulo: "Periféricos" }] }
  };

  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function norm(s) { return String(s || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase(); }
  function chave(s) { return norm(s).replace(/[^a-z0-9]/g, ""); }
  function acha(p, q) {
    var junto = chave(q);
    if (!junto) return false;
    var feno = chave(p.nome + " " + p.id + " " + (p.versao || "") + " " + p.descricao);
    return feno.indexOf(junto) !== -1;
  }
  function urlSegura(u) {
    u = String(u || "").trim();
    if (!u || u === "-") return "";
    if (/^https?:\/\//i.test(u)) return u;
    if (u.indexOf(".") !== -1) return "https://" + u;
    return "";
  }
  function ytId(v) {
    if (!v) return "";
    var m = String(v).trim().match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([\w-]{11})/);
    return m ? m[1] : (/^[\w-]{11}$/.test(v) ? v : "");
  }
  function setTema(t, titulo) { document.title = (titulo ? titulo + " • " : "") + SITE.nome + " " + SITE.subtitulo; }
  function achar(id) { for (var i = 0; i < PRODUTOS.length; i++) if (PRODUTOS[i].id === id) return PRODUTOS[i]; return null; }

  /* Links */
  var MAPA_LINKS = {};
  String(typeof LINKS === "string" ? LINKS : "").split(/\r?\n/).forEach(function (linha) {
    var i = linha.indexOf("=");
    if (i > 0 && linha.charAt(0) !== "#") MAPA_LINKS[linha.slice(0, i).trim().toLowerCase().replace(/[^a-z0-9_]/g, "")] = linha.slice(i + 1).trim();
  });
  function linkDe(id, tipo) {
    var base = id.replace(/[^a-z0-9_]/g, "");
    return MAPA_LINKS[base + "_" + tipo] || MAPA_LINKS[tipo + "_" + base] || "";
  }

  /* Imagens por Pasta (imagens/id_do_jogo/capa.png) */
  var EXTENSOES = ["png", "jpg", "webp", "jpeg"];
  var cacheImg = {};

  function testar(src) {
    return new Promise(function (resolve) {
      var im = new Image();
      im.onload = function () { resolve(true); }; im.onerror = function () { resolve(false); }; im.src = src;
    });
  }

  // Agora ele busca dentro da pasta do produto! Ex: imagens/gta-6/capa.png
  function acharProdutoMidia(id, nomeArquivo) {
    var cKey = id + "/" + nomeArquivo;
    if (cacheImg[cKey] !== undefined) return Promise.resolve(cacheImg[cKey]);
    return EXTENSOES.reduce(function (cadeia, ext) {
      return cadeia.then(function (achada) {
        if (achada) return achada;
        var pasta = SITE.pastaImagens ? SITE.pastaImagens + "/" : "";
        var src = pasta + id + "/" + nomeArquivo + "." + ext;
        return testar(src).then(function (ok) { return ok ? src : ""; });
      });
    }, Promise.resolve("")).then(function (r) { cacheImg[cKey] = r; return r; });
  }

  function acharPrints(id) {
    var achadas = [];
    function buscarPrint(n) {
      return acharProdutoMidia(id, "print" + n).then(function(src) {
        if (!src) return achadas; // Parou de achar prints, encerra.
        achadas.push({ tipo: "imagem", src: src });
        return buscarPrint(n + 1);
      });
    }
    return buscarPrint(1);
  }

  function resolverMidia(p) {
    return Promise.all([acharProdutoMidia(p.id, "capa"), acharPrints(p.id)]).then(function (r) {
      var itens = [];
      if (r[0]) itens.push({ tipo: "imagem", src: r[0] });
      var yt = ytId(linkDe(p.id, "trailer"));
      if (yt) itens.push({ tipo: "video", id: yt });
      return itens.concat(r[1]);
    });
  }

  /* Interface de Produto e Lightbox (Zoom) */
  var itensGaleria = [];
  var indiceGaleria = 0;
  var produtoAtual = null;

  function palcoHTML(m, p) {
    if (m.tipo === "video") return '<div class="video"><iframe src="https://www.youtube-nocookie.com/embed/' + m.id + '" allowfullscreen></iframe></div>';
    return '<div class="video palco-img" style="background:#fff;"><img class="palco-foto" src="' + esc(m.src) + '" alt="' + esc(p.nome) + '"></div>';
  }

  function abrirLightbox(i) {
    if(!itensGaleria.length) return;
    indiceGaleria = i;
    document.getElementById("lightbox").classList.remove("escondido");
    atualizarLightbox();
  }

  function atualizarLightbox() {
    var conteudo = document.getElementById("lb-conteudo");
    conteudo.innerHTML = palcoHTML(itensGaleria[indiceGaleria], produtoAtual);
  }

  // Controles Globais do Lightbox
  document.querySelector(".lb-fechar").addEventListener("click", function() { document.getElementById("lightbox").classList.add("escondido"); document.getElementById("lb-conteudo").innerHTML = ""; });
  document.querySelector(".lb-ant").addEventListener("click", function() { if(indiceGaleria > 0) { indiceGaleria--; atualizarLightbox(); } else { indiceGaleria = itensGaleria.length - 1; atualizarLightbox(); } });
  document.querySelector(".lb-prox").addEventListener("click", function() { if(indiceGaleria < itensGaleria.length - 1) { indiceGaleria++; atualizarLightbox(); } else { indiceGaleria = 0; atualizarLightbox(); } });
  document.getElementById("lightbox").addEventListener("click", function(e) { if(e.target === this) { this.classList.add("escondido"); document.getElementById("lb-conteudo").innerHTML = ""; }});

  function montarMidia(itens, p, meu) {
    var box = document.getElementById("midiaBox");
    if (!box || meu !== tokenRota) return;
    if (!itens.length) { box.innerHTML = '<div class="video video-vazio">🎬<p>Imagens em breve</p></div>'; return; }
    
    itensGaleria = itens;
    produtoAtual = p;

    box.innerHTML = '<div id="palco" class="palco" style="cursor:zoom-in;">' + palcoHTML(itens[0], p) + "</div>" +
      (itens.length > 1 ? '<div class="minis">' + itens.map(function (m, i) { 
        var img = m.tipo === "video" ? "https://i.ytimg.com/vi/" + m.id + "/mqdefault.jpg" : m.src;
        return '<button class="mini' + (i === 0 ? " ativa" : "") + '" data-i="' + i + '"><img src="' + esc(img) + '">' + (m.tipo === "video" ? '<span class="mini-play">▶</span>' : "") + "</button>";
      }).join("") + "</div>" : "");
    
    // Clicar na imagem principal abre o Zoom!
    document.getElementById("palco").addEventListener("click", function() { abrirLightbox(indiceGaleria); });

    var minis = box.querySelectorAll(".mini");
    Array.prototype.forEach.call(minis, function (btn) {
      btn.addEventListener("click", function () {
        var i = parseInt(btn.getAttribute("data-i"), 10);
        indiceGaleria = i;
        document.getElementById("palco").innerHTML = palcoHTML(itens[i], p);
        Array.prototype.forEach.call(minis, function (b) { b.classList.remove("ativa"); });
        btn.classList.add("ativa");
      });
    });
  }

  function capa(p) { return '<div class="capa" data-id="' + esc(p.id) + '" data-nome="' + esc(p.nome) + '"><span class="capa-nome">' + esc(p.nome) + "</span></div>"; }
  function preencherCapas() {
    var meu = tokenRota;
    var lista = app.querySelectorAll ? app.querySelectorAll(".capa[data-id]") : [];
    Array.prototype.forEach.call(lista, function (c) {
      acharProdutoMidia(c.getAttribute("data-id"), "capa").then(function (src) {
        if (!src || meu !== tokenRota) return;
        c.innerHTML = '<img class="capa-foto" src="' + esc(src) + '" alt="' + esc(c.getAttribute("data-nome")) + '">';
      });
    });
  }

  function card(p) {
    return '<a class="card" href="#/produto/' + esc(p.id) + '">' + capa(p) +
      '<div class="card-corpo"><div class="selos">' + (p.promocao ? '<span class="selo selo-promo">🔥 Promoção</span>' : "") + '<span class="selo">' + esc(p.versao || PLAT[p.plataforma].curto) + "</span></div>" +
      "<h3>" + esc(p.nome) + "</h3><span class=\"ver\">Ver onde comprar →</span></div></a>";
  }

  function grade(lista, vazio) {
    return lista.length ? '<div class="grade">' + lista.map(card).join("") + "</div>" : '<p class="vazio">' + esc(vazio || "Nada por aqui ainda.") + "</p>";
  }
  function secao(titulo, html) { return '<section class="secao"><div class="secao-topo"><h2>' + esc(titulo) + "</h2></div>" + html + "</section>"; }

  function botaoLoja(p, k) {
    var v = linkDe(p.id, k);
    if (v === "-") return "";
    var nome = esc(LOJAS[k].nome);
    // Para as lojas, continua procurando a imagem solta na raiz da pasta imagens (ex: imagens/loja-amazon.png)
    var pasta = SITE.pastaImagens ? SITE.pastaImagens + "/" : "";
    var ico = '<span class="loja-ico" data-sigla="' + esc(LOJAS[k].sigla) + '"><img src="' + pasta + "loja-" + k + '.png" onerror="this.parentNode.classList.add(\'sem-logo\');this.remove()"></span>';
    var url = urlSegura(v);
    if (url) return '<a class="loja loja-' + k + '" href="' + esc(url) + '" target="_blank">' + ico + '<span class="loja-txt"><strong>' + nome + "</strong><small>Ver preço</small></span><em>→</em></a>';
    return '<div class="loja loja-' + k + ' off">' + ico + '<span class="loja-txt"><strong>' + nome + "</strong><small>Link em breve</small></span></div>';
  }

  function produto(id) {
    var p = achar(id);
    if (!p) { app.innerHTML = '<section class="plat-topo"><h1>Página não encontrada</h1></section>'; return; }
    setTema(p.plataforma, p.nome);
    var plat = PLAT[p.plataforma];
    var meu = tokenRota;
    var botoes = Object.keys(LOJAS).map(function (k) { return botaoLoja(p, k); }).join("");

    app.innerHTML =
      '<nav class="trilha"><a href="#/">Início</a> › <a href="#/' + p.plataforma + '">' + esc(plat.nome) + "</a></nav>" +
      '<article class="produto">' +
      '<div id="midiaBox" class="produto-midia"><div class="video video-vazio">⏳</div></div>' +
      '<div class="produto-info">' +
      '<div class="selos">' + (p.promocao ? '<span class="selo selo-promo">🔥</span>' : "") + '<span class="selo">' + esc(p.versao || plat.curto) + "</span></div>" +
      "<h1>" + esc(p.nome) + "</h1><p class=\"desc\">" + esc(p.descricao) + "</p>" +
      "<h2>Onde comprar</h2><div class=\"lojas\">" + (botoes || '<p class="vazio">Link em breve.</p>') + "</div>" +
      "</div></article>";

    resolverMidia(p).then(function (itens) { montarMidia(itens, p, meu); });
  }

  function home() {
    setTema("neutro");
    app.innerHTML = '<section class="hero"><h1>Seu Setup. <span>Sua Regra.</span></h1></section>' +
      secao("🔥 Destaques", grade(PRODUTOS.filter(function(p){return p.destaque;})));
  }

  function rota() {
    tokenRota++;
    var partes = location.hash.replace(/^#\/?/, "").split("/");
    var a = partes[0], b = partes[1];
    document.getElementById("lightbox").classList.add("escondido"); // fecha o lightbox ao trocar de pagina
    document.getElementById("menu").classList.remove("aberto");
    document.getElementById("fundo").classList.remove("aberto");
    
    if (!a) home(); else if (a === "produto") produto(b); else home(); // Simplificado pro exemplo, mantenha sua rota completa de categorias aqui
    preencherCapas();
  }

  window.addEventListener("hashchange", rota);
  rota();
})();