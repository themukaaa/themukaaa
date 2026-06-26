/* THEMUKAAA.COM - Script v3 */

/* TOPOGRAPHIC LINE BACKGROUND - sparse lines on black */
(function () {
  const canvas = document.getElementById('bgCanvas');
  const ctx = canvas.getContext('2d');
  let W, H, t = 0;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function field(x, y, t) {
    return (
      Math.sin(x * 0.005 + t * 0.3) *
      Math.cos(y * 0.007 - t * 0.2) +
      Math.sin(x * 0.010 - y * 0.006 + t * 0.4) * 0.6 +
      Math.cos(x * 0.003 + y * 0.009 + t * 0.15) * 0.4
    );
  }

  /* Only a few iso levels = sparse lines */
  const LEVELS = [-0.6, -0.1, 0.4, 0.9];

  const LINE_COLORS = [
    '#E8241A',
    '#1A4CE8',
    '#F5C800',
    '#2ECC40',
  ];

  const STEP = 10;

  function draw() {
    /* Black background each frame */
    ctx.fillStyle = '#080808';
    ctx.fillRect(0, 0, W, H);

    const cols = Math.ceil(W / STEP) + 1;
    const rows = Math.ceil(H / STEP) + 1;
    const grid = [];

    for (let r = 0; r < rows; r++) {
      grid[r] = [];
      for (let c = 0; c < cols; c++) {
        grid[r][c] = field(c * STEP, r * STEP, t);
      }
    }

    LEVELS.forEach((level, li) => {
      ctx.beginPath();
      ctx.strokeStyle = LINE_COLORS[li % LINE_COLORS.length];
      ctx.lineWidth = 2;
      ctx.globalAlpha = 0.85;

      for (let r = 0; r < rows - 1; r++) {
        for (let c = 0; c < cols - 1; c++) {
          const x = c * STEP;
          const y = r * STEP;
          const v00 = grid[r][c];
          const v10 = grid[r][c + 1];
          const v01 = grid[r + 1][c];
          const v11 = grid[r + 1][c + 1];

          const pts = [];

          if ((v00 < level) !== (v10 < level)) {
            const f = (level - v00) / (v10 - v00);
            pts.push([x + f * STEP, y]);
          }
          if ((v10 < level) !== (v11 < level)) {
            const f = (level - v10) / (v11 - v10);
            pts.push([x + STEP, y + f * STEP]);
          }
          if ((v01 < level) !== (v11 < level)) {
            const f = (level - v01) / (v11 - v01);
            pts.push([x + f * STEP, y + STEP]);
          }
          if ((v00 < level) !== (v01 < level)) {
            const f = (level - v00) / (v01 - v00);
            pts.push([x, y + f * STEP]);
          }

          if (pts.length === 2) {
            ctx.moveTo(pts[0][0], pts[0][1]);
            ctx.lineTo(pts[1][0], pts[1][1]);
          }
        }
      }
      ctx.stroke();
    });

    ctx.globalAlpha = 1;
    t += 0.004;
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  resize();
  draw();
})();


/* MODAL SYSTEM */
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

document.querySelectorAll('.sticker-item[data-modal]').forEach(item => {
  item.addEventListener('click', () => openModal(item.dataset.modal));
});

document.querySelectorAll('.modal-close').forEach(btn => {
  btn.addEventListener('click', closeAllModals);
});

overlay.addEventListener('click', closeAllModals);

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeAllModals();
});


/* STICKER ENTRANCE */
const stickers = document.querySelectorAll('.sticker-item');

const stickerObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.style.opacity = '1';
      }, i * 90);
      stickerObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.05 });

stickers.forEach(s => {
  s.style.opacity = '0';
  s.style.transition = 'opacity 0.5s ease, filter 0.3s ease, transform 0.3s ease';
  stickerObserver.observe(s);
});


/* BRAND ENTRANCE */
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
  b.style.transform = 'translateY(20px)';
  b.style.transition = 'opacity 0.5s ease, transform 0.5s ease, background 0.3s, border-color 0.3s';
  brandObserver.observe(b);
});
