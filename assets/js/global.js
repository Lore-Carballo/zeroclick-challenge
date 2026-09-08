/**
 * Zero Click
 * Global scripts
 */

document.addEventListener('DOMContentLoaded', () => {
    initCopyrightYear();
    initZeroClickLogo();
    initHomeHeroIntro();
    initScrambleEffect();
    initEventFilters();
    initTypewriters();
    initFaqs();
    initAnchorLinks();
    initStickyHeader();
    initFloatingCursors();
    initModal();
    initScrollAnimations();
    initEventHeroScroll();
});


/* ----------------------------------------
 * Copyright year
 * ---------------------------------------- */

function initCopyrightYear() {
    const year = document.getElementById('copyright-year');

    if (year) {
        year.textContent = new Date().getFullYear();
    }
}


/* ----------------------------------------
 * Zero Click logo
 * ---------------------------------------- */

function initZeroClickLogo() {
    const logo = document.querySelector('.zero-click-logo');

    if (!logo) return;

    requestAnimationFrame(() => {
        logo.classList.add('is-visible');
    });

    if (typeof gsap === 'undefined') return;

    const wordmark = logo.querySelector('.zero-click-logo__wordmark');
    const letters = [...logo.querySelectorAll('.zero-click-logo__letter')];
    const caret = logo.querySelector('.zero-click-logo__caret');

    if (!wordmark || !letters.length || !caret) return;

    const wordmarkRect = wordmark.getBoundingClientRect();

    const typingStart = 0.1;
    const letterStep = 0.065;
    const revealDuration = 2;

    const tl = gsap.timeline();

    gsap.set(logo, {
        autoAlpha: 0,
        filter: 'blur(8px)'
    });

    gsap.set(letters, {
        autoAlpha: 0
    });

    gsap.set(caret, {
        x: 0
    });

    tl.to(
        logo,
        {
            autoAlpha: 1,
            filter: 'blur(0px)',
            duration: revealDuration,
            ease: 'power2.out'
        },
        0
    );

    letters.forEach((letter, index) => {
        const letterRect = letter.getBoundingClientRect();
        const caretX = letterRect.right - wordmarkRect.left;
        const time = typingStart + index * letterStep;

        tl.set(
            letter,
            {
                autoAlpha: 1
            },
            time
        );

        tl.to(
            caret,
            {
                x: caretX,
                duration: letterStep,
                ease: 'none'
            },
            time
        );
    });

    tl.call(
        () => {
            caret.classList.add('is-blinking');
        },
        [],
        typingStart + letters.length * letterStep
    );
}

/* ----------------------------------------
 * Home Hero
 * ---------------------------------------- */

function initHomeHeroIntro() {
    const hero = document.querySelector('.home__hero');
    if (!hero || typeof gsap === 'undefined') return;

    const isPortrait = window.matchMedia('(orientation: portrait)').matches;
    if (isPortrait) return;

    const heroVideo = hero.querySelector('.home__hero__video');
    const heroRight = hero.querySelector('.home__hero__content .home__hero__column__right');

    if (!heroVideo && !heroRight) return;
    const tl = gsap.timeline();

    if (heroVideo) {
        gsap.set(heroVideo, {
            xPercent: 100
        });

        tl.to(
            heroVideo,
            {
                xPercent: 0,
                delay: 1,
                duration: 1.5,
                ease: 'easeIn'
            },
            0
        );
    }

    if (heroRight) {
        gsap.set(heroRight, {
            yPercent: 0,
            paddingBottom: '5.3rem',
        });

        tl.to(
            heroRight,
            {
                yPercent: 100,
                paddingBottom: '0',
                delay: 2.1,
                duration: 1.3,
                ease: 'easeOut'
            },
            0
        );
    }
}

/* ----------------------------------------
 * Scramble effect
 * ---------------------------------------- */

function initScrambleEffect() {
    const elements = document.querySelectorAll('.js-scramble');

    if (!elements.length) return;

    const scrambleChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.#/+';
    const preservedCharacters = ' ./:-';

    const scrambleText = (element) => {
        const finalText = element.dataset.text || element.textContent;
        const duration = Number(element.dataset.time) || 700;
        const scrambleInterval = 45;

        let startTime = null;
        let lastScramble = 0;

        const animate = (time) => {
            if (startTime === null) {
                startTime = time;
            }

            const elapsed = time - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const resolvedCharacters = Math.floor(progress * finalText.length);

            if (time - lastScramble >= scrambleInterval) {
                element.textContent = finalText
                    .split('')
                    .map((character, index) => {
                        if (preservedCharacters.includes(character)) {
                            return character;
                        }

                        if (index < resolvedCharacters) {
                            return character;
                        }

                        return scrambleChars[
                            Math.floor(Math.random() * scrambleChars.length)
                        ];
                    })
                    .join('');

                lastScramble = time;
            }

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                element.textContent = finalText;
            }
        };

        requestAnimationFrame(animate);
    };

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;

                scrambleText(entry.target);
                observer.unobserve(entry.target);
            });
        },
        {
            threshold: 0.5
        }
    );

    elements.forEach((element) => {
        observer.observe(element);
    });
}


/* ----------------------------------------
 * Event filters
 * ---------------------------------------- */

function initEventFilters() {
    const filters = document.querySelectorAll('.home__events__filters__item');
    const events = document.querySelectorAll('.home__events__item');

    if (!filters.length || !events.length) return;

    filters.forEach((filter) => {
        filter.addEventListener('click', () => {
            const selectedFilter = filter.dataset.filter;

            filters.forEach((item) => {
                const isActive = item === filter;

                item.classList.toggle('filter--active', isActive);
                item.setAttribute('aria-pressed', String(isActive));
            });

            events.forEach((eventItem) => {
                const shouldShow =
                    selectedFilter === 'all' ||
                    eventItem.dataset.status === selectedFilter;

                if (shouldShow) {
                    eventItem.hidden = false;

                    requestAnimationFrame(() => {
                        eventItem.classList.remove('is-hidden');
                    });
                } else {
                    eventItem.classList.add('is-hidden');

                    window.setTimeout(() => {
                        if (eventItem.classList.contains('is-hidden')) {
                            eventItem.hidden = true;
                        }
                    }, 250);
                }
            });
        });
    });
}


/* ----------------------------------------
 * Typewriter
 * ---------------------------------------- */

function initTypewriters() {
    const elements = document.querySelectorAll('.js-typewriter');

    if (!elements.length) return;

    const initTypewriter = (element) => {
        const text = element.textContent.trim();
        const speed = Number(element.dataset.typeSpeed) || 45;

        element.setAttribute('aria-label', text);
        element.textContent = '';
        element.classList.add('typewriter');

        const letters = [...text].map((character) => {
            const span = document.createElement('span');

            span.className = 'typewriter__letter';
            span.setAttribute('aria-hidden', 'true');
            span.textContent = character === ' ' ? '\u00A0' : character;

            element.appendChild(span);

            return span;
        });

        const caret = document.createElement('span');

        caret.className = 'typewriter__caret';
        caret.setAttribute('aria-hidden', 'true');

        element.appendChild(caret);

        let hasPlayed = false;

        return () => {
            if (hasPlayed) return;

            hasPlayed = true;

            let index = 0;

            const typeNext = () => {
                if (index >= letters.length) {
                    caret.classList.add('is-blinking');
                    return;
                }

                const letter = letters[index];

                letter.classList.add('is-visible');

                const elementRect = element.getBoundingClientRect();
                const letterRect = letter.getBoundingClientRect();

                const caretX = letterRect.right - elementRect.left + 4;
                const caretY =
                    letterRect.top -
                    elementRect.top +
                    letterRect.height / 2;

                caret.style.left = '0';
                caret.style.top = '0';
                caret.style.transform =
                    `translate(${caretX}px, ${caretY}px) translateY(-50%)`;

                index += 1;

                window.setTimeout(typeNext, speed);
            };

            typeNext();
        };
    };

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;

                const play = entry.target._playTypewriter;

                if (play) {
                    play();
                }

                observer.unobserve(entry.target);
            });
        },
        {
            threshold: 0.5
        }
    );

    elements.forEach((element) => {
        element._playTypewriter = initTypewriter(element);
        observer.observe(element);
    });
}


/* ----------------------------------------
 * FAQ accordion
 * ---------------------------------------- */

function initFaqs() {
    const cards = document.querySelectorAll('.card--faq');

    if (!cards.length) return;

    cards.forEach((card) => {
        const button = card.querySelector('.card--faq__header');

        if (!button) return;

        button.addEventListener('click', () => {
            const isOpen = card.classList.toggle('is-open');

            button.setAttribute('aria-expanded', String(isOpen));
        });
    });
}


/* ----------------------------------------
 * Anchor links
 * ---------------------------------------- */

function initAnchorLinks() {
    document.addEventListener('click', (event) => {
        const link = event.target.closest('.anchor, .anchor-space');

        if (!link) return;

        const href = link.getAttribute('href');

        if (!href || !href.startsWith('#') || href === '#') return;

        const target = document.querySelector(href);

        if (!target) return;

        event.preventDefault();

        let offset = 0;

        if (link.classList.contains('anchor-space')) {
            offset = window.innerWidth > 600 ? 200 : 150;
        }

        const top =
            target.getBoundingClientRect().top +
            window.scrollY -
            offset;

        window.scrollTo({
            top,
            behavior: 'smooth'
        });
    });
}


/* ----------------------------------------
 * Sticky header
 * ---------------------------------------- */

function initStickyHeader() {
    const header = document.querySelector('header');

    if (!header) return;

    const logo = header.querySelector('.logo');

    let lastScrollY = window.scrollY;
    let ticking = false;

    const updateHeader = () => {
        const currentScrollY = window.scrollY;
        const headerHeight = header.offsetHeight;
        const isSticky = currentScrollY > 0;

        header.classList.toggle('sticky', isSticky);
        logo?.classList.toggle('sticky', isSticky);

        if (Math.abs(currentScrollY - lastScrollY) > 5) {
            if (
                currentScrollY > lastScrollY &&
                currentScrollY > headerHeight
            ) {
                header.classList.remove('nav-down');
                header.classList.add('nav-up');
            } else {
                header.classList.remove('nav-up');
                header.classList.add('nav-down');
            }

            lastScrollY = currentScrollY;
        }

        ticking = false;
    };

    window.addEventListener(
        'scroll',
        () => {
            if (!ticking) {
                requestAnimationFrame(updateHeader);
                ticking = true;
            }
        },
        { passive: true }
    );

    updateHeader();
}


/* ----------------------------------------
 * Floating cursors
 * ---------------------------------------- */

function initFloatingCursors() {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const triggers = document.querySelectorAll('.js-cursor-trigger');

    if (!triggers.length) return;

    triggers.forEach((trigger) => {
        const cursorId = trigger.dataset.cursorId;
        if (!cursorId) return;

        const cursor = document.querySelector(
            `.js-floating-cursor[data-cursor-id="${cursorId}"]`
        );

        if (!cursor) return;

        const parent = cursor.offsetParent;
        if (!parent) return;

        const tooltip = cursor.querySelector('.floating-cursor__tooltip');

        let animationFrame = null;
        let isFollowing = false;

        let currentX = 0;
        let currentY = 0;
        let targetX = 0;
        let targetY = 0;

        const ease = 0.18;
        const gap = 6;

        const getCursorOffset = () => {
            const cursorRect = cursor.getBoundingClientRect();

            return {
                x: -cursorRect.width - gap,
                y: gap
            };
        };

        const updateTarget = (event) => {
            const parentRect = parent.getBoundingClientRect();
            const offset = getCursorOffset();

            targetX =
                event.clientX -
                parentRect.left +
                parent.scrollLeft +
                offset.x;

            targetY =
                event.clientY -
                parentRect.top +
                parent.scrollTop +
                offset.y;
        };

        const renderCursor = () => {
            cursor.style.left = `${currentX}px`;
            cursor.style.top = `${currentY}px`;

            cursor.style.right = 'auto';
            cursor.style.bottom = 'auto';
            cursor.style.transform = 'translate3d(0, 0, 0)';
        };

        const animateCursor = () => {
            currentX += (targetX - currentX) * ease;
            currentY += (targetY - currentY) * ease;

            renderCursor();

            if (isFollowing) {
                animationFrame = requestAnimationFrame(animateCursor);
            }
        };

        const showCursor = (event) => {
            const customText = trigger.dataset.cursorText;

            if (tooltip && customText) {
                tooltip.textContent = customText;
            }

            updateTarget(event);

            currentX = targetX;
            currentY = targetY;

            renderCursor();

            cursor.classList.add('is-visible');

            isFollowing = true;

            if (animationFrame) {
                cancelAnimationFrame(animationFrame);
            }

            animationFrame = requestAnimationFrame(animateCursor);
        };

        const moveCursor = (event) => {
            updateTarget(event);
        };

        const hideCursor = () => {
            isFollowing = false;

            cursor.classList.remove('is-visible');

            if (animationFrame) {
                cancelAnimationFrame(animationFrame);
                animationFrame = null;
            }
        };

        trigger.addEventListener('mouseenter', showCursor);
        trigger.addEventListener('mousemove', moveCursor);
        trigger.addEventListener('mouseleave', hideCursor);
    });
}


/* ----------------------------------------
 * Modal
 * ---------------------------------------- */

function initModal() {
    const triggers = document.querySelectorAll('.js-modal-trigger');
    const modal = document.getElementById('modal');

    if (!triggers.length || !modal) return;

    const iframe = modal.querySelector('.modal__iframe');
    const closeButtons = modal.querySelectorAll('[data-modal-close]');

    let activeTrigger = null;

    const openModal = (trigger) => {
        const videoUrl = trigger.dataset.videoUrl;
        if (!videoUrl) return;
        activeTrigger = trigger;
        iframe.src = videoUrl;

        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('modal-open');

        document
            .querySelectorAll('.js-floating-cursor')
            .forEach((cursor) => {
                cursor.classList.remove('is-visible');
            });

        modal.querySelector('.modal__close')?.focus();
    };

    const closeModal = () => {
        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('modal-open');

        iframe.src = '';

        activeTrigger?.focus();
        activeTrigger = null;
    };

    triggers.forEach((trigger) => {
        trigger.addEventListener('click', () => {
            openModal(trigger);
        });

        trigger.addEventListener('keydown', (event) => {
            if (event.key !== 'Enter' && event.key !== ' ') return;
            event.preventDefault();
            openModal(trigger);
        });
    });

    closeButtons.forEach((button) => {
        button.addEventListener('click', closeModal);
    });

    document.addEventListener('keydown', (event) => {
        if (
            event.key === 'Escape' &&
            modal.classList.contains('is-open')
        ) {
            closeModal();
        }
    });
}


/* ----------------------------------------
 * Scroll animations
 * ---------------------------------------- */

function initScrollAnimations() {
    const elements = document.querySelectorAll('.animation--in');

    if (!elements.length) return;

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;

                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            });
        },
        {
            threshold: 0.1,
            rootMargin: '0px 0px -80px 0px'
        }
    );

    elements.forEach((element) => {
        observer.observe(element);
    });
}

function initEventHeroScroll() {
    const hero = document.querySelector('.event__hero');
    const eventBg = document.querySelector('.page-event__background');
    if (!hero && !eventBg) return;

    const SCROLL_ON = 70;
    const SCROLL_OFF = 20;

    let isScrolled = false;
    let ticking = false;

    const setScrolledState = (state) => {
        if (state === isScrolled) return;
        isScrolled = state;
        hero?.classList.toggle('scrolled', state);
        eventBg?.classList.toggle('scrolled', state);
    };

    const updateScrolled = () => {
        const scrollY = Math.max(window.scrollY, 0);
        if (!isScrolled && scrollY > SCROLL_ON) {
            setScrolledState(true);
        } else if (isScrolled && scrollY < SCROLL_OFF) {
            setScrolledState(false);
        }
        ticking = false;
    };

    const onScroll = () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(updateScrolled);
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    updateScrolled();
}