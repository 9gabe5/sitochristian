(() => {
  const root = document.documentElement;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const narrow = window.matchMedia('(max-width: 800px)');
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#main-nav');
  const motionButton = document.querySelector('#motion-toggle');
  const header = document.querySelector('.site-header');
  const orbit = document.querySelector('.orbit-badge');
  const track = document.querySelector('.process-track');
  const mark = document.querySelector('.process-mark');
  let paused = false, scheduled = false, observer;
  try { paused = localStorage.getItem('cg-reduce-motion') === 'true'; } catch (_) {}
  root.classList.add('js-ready');
  toggle.hidden = false;
  motionButton.hidden = false;
  function menu(open) {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.querySelector('.menu-label').textContent = open ? 'Chiudi' : 'Menu';
    nav.classList.toggle('is-open', open);
    document.body.classList.toggle('menu-open', open && narrow.matches);
  }
  toggle.addEventListener('click', () => menu(toggle.getAttribute('aria-expanded') !== 'true'));
  nav.addEventListener('click', event => { if (event.target.closest('a')) menu(false); });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') { menu(false); toggle.focus(); }
  });
  document.addEventListener('click', event => { if (!header.contains(event.target)) menu(false); });
  header.addEventListener('focusout', event => {
    if (event.relatedTarget && !header.contains(event.relatedTarget)) menu(false);
  });
  narrow.addEventListener('change', () => menu(false));
  function renderMotion() {
    scheduled = false;
    header.classList.toggle('scrolled', window.scrollY > 12);
    if (paused || reduced.matches) return;
    const progress = Math.min(window.scrollY / Math.max(innerHeight, 1), 1.5);
    orbit.style.setProperty('--orbit-turn', `${progress * 36}deg`);
    const bounds = track.getBoundingClientRect();
    const phase = Math.max(0, Math.min(1, (innerHeight * .42 - bounds.top) / Math.max(bounds.height, 1)));
    mark.style.setProperty('--mark-y', `${phase * Math.max(0, bounds.height - 30)}px`);
    mark.style.setProperty('--mark-r', `${phase * 28 - 14}deg`);
  }
  function queueMotion() { if (!scheduled) { scheduled = true; requestAnimationFrame(renderMotion); } }
  function applyMotion() {
    const off = paused || reduced.matches;
    root.classList.toggle('reduce-motion', off);
    root.classList.toggle('motion-enabled', !off);
    motionButton.setAttribute('aria-pressed', String(off));
    motionButton.textContent = off ? (reduced.matches ? 'Movimento ridotto dal dispositivo' : 'Riattiva animazioni') : 'Riduci animazioni';
    motionButton.disabled = reduced.matches;
    if (observer) observer.disconnect();
    document.querySelectorAll('.reveal').forEach(el => el.classList.remove('is-pending'));
    if (!off && 'IntersectionObserver' in window) {
      observer = new IntersectionObserver(entries => {
        entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.remove('is-pending'); observer.unobserve(entry.target); } });
      }, { threshold: .08, rootMargin: '0px 0px -20px 0px' });
      document.querySelectorAll('.reveal').forEach(el => {
        if (el.getBoundingClientRect().top > innerHeight) { el.classList.add('is-pending'); observer.observe(el); }
      });
    }
    queueMotion();
  }
  motionButton.addEventListener('click', () => { paused = !paused; try { localStorage.setItem('cg-reduce-motion', String(paused)); } catch (_) {} applyMotion(); });
  reduced.addEventListener('change', applyMotion);
  window.addEventListener('scroll', queueMotion, { passive: true });
  window.addEventListener('resize', queueMotion, { passive: true });
  applyMotion();
})();
