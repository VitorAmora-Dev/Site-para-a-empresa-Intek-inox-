document.addEventListener('headerLoaded', () => {
    initScripts();
});

// Fallback caso o header seja estático ou já esteja carregado
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        if (!document.querySelector('header')) return;
        if (document.body.dataset.scriptsInitialized) return;
        initScripts();
    }, 50);
});

function initScripts() {
    if (document.body.dataset.scriptsInitialized) return;
    document.body.dataset.scriptsInitialized = 'true';

    const HEADER_HEIGHT = 70;

    // --- ELEMENTOS GLOBAIS ---
    const mobileMenuBtn = document.querySelector('.mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    const dropbtn = document.querySelector('.dropbtn');
    const dropdownContent = document.querySelector('.dropdown-content');

    // --- TEMA DARK/LIGHT ---
    const themeToggles = document.querySelectorAll('[data-theme-toggle]');
    const THEME_STORAGE_KEY = 'intek-theme';

    const applyTheme = (theme) => {
        document.body.dataset.theme = theme;
        localStorage.setItem(THEME_STORAGE_KEY, theme);

        themeToggles.forEach(toggle => {
            const icon = toggle.querySelector('i');
            const label = toggle.querySelector('span');
            if (icon) icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
            if (label) label.textContent = theme === 'dark' ? 'Modo Claro' : 'Modo Escuro';
        });
    };

    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(savedTheme || (systemDark ? 'dark' : 'light'));

    themeToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            applyTheme(document.body.dataset.theme === 'dark' ? 'light' : 'dark');
        });
    });

    // --- SCROLL SUAVE ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (!href || href === '#') return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                if (navLinks && navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    if (mobileMenuBtn) mobileMenuBtn.innerHTML = '&#9776;';
                }
                window.scrollTo({ top: target.offsetTop - HEADER_HEIGHT + 1, behavior: 'smooth' });
            }
        });
    });

    // --- MENU MOBILE ---
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            mobileMenuBtn.innerHTML = navLinks.classList.contains('active') ? '✕' : '&#9776;';
        });
    }

    if (dropbtn && dropdownContent) {
        dropbtn.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                dropdownContent.classList.toggle('show');
            }
        });
    }

    // --- ANIMAÇÕES DE SCROLL (REVEAL) ---
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                obs.unobserve(entry.target);
            }
        });
    }, { root: null, rootMargin: '0px', threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    // --- CARROSSEL ---
    const productsCarousel = document.getElementById('products-carousel');
    if (productsCarousel) {
        const prevButton = document.getElementById('prev-product');
        const nextButton = document.getElementById('next-product');
        const items = productsCarousel.querySelectorAll('.carousel-item');

        if (items.length > 0) {
            let isDown = false;
            let startX, scrollLeft;

            productsCarousel.addEventListener('mousedown', (e) => {
                isDown = true;
                productsCarousel.classList.add('active');
                startX = e.pageX - productsCarousel.offsetLeft;
                scrollLeft = productsCarousel.scrollLeft;
            });
            productsCarousel.addEventListener('mouseleave', () => { isDown = false; productsCarousel.classList.remove('active'); });
            productsCarousel.addEventListener('mouseup', () => { isDown = false; productsCarousel.classList.remove('active'); });
            productsCarousel.addEventListener('mousemove', (e) => {
                if (!isDown) return;
                e.preventDefault();
                const walk = (e.pageX - productsCarousel.offsetLeft - startX) * 2;
                productsCarousel.scrollLeft = scrollLeft - walk;
            });

            const getCarouselWidth = () => {
                const style = window.getComputedStyle(productsCarousel);
                return items[0].offsetWidth + (parseFloat(style.gap) || 0);
            };

            if (nextButton) nextButton.addEventListener('click', () => productsCarousel.scrollBy({ left: getCarouselWidth(), behavior: 'smooth' }));
            if (prevButton) prevButton.addEventListener('click', () => productsCarousel.scrollBy({ left: -getCarouselWidth(), behavior: 'smooth' }));
        }
    }

    // --- EFEITO 3D TILT NOS CARDS ---
    const tiltCards = document.querySelectorAll('.slim-card, .product-image-wrapper, .location-card');

    tiltCards.forEach(card => {
        const content = card.querySelector('.card-overlay, .image-badge');

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const rotateX = (((e.clientY - rect.top) / rect.height) - 0.5) * -20;
            const rotateY = (((e.clientX - rect.left) / rect.width) - 0.5) * 20;

            card.style.transition = 'none';
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;

            if (content) {
                content.style.transition = 'none';
                content.style.transform = `translateX(${rotateY * 2}px) translateY(${rotateX * 2}px)`;
            }
        });

        card.addEventListener('mouseleave', () => {
            card.style.transition = 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)';
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';

            if (content) {
                content.style.transition = 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)';
                content.style.transform = 'translateX(0) translateY(0)';
            }
        });
    });

    // --- MODAL DE COTAÇÃO (injetado UMA vez, fora do loop de cards) ---
    initQuoteModal();
}

/**
 * Injeta o modal de cotação por email no DOM uma única vez
 * e registra todos os event listeners necessários.
 */
function initQuoteModal() {
    // Evita injeção duplicada caso initScripts() seja chamado mais de uma vez
    if (document.getElementById('quoteModal')) return;

    const modalHTML = `
        <div class="whatsapp-modal-overlay" id="quoteModal" role="dialog" aria-modal="true" aria-labelledby="quoteModalTitle">
            <div class="whatsapp-modal quote-modal-content">
                <button class="close-modal-btn" id="closeQuoteModal" aria-label="Fechar modal">
                    <i class="fas fa-times"></i>
                </button>
                <h3 id="quoteModalTitle">Solicitar Cotação</h3>
                <p id="quoteProductTarget">Selecione como prefere enviar sua cotação:</p>
                <div class="whatsapp-options">
                    <button id="copyEmailBtn" class="whatsapp-btn email-opt">
                        <i class="fas fa-envelope"></i> Copiar E-mail
                    </button>
                    <a href="mailto:contato@intekinox.com.br" id="openEmailBtn" class="whatsapp-btn email-link-opt">
                        <i class="fas fa-external-link-alt"></i> Abrir E-mail Padrão
                    </a>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    const quoteModal = document.getElementById('quoteModal');
    const closeQuoteBtn = document.getElementById('closeQuoteModal');
    const copyEmailBtn = document.getElementById('copyEmailBtn');
    const openEmailBtn = document.getElementById('openEmailBtn');
    const quoteProductTarget = document.getElementById('quoteProductTarget');

    const pageTitle =
        document.querySelector('h1')?.innerText ||
        document.querySelector('.product-info-wrapper h2')?.innerText ||
        'Produtos Intek';

    const openModal = (originalMailto) => {
        openEmailBtn.setAttribute('href', originalMailto);
        quoteProductTarget.innerText = `Cotar: ${pageTitle}`;
        quoteModal.classList.add('active');
    };

    const closeModal = () => quoteModal.classList.remove('active');

    // Intercepta todos os links mailto da página (exceto o botão interno do modal)
    document.querySelectorAll('a[href^="mailto:"]').forEach(btn => {
        if (btn.id === 'openEmailBtn') return;
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            openModal(btn.getAttribute('href'));
        });
    });

    closeQuoteBtn.addEventListener('click', closeModal);
    quoteModal.addEventListener('click', (e) => { if (e.target === quoteModal) closeModal(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

    copyEmailBtn.addEventListener('click', () => {
        navigator.clipboard.writeText('contato@intekinox.com.br').then(() => {
            const original = copyEmailBtn.innerHTML;
            copyEmailBtn.innerHTML = '<i class="fas fa-check"></i> Copiado!';
            setTimeout(() => { copyEmailBtn.innerHTML = original; }, 2000);
        });
    });
}
