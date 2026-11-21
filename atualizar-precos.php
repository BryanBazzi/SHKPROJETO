<?php
/**
 * Atualização automática de preços via Feed Oficial da Awin (KaBuM!) + Cupom da página
 *
 * Agendamento no cPanel da HostGator (Tarefas Cron):
 *   Frequência: Uma vez por hora (0 * * * *)
 *   Comando:    php -q /home2/bryanp10/public_html/atualizar-precos.php
 */

if (php_sapi_name() !== 'cli') {
    http_response_code(403);
    exit('Acesso permitido apenas via Cron.');
}

date_default_timezone_set('America/Sao_Paulo');

$ARQUIVO_PRECOS = __DIR__ . '/precos.json';

$AWIN_KABUM_FEED = 'https://productdata.awin.com/datafeed/download/apikey/d2587e60c98f8edb1b0e4732ac9687cc/language/pt/fid/46967/rid/0/hasEnhancedFeeds/0/columns/merchant_product_id,search_price/format/csv/delimiter/%2C/compression/gzip/adultcontent/1/';

// Mapa: 'id-no-seu-site' => ['id' => 'id-na-kabum', 'url' => 'url-direta-sem-afiliado']
$KABUM_PRODUTOS = [
    'ps5-slim' => [
        'id'  => '989702',
        'url' => 'https://www.kabum.com.br/produto/989702/console-sony-playstation-5-ssd-825gb-controle-sem-fio-dualsense-2-jogos-digitais-edicao-digital',
    ],
    'gta-6' => [
        'id'  => '1051619',
        'url' => 'https://www.kabum.com.br/produto/1051619/jogo-grand-theft-auto-gta-vi-6-ps5-tt000272ps5',
    ],
    'astro-bot' => [
        'id'  => '609663',
        'url' => 'https://www.kabum.com.br/produto/609663/jogo-astro-bot-ps5-1000044301',
    ],
    'dualsense' => [
        'id'  => '1032834',
        'url' => 'https://www.kabum.com.br/produto/1032834/controle-sem-fio-sony-dualsense-playstation-5-bluetooth-branco-3005767',
    ],
    'switch-2' => [
        'id'  => '777177',
        'url' => 'https://www.kabum.com.br/produto/777177/console-nintendo-switch-2-256gb-preto-azul-e-vermelho',
    ],
    'zelda-ocarina-remake' => [
        'id'  => '1089825',
        'url' => 'https://www.kabum.com.br/produto/1089825/jogo-the-legend-of-zelda-ocarina-of-time-para-nintendo-switch-2',
    ],
    'resident-evil-requiem-switch' => [
        'id'  => '1002659',
        'url' => 'https://www.kabum.com.br/produto/1002659/jogo-resident-evil-requiem-para-nintendo-switch-2-cp000037nsw',
    ],
    'resident-evil-generation-pack' => [
        'id'  => '1020006',
        'url' => 'https://www.kabum.com.br/produto/1020006/resident-evil-generation-pack',
    ],
    'switch-oled' => [
        'id'  => '940533',
        'url' => 'https://www.kabum.com.br/produto/940533/console-nintendo-switch-oled-super-mario-bros-wonder-3mo-nos-nt000053nsw',
    ],
    'pro-controller' => [
        'id'  => '178103',
        'url' => 'https://www.kabum.com.br/produto/178103/controle-nintendo-switch-pro-controller-hacafssk2',
    ],
    'controle-xbox' => [
        'id'  => '135642',
        'url' => 'https://www.kabum.com.br/produto/135642/controle-sem-fio-microsoft-xbox-branco-qas-00007',
    ],
];

function baixar($url, $browserHeaders = false) {
    $ch = curl_init($url);
    $opts = [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_SSL_VERIFYPEER => true,
        CURLOPT_ENCODING => '',
    ];
    if ($browserHeaders) {
        $opts[CURLOPT_HTTPHEADER] = [
            'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
            'Accept-Language: pt-BR,pt;q=0.9',
        ];
    }
    curl_setopt_array($ch, $opts);
    $body = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    return ($code >= 200 && $code < 300 && $body) ? $body : null;
}

function checarPaginaKabum($url) {
    $html = baixar($url, true);
    if (!$html) return null;
    $res = ['preco' => null, 'cupom' => null];

    $pix   = preg_match('/"priceWithDiscount"\s*:\s*([\d.]+)/', $html, $md) ? (float)$md[1] : null;
    $cheio = null;
    if (preg_match_all('/"price"\s*:\s*([\d.]+)/', $html, $mp) && !empty($mp[1])) {
        $cheio = max(array_map('floatval', $mp[1])); // ignora o "price" já com Pix do JSON-LD
    }
    $res['preco'] = ($pix && $pix > 0) ? $pix : (($cheio && $cheio > 0) ? $cheio : null);

    if ($res['preco'] && preg_match('/"description"\s*:\s*"Use o cupom ([A-Z0-9_-]+) e ganhe (\d+(?:[.,]\d+)?)%\s*OFF/i', $html, $mc)) {
        $codigo = strtoupper($mc[1]);
        $pct = (float)str_replace(',', '.', $mc[2]);
        if ($pct > 0 && $pct < 90) {
            $res['preco'] = round($res['preco'] * (1 - $pct / 100), 2);
            $res['cupom'] = $codigo;
        }
    } elseif ($res['preco'] && preg_match('/"description"\s*:\s*"Use o cupom ([A-Z0-9_-]+) e ganhe R\$\s*(\d+(?:[.,]\d+)?)\s*OFF/i', $html, $mc)) {
        $codigo = strtoupper($mc[1]);
        $desc = (float)str_replace(',', '.', str_replace('.', '', $mc[2]));
        $fatorPix = ($cheio && $pix && $cheio > 0) ? ($pix / $cheio) : 1;
        $base = ($cheio && $cheio > 0) ? $cheio : $res['preco'];
        if ($desc > 0 && $desc < $base) {
            // Na KaBuM!, cupom em R$ abate do preço cheio antes do desconto do Pix
            $res['preco'] = round(($base - $desc) * $fatorPix, 2);
            $res['cupom'] = $codigo;
        }
    }
    return $res;
}

$dados = ['atualizadoEm' => date('c'), 'precos' => []];
if (file_exists($ARQUIVO_PRECOS)) {
    $antigo = json_decode(file_get_contents($ARQUIVO_PRECOS), true);
    if (is_array($antigo) && isset($antigo['precos']) && is_array($antigo['precos'])) {
        $dados['precos'] = $antigo['precos'];
    }
}

// 1. Preço base via Feed Oficial da Awin
$precosAwin = [];
$gz = baixar($AWIN_KABUM_FEED);
if ($gz && function_exists('gzdecode')) {
    $csv = @gzdecode($gz);
    if ($csv) {
        $busca = [];
        foreach ($KABUM_PRODUTOS as $siteId => $cfg) $busca[$cfg['id']] = $siteId;
        $fp = fopen('php://memory', 'r+');
        fwrite($fp, $csv);
        rewind($fp);
        $cab = fgetcsv($fp);
        $idxId = $cab ? array_search('merchant_product_id', $cab, true) : false;
        $idxPr = $cab ? array_search('search_price', $cab, true) : false;
        if ($idxId !== false && $idxPr !== false) {
            while (($linha = fgetcsv($fp)) !== false) {
                $mid = isset($linha[$idxId]) ? trim($linha[$idxId]) : '';
                if ($mid !== '' && isset($busca[$mid])) {
                    $p = (float)str_replace(',', '.', $linha[$idxPr]);
                    if ($p > 0) $precosAwin[$busca[$mid]] = round($p, 2);
                }
            }
        }
        fclose($fp);
    }
}

$agora = time();

// 2. Combina com cupom / preço ao vivo da página direta (quando houver)
foreach ($KABUM_PRODUTOS as $siteId => $cfg) {
    $preco = isset($precosAwin[$siteId]) ? $precosAwin[$siteId] : null;
    $cupom = null;

    if (!empty($cfg['url'])) {
        $live = checarPaginaKabum($cfg['url']);
        if ($live && $live['preco'] !== null) {
            $preco = $live['preco'];
            $cupom = $live['cupom'];
        }
    }

    if ($preco !== null) {
        if (!isset($dados['precos'][$siteId])) $dados['precos'][$siteId] = [];
        $item = ['preco' => round($preco, 2), 'em' => $agora];
        if ($cupom) $item['cupom'] = $cupom;
        $dados['precos'][$siteId]['kabum'] = $item;
        echo "[OK] $siteId kabum = R$ " . number_format($preco, 2, ',', '.') . ($cupom ? " (Cupom: $cupom)" : "") . "\n";
    } else {
        echo "[AVISO] $siteId kabum sem retorno; mantendo anterior se existir.\n";
    }
}

$dados['atualizadoEm'] = date('c');
file_put_contents($ARQUIVO_PRECOS, json_encode($dados, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) . "\n", LOCK_EX);
echo "Salvo em $ARQUIVO_PRECOS\n";
