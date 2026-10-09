// Interacciones para la página de proceso de matrícula

document.addEventListener('DOMContentLoaded', () => {
    // Revelado suave al hacer scroll
    const revealElements = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });
        revealElements.forEach((element) => observer.observe(element));
    } else {
        revealElements.forEach((element) => element.classList.add('visible'));
    }

    // Pestañas de requisitos
    const tabs = document.querySelectorAll('.requirement-tab');
    const panels = document.querySelectorAll('.requirement-panel');
    tabs.forEach((tab) => {
        tab.addEventListener('click', () => {
            const targetId = tab.dataset.target;
            tabs.forEach((item) => {
                const selected = item === tab;
                item.classList.toggle('active', selected);
                item.setAttribute('aria-selected', String(selected));
            });
            panels.forEach((panel) => {
                const selected = panel.id === targetId;
                panel.classList.toggle('active', selected);
                panel.hidden = !selected;
            });
        });
    });

    // Imprimir la lista visible
    document.querySelectorAll('[data-print]').forEach((button) => {
        button.addEventListener('click', () => window.print());
    });

    // Acordeón de preguntas frecuentes
    document.querySelectorAll('.faq-item button').forEach((button) => {
        button.addEventListener('click', () => {
            const item = button.closest('.faq-item');
            const isOpen = item.classList.toggle('open');
            button.setAttribute('aria-expanded', String(isOpen));
        });
    });

    // Opciones de grado según el nivel
    const levelSelect = document.querySelector('select[name="nivel"]');
    const gradeSelect = document.querySelector('select[name="grado"]');
    const grades = {
        primaria: ['1.er grado', '2.º grado', '3.er grado', '4.º grado', '5.º grado', '6.º grado'],
        secundaria: ['1.er año', '2.º año', '3.er año', '4.º año', '5.º año']
    };

    if (levelSelect && gradeSelect) {
        levelSelect.addEventListener('change', () => {
            const options = grades[levelSelect.value] || [];
            gradeSelect.innerHTML = options.length
                ? '<option value="">Selecciona un grado</option>' + options.map((grade) => `<option value="${grade}">${grade}</option>`).join('')
                : '<option value="">Selecciona primero el nivel</option>';
            gradeSelect.disabled = options.length === 0;
        });
    }

    // Validación local del formulario demostrativo
    const form = document.querySelector('.enrollment-form');
    const message = document.querySelector('.form-message');
    if (form && message) {
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            const requiredFields = Array.from(form.querySelectorAll('[required]'));
            let firstInvalid = null;

            requiredFields.forEach((field) => {
                const invalid = field.type === 'checkbox' ? !field.checked : !field.value.trim();
                field.setAttribute('aria-invalid', String(invalid));
                if (invalid && !firstInvalid) firstInvalid = field;
            });

            const email = form.querySelector('input[type="email"]');
            if (email && email.value && !email.checkValidity()) {
                email.setAttribute('aria-invalid', 'true');
                firstInvalid = firstInvalid || email;
            }

            if (firstInvalid) {
                message.textContent = 'Revisa los campos obligatorios antes de enviar la solicitud.';
                message.className = 'form-message error';
                message.hidden = false;
                firstInvalid.focus();
                return;
            }

            const data = new FormData(form);
            const guardianName = String(data.get('apoderado') || '').trim();
            const whatsappText = [
                'Hola Colegio Guadalupe, quisiera orientación sobre el proceso de matrícula.',
                '',
                `Apoderado: ${guardianName}`,
                `Teléfono: ${String(data.get('telefono') || '').trim()}`,
                `Correo: ${String(data.get('correo') || '').trim() || 'No indicado'}`,
                `Estudiante: ${String(data.get('estudiante') || '').trim()}`,
                `Nivel: ${String(data.get('nivel') || '').trim()}`,
                `Grado: ${String(data.get('grado') || '').trim()}`,
                `Consulta: ${String(data.get('consulta') || '').trim() || 'Deseo conocer vacantes, requisitos, fechas y costos vigentes.'}`
            ].join('\n');

            const whatsappUrl = `https://wa.me/51979343130?text=${encodeURIComponent(whatsappText)}`;
            message.textContent = 'La información está lista. Se abrirá WhatsApp para que revises y envíes el mensaje a Secretaría.';
            message.className = 'form-message success';
            message.hidden = false;
            window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
            form.querySelectorAll('[aria-invalid]').forEach((field) => field.removeAttribute('aria-invalid'));
        });

        form.addEventListener('input', (event) => {
            event.target.removeAttribute('aria-invalid');
            if (!message.hidden) message.hidden = true;
        });
    }

    
});
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
