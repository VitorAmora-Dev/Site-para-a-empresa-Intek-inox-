# INTEK — Soluções em Aço Inox

> Site institucional da **INTEK - Soluções em Aço Inox LTDA**, distribuidora B2B de produtos em aço inoxidável e carbono com presença em Canoas/RS e São Paulo/SP.

---

## Sobre o Projeto

Site institucional desenvolvido para a **INTEK - Soluções em Aço Inox LTDA**, empresa especializada na distribuição de produtos em aço inoxidável e carbono para aplicações industriais.

O objetivo do site é apresentar o portfólio de produtos da empresa, transmitir credibilidade para o público B2B e converter visitantes em leads qualificados via WhatsApp e e-mail. O projeto foi construído com HTML, CSS e JavaScript puros — sem frameworks — priorizando performance, responsividade e uma experiência visual sofisticada alinhada ao posicionamento da empresa.

---

## Páginas

| Arquivo | Descrição |
|---|---|
| `index.html` | Home — Hero, grid de produtos, sobre nós, contato |
| `quem-somos.html` | Institucional — história, missão, visão, valores e diferenciais |
| `produtos/chapas.html` | Produto: Chapas de Aço Inox |
| `produtos/tubos.html` | Produto: Tubos de Aço Inox |
| `produtos/barras.html` | Produto: Barras de Aço Inox |
| `produtos/bobinas.html` | Produto: Bobinas de Aço Inox |
| `produtos/cantoneiras.html` | Produto: Cantoneiras de Aço Inox |
| `produtos/slitter.html` | Produto: Slitter |

---

## Estrutura do Projeto

```
intek/
├── index.html
├── quem-somos.html
├── produtos/
│   ├── chapas.html
│   ├── tubos.html
│   ├── barras.html
│   ├── bobinas.html
│   ├── cantoneiras.html
│   └── slitter.html
├── public/
│   ├── styles.css          # CSS global (dark mode, responsivo, animações)
│   ├── whatsapp-modal.css  # Estilos do modal de cotação
│   ├── components.js       # Header, footer e botão WhatsApp dinâmicos
│   └── script.js           # Tema, scroll, menu mobile, tilt 3D, modal
└── images/
    ├── logo-nova.png
    └── intek-*.png         # Imagens dos produtos
```

---

## Funcionalidades

- **Dark/Light Mode** — alternância com persistência via `localStorage`, detecta preferência do sistema
- **Header dinâmico** — injetado via `components.js` com dropdown de produtos e navegação adaptativa (root vs. subpáginas)
- **Botão flutuante WhatsApp** — CTA de conversão com animação pulse, mensagem pré-preenchida
- **Animações de scroll** — elementos revelados via `IntersectionObserver` (`.reveal`)
- **Efeito 3D Tilt** — paralaxe nos cards de produto ao mover o mouse
- **Modal de cotação** — intercepta links `mailto:`, oferece copiar e-mail ou abrir cliente de e-mail
- **Responsivo** — mobile-first, breakpoints em 1200px, 992px, 768px e 480px

