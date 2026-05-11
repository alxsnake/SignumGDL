/* =============================================
   NAVBAR: shrink on scroll + back-to-top toggle
============================================= */
const navbar = document.getElementById('navbar');
const backToTop = document.getElementById('backToTop');

const onScroll = () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
  backToTop.classList.toggle('visible', window.scrollY > 400);
};
window.addEventListener('scroll', onScroll, { passive: true });

/* =============================================
   INTERSECTION OBSERVER: fade-in animations
============================================= */
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right')
  .forEach(el => io.observe(el));

/* =============================================
   SMOOTH SCROLL for nav links
============================================= */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const menu = document.getElementById('navMenu');
    if (menu.classList.contains('show')) {
      bootstrap.Collapse.getInstance(menu)?.hide();
    }
    const offset = navbar.offsetHeight + 8;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* =============================================
   BACK TO TOP button
============================================= */
backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* =============================================
   GALLERY LIGHTBOX
============================================= */
const lightbox = document.getElementById('lightbox');
const lbTitle  = document.getElementById('lightbox-title');
const lbDesc   = document.getElementById('lightbox-desc');
const lbVisual = document.getElementById('lightbox-visual');
const lbClose  = document.getElementById('lightbox-close');

const galBg = {
  'gi-1': 'linear-gradient(135deg,#1a1208,#3a2a10)',
  'gi-2': 'linear-gradient(135deg,#0a1020,#1a2840)',
  'gi-3': 'linear-gradient(135deg,#100a20,#281840)',
  'gi-4': 'linear-gradient(135deg,#0a1a0a,#183018)',
  'gi-5': 'linear-gradient(135deg,#1a0808,#381018)',
  'gi-6': 'linear-gradient(135deg,#101820,#204050)',
  'gi-7': 'linear-gradient(135deg,#18100a,#382818)',
  'gi-8': 'linear-gradient(135deg,#0a0a18,#181830)',
  'gi-9': 'linear-gradient(135deg,#180a10,#381820)',
};

document.querySelectorAll('.gallery-item').forEach(item => {
  item.addEventListener('click', () => {
    lbTitle.textContent = item.dataset.title || '';
    lbDesc.textContent  = item.dataset.desc  || '';
    const inner = item.querySelector('.gallery-item-inner');
    let bg = '#222';
    for (const cls of inner.classList) {
      if (galBg[cls]) { bg = galBg[cls]; break; }
    }
    lbVisual.style.background = bg;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
});

const closeLightbox = () => {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
};

lbClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

/* =============================================
   FOOTER YEAR
============================================= */
document.getElementById('year').textContent = new Date().getFullYear();

/* =============================================
   NOTAS FLOTANTES — Fondo del Hero
============================================= */
(function () {
  const hero  = document.getElementById('hero');
  const chars = ['♪', '♫', '♩', '♬'];
  for (let i = 0; i < 12; i++) {
    const n = document.createElement('span');
    n.className   = 'float-note';
    n.textContent = chars[i % chars.length];
    const dur = 10 + Math.random() * 12;
    n.style.cssText = [
      `left:${4 + Math.random() * 92}%`,
      `font-size:${2.5 + Math.random() * 3}rem`,
      `animation-duration:${dur}s`,
      `animation-delay:${-(Math.random() * dur)}s`
    ].join(';');
    hero.appendChild(n);
  }
}());

/* =============================================
   CONTADOR DE ESTADÍSTICAS — count-up animado
============================================= */
(function () {
  const ioCount = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el     = e.target;
      const target = +el.dataset.target;
      const dur    = 1800;
      const t0     = performance.now();
      const tick   = (now) => {
        const p    = Math.min((now - t0) / dur, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(ease * target);
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      ioCount.unobserve(el);
    });
  }, { threshold: .6 });

  document.querySelectorAll('.stat-count').forEach(el => ioCount.observe(el));
}());

/* =============================================
   ACTIVE NAV LINK via scroll position
============================================= */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

const ioNav = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navLinks.forEach(l => l.classList.remove('active'));
      const active = document.querySelector(`.nav-link[href="#${e.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => ioNav.observe(s));
