/* ═══════════════════════════════════════
   THEMUKAAA.COM — Main Script
   ═══════════════════════════════════════ */

/* ─── ANIMATED WAVE BACKGROUND ─── */
(function () {
  const canvas = document.getElementById('bgCanvas');
  const ctx = canvas.getContext('2d');

  let W, H, t = 0;

  const COLORS = [
    { r: 232, g: 36,  b: 26  }, // red
    { r: 26,  g: 76,  b: 232 }, // blue
    { r: 245, g: 200, b: 0   }, // yellow
    { r: 46,  g: 204, b: 64  }, // green
    { r: 180, g: 0,   b: 200 }, // purple accent
    { r: 0,   g: 200, b: 200 }, // cyan accent
  ];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function lerp(a, b, n) { return a + (b - a) * n; }

  function noise(x, y, t) {
    return (
      Math.sin(x * 0.008 + t * 0.4) *
      Math.cos(y * 0.010 - t * 0.3) +
      Math.sin(x * 0.015 - y * 0.008 + t * 0.5) * 0.5 +
      Math.cos(x * 0.005 + y * 0.012 + t * 0.2) * 0.5
    );
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    const STEP = 6; // pixel grid size — smaller = smoother but slower
    for (let y = 0; y < H; y += STEP) {
      for (let x = 0; x < W; x += STEP) {
        const n = noise(x, y, t);            // -2 to +2 roughly
        const norm = (n + 2) / 4;            // 0 to 1

        // pick two adjacent colors to blend
        const idx1 = Math.floor(norm * (COLORS.length - 1));
        const idx2 = Math.min(idx1 + 1, COLORS.length - 1);
        const frac = (norm * (COLORS.length - 1)) - idx1;

        const c1 = COLORS[idx1];
        const c2 = COLORS[idx2];

        const r = Math.round(lerp(c1.r, c2.r, frac));
        const g = Math.round(lerp(c1.g, c2.g, frac));
        const b = Math.round(lerp(c1.b, c2.b, frac));

        ctx.fillStyle = `rgb(${r},${g},${b})`;
        ctx.fillRect(x, y, STEP, STEP);
      }
    }

    t += 0.008; // speed of animation — increase for faster morph
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  resize();
  draw();
})();


/* ─── MODAL SYSTEM ─── */
const overlay = document.getElementById('modalOverlay');

function openModal(id) {
  const modal = document.getElementById('modal-' + id);
  if (!modal) return;
  modal.classList.add('active');
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeAllModals() {
  document.querySelectorAll('.modal.active').forEach(m => m.classList.remove('active'));
  overlay.classList.remove('active');
  document.body.style.overflow = '';
}

// Open on sticker click
document.querySelectorAll('.sticker-item[data-modal]').forEach(item => {
  item.addEventListener('click', () => {
    openModal(item.dataset.modal);
  });
});

// Close on X button
document.querySelectorAll('.modal-close').forEach(btn => {
  btn.addEventListener('click', closeAllModals);
});

// Close on overlay click
overlay.addEventListener('click', closeAllModals);

// Close on Escape key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeAllModals();
});


/* ─── STAGGER STICKER ENTRANCE ON SCROLL ─── */
const stickers = document.querySelectorAll('.sticker-item');

const stickerObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }, i * 80);
      stickerObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

stickers.forEach(s => {
  s.style.opacity = '0';
  s.style.transform = 'translateY(28px)';
  s.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  stickerObserver.observe(s);
});


/* ─── BRAND ITEM ENTRANCE ─── */
const brands = document.querySelectorAll('.brand-item');

const brandObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }, i * 100);
      brandObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

brands.forEach(b => {
  b.style.opacity = '0';
  b.style.transform = 'translateY(24px)';
  b.style.transition = 'opacity 0.5s ease, transform 0.5s ease, background 0.3s ease, border-color 0.3s ease';
  brandObserver.observe(b);
});