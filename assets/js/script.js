/**
 * Landing Page - Antônio Silva Advogado
 * JavaScript para interatividade e animações
 */

$(document).ready(function() {
    'use strict';

    // ===== VARIÁVEIS GLOBAIS =====
    let isScrolling = false;
    let lastScrollTop = 0;
    const navbar = $('#mainNav');
    const scrollThreshold = 100;

    // ===== NAVEGAÇÃO SUAVE =====
    function initSmoothScrolling() {
        $('a[href^="#"]').on('click', function(e) {
            e.preventDefault();
            
            const target = $(this.getAttribute('href'));
            if (target.length) {
                const offset = navbar.outerHeight() + 20;
                const targetPosition = target.offset().top - offset;
                
                $('html, body').animate({
                    scrollTop: targetPosition
                }, 800, 'easeInOutCubic');
            }
        });
    }

    // ===== NAVBAR SCROLL EFFECT =====
    function initNavbarScroll() {
        $(window).on('scroll', function() {
            if (!isScrolling) {
                window.requestAnimationFrame(function() {
                    const scrollTop = $(window).scrollTop();
                    
                    if (scrollTop > scrollThreshold) {
                        navbar.addClass('scrolled');
                    } else {
                        navbar.removeClass('scrolled');
                    }
                    
                    // Efeito parallax sutil no hero
                    if (scrollTop < $(window).height()) {
                        const parallaxSpeed = scrollTop * 0.5;
                        $('.hero-image').css('transform', `translateY(${parallaxSpeed}px)`);
                    }
                    
                    lastScrollTop = scrollTop;
                    isScrolling = false;
                });
                isScrolling = true;
            }
        });
    }

    // ===== ANIMAÇÕES ON SCROLL =====
    function initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                    
                    // Animações específicas para diferentes elementos
                    if (entry.target.classList.contains('service-card')) {
                        animateServiceCard(entry.target);
                    }
                    
                    if (entry.target.classList.contains('stat-item')) {
                        animateCounter(entry.target);
                    }
                }
            });
        }, observerOptions);

        // Observar elementos para animação
        $('.service-card, .stat-item, .feature-item, .accordion-item').each(function() {
            observer.observe(this);
        });
    }

    // ===== ANIMAÇÃO DOS CARDS DE SERVIÇO =====
    function animateServiceCard(card) {
        const icon = $(card).find('.service-icon');
        const features = $(card).find('.service-features li');
        
        // Animar ícone
        setTimeout(() => {
            icon.addClass('animate__animated animate__bounceIn');
        }, 200);
        
        // Animar lista de features
        features.each(function(index) {
            setTimeout(() => {
                $(this).addClass('fade-in');
            }, 300 + (index * 100));
        });
    }

    // ===== ANIMAÇÃO DOS CONTADORES =====
    function animateCounter(element) {
        const $element = $(element);
        const target = parseInt($element.find('h3').text().replace(/\D/g, ''));
        const suffix = $element.find('h3').text().replace(/\d/g, '');
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            $element.find('h3').text(Math.floor(current) + suffix);
        }, 16);
    }

    // ===== EFEITOS HOVER NOS BOTÕES =====
    function initButtonEffects() {
        $('.cta-button, .btn').on('mouseenter', function() {
            $(this).addClass('animate__animated animate__pulse');
        }).on('mouseleave', function() {
            $(this).removeClass('animate__animated animate__pulse');
        });
    }

    // ===== FAQ ACCORDION CUSTOMIZADO =====
    function initCustomAccordion() {
        $('.accordion-button').on('click', function() {
            const target = $(this).attr('data-bs-target');
            const isExpanded = $(this).attr('aria-expanded') === 'true';
            
            // Fechar outros accordions
            $('.accordion-collapse').not(target).removeClass('show');
            $('.accordion-button').not(this).addClass('collapsed').attr('aria-expanded', 'false');
            
            // Animar abertura/fechamento
            if (!isExpanded) {
                $(this).removeClass('collapsed').attr('aria-expanded', 'true');
                $(target).addClass('show');
            }
        });
    }

    // ===== FORMULÁRIO DE CONTATO (se houver) =====
    function initContactForm() {
        // Validação básica do formulário
        $('form').on('submit', function(e) {
            e.preventDefault();
            
            const form = $(this);
            const formData = new FormData(this);
            
            // Simular envio
            const submitBtn = form.find('button[type="submit"]');
            const originalText = submitBtn.text();
            
            submitBtn.text('Enviando...').prop('disabled', true);
            
            setTimeout(() => {
                submitBtn.text('Enviado!').removeClass('btn-primary').addClass('btn-success');
                
                setTimeout(() => {
                    submitBtn.text(originalText).prop('disabled', false).removeClass('btn-success').addClass('btn-primary');
                    form[0].reset();
                }, 3000);
            }, 2000);
        });
    }

    // ===== WHATSAPP INTEGRATION =====
    function initWhatsAppIntegration() {
        $('a[href*="wa.me"]').on('click', function(e) {
            // Adicionar evento de tracking (Google Analytics, Facebook Pixel, etc.)
            if (typeof gtag !== 'undefined') {
                gtag('event', 'click', {
                    'event_category': 'WhatsApp',
                    'event_label': 'Contact Button'
                });
            }
            
            // Efeito visual no clique
            $(this).addClass('animate__animated animate__heartBeat');
            setTimeout(() => {
                $(this).removeClass('animate__animated animate__heartBeat');
            }, 1000);
        });
    }

    // ===== LAZY LOADING DE IMAGENS =====
    function initLazyLoading() {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    // ===== SCROLL TO TOP =====
    function initScrollToTop() {
        // Criar botão scroll to top
        const scrollBtn = $('<button class="scroll-to-top"><i class="fas fa-arrow-up"></i></button>');
        $('body').append(scrollBtn);
        
        // Mostrar/ocultar botão
        $(window).on('scroll', function() {
            if ($(window).scrollTop() > 300) {
                scrollBtn.addClass('show');
            } else {
                scrollBtn.removeClass('show');
            }
        });
        
        // Ação do botão
        scrollBtn.on('click', function() {
            $('html, body').animate({scrollTop: 0}, 800);
        });
    }

    // ===== PERFORMANCE OPTIMIZATION =====
    function initPerformanceOptimizations() {
        // Debounce para eventos de scroll
        let scrollTimer;
        $(window).on('scroll', function() {
            clearTimeout(scrollTimer);
            scrollTimer = setTimeout(function() {
                // Operações pesadas de scroll aqui
            }, 10);
        });
        
        // Preload de imagens críticas
        const criticalImages = [
            'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
        ];
        
        criticalImages.forEach(src => {
            const img = new Image();
            img.src = src;
        });
    }

    // ===== MOBILE OPTIMIZATIONS =====
    function initMobileOptimizations() {
        // Detectar dispositivo móvel
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        if (isMobile) {
            $('body').addClass('mobile-device');
            
            // Otimizações específicas para mobile
            $('.hero-title').css('font-size', '2rem');
            $('.section-title').css('font-size', '1.8rem');
            
            // Touch events
            $('.service-card').on('touchstart', function() {
                $(this).addClass('touch-active');
            }).on('touchend', function() {
                $(this).removeClass('touch-active');
            });
        }
    }

    // ===== ACCESSIBILITY IMPROVEMENTS =====
    function initAccessibility() {
        // Navegação por teclado
        $('.nav-link, .btn, .accordion-button').on('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                $(this).click();
            }
        });
        
        // ARIA labels dinâmicos
        $('.service-card').each(function(index) {
            $(this).attr('aria-label', `Serviço ${index + 1}: ${$(this).find('h4').text()}`);
        });
        
        // Skip links
        const skipLink = $('<a href="#main" class="skip-link">Pular para o conteúdo principal</a>');
        $('body').prepend(skipLink);
    }

    // ===== ANALYTICS E TRACKING =====
    function initAnalytics() {
        // Track scroll depth
        let maxScroll = 0;
        $(window).on('scroll', function() {
            const scrollPercent = Math.round(($(window).scrollTop() / ($(document).height() - $(window).height())) * 100);
            
            if (scrollPercent > maxScroll) {
                maxScroll = scrollPercent;
                
                // Enviar evento de scroll depth
                if (typeof gtag !== 'undefined' && maxScroll % 25 === 0) {
                    gtag('event', 'scroll', {
                        'event_category': 'Engagement',
                        'event_label': `${maxScroll}% scrolled`
                    });
                }
            }
        });
        
        // Track CTA clicks
        $('.cta-button, .btn-primary').on('click', function() {
            const ctaText = $(this).text().trim();
            if (typeof gtag !== 'undefined') {
                gtag('event', 'click', {
                    'event_category': 'CTA',
                    'event_label': ctaText
                });
            }
        });
    }

    // ===== INICIALIZAÇÃO =====
    function init() {
        initSmoothScrolling();
        initNavbarScroll();
        initScrollAnimations();
        initButtonEffects();
        initCustomAccordion();
        initContactForm();
        initWhatsAppIntegration();
        initLazyLoading();
        initScrollToTop();
        initPerformanceOptimizations();
        initMobileOptimizations();
        initAccessibility();
        initAnalytics();
        
        // Adicionar classe de carregamento completo
        $('body').addClass('loaded');
        
        console.log('Landing Page Antônio Silva - Carregada com sucesso!');
    }

    // ===== CSS ADICIONAL DINÂMICO =====
    function addDynamicCSS() {
        const dynamicCSS = `
            <style>
                .scroll-to-top {
                    position: fixed;
                    bottom: 30px;
                    right: 30px;
                    width: 50px;
                    height: 50px;
                    background: var(--gradient-primary);
                    border: none;
                    border-radius: 50%;
                    color: white;
                    font-size: 1.2rem;
                    cursor: pointer;
                    opacity: 0;
                    visibility: hidden;
                    transition: all 0.3s ease;
                    z-index: 1000;
                    box-shadow: var(--shadow-soft);
                }
                
                .scroll-to-top.show {
                    opacity: 1;
                    visibility: visible;
                }
                
                .scroll-to-top:hover {
                    transform: translateY(-3px);
                    box-shadow: var(--shadow-strong);
                }
                
                .skip-link {
                    position: absolute;
                    top: -40px;
                    left: 6px;
                    background: var(--primary-color);
                    color: white;
                    padding: 8px;
                    text-decoration: none;
                    border-radius: 4px;
                    z-index: 1001;
                    transition: top 0.3s;
                }
                
                .skip-link:focus {
                    top: 6px;
                }
                
                .touch-active {
                    transform: scale(0.98);
                }
                
                .mobile-device .hero-title {
                    font-size: 2rem !important;
                }
                
                .mobile-device .section-title {
                    font-size: 1.8rem !important;
                }
                
                .loaded {
                    opacity: 1;
                }
                
                body {
                    opacity: 0;
                    transition: opacity 0.5s ease;
                }
            </style>
        `;
        
        $('head').append(dynamicCSS);
    }

    // ===== EXECUTAR INICIALIZAÇÃO =====
    addDynamicCSS();
    init();

    // ===== UTILITÁRIOS GLOBAIS =====
    window.LandingPage = {
        scrollToSection: function(sectionId) {
            const target = $(sectionId);
            if (target.length) {
                const offset = navbar.outerHeight() + 20;
                $('html, body').animate({
                    scrollTop: target.offset().top - offset
                }, 800);
            }
        },
        
        showNotification: function(message, type = 'info') {
            const notification = $(`
                <div class="notification notification-${type}">
                    <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
                    <span>${message}</span>
                </div>
            `);
            
            $('body').append(notification);
            
            setTimeout(() => {
                notification.addClass('show');
            }, 100);
            
            setTimeout(() => {
                notification.removeClass('show');
                setTimeout(() => notification.remove(), 300);
            }, 3000);
        }
    };
});

// ===== CSS PARA NOTIFICAÇÕES =====
const notificationCSS = `
    <style>
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            display: flex;
            align-items: center;
            gap: 0.5rem;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            z-index: 1002;
            max-width: 300px;
        }
        
        .notification.show {
            transform: translateX(0);
        }
        
        .notification-success {
            border-left: 4px solid #28a745;
        }
        
        .notification-info {
            border-left: 4px solid #007bff;
        }
        
        .notification i {
            color: #28a745;
        }
        
        .notification-info i {
            color: #007bff;
        }
    </style>
`;

// Adicionar CSS das notificações
document.head.insertAdjacentHTML('beforeend', notificationCSS);
