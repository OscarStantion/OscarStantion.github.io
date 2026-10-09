// ============================================================
// MENÚ HAMBURGUESA - Para TODAS las páginas
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    // Si no existen, los creamos dinámicamente
    if (!hamburger && document.querySelector('.top-nav')) {
        const nav = document.querySelector('.top-nav');
        const btn = document.createElement('button');
        btn.className = 'hamburger';
        btn.setAttribute('aria-label', 'Menú');
        btn.innerHTML = '<span></span><span></span><span></span>';
        nav.insertBefore(btn, nav.querySelector('.nav-links'));
        
        const brand = nav.querySelector('.brand');
        if (brand && !brand.querySelector('.brand-mobile')) {
            const span = document.createElement('span');
            span.className = 'brand-mobile';
            span.textContent = 'Colegio Guadalupe';
            brand.appendChild(span);
        }
    }
    
    const hamburgerFinal = document.querySelector('.hamburger');
    const navLinksFinal = document.querySelector('.nav-links');
    
    if (hamburgerFinal && navLinksFinal) {
        hamburgerFinal.addEventListener('click', function(e) {
            e.stopPropagation();
            this.classList.toggle('active');
            navLinksFinal.classList.toggle('open');
            document.body.style.overflow = navLinksFinal.classList.contains('open') ? 'hidden' : '';
        });

        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', function() {
                hamburgerFinal.classList.remove('active');
                navLinksFinal.classList.remove('open');
                document.body.style.overflow = '';
            });
        });

        document.addEventListener('click', function(event) {
            const isClickInside = hamburgerFinal.contains(event.target) || navLinksFinal.contains(event.target);
            if (!isClickInside && navLinksFinal.classList.contains('open')) {
                hamburgerFinal.classList.remove('active');
                navLinksFinal.classList.remove('open');
                document.body.style.overflow = '';
            }
        });

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navLinksFinal.classList.contains('open')) {
                hamburgerFinal.classList.remove('active');
                navLinksFinal.classList.remove('open');
                document.body.style.overflow = '';
            }
        });
    }
});

// ============================================================
// ANIMACIONES AL HACER SCROLL (Intersection Observer)
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
    const animatedElements = document.querySelectorAll(
        '.timeline-item, .value-item, .metric-card, .highlight-card, .nivel-card, .beneficio-item, .enrollment-preview__steps article, .cta-content, .identity-card, .director-card, .history-quote, .team-card, .info-card, .social-link, .contact-form-wrapper, .process-step, .fee-card, .document-card, .faq-item, .important-item, .level-card, .institution-photo, .value-card, .showcase-slide'
    );

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('reveal-visible');
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.12,
            rootMargin: '0px 0px -30px 0px',
        }
    );

    animatedElements.forEach((el) => {
        el.classList.add('reveal-hidden');
        observer.observe(el);
    });
});

// ============================================================
// BOTÓN DE VOLVER ARRIBA (SCROLL TO TOP)
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
    if (document.querySelector('.scroll-top-btn')) return;
    
    const scrollBtn = document.createElement('button');
    scrollBtn.className = 'scroll-top-btn';
    scrollBtn.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';
    scrollBtn.setAttribute('aria-label', 'Volver arriba');
    document.body.appendChild(scrollBtn);
    
    const style = document.createElement('style');
    style.textContent = `
        .scroll-top-btn {
            position: fixed;
            bottom: 90px;
            right: 20px;
            width: 48px;
            height: 48px;
            border-radius: 50%;
            background: #FDBB13;
            color: #0B2A4A;
            border: none;
            cursor: pointer;
            font-size: 1.2rem;
            box-shadow: 0 4px 15px rgba(253, 187, 19, 0.3);
            transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            opacity: 0;
            visibility: hidden;
            transform: translateY(20px);
            z-index: 999;
        }
        .scroll-top-btn.visible {
            opacity: 1;
            visibility: visible;
            transform: translateY(0);
        }
        .scroll-top-btn:hover {
            transform: translateY(-3px) scale(1.05);
            box-shadow: 0 8px 25px rgba(253, 187, 19, 0.5);
        }
        @media (max-width: 600px) {
            .scroll-top-btn {
                bottom: 75px;
                right: 12px;
                width: 40px;
                height: 40px;
                font-size: 1rem;
            }
        }
    `;
    document.head.appendChild(style);
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 400) {
            scrollBtn.classList.add('visible');
        } else {
            scrollBtn.classList.remove('visible');
        }
    });
    
    scrollBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});

// ============================================================
// EFECTO PARALLAX EN EL HERO
// ============================================================
document.addEventListener('scroll', function() {
    const hero = document.querySelector('.hero, .contact-hero, .institucion-hero, .enrollment-hero');
    if (hero) {
        const scrollPosition = window.scrollY;
        const heroContent = hero.querySelector('.hero-content, .hero-content-left, .hero-inner');
        if (heroContent && scrollPosition < 600) {
            heroContent.style.transform = `translateY(${scrollPosition * 0.12}px)`;
            heroContent.style.opacity = Math.max(1 - scrollPosition / 700, 0.4);
        }
    }
});