/**
 * CARTA A LOS REYES MAGOS - SCRIPT PRINCIPAL
 * Funcionalidades:
 * 1. Inicialización de iconos vectoriales SVG (Lucide)
 * 2. Cielo nocturno interactivo en Canvas (estrellas parpadeantes, nieve sutil y múltiples estrellas fugaces simultáneas)
 * 3. Sistema de desenvolvimiento de regalos con física GSAP, confeti dorado y LocalStorage
 * 4. Animaciones de scroll inmersivas (GSAP + ScrollTrigger y pergamino desenrollándose)
 * 5. Efecto de estrella fugaz en el cierre y música navideña bidireccional
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Inicializar iconos profesionales SVG
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // Inicializar módulos de la experiencia
  initMagicSkyCanvas();
  initScrollAnimations();
  initGiftUnwrapping();
  initClosingWish();
  initScrollContainerToggle();
  initMusicPlayer();
});

/* ==========================================================================
   1. MOTOR DE CIELO NOCTURNO (ESTRELLAS, NIEVE Y ESTRELLAS FUGACES)
   ========================================================================== */
const shootingStarsArray = [];

function initMagicSkyCanvas() {
  const canvas = document.getElementById('magic-sky');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const isMobile = width < 768;
  const starCount = isMobile ? 140 : 280;
  const snowCount = isMobile ? 25 : 45;

  const stars = [];
  const snowflakes = [];

  // Crear estrellas parpadeantes densas
  for (let i = 0; i < starCount; i++) {
    stars.push({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.6 + 0.3,
      alpha: Math.random(),
      speed: Math.random() * 0.02 + 0.005,
      isGold: Math.random() > 0.8 // 20% doradas, 80% blancas
    });
  }

  initShootingStarManager(canvas);

  for (let i = 0; i < snowCount; i++) {
    snowflakes.push({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2 + 0.8,
      speedY: Math.random() * 0.45 + 0.2,
      speedX: (Math.random() - 0.5) * 0.3,
      alpha: Math.random() * 0.45 + 0.15
    });
  }

  function renderSky() {
    ctx.clearRect(0, 0, width, height);

    // Dibujar estrellas
    stars.forEach((star) => {
      star.alpha += star.speed;
      if (star.alpha >= 1 || star.alpha <= 0.15) {
        star.speed = -star.speed;
      }

      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fillStyle = star.isGold
        ? `rgba(255, 243, 176, ${Math.max(0.1, Math.min(1, star.alpha))})`
        : `rgba(255, 255, 255, ${Math.max(0.15, Math.min(1, star.alpha))})`;
      ctx.fill();
    });

    // Dibujar estrellas fugaces simultáneas
    shootingStarsArray.forEach((ss, idx) => {
      ss.x += Math.cos(ss.angle) * ss.speed;
      ss.y += Math.sin(ss.angle) * ss.speed;

      if (Math.random() > 0.3) {
        ss.trail.push({
          x: ss.x - Math.cos(ss.angle) * 15,
          y: ss.y - Math.sin(ss.angle) * 15,
          radius: Math.random() * 1.8 + 0.8,
          alpha: 1
        });
      }

      ctx.save();
      ctx.strokeStyle = 'rgba(255, 243, 176, 0.85)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(ss.x, ss.y);
      ctx.lineTo(
        ss.x - Math.cos(ss.angle) * ss.length,
        ss.y - Math.sin(ss.angle) * ss.length
      );
      ctx.stroke();
      ctx.restore();

      ss.trail.forEach((p, pIdx) => {
        p.y += 0.8;
        p.alpha -= 0.02;
        if (p.alpha <= 0) {
          ss.trail.splice(pIdx, 1);
          return;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 243, 176, ${p.alpha})`;
        ctx.fill();
      });

      if (ss.x > width + 150 || ss.x < -150 || ss.y > height + 150) {
        shootingStarsArray.splice(idx, 1);
      }
    });

    // Dibujar nieve
    snowflakes.forEach((flake) => {
      flake.y += flake.speedY;
      flake.x += flake.speedX;

      if (flake.y > height) {
        flake.y = -5;
        flake.x = Math.random() * width;
      }
      if (flake.x > width) flake.x = 0;
      if (flake.x < 0) flake.x = width;

      ctx.beginPath();
      ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${flake.alpha})`;
      ctx.fill();
    });

    requestAnimationFrame(renderSky);
  }

  renderSky();

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });
}

function initShootingStarManager(canvas) {
  function triggerTrio() {
    const w = canvas.width;
    const h = canvas.height;

    shootingStarsArray.push({
      x: -50,
      y: Math.random() * (h * 0.3),
      length: Math.random() * 80 + 60,
      speed: Math.random() * 3 + 5,
      angle: Math.PI / 6,
      trail: []
    });

    shootingStarsArray.push({
      x: w + 50,
      y: Math.random() * (h * 0.3),
      length: Math.random() * 80 + 60,
      speed: Math.random() * 3 + 5,
      angle: Math.PI - (Math.PI / 6),
      trail: []
    });

    shootingStarsArray.push({
      x: Math.random() * w,
      y: -50,
      length: Math.random() * 90 + 70,
      speed: Math.random() * 4 + 6,
      angle: Math.PI / 4,
      trail: []
    });
  }

  setTimeout(triggerTrio, 1000);
  setTimeout(triggerTrio, 4000);
  setTimeout(triggerTrio, 7000);
  setInterval(triggerTrio, 15000);
}

/* ==========================================================================
   2. ANIMACIONES DE SCROLL Y PARALLAX (GSAP + SCROLLTRIGGER)
   ========================================================================== */
function initScrollAnimations() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  heroTl
    .from('.hero__badge', { y: -20, opacity: 0, duration: 0.8 })
    .from('.hero__title', { y: 25, opacity: 0, duration: 1 }, '-=0.5')
    .from('.hero__subtitle', { y: 20, opacity: 0, duration: 0.8 }, '-=0.6')
    .from('.hero__image-wrapper', { scale: 0.92, opacity: 0, duration: 1 }, '-=0.5')
    .from('.scroll-indicator', { opacity: 0, y: 10, duration: 0.6 }, '-=0.4');

  gsap.to('.parallax-img', {
    yPercent: 14,
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true
    }
  });

  const revealElements = document.querySelectorAll('.reveal-up');
  revealElements.forEach((el) => {
    gsap.from(el, {
      y: 45,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none none'
      }
    });
  });

  const giftCards = document.querySelectorAll('.reveal-card');
  giftCards.forEach((card, index) => {
    gsap.from(card, {
      y: 50,
      opacity: 0,
      duration: 0.85,
      delay: (index % 3) * 0.1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: card,
        start: 'top 88%',
        toggleActions: 'play none none none'
      }
    });
  });
}

/* ==========================================================================
   3. SISTEMA DE DESENVOLVIMIENTO DE REGALOS (RASGADO + LOCALSTORAGE)
   ========================================================================== */
function initGiftUnwrapping() {
  const STORAGE_KEY = 'carta_reyes_unwrapped_gifts';
  const giftCards = document.querySelectorAll('.gift-card');
  const resetBtn = document.getElementById('reset-gifts-btn');

  let unwrappedGifts = [];
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    unwrappedGifts = saved ? JSON.parse(saved) : [];
  } catch (e) {
    unwrappedGifts = [];
  }

  function updateResetButton() {
    if (!resetBtn) return;
    resetBtn.hidden = unwrappedGifts.length === 0;
  }

  giftCards.forEach((card) => {
    const giftId = card.dataset.giftId;
    if (unwrappedGifts.includes(giftId)) {
      instantUnwrap(card);
    }

    const wrap = card.querySelector('.gift-wrap');
    if (!wrap) return;

    wrap.addEventListener('click', (e) => {
      if (card.classList.contains('is-unwrapped')) return;
      animateUnwrap(card, giftId, e);
    });

    wrap.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (!card.classList.contains('is-unwrapped')) {
          animateUnwrap(card, giftId, null);
        }
      }
    });
  });

  updateResetButton();

  function animateUnwrap(card, giftId, clickEvent) {
    card.classList.add('is-unwrapped');

    const wrap = card.querySelector('.gift-wrap');
    const leftHalf = card.querySelector('.gift-wrap__half--left');
    const rightHalf = card.querySelector('.gift-wrap__half--right');
    const ribbonV = card.querySelector('.gift-wrap__ribbon-v');
    const seal = card.querySelector('.gift-wrap__seal');
    const content = card.querySelector('.gift-content');

    triggerGoldSparks(card, clickEvent);

    if (typeof gsap !== 'undefined') {
      const tl = gsap.timeline({
        onComplete: () => {
          wrap.style.display = 'none';
        }
      });

      const isCard2 = card.matches(':nth-child(3n + 2)');
      const isCard3 = card.matches(':nth-child(3n + 3)');

      // Animación 1: Azul (Izquierda y Derecha)
      if (!isCard2 && !isCard3) {
        tl.to(wrap, { x: -6, rotation: -1, duration: 0.05, yoyo: true, repeat: 3 })
          .to([seal, ribbonV], { scale: 1.25, opacity: 0, duration: 0.3, ease: 'back.in(2)' })
          .to(leftHalf, { xPercent: -110, rotation: -8, opacity: 0, duration: 0.65, ease: 'power3.inOut' }, '-=0.15')
          .to(rightHalf, { xPercent: 110, rotation: 8, opacity: 0, duration: 0.65, ease: 'power3.inOut' }, '<');
      } 
      // Animación 2: Carmesí (Vertical Arriba y Abajo)
      else if (isCard2) {
        tl.to(seal, { scale: 1.3, rotation: 15, opacity: 0, duration: 0.3, ease: 'back.in(2)' })
          .to(leftHalf, { yPercent: -110, opacity: 0, duration: 0.6, ease: 'power3.inOut' })
          .to(rightHalf, { yPercent: 110, opacity: 0, duration: 0.6, ease: 'power3.inOut' }, '<')
          .to(ribbonV, { scaleY: 0, opacity: 0, duration: 0.3 }, '<');
      } 
      // Animación 3: Esmeralda (Espiral / Zoom mágico)
      else {
        tl.to(seal, { scale: 1.4, rotation: -20, opacity: 0, duration: 0.3, ease: 'power2.in' })
          .to([leftHalf, rightHalf, ribbonV], { scale: 1.25, rotation: 12, opacity: 0, duration: 0.6, ease: 'power2.inOut' }, '-=0.1');
      }

      tl.fromTo(content, 
        { scale: 0.92, opacity: 0.4 },
        { scale: 1, opacity: 1, duration: 0.55, ease: 'back.out(1.5)' },
        '-=0.4'
      );

    } else {
      wrap.style.display = 'none';
    }

    if (!unwrappedGifts.includes(giftId)) {
      unwrappedGifts.push(giftId);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(unwrappedGifts));
      } catch (e) {}
      updateResetButton();
    }
  }

  function instantUnwrap(card) {
    card.classList.add('is-unwrapped');
    const wrap = card.querySelector('.gift-wrap');
    if (wrap) wrap.style.display = 'none';
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      unwrappedGifts = [];
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (e) {}
      updateResetButton();

      giftCards.forEach((card) => {
        card.classList.remove('is-unwrapped');
        const wrap = card.querySelector('.gift-wrap');
        const leftHalf = card.querySelector('.gift-wrap__half--left');
        const rightHalf = card.querySelector('.gift-wrap__half--right');
        const ribbonV = card.querySelector('.gift-wrap__ribbon-v');
        const seal = card.querySelector('.gift-wrap__seal');

        if (wrap) {
          wrap.style.display = 'flex';
          if (typeof gsap !== 'undefined') {
            gsap.set([wrap, leftHalf, rightHalf, ribbonV, seal], { clearProps: 'all' });
            gsap.fromTo(wrap, { opacity: 0, scale: 1.05 }, { opacity: 1, scale: 1, duration: 0.45, ease: 'power2.out' });
          }
        }
      });
    });
  }
}

/* ==========================================================================
   4. EFECTO DE PARTÍCULAS DE ORO AL ROMPER EL PAPEL
   ========================================================================== */
function triggerGoldSparks(cardElement, clickEvent) {
  if (typeof confetti === 'undefined') return;

  const rect = cardElement.getBoundingClientRect();
  const originX = clickEvent
    ? clickEvent.clientX / window.innerWidth
    : (rect.left + rect.width / 2) / window.innerWidth;
  const originY = clickEvent
    ? clickEvent.clientY / window.innerHeight
    : (rect.top + rect.height / 2) / window.innerHeight;

  confetti({
    particleCount: 45,
    spread: 70,
    origin: { x: originX, y: originY },
    colors: ['#D4AF37', '#FFF3B0', '#AA8220', '#FFFFFF'],
    shapes: ['star', 'circle'],
    scalar: 0.9,
    ticks: 160,
    disableForReducedMotion: true
  });
}

/* ==========================================================================
   5. INTERACCIÓN FINAL: LANZAR ESTRELLA FUGAZ A ORIENTE
   ========================================================================== */
function initClosingWish() {
  const wishBtn = document.getElementById('magic-wish-btn');
  const confirmationMsg = document.getElementById('wish-confirmation');

  if (!wishBtn || !confirmationMsg) return;

  wishBtn.addEventListener('click', () => {
    confirmationMsg.classList.add('is-visible');

    if (typeof confetti !== 'undefined') {
      const duration = 2000;
      const end = Date.now() + duration;

      (function frame() {
        confetti({
          particleCount: 4,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.7 },
          colors: ['#D4AF37', '#FFF3B0', '#FFFFFF'],
          shapes: ['star']
        });
        confetti({
          particleCount: 4,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.7 },
          colors: ['#D4AF37', '#FFF3B0', '#FFFFFF'],
          shapes: ['star']
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      })();
    }
  });
}

/* ==========================================================================
   6. INTERACCIÓN DE DESPLIEGUE DEL PERGAMINO
   ========================================================================== */
function initScrollContainerToggle() {
  const scrollContainer = document.querySelector('.scroll-container');
  const parchmentCard = document.querySelector('.parchment-scroll');

  if (scrollContainer && parchmentCard) {
    scrollContainer.addEventListener('click', () => {
      parchmentCard.classList.toggle('is-unrolled');
    });
  }
}

/* ==========================================================================
   7. CONTROL DE MÚSICA NAVIDEÑA (ROBUSTO Y CON AVISO)
   ========================================================================== */
function initMusicPlayer() {
  const audio = document.getElementById('bg-music');
  const musicBtn = document.getElementById('toggle-music-btn');
  const musicText = document.getElementById('music-text');
  const musicIcon = document.getElementById('music-icon');

  if (audio && musicBtn) {
    audio.volume = 0.4;

    audio.addEventListener('error', () => {
      console.warn("No se pudo cargar el archivo de audio.");
      musicBtn.classList.add('is-disabled');
      if (musicText) musicText.textContent = 'Audio no disponible';
      if (musicIcon) {
        musicIcon.setAttribute('data-lucide', 'alert-circle');
        if (typeof lucide !== 'undefined') lucide.createIcons();
      }
    });

    musicBtn.addEventListener('click', () => {
      if (audio.error) {
        if (musicText) musicText.textContent = 'Audio no disponible';
        return;
      }

      if (audio.paused) {
        audio.play().then(() => {
          musicBtn.classList.add('is-playing');
          if (musicText) musicText.textContent = 'Música Activa';
          if (musicIcon) {
            musicIcon.setAttribute('data-lucide', 'music');
            if (typeof lucide !== 'undefined') lucide.createIcons();
          }
        }).catch(err => {
          console.warn("Reproducción bloqueada por el navegador:", err);
          musicBtn.classList.remove('is-playing');
          if (musicText) musicText.textContent = 'Navegador bloqueó audio';
          setTimeout(() => {
            if (musicText && audio.paused) musicText.textContent = 'Música Desactivada';
          }, 3000);
        });
      } else {
        audio.pause();
        musicBtn.classList.remove('is-playing');
        if (musicText) musicText.textContent = 'Música Desactivada';
        if (musicIcon) {
          musicIcon.setAttribute('data-lucide', 'music-off');
          if (typeof lucide !== 'undefined') lucide.createIcons();
        }
      }
    });
  }
}