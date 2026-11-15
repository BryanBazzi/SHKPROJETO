/* ==========================================================
   TRAILERS E LINKS DE AFILIADO — o arquivo que você mais vai usar.

   Cada linha é assim:     produto_loja = seu link

   - "produto" é o id do produto no produtos.js (ex.: astro-bot, gta-6)
   - lojas:   amazon, kabum, mercadolivre, shopee, aliexpress
   - trailer: produto_trailer = link do vídeo no YouTube
   - Deixou o link vazio?  O botão aparece cinza, escrito "Link em breve".
   - Produto indisponível na loja?  Escreva N:  gta-6_kabum = N  ("Não disponível no momento")
   - Quer esconder uma loja de um produto?  Escreva um traço:  astro-bot_shopee = -
   - Mídia Digital (opcional):  produto_digital_amazon = link
     A aba "Mídia Digital" só aparece no site se você preencher pelo menos 1 link digital!
   - Linhas que começam com # são só comentários (o site ignora).
   - Maiúscula, minúscula e hífen não importam: "Amazon_AstroBot" funciona igual a "astro-bot_amazon".

   CUIDADO: não use o símbolo ` (crase) dentro da lista, nem apague as crases do começo e do fim.

   Para um produto novo, copie as linhas de outro produto e troque o nome.
   ========================================================== */
const LINKS = `

# ===== PlayStation 5 Slim =====
ps5-slim_trailer = https://www.youtube.com/watch?v=RkC0l4iekYo
ps5-slim_amazon = https://link.amazon/B02j0rBMC
ps5-slim_kabum = https://tidd.ly/48RTRi8
ps5-slim_mercadolivre = https://meli.la/1mYS1Uq
ps5-slim_shopee = https://s.shopee.com.br/50adjoR040
ps5-slim_aliexpress =

# ===== Grand Theft Auto VI =====
gta-6_trailer = https://www.youtube.com/watch?v=3JUboYgqIxc
gta-6_amazon = https://link.amazon/B0dTmjbzj
gta-6_kabum = https://tidd.ly/4zGRw5o
gta-6_mercadolivre = https://meli.la/2gLhkNJ
gta-6_shopee = https://s.shopee.com.br/7KyYVbHIpX
gta-6_aliexpress = -
gta-6_digital_amazon =
gta-6_digital_kabum =
gta-6_digital_mercadolivre =
gta-6_digital_shopee =
gta-6_digital_aliexpress =

# ===== Astro Bot =====
astro-bot_trailer = https://www.youtube.com/watch?v=wHMNQzLG_Jg
astro-bot_amazon = https://link.amazon/B0fzOUbMP
astro-bot_kabum = https://tidd.ly/4sWME9G
astro-bot_mercadolivre = https://meli.la/1r8LN1Q
astro-bot_shopee = https://s.shopee.com.br/2BGSMwBZCX
astro-bot_aliexpress = -
astro-bot_digital_amazon =
astro-bot_digital_kabum =
astro-bot_digital_mercadolivre =
astro-bot_digital_shopee =
astro-bot_digital_aliexpress =

# ===== Resident Evil Requiem (PS5) =====
resident-evil-requiem_trailer = https://www.youtube.com/watch?v=T54OWinnymM
resident-evil-requiem_amazon = https://link.amazon/B0iX72Iw0
resident-evil-requiem_kabum = N
resident-evil-requiem_mercadolivre = https://meli.la/1z15hw3
resident-evil-requiem_shopee = N
resident-evil-requiem_aliexpress = -
resident-evil-requiem_digital_amazon =
resident-evil-requiem_digital_kabum =
resident-evil-requiem_digital_mercadolivre =
resident-evil-requiem_digital_shopee =
resident-evil-requiem_digital_aliexpress =

# ===== Death Stranding 2: On the Beach =====
death-stranding-2_trailer =
death-stranding-2_amazon =
death-stranding-2_kabum =
death-stranding-2_mercadolivre =
death-stranding-2_shopee =
death-stranding-2_aliexpress =
death-stranding-2_digital_amazon =
death-stranding-2_digital_kabum =
death-stranding-2_digital_mercadolivre =
death-stranding-2_digital_shopee =
death-stranding-2_digital_aliexpress =

# ===== Zelda: Ocarina of Time Remake =====
zelda-ocarina-remake_trailer = https://www.youtube.com/watch?v=o3lNWCdj3bc
zelda-ocarina-remake_amazon = https://link.amazon/B0j3XaJhX
zelda-ocarina-remake_kabum = https://tidd.ly/4AB2Lww
zelda-ocarina-remake_mercadolivre = https://meli.la/1g1Qbur
zelda-ocarina-remake_shopee = https://s.shopee.com.br/20x2BOO9SC
zelda-ocarina-remake_aliexpress = -
zelda-ocarina-remake_digital_amazon =
zelda-ocarina-remake_digital_kabum =
zelda-ocarina-remake_digital_mercadolivre = https://meli.la/2wRjxBC
zelda-ocarina-remake_digital_shopee =
zelda-ocarina-remake_digital_aliexpress =

# ===== Resident Evil Requiem (Switch 2) =====
resident-evil-requiem-switch_trailer =
resident-evil-requiem-switch_amazon =
resident-evil-requiem-switch_kabum =
resident-evil-requiem-switch_mercadolivre =
resident-evil-requiem-switch_shopee =
resident-evil-requiem-switch_aliexpress =
resident-evil-requiem-switch_digital_amazon =
resident-evil-requiem-switch_digital_kabum =
resident-evil-requiem-switch_digital_mercadolivre =
resident-evil-requiem-switch_digital_shopee =
resident-evil-requiem-switch_digital_aliexpress =

# ===== Resident Evil Generation Pack (Switch 2) =====
resident-evil-generation-pack_trailer =
resident-evil-generation-pack_amazon =
resident-evil-generation-pack_kabum =
resident-evil-generation-pack_mercadolivre =
resident-evil-generation-pack_shopee =
resident-evil-generation-pack_aliexpress =
resident-evil-generation-pack_digital_amazon =
resident-evil-generation-pack_digital_kabum =
resident-evil-generation-pack_digital_mercadolivre =
resident-evil-generation-pack_digital_shopee =
resident-evil-generation-pack_digital_aliexpress =

# ===== Marvel's Spider-Man 2 =====
spider-man-2_trailer =
spider-man-2_amazon =
spider-man-2_kabum =
spider-man-2_mercadolivre =
spider-man-2_shopee =
spider-man-2_aliexpress =
spider-man-2_digital_amazon =
spider-man-2_digital_kabum =
spider-man-2_digital_mercadolivre =
spider-man-2_digital_shopee =
spider-man-2_digital_aliexpress =

# ===== Controle DualSense (PS5) =====
dualsense_trailer =
dualsense_amazon =
dualsense_kabum =
dualsense_mercadolivre =
dualsense_shopee =
dualsense_aliexpress =

# ===== Nintendo Switch 2 =====
switch-2_trailer =
switch-2_amazon =
switch-2_kabum =
switch-2_mercadolivre =
switch-2_shopee =
switch-2_aliexpress =

# ===== Nintendo Switch OLED =====
switch-oled_trailer =
switch-oled_amazon =
switch-oled_kabum =
switch-oled_mercadolivre =
switch-oled_shopee =
switch-oled_aliexpress =

# ===== Mario Kart World =====
mario-kart-world_trailer =
mario-kart-world_amazon =
mario-kart-world_kabum =
mario-kart-world_mercadolivre =
mario-kart-world_shopee =
mario-kart-world_aliexpress =
mario-kart-world_digital_amazon =
mario-kart-world_digital_kabum =
mario-kart-world_digital_mercadolivre =
mario-kart-world_digital_shopee =
mario-kart-world_digital_aliexpress =

# ===== Zelda: Tears of the Kingdom =====
zelda-totk_trailer =
zelda-totk_amazon =
zelda-totk_kabum =
zelda-totk_mercadolivre =
zelda-totk_shopee =
zelda-totk_aliexpress =
zelda-totk_digital_amazon =
zelda-totk_digital_kabum =
zelda-totk_digital_mercadolivre =
zelda-totk_digital_shopee =
zelda-totk_digital_aliexpress =

# ===== Controle Pro Nintendo Switch =====
pro-controller_trailer =
pro-controller_amazon =
pro-controller_kabum =
pro-controller_mercadolivre =
pro-controller_shopee =
pro-controller_aliexpress =

# ===== Xbox Series X =====
xbox-series-x_trailer =
xbox-series-x_amazon =
xbox-series-x_kabum =
xbox-series-x_mercadolivre =
xbox-series-x_shopee =
xbox-series-x_aliexpress =

# ===== Xbox Series S =====
xbox-series-s_trailer =
xbox-series-s_amazon =
xbox-series-s_kabum =
xbox-series-s_mercadolivre =
xbox-series-s_shopee =
xbox-series-s_aliexpress =

# ===== Forza Horizon 5 =====
forza-horizon-5_trailer =
forza-horizon-5_amazon =
forza-horizon-5_kabum =
forza-horizon-5_mercadolivre =
forza-horizon-5_shopee =
forza-horizon-5_aliexpress =
forza-horizon-5_digital_amazon =
forza-horizon-5_digital_kabum =
forza-horizon-5_digital_mercadolivre =
forza-horizon-5_digital_shopee =
forza-horizon-5_digital_aliexpress =

# ===== Controle Sem Fio Xbox =====
controle-xbox_trailer =
controle-xbox_amazon =
controle-xbox_kabum =
controle-xbox_mercadolivre =
controle-xbox_shopee =
controle-xbox_aliexpress =


`;
