function sendToWhatsApp() {
    const name = document.getElementById('f-name').value.trim();
    const phone = document.getElementById('f-phone').value.trim();
    const service = document.getElementById('f-service').value;
    const desc = document.getElementById('f-desc').value.trim();
    if (!name || !phone || !service) {
        alert('Please fill in your Name, Phone Number, and Service before sending.');
        return;
    }
    const msg =
        `🔧 *New Enquiry – Baba Engineering*\n\n` +
        `👤 *Name:* ${name}\n` +
        `📞 *Phone:* ${phone}\n` +
        `⚙ *Service:* ${service}\n` +
        `📝 *Description:* ${desc || 'Not provided'}\n\n` +
        `_(Sent via babaengineering.com)_`;
    const url = `https://wa.me/918453033543?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
}

// Reveal animations
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1 });
reveals.forEach(r => observer.observe(r));

// ─── GOOEY NAV ───
(function () {
    const container = document.getElementById('gooeyNavContainer');
    const navUl = document.getElementById('gooeyNavLinks');
    const filterEl = document.getElementById('gooeyFilter');
    const textEl = document.getElementById('gooeyText');
    const allLis = navUl.querySelectorAll('li');
    let activeIndex = -1;

    const PARTICLE_COUNT = 15;
    const PARTICLE_DISTANCES = [90, 10];
    const PARTICLE_R = 100;
    const ANIMATION_TIME = 600;
    const TIME_VARIANCE = 300;
    const COLORS = [1, 2, 3, 1, 2, 3, 1, 4];

    function noise(n) { n = n || 1; return n / 2 - Math.random() * n; }

    function getXY(distance, pointIndex, totalPoints) {
        const angle = ((360 + noise(8)) / totalPoints) * pointIndex * (Math.PI / 180);
        return [distance * Math.cos(angle), distance * Math.sin(angle)];
    }

    function createParticle(i, t, d, r) {
        let rotate = noise(r / 10);
        return {
            start: getXY(d[0], PARTICLE_COUNT - i, PARTICLE_COUNT),
            end: getXY(d[1] + noise(7), PARTICLE_COUNT - i, PARTICLE_COUNT),
            time: t,
            scale: 1 + noise(0.2),
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
            rotate: rotate > 0 ? (rotate + r / 20) * 10 : (rotate - r / 20) * 10
        };
    }

    function makeParticles(element) {
        const bubbleTime = ANIMATION_TIME * 2 + TIME_VARIANCE;
        element.style.setProperty('--time', bubbleTime + 'ms');

        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const t = ANIMATION_TIME * 2 + noise(TIME_VARIANCE * 2);
            const p = createParticle(i, t, PARTICLE_DISTANCES, PARTICLE_R);
            element.classList.remove('active');

            setTimeout(function () {
                const particle = document.createElement('span');
                const point = document.createElement('span');
                particle.classList.add('gooey-particle');
                particle.style.setProperty('--start-x', p.start[0] + 'px');
                particle.style.setProperty('--start-y', p.start[1] + 'px');
                particle.style.setProperty('--end-x', p.end[0] + 'px');
                particle.style.setProperty('--end-y', p.end[1] + 'px');
                particle.style.setProperty('--time', p.time + 'ms');
                particle.style.setProperty('--scale', p.scale);
                particle.style.setProperty('--color', 'var(--color-' + p.color + ', var(--primary))');
                particle.style.setProperty('--rotate', p.rotate + 'deg');

                point.classList.add('gooey-point');
                particle.appendChild(point);
                element.appendChild(particle);
                requestAnimationFrame(function () {
                    element.classList.add('active');
                });
                setTimeout(function () {
                    try { element.removeChild(particle); } catch (e) { }
                }, t);
            }, 30);
        }
    }

    function updateEffectPosition(liEl) {
        if (!container || !filterEl || !textEl) return;
        const containerRect = container.getBoundingClientRect();
        const pos = liEl.getBoundingClientRect();
        const styles = {
            left: (pos.x - containerRect.x) + 'px',
            top: (pos.y - containerRect.y) + 'px',
            width: pos.width + 'px',
            height: pos.height + 'px'
        };
        Object.assign(filterEl.style, styles);
        Object.assign(textEl.style, styles);
        textEl.innerText = liEl.querySelector('a').innerText;
    }

    function handleClick(liEl, index) {
        if (activeIndex === index) return;

        // Remove old active
        allLis.forEach(li => li.classList.remove('gooey-active'));
        activeIndex = index;
        liEl.classList.add('gooey-active');

        updateEffectPosition(liEl);

        // Clear old particles
        filterEl.querySelectorAll('.gooey-particle').forEach(p => filterEl.removeChild(p));

        // Trigger text effect
        textEl.classList.remove('active');
        void textEl.offsetWidth; // force reflow
        textEl.classList.add('active');

        // Fire particles
        makeParticles(filterEl);
    }

    // Attach click handlers
    allLis.forEach(function (li, index) {
        li.addEventListener('click', function (e) {
            handleClick(li, index);
        });
    });

    // Auto-highlight on scroll
    const sections = document.querySelectorAll('section[id]');
    const sectionIds = ['services', 'gallery', 'about', 'testimonials', 'contact'];

    window.addEventListener('scroll', function () {
        let current = '';
        sections.forEach(function (sec) {
            if (window.scrollY >= sec.offsetTop - 200) {
                current = sec.getAttribute('id');
            }
        });
        const matchIndex = sectionIds.indexOf(current);
        if (matchIndex !== -1 && matchIndex !== activeIndex) {
            const li = allLis[matchIndex];
            if (li) {
                allLis.forEach(l => l.classList.remove('gooey-active'));
                activeIndex = matchIndex;
                li.classList.add('gooey-active');
                updateEffectPosition(li);
                // Clear old particles
                filterEl.querySelectorAll('.gooey-particle').forEach(p => filterEl.removeChild(p));
                textEl.classList.remove('active');
                void textEl.offsetWidth;
                textEl.classList.add('active');
                makeParticles(filterEl);
            }
        }
    });

    // Handle resize
    window.addEventListener('resize', function () {
        if (activeIndex >= 0 && allLis[activeIndex]) {
            updateEffectPosition(allLis[activeIndex]);
        }
    });
})();



// ─── MOBILE HAMBURGER MENU ───
(function () {
    const hamburger = document.getElementById('hamburger');
    const navContainer = document.getElementById('gooeyNavContainer');
    const navLinks = document.querySelectorAll('.nav-links a');

    if (!hamburger || !navContainer) return;

    hamburger.addEventListener('click', function () {
        hamburger.classList.toggle('active');
        navContainer.classList.toggle('mobile-open');
    });

    // Close menu when a link is clicked
    navLinks.forEach(function (link) {
        link.addEventListener('click', function () {
            hamburger.classList.remove('active');
            navContainer.classList.remove('mobile-open');
        });
    });
})();

// Review Form Handling
function toggleReviewModal(show) {
    document.getElementById('reviewModal').classList.toggle('active', show);
}

function setRating(n) {
    const stars = document.querySelectorAll('.rating-picker span');
    stars.forEach((s, i) => {
        s.style.opacity = i < n ? "1" : "0.3";
    });
}

document.getElementById('reviewForm').addEventListener('submit', function (e) {
    e.preventDefault();
    alert('Thank you for your review! It will be displayed after moderation.');
    toggleReviewModal(false);
    this.reset();
    setRating(0);
});

// ─── INTERACTIVE IMAGE ACCORDION ───
(function () {
    const accordionItems = document.querySelectorAll('.accordion-item');
    if (!accordionItems.length) return;

    accordionItems.forEach((item, index) => {
        item.addEventListener('mouseenter', () => {
            accordionItems.forEach(el => el.classList.remove('active'));
            item.classList.add('active');
        });
    });
})();

