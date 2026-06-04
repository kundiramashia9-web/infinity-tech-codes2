/**
 * Infinity Tech - Main JavaScript File
 * Complete working version for all pages
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // ============================================
    // 1. MOBILE NAVIGATION MENU
    // ============================================
    const initMobileNav = () => {
        const mobileMenuIcon = document.querySelector('.mobile-menu-icon');
        const navMenu = document.querySelector('.nav-menu');
        
        if (!mobileMenuIcon || !navMenu) return;

        // Create mobile toggle if it doesn't exist
        let mobileToggle = document.getElementById('mobile-toggle');
        if (!mobileToggle) {
            mobileToggle = document.createElement('input');
            mobileToggle.type = 'checkbox';
            mobileToggle.id = 'mobile-toggle';
            mobileToggle.className = 'mobile-toggle';
            mobileToggle.style.display = 'none';
            const navContainer = document.querySelector('.navbar .container');
            if (navContainer) {
                navContainer.insertBefore(mobileToggle, mobileMenuIcon);
            }
        }

        // Toggle menu
        mobileMenuIcon.addEventListener('click', function(e) {
            e.preventDefault();
            if (mobileToggle) {
                mobileToggle.checked = !mobileToggle.checked;
                if (mobileToggle.checked) {
                    navMenu.classList.add('show');
                } else {
                    navMenu.classList.remove('show');
                }
            }
        });

        // Close menu on link click
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                if (mobileToggle && mobileToggle.checked) {
                    mobileToggle.checked = false;
                    navMenu.classList.remove('show');
                }
            });
        });

        // Handle resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                if (mobileToggle) mobileToggle.checked = false;
                if (navMenu) navMenu.classList.remove('show');
            }
        });
    };

    // ============================================
    // 2. TOAST NOTIFICATION SYSTEM
    // ============================================
    const showToast = (message, type = 'success') => {
        const existingToast = document.querySelector('.toast-notification');
        if (existingToast) existingToast.remove();

        const toast = document.createElement('div');
        toast.className = `toast-notification toast-${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
                <span>${escapeHtml(message)}</span>
            </div>
            <button class="toast-close">&times;</button>
        `;
        
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: ${type === 'success' ? '#27ae60' : '#e74c3c'};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            gap: 12px;
            z-index: 10000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            font-size: 14px;
            max-width: 350px;
            animation: slideInRight 0.3s ease;
        `;
        
        const closeBtn = toast.querySelector('.toast-close');
        if (closeBtn) {
            closeBtn.style.cssText = `
                background: none;
                border: none;
                color: white;
                font-size: 18px;
                cursor: pointer;
                margin-left: auto;
                padding: 0 5px;
            `;
            closeBtn.onclick = () => {
                toast.style.animation = 'slideOutRight 0.3s ease';
                setTimeout(() => toast.remove(), 300);
            };
        }
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            if (toast && toast.parentNode) {
                toast.style.animation = 'slideOutRight 0.3s ease';
                setTimeout(() => toast.remove(), 300);
            }
        }, 4000);
    };

    const escapeHtml = (str) => {
        if (!str) return '';
        return str.replace(/[&<>]/g, function(m) {
            if (m === '&') return '&amp;';
            if (m === '<') return '&lt;';
            if (m === '>') return '&gt;';
            return m;
        });
    };

    // Add animation styles
    const addToastStyles = () => {
        if (!document.querySelector('#toast-animation-styles')) {
            const style = document.createElement('style');
            style.id = 'toast-animation-styles';
            style.textContent = `
                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOutRight {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
    };
    addToastStyles();

    // ============================================
    // 3. FORM HANDLING
    // ============================================
    const initForms = () => {
        const isValidEmail = (email) => {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        };

        const handleFormSubmit = (form, successMessage) => {
            if (!form) return;
            
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                
                let isValid = true;
                const requiredFields = form.querySelectorAll('[required]');
                
                requiredFields.forEach(field => {
                    const value = field.value.trim();
                    if (!value) {
                        isValid = false;
                        field.style.borderColor = '#e74c3c';
                        field.style.backgroundColor = '#fff5f5';
                        setTimeout(() => {
                            field.style.borderColor = '';
                            field.style.backgroundColor = '';
                        }, 2000);
                    } else {
                        field.style.borderColor = '';
                        field.style.backgroundColor = '';
                    }
                    
                    if (field.type === 'email' && value && !isValidEmail(value)) {
                        isValid = false;
                        showToast('Please enter a valid email address', 'error');
                    }
                });

                if (!isValid) {
                    showToast('Please fill in all required fields', 'error');
                    return;
                }

                // Store in localStorage
                const formData = new FormData(form);
                const data = {};
                formData.forEach((value, key) => { data[key] = value; });
                
                try {
                    const savedForms = JSON.parse(localStorage.getItem('infinityTech_forms') || '[]');
                    savedForms.push({
                        ...data,
                        timestamp: new Date().toISOString(),
                        page: window.location.pathname
                    });
                    while (savedForms.length > 50) savedForms.shift();
                    localStorage.setItem('infinityTech_forms', JSON.stringify(savedForms));
                } catch(e) {}

                showToast(successMessage, 'success');
                form.reset();
            });
        };

        // Contact form
        const contactForm = document.querySelector('.contact-form form');
        if (contactForm) {
            handleFormSubmit(contactForm, 'Thank you! We will respond within 24 hours.');
        }

        // Newsletter forms
        document.querySelectorAll('.newsletter-form').forEach(form => {
            handleFormSubmit(form, 'Thanks for subscribing!');
        });

        // Price calculator
        const calculatorSelect = document.querySelector('.calculator-widget select');
        const priceDisplay = document.querySelector('.calculator-widget .price-display');
        if (calculatorSelect && priceDisplay) {
            calculatorSelect.addEventListener('change', function() {
                const text = this.options[this.selectedIndex].text;
                const priceMatch = text.match(/(\d+(?:,\d+)?)/);
                if (priceMatch) {
                    let price = priceMatch[0].replace(',', '');
                    if (text.includes('/month')) {
                        priceDisplay.innerHTML = `Estimated: R${price}/month`;
                    } else {
                        priceDisplay.innerHTML = `Estimated: R${price} one-time`;
                    }
                } else {
                    priceDisplay.innerHTML = 'Contact us for accurate pricing';
                }
            });
        }
    };

    // ============================================
    // 4. SMOOTH SCROLLING
    // ============================================
    const initSmoothScroll = () => {
        document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                if (targetId && targetId !== '#') {
                    const targetElement = document.querySelector(targetId);
                    if (targetElement) {
                        e.preventDefault();
                        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }
            });
        });
    };

    // ============================================
    // 5. SCROLL REVEAL ANIMATIONS
    // ============================================
    const initScrollReveal = () => {
        const elements = document.querySelectorAll('.service-card, .team-member, .portfolio-item, .stat');
        if (elements.length === 0) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
        
        elements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    };

    // ============================================
    // 6. NAVBAR SCROLL EFFECT
    // ============================================
    const initNavbarScroll = () => {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            window.addEventListener('scroll', () => {
                if (window.scrollY > 50) {
                    navbar.style.background = '#ffffff';
                    navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
                } else {
                    navbar.style.background = '';
                    navbar.style.boxShadow = '';
                }
            });
        }
    };

    // ============================================
    // 7. ACTIVE NAVIGATION LINK
    // ============================================
    const initActiveNavLink = () => {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        document.querySelectorAll('.nav-menu a').forEach(link => {
            const linkPage = link.getAttribute('href');
            if (linkPage === currentPage || (currentPage === 'index.html' && linkPage === 'index.html')) {
                link.classList.add('active');
            }
        });
    };

    // ============================================
    // 8. BACK TO TOP BUTTON
    // ============================================
    const initBackToTop = () => {
        let btn = document.querySelector('.back-to-top');
        if (!btn) {
            btn = document.createElement('button');
            btn.className = 'back-to-top';
            btn.innerHTML = '<i class="fas fa-arrow-up"></i>';
            btn.style.cssText = `
                position: fixed; bottom: 20px; right: 20px; width: 45px; height: 45px;
                background: #3498db; color: white; border: none; border-radius: 50%;
                cursor: pointer; display: none; align-items: center; justify-content: center;
                z-index: 999; transition: all 0.3s ease; box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            `;
            document.body.appendChild(btn);
        }
        
        window.addEventListener('scroll', () => {
            btn.style.display = window.scrollY > 300 ? 'flex' : 'none';
        });
        
        btn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    };

    // ============================================
    // 9. STATS COUNTER
    // ============================================
    const initStatsCounter = () => {
        const stats = document.querySelectorAll('.stat h3');
        if (stats.length === 0) return;
        
        const animateNumber = (el, target) => {
            let current = 0;
            const increment = target / 50;
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    el.textContent = target + '+';
                    clearInterval(timer);
                } else {
                    el.textContent = Math.floor(current) + '+';
                }
            }, 20);
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const match = el.textContent.match(/\d+/);
                    if (match) {
                        animateNumber(el, parseInt(match[0]));
                    }
                    observer.unobserve(el);
                }
            });
        }, { threshold: 0.5 });
        
        stats.forEach(stat => observer.observe(stat));
    };

    // ============================================
    // 10. ENQUIRY PAGE LOGIC
    // ============================================
    const initEnquiryLogic = () => {
        const budgetSelect = document.getElementById('budget');
        const timelineSelect = document.getElementById('timeline');
        
        if (budgetSelect || timelineSelect) {
            const updateEstimate = () => {
                let estimateDiv = document.querySelector('.estimate-display');
                if (!estimateDiv) {
                    estimateDiv = document.createElement('div');
                    estimateDiv.className = 'estimate-display';
                    estimateDiv.style.cssText = 'margin-top: 15px; padding: 10px; background: #e8f5e9; border-radius: 8px; font-size: 14px;';
                    const parent = (budgetSelect || timelineSelect).closest('.form-group');
                    if (parent && parent.parentNode) {
                        parent.parentNode.insertBefore(estimateDiv, parent.nextSibling);
                    }
                }
                
                let estimate = '';
                if (budgetSelect?.value && timelineSelect?.value) {
                    estimate = '📋 We\'ll prepare a custom quote. Expect response within 24 hours.';
                } else if (budgetSelect?.value) {
                    estimate = '💰 Thank you for providing your budget range.';
                } else if (timelineSelect?.value) {
                    estimate = '⏰ Thanks for sharing your timeline.';
                }
                
                if (estimateDiv) {
                    estimateDiv.innerHTML = estimate;
                    estimateDiv.style.display = estimate ? 'block' : 'none';
                }
            };
            
            if (budgetSelect) budgetSelect.addEventListener('change', updateEstimate);
            if (timelineSelect) timelineSelect.addEventListener('change', updateEstimate);
        }
    };

    // ============================================
    // 11. UPDATE FOOTER YEAR
    // ============================================
    const updateFooterYear = () => {
        const footerBottom = document.querySelector('.footer-bottom p');
        if (footerBottom) {
            footerBottom.innerHTML = footerBottom.innerHTML.replace(/\d{4}/, new Date().getFullYear());
        }
    };

    // ============================================
    // 12. FIX GOOGLE MAPS
    // ============================================
    const fixGoogleMaps = () => {
        const iframe = document.querySelector('.map-container iframe');
        if (iframe && (!iframe.src || iframe.src === '')) {
            iframe.src = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3593.210516039046!2d28.2355555!3d-25.7498705!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1e9561981e2e7aa5%3A0x3ef67cd5e36db6f4!2sHatfield%20Plaza!5e0!3m2!1sen!2sza!4v1700000000000!5m2!1sen!2sza';
        }
    };

    // ============================================
    // 13. PORTFOLIO FILTER (optional)
    // ============================================
    const initPortfolioFilter = () => {
        const filterBtns = document.querySelectorAll('.filter-btn');
        const portfolioItems = document.querySelectorAll('.portfolio-item');
        
        if (filterBtns.length && portfolioItems.length) {
            filterBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    const filter = btn.getAttribute('data-filter');
                    filterBtns.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    
                    portfolioItems.forEach(item => {
                        if (filter === 'all' || item.getAttribute('data-category') === filter) {
                            item.style.display = 'block';
                            setTimeout(() => {
                                item.style.opacity = '1';
                                item.style.transform = 'scale(1)';
                            }, 10);
                        } else {
                            item.style.opacity = '0';
                            item.style.transform = 'scale(0.8)';
                            setTimeout(() => { item.style.display = 'none'; }, 300);
                        }
                    });
                });
            });
        }
    };

    // ============================================
    // 14. LOADING SPINNERS
    // ============================================
    const initLoadingSpinners = () => {
        document.querySelectorAll('form button[type="submit"]').forEach(btn => {
            btn.addEventListener('click', function() {
                const form = this.closest('form');
                if (form && form.checkValidity && !form.checkValidity()) return;
                
                const originalText = this.innerHTML;
                this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
                this.disabled = true;
                
                setTimeout(() => {
                    if (this.disabled) {
                        this.innerHTML = originalText;
                        this.disabled = false;
                    }
                }, 3000);
            });
        });
    };

    // ============================================
    // 15. CARD HOVER EFFECTS
    // ============================================
    const initCardEffects = () => {
        document.querySelectorAll('.service-card, .team-member').forEach(card => {
            card.addEventListener('touchstart', () => {
                card.style.transform = 'scale(0.98)';
            }, { passive: true });
            card.addEventListener('touchend', () => {
                card.style.transform = '';
            });
        });
    };

    // ============================================
    // INITIALIZE EVERYTHING
    // ============================================
    initMobileNav();
    initForms();
    initSmoothScroll();
    initScrollReveal();
    initNavbarScroll();
    initActiveNavLink();
    initBackToTop();
    initStatsCounter();
    initEnquiryLogic();
    updateFooterYear();
    fixGoogleMaps();
    initPortfolioFilter();
    initLoadingSpinners();
    initCardEffects();

    console.log('Infinity Tech website fully loaded and interactive');
});