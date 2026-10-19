# Espaço dellas — site

Site estático (HTML + CSS + JS), sem build. Funciona no GitHub Pages e no Cloudflare Pages.

## Antes de publicar (obrigatório)

1. **WhatsApp real** em `script.js` → `CONFIG.business.whatsapp` (só números, `55` + DDD + número) e `whatsappDisplay`. Enquanto estiver o número de exemplo, o botão "Confirmar agendamento" não envia nada.
2. **Preços e durações** em `CONFIG.services`: os valores atuais são exemplos.
3. **Instagram** em `CONFIG.business.instagram` e `instagramUrl` (vazio = link escondido).
4. **Fotos**: as imagens são do Unsplash (banco de fotos). Troque por fotos reais do salão (veja abaixo).
5. **Depoimentos**: `CONFIG.testimonials` está vazio de propósito. Só coloque avaliações reais e autorizadas.

## Publicar

**GitHub:** crie o repositório → *Add file → Upload files* → arraste o **conteúdo** desta pasta (não a pasta em si) → *Commit*.

**Cloudflare Pages:** *Workers & Pages → Create → Pages → Connect to Git* → escolha o repositório →
- Framework preset: **None**
- Build command: *(vazio)*
- Build output directory: **/**

Cada commit novo no GitHub republica sozinho. O arquivo `_headers` (segurança e política de conteúdo) só vale no Cloudflare, não no GitHub Pages.

## Depois que tiver o domínio

- Em `index.html`, dentro do `<head>`, adicione:
  `<link rel="canonical" href="https://SEU-DOMINIO/" />` e `<meta property="og:url" content="https://SEU-DOMINIO/" />`
- Descomente a linha `Sitemap` em `robots.txt` e crie um `sitemap.xml` com a URL da home.
- Cadastre o site no Google Search Console e coloque o link no perfil do Google Meu Negócio.

## Trocar fotos

Coloque os arquivos em `assets/` (WebP ou JPEG, até ~150 KB cada; hero 960 px de largura, galeria 900 px) e troque:
- hero e "Sobre": atributos `src` e `srcset` no `index.html` (apague o `srcset` e o `<link rel="preload" ...>` do hero se usar um arquivo só);
- galeria: `image` em `CONFIG.gallery`.
- imagem de compartilhamento (`og:image`): use uma foto real, 1200×630, com URL completa.

## Limitações atuais do agendamento

Os horários ficam salvos só no navegador de quem agendou (`localStorage`). Duas clientes diferentes podem escolher o mesmo horário, então a confirmação real é a resposta do salão no WhatsApp. Para uma agenda compartilhada, troque `getBookings()` e `saveBooking()` por Google Apps Script/Sheets ou Firebase.

O painel "Área da dona" vem **desligado** (`ownerPanelEnabled: false`): ele só vê agendamentos feitos no mesmo aparelho e a senha fica visível no código.

## Editar o resto

| O quê | Onde |
| --- | --- |
| Horário de funcionamento | `CONFIG.opening` (`openDays`: 0 dom … 6 sáb) |
| Antecedência mínima no mesmo dia / meses no calendário | `minLeadMinutes`, `maxMonthsAhead` |
| Endereço e mapa | `CONFIG.business.addressLines`, `mapsQuery` |
| Cores | `:root` no início de `styles.css` |

Teste local: `python3 -m http.server 3000` e abra `http://localhost:3000`.
