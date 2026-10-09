document.addEventListener("DOMContentLoaded", () => {
    const slides = Array.from(
        document.querySelectorAll(".showcase-slide")
    );

    const thumbs = Array.from(
        document.querySelectorAll(".showcase-thumb")
    );

    const nextButton = document.querySelector(".showcase-next");
    const prevButton = document.querySelector(".showcase-prev");
    const progressBar = document.querySelector(
        ".showcase-progress > div span"
    );
    const currentCounter = document.querySelector(
        ".showcase-current"
    );

    const carousel = document.querySelector(
        ".showcase-main"
    );

    let currentIndex = 0;
    let timer;
    let touchStartX = 0;

    if (!slides.length) return;

    function showSlide(index) {
        currentIndex =
            (index + slides.length) % slides.length;

        slides.forEach((slide, slideIndex) => {
            slide.classList.toggle(
                "active",
                slideIndex === currentIndex
            );

            slide.classList.remove("is-entering");
        });

        thumbs.forEach((thumb, thumbIndex) => {
            thumb.classList.toggle(
                "active",
                thumbIndex === currentIndex
            );
        });

        if (currentCounter) {
            currentCounter.textContent = String(
                currentIndex + 1
            ).padStart(2, "0");
        }

        if (progressBar) {
            progressBar.style.width =
                `${((currentIndex + 1) / slides.length) * 100}%`;
        }

        requestAnimationFrame(() => {
            slides[currentIndex].classList.add("is-entering");
        });
    }

    function nextSlide() {
        showSlide(currentIndex + 1);
    }

    function prevSlide() {
        showSlide(currentIndex - 1);
    }

    function startAutoplay() {
        timer = setInterval(nextSlide, 6000);
    }

    function stopAutoplay() {
        clearInterval(timer);
    }

    function restartAutoplay() {
        stopAutoplay();
        startAutoplay();
    }

    nextButton?.addEventListener("click", () => {
        nextSlide();
        restartAutoplay();
    });

    prevButton?.addEventListener("click", () => {
        prevSlide();
        restartAutoplay();
    });

    thumbs.forEach((thumb, index) => {
        thumb.addEventListener("click", () => {
            showSlide(index);
            restartAutoplay();
        });
    });

    carousel?.addEventListener("mouseenter", stopAutoplay);
    carousel?.addEventListener("mouseleave", startAutoplay);

    carousel?.addEventListener(
        "touchstart",
        event => {
            touchStartX = event.changedTouches[0].screenX;
            stopAutoplay();
        },
        { passive: true }
    );

    carousel?.addEventListener(
        "touchend",
        event => {
            const touchEndX =
                event.changedTouches[0].screenX;

            const distance = touchStartX - touchEndX;

            if (distance > 45) nextSlide();
            if (distance < -45) prevSlide();

            startAutoplay();
        },
        { passive: true }
    );

    document.addEventListener("keydown", event => {
        if (event.key === "ArrowRight") {
            nextSlide();
            restartAutoplay();
        }

        if (event.key === "ArrowLeft") {
            prevSlide();
            restartAutoplay();
        }
    });

    /*
     * Filtros
     */
    const tabs = document.querySelectorAll(".category-tab");
    const photoItems = document.querySelectorAll(
        ".institution-photo"
    );

    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            const selectedFilter = tab.dataset.filter;

            tabs.forEach(button => {
                const active = button === tab;

                button.classList.toggle("active", active);
                button.setAttribute(
                    "aria-pressed",
                    active ? "true" : "false"
                );
            });

            photoItems.forEach(item => {
                const shouldShow =
                    selectedFilter === "all" ||
                    item.dataset.category === selectedFilter;

                item.classList.toggle(
                    "is-hidden",
                    !shouldShow
                );
            });
        });
    });

    /*
     * Ampliar imágenes
     */
    const openButtons = document.querySelectorAll(
        ".photo-open"
    );

    openButtons.forEach(button => {
        button.addEventListener("click", () => {
            const image = button
                .closest(".institution-photo")
                ?.querySelector("img");

            if (!image) return;

            const modal = document.createElement("div");

            modal.className = "image-modal";

            modal.innerHTML = `
                <button class="modal-close" type="button">
                    <i class="fa-solid fa-xmark"></i>
                </button>
                <img src="${image.src}" alt="${image.alt}">
            `;

            document.body.appendChild(modal);

            requestAnimationFrame(() => {
                modal.classList.add("visible");
            });

            function closeModal() {
                modal.classList.remove("visible");

                setTimeout(() => {
                    modal.remove();
                }, 250);
            }

            modal.addEventListener("click", event => {
                if (
                    event.target === modal ||
                    event.target.closest(".modal-close")
                ) {
                    closeModal();
                }
            });

            document.addEventListener(
                "keydown",
                function escapeHandler(event) {
                    if (event.key === "Escape") {
                        closeModal();

                        document.removeEventListener(
                            "keydown",
                            escapeHandler
                        );
                    }
                }
            );
        });
    });

    showSlide(0);
    startAutoplay();
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