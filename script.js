/* ============================================================
   Muhammad Muneeb | Premium Developer Portfolio
   script.js — Vanilla JavaScript interactions
   ============================================================ */

(function () {
    'use strict';

    /* ==========================================================
       0. HELPER — Check if the device supports hover (desktop)
       ========================================================== */
    const isDesktop = () =>
        window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    /* ==========================================================
       1. NAVBAR — scroll effect (solid background)
       ========================================================== */
    const navbar = document.getElementById('navbar');

    const handleNavbarScroll = () => {
        if (window.scrollY > 30) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', handleNavbarScroll, { passive: true });
    handleNavbarScroll();

    /* ==========================================================
       1b. THEME TOGGLE — dark / light, persisted in localStorage
       ========================================================== */
    const themeToggle = document.getElementById('themeToggle');
    const getTheme = () =>
        document.documentElement.getAttribute('data-theme') === 'light'
            ? 'light'
            : 'dark';

    if (themeToggle) {
        const syncThemeAria = (theme) => {
            const label =
                theme === 'light'
                    ? 'Switch to dark theme'
                    : 'Switch to light theme';
            themeToggle.setAttribute('aria-label', label);
            themeToggle.setAttribute('title', label);
        };
        syncThemeAria(getTheme());

        themeToggle.addEventListener('click', () => {
            const next = getTheme() === 'light' ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', next);
            syncThemeAria(next);
            try {
                localStorage.setItem('theme', next);
            } catch (e) {
                /* storage blocked — theme still applies for this visit */
            }
        });
    }

    /* ==========================================================
       2. MOBILE NAVIGATION — hamburger toggle
       ========================================================== */
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    const navCta = document.querySelector('.nav-cta');

    const closeMobileMenu = () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('menu-open');
    };

    const toggleMobileMenu = () => {
        const isOpen = hamburger.classList.toggle('active');
        navMenu.classList.toggle('open', isOpen);
        hamburger.setAttribute('aria-expanded', String(isOpen));
        document.body.classList.toggle('menu-open', isOpen);
    };

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', toggleMobileMenu);

        // Close mobile menu after clicking any nav link (including CTA)
        [...navLinks, navCta].forEach((link) => {
            if (!link) return;
            link.addEventListener('click', () => {
                if (navMenu.classList.contains('open')) {
                    closeMobileMenu();
                }
            });
        });

        // Close menu with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navMenu.classList.contains('open')) {
                closeMobileMenu();
                hamburger.focus();
            }
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (
                navMenu.classList.contains('open') &&
                !navMenu.contains(e.target) &&
                !hamburger.contains(e.target)
            ) {
                closeMobileMenu();
            }
        });
    }

    /* ==========================================================
       3. ACTIVE NAV LINK — highlight current section on scroll
       ========================================================== */
    const sections = document.querySelectorAll('section[id]');
    const navIds = new Set(
        Array.from(navLinks, (link) => link.getAttribute('href').slice(1))
    );

    const updateActiveNavLink = () => {
        const scrollPos = window.scrollY + 120; // offset for fixed navbar

        let currentId = '';
        sections.forEach((section) => {
            // Skip sections that have no nav link (e.g. #resume) so the
            // highlight stays on the nearest preceding nav item.
            if (scrollPos >= section.offsetTop && navIds.has(section.id)) {
                currentId = section.getAttribute('id');
            }
        });

        navLinks.forEach((link) => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentId}`) {
                link.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', updateActiveNavLink, { passive: true });
    updateActiveNavLink();

    /* ==========================================================
       4. SCROLL REVEAL — IntersectionObserver
       ========================================================== */
    const revealElements = document.querySelectorAll('.reveal');

    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('in-view');
                        observer.unobserve(entry.target); // reveal once
                    }
                });
            },
            {
                threshold: 0.12,
                rootMargin: '0px 0px -60px 0px',
            }
        );

        revealElements.forEach((el) => revealObserver.observe(el));
    } else {
        // Fallback: reveal everything immediately
        revealElements.forEach((el) => el.classList.add('in-view'));
    }

    /* ==========================================================
       5. SCROLL PROGRESS BAR
       ========================================================== */
    const scrollProgress = document.getElementById('scrollProgress');

    const updateScrollProgress = () => {
        if (!scrollProgress) return;
        const scrollTop = window.scrollY;
        const docHeight =
            document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        scrollProgress.style.width = progress + '%';
    };

    window.addEventListener('scroll', updateScrollProgress, { passive: true });
    window.addEventListener('resize', updateScrollProgress);
    updateScrollProgress();

    /* ==========================================================
       6. BACK TO TOP
       ========================================================== */
    const backToTop = document.getElementById('backToTop');

    const handleBackToTopVisibility = () => {
        if (!backToTop) return;
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    };

    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    window.addEventListener('scroll', handleBackToTopVisibility, {
        passive: true,
    });
    handleBackToTopVisibility();

    /* ==========================================================
       7. CURRENT YEAR IN FOOTER
       ========================================================== */
    const yearSpan = document.getElementById('currentYear');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    /* ==========================================================
       8. CURSOR GLOW — desktop only (hover capable devices)
       ========================================================== */
    const cursorGlow = document.getElementById('cursorGlow');

    if (cursorGlow && isDesktop()) {
        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let glowX = mouseX;
        let glowY = mouseY;

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursorGlow.classList.add('visible');
        });

        window.addEventListener('mouseleave', () => {
            cursorGlow.classList.remove('visible');
        });

        // Smooth easing animation for the glow
        const animateGlow = () => {
            glowX += (mouseX - glowX) * 0.12;
            glowY += (mouseY - glowY) * 0.12;
            cursorGlow.style.left = glowX + 'px';
            cursorGlow.style.top = glowY + 'px';
            requestAnimationFrame(animateGlow);
        };
        animateGlow();
    }

    /* ==========================================================
       9. CONTACT FORM — validation & submission handling
       ========================================================== */
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');
    const submitBtn = document.getElementById('submitBtn');
    let formStatusTimer = null;

    if (contactForm) {
        const fields = {
            fullName: {
                input: document.getElementById('fullName'),
                error: document.getElementById('fullNameError'),
            },
            email: {
                input: document.getElementById('email'),
                error: document.getElementById('emailError'),
            },
            subject: {
                input: document.getElementById('subject'),
                error: document.getElementById('subjectError'),
            },
            message: {
                input: document.getElementById('message'),
                error: document.getElementById('messageError'),
            },
        };

        // Simple, permissive email regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

        const setError = (field, message) => {
            field.input.classList.add('invalid');
            field.error.textContent = message;
        };

        const clearError = (field) => {
            field.input.classList.remove('invalid');
            field.error.textContent = '';
        };

        const validateField = (name, value) => {
            const trimmed = value.trim();

            switch (name) {
                case 'fullName':
                    if (!trimmed) return 'Please enter your full name.';
                    if (trimmed.length < 2)
                        return 'Name must be at least 2 characters.';
                    return '';
                case 'email':
                    if (!trimmed) return 'Please enter your email address.';
                    if (!emailRegex.test(trimmed))
                        return 'Please enter a valid email address.';
                    return '';
                case 'subject':
                    if (!trimmed) return 'Please enter a subject.';
                    if (trimmed.length < 3)
                        return 'Subject must be at least 3 characters.';
                    return '';
                case 'message':
                    if (!trimmed) return 'Please write a message.';
                    if (trimmed.length < 10)
                        return 'Message must be at least 10 characters.';
                    return '';
                default:
                    return '';
            }
        };

        // Validate on blur (real-time feedback after leaving a field)
        Object.entries(fields).forEach(([name, field]) => {
            if (!field.input) return;

            field.input.addEventListener('blur', () => {
                const errorMsg = validateField(name, field.input.value);
                if (errorMsg) {
                    setError(field, errorMsg);
                } else {
                    clearError(field);
                }
            });

            // Clear error while typing if it becomes valid
            field.input.addEventListener('input', () => {
                if (field.input.classList.contains('invalid')) {
                    const errorMsg = validateField(name, field.input.value);
                    if (!errorMsg) clearError(field);
                }
            });
        });

        // Form submit
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            let isValid = true;
            let firstInvalid = null;

            Object.entries(fields).forEach(([name, field]) => {
                if (!field.input) return;
                const errorMsg = validateField(name, field.input.value);
                if (errorMsg) {
                    setError(field, errorMsg);
                    isValid = false;
                    if (!firstInvalid) firstInvalid = field.input;
                } else {
                    clearError(field);
                }
            });

            if (!isValid) {
                formStatus.textContent =
                    '⚠ Please fix the errors above before submitting.';
                formStatus.className = 'form-status error';

                if (firstInvalid) firstInvalid.focus();
                return;
            }

            // Send to Web3Forms
            formStatus.textContent = 'Sending…';
            formStatus.className = 'form-status sending';

            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Sending…';
            }

            try {
                const res = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    },
                    body: JSON.stringify({
                        access_key: 'd36b219d-5ae4-48dc-adbd-572dc9c571e6',
                        name: fields.fullName.input.value.trim(),
                        email: fields.email.input.value.trim(),
                        subject: fields.subject.input.value.trim(),
                        message: fields.message.input.value.trim(),
                    }),
                });

                const data = await res.json().catch(() => ({}));

                if (res.ok && data.success) {
                    formStatus.textContent =
                        '✓ Message sent! I will get back to you soon.';
                    formStatus.className = 'form-status success';
                    contactForm.reset();
                    Object.values(fields).forEach(clearError);
                } else {
                    throw new Error(data.message || 'Request failed');
                }
            } catch {
                formStatus.textContent =
                    '✗ Could not send right now. Please email ladlamuneeb242@gmail.com instead.';
                formStatus.className = 'form-status error';
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Send Message';
                }

                clearTimeout(formStatusTimer);
                formStatusTimer = setTimeout(() => {
                    formStatus.textContent = '';
                    formStatus.className = 'form-status';
                }, 7000);
            }
        });
    }

    /* ==========================================================
       10. CV DOWNLOAD — friendly placeholder handling
       ========================================================== */
    const cvPath = 'assets/cv/Muhammad-Muneeb-CV.pdf';
    const cvButtons = [
        document.getElementById('heroDownloadCv'),
        document.getElementById('downloadCvBtn'),
    ].filter(Boolean);

    const isLocalFile = window.location.protocol === 'file:';

    cvButtons.forEach((btn) => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();

            // Browsers block fetch() on file://, so existence cannot be
            // checked locally — just open the PDF (or the browser 404).
            if (isLocalFile) {
                window.open(cvPath, '_blank', 'noopener');
                return;
            }

            // Try to check if the file exists before opening.
            fetch(cvPath, { method: 'HEAD' })
                .then((response) => {
                    if (response.ok) {
                        // File exists — open it in a new tab
                        window.open(cvPath, '_blank', 'noopener');
                    } else {
                        showCvMessage();
                    }
                })
                .catch(() => showCvMessage());
        });
    });

    const showCvMessage = () => {
        // Non-intrusive inline notification
        const existing = document.getElementById('cvToast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.id = 'cvToast';
        toast.setAttribute('role', 'alert');
        toast.textContent =
            '📄 CV not uploaded yet. Place your file at: ' + cvPath;
        toast.style.cssText = `
            position: fixed;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%);
            background: #151522;
            color: #F5F5F7;
            border: 1px solid rgba(139, 92, 246, 0.4);
            padding: 14px 22px;
            border-radius: 12px;
            font-size: 0.88rem;
            z-index: 2000;
            box-shadow: 0 10px 30px rgba(0,0,0,0.4);
            max-width: 90vw;
            text-align: center;
        `;
        document.body.appendChild(toast);

        setTimeout(() => toast.remove(), 4500);
    };

    /* ==========================================================
       11. SMOOTH SCROLL FALLBACK (for browsers without CSS support)
       ========================================================== */
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', (e) => {
            const targetId = anchor.getAttribute('href');
            if (!targetId || targetId === '#') return;

            const targetEl = document.querySelector(targetId);
            if (!targetEl) return;

            // Let CSS smooth-scroll handle it when supported
            if ('scrollBehavior' in document.documentElement.style) return;

            e.preventDefault();
            const offset =
                targetEl.getBoundingClientRect().top +
                window.pageYOffset -
                (parseInt(
                    getComputedStyle(document.documentElement).getPropertyValue(
                        '--nav-height'
                    ),
                    10
                ) || 72);

            window.scrollTo({ top: offset, behavior: 'smooth' });
        });
    });

    /* ==========================================================
       12. REDUCED MOTION — respect user preference
       ========================================================== */
    const prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) {
        // Instantly reveal all animated elements
        revealElements.forEach((el) => el.classList.add('in-view'));

        // Disable cursor glow motion by hiding it entirely
        if (cursorGlow) cursorGlow.style.display = 'none';
    }
})();