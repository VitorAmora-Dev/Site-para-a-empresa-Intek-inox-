document.addEventListener('DOMContentLoaded', () => {
    loadHeader();
    loadFooter();
    loadWhatsAppButton();
});

function loadHeader() {
    const placeholder = document.getElementById('header-placeholder');
    if (!placeholder) return;

    const isRoot = window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/');
    const basePath = isRoot ? '' : '../';
    const homeLink = isRoot ? '#home' : '../index.html';
    const produtosLink = isRoot ? '#produtos' : '../index.html#produtos';
    const contatoLink = isRoot ? '#contato' : '../index.html#contato';
    const sobreLink = isRoot ? '#sobre' : '../index.html#sobre';

    placeholder.innerHTML = `
    <header>
        <nav>
            <a href="${homeLink}" class="logo" aria-label="Página inicial INTEK">
                <div class="logo-icon" aria-hidden="true">I</div>
                <div class="logo-text">INTEK</div>
            </a>

            <ul class="nav-links" role="menubar">
                <li role="none"><a href="${homeLink}" role="menuitem">Home</a></li>
                <li role="none"><a href="${sobreLink}" role="menuitem">Sobre Nós</a></li>

                <li class="dropdown" role="none">
                    <a href="${produtosLink}" class="dropbtn" role="menuitem" aria-haspopup="true">
                        Produtos <span class="arrow-down" aria-hidden="true">▼</span>
                    </a>
                    <ul class="dropdown-content" role="menu">
                        <li role="none"><a href="${basePath}produtos/chapas.html" role="menuitem">Chapas</a></li>
                        <li role="none"><a href="${basePath}produtos/tubos.html" role="menuitem">Tubos</a></li>
                        <li role="none"><a href="${basePath}produtos/barras.html" role="menuitem">Barras</a></li>
                        <li role="none"><a href="${basePath}produtos/bobinas.html" role="menuitem">Bobinas</a></li>
                        <li role="none"><a href="${basePath}produtos/cantoneiras.html" role="menuitem">Cantoneiras</a></li>
                        <li role="none"><a href="${basePath}produtos/slitter.html" role="menuitem">Slitter</a></li>
                    </ul>
                </li>

                <li role="none"><a href="${contatoLink}" role="menuitem">Contato</a></li>
            </ul>

            <button class="theme-toggle" data-theme-toggle aria-label="Alternar tema">
                <i class="fas fa-moon" aria-hidden="true"></i>
                <span>Modo Escuro</span>
            </button>

            <button class="mobile-menu" aria-label="Abrir menu" aria-expanded="false">&#9776;</button>
        </nav>
    </header>
    `;

    document.dispatchEvent(new Event('headerLoaded'));
}

function loadFooter() {
    const placeholder = document.getElementById('footer-placeholder');
    if (!placeholder) return;

    const currentYear = new Date().getFullYear();

    placeholder.innerHTML = `
    <footer>
        <p><strong>INTEK - Soluções em Aço Inox LTDA.</strong></p>
        <p>Qualidade e precisão em produtos de aço inoxidável</p>
        <p>&copy; ${currentYear} Intek. Todos os direitos reservados.</p>
    </footer>
    `;
}

/**
 * Injeta o botão flutuante de WhatsApp.
 * Exibe aviso enquanto o canal ainda não está disponível.
 */
function loadWhatsAppButton() {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'whatsapp-float-btn';
    button.setAttribute('aria-label', 'Falar com consultor pelo WhatsApp');
    button.innerHTML = '<i class="fab fa-whatsapp" aria-hidden="true"></i>';
    button.addEventListener('click', showWhatsAppUnavailable);

    document.body.appendChild(button);

    // Intercepta também os botões de WhatsApp declarados no HTML
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a[href*="wa.me"]');
        if (link) {
            e.preventDefault();
            showWhatsAppUnavailable();
        }
    });
}

function showWhatsAppUnavailable() {
    const existing = document.getElementById('wpp-unavailable-toast');
    if (existing) return;

    const toast = document.createElement('div');
    toast.id = 'wpp-unavailable-toast';
    toast.setAttribute('role', 'alert');
    toast.innerHTML = `
        <i class="fab fa-whatsapp" aria-hidden="true"></i>
        <span>Atendimento via WhatsApp ainda não disponível.<br>Entre em contato pelo e-mail: <strong>contato@intekinox.com.br</strong></span>
    `;
    document.body.appendChild(toast);

    requestAnimationFrame(() => toast.classList.add('visible'));

    setTimeout(() => {
        toast.classList.remove('visible');
        setTimeout(() => toast.remove(), 400);
    }, 5000);
}
