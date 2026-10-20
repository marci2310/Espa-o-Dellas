#Atualizado em 19/10.#
# Espaço dellas — site

Site estático (HTML + CSS + JS), sem build. Funciona no Cloudflare e no GitHub Pages.

## Como o agendamento funciona

A cliente escolhe os serviços, digita o nome e toca em **Enviar pelo WhatsApp**. O WhatsApp do salão abre com a mensagem pronta, por exemplo:

> Olá, Espaço dellas! 😊
> Me chamo Anna e gostaria de saber mais sobre manicure e pedicure.
> Poderiam me passar os valores e os horários disponíveis?
>
> Desde já, agradeço!

Dia e horário são combinados na conversa. O site não guarda nada, então não existe agenda nem painel no site.

Para mudar o texto da mensagem: função `buildWhatsappMessage()` em `script.js`.

## Antes de publicar (obrigatório)

1. **WhatsApp real** em `script.js` → `CONFIG.business.whatsapp` (só números, `55` + DDD + número) e `whatsappDisplay`. Com o número de exemplo, o botão de enviar não funciona.
2. **Instagram** em `CONFIG.business.instagram` e `instagramUrl` (vazio = link escondido).
3. **Fotos**: as imagens do topo e da seção "Sobre" são do Unsplash. Troque por fotos reais do salão.

## Editar

| O quê | Onde |
| --- | --- |
| Serviços | `CONFIG.services` (para mostrar preço, acrescente `price: 50`) |
| Avaliações do Google | `CONFIG.reviews` (a nota 5,0 e o total "41" ficam no `index.html`, seção `#avaliacoes` e faixa do topo) |
| Link das avaliações | `CONFIG.business.googleUrl` |
| Horário, endereço e mapa | `CONFIG.opening`, `CONFIG.business.addressLines`, `mapsQuery` |
| Cores | `:root` no início de `styles.css` |

## Trocar fotos

Coloque os arquivos em `assets/` (WebP ou JPEG, até ~150 KB cada) e troque os atributos `src` e `srcset` das imagens no `index.html`. Se usar um arquivo só, apague o `srcset` e o `<link rel="preload" ...>` da foto do topo. A imagem de compartilhamento (`og:image`) também deve ser uma foto real, 1200×630, com URL completa.

## Publicar

Envie os arquivos para o GitHub (*Add file → Upload files*, mesmo nome substitui o antigo). O Cloudflare republica sozinho em cerca de 30 segundos. O arquivo `_headers` (segurança) só vale no Cloudflare.

## Depois que tiver o domínio

- No `<head>` do `index.html`, adicione `<link rel="canonical" href="https://SEU-DOMINIO/" />` e `<meta property="og:url" content="https://SEU-DOMINIO/" />`.
- Descomente a linha `Sitemap` em `robots.txt` e crie um `sitemap.xml` com a URL da home.
