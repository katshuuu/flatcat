export const PAW_COLORS = [
  '#b8956a', '#9a7245', '#7d5535', '#6b4428',
  '#c4a47c', '#a07850', '#8b6040', '#d0ae8a',
];

export function seededJitter(seed, rx, factor = 0.25) {
  const s = Math.sin(seed * 9301 + 49297) * 0.5 + 0.5;
  return (s - 0.5) * rx * factor * 2;
}

function drawDirtyEllipse(ctx, x, y, rx, ry, tilt, seed) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(tilt);
  ctx.beginPath();
  const j = (i) => seededJitter(seed + i, rx);
  ctx.moveTo(j(0), -ry + j(1));
  ctx.bezierCurveTo(
    rx * 0.55 + j(2), -ry * 0.55 + j(3),
    rx + j(4), ry * 0.25 + j(5),
    j(6), ry + j(7),
  );
  ctx.bezierCurveTo(
    -rx * 0.55 + j(8), ry * 0.7 + j(9),
    -rx + j(10), -ry * 0.25 + j(11),
    j(12), -ry + j(13),
  );
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

export function drawPaw(ctx, cx, cy, angleDeg, scale, color, alpha, seed) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = color;
  ctx.translate(cx, cy);
  ctx.rotate((angleDeg * Math.PI) / 180);
  ctx.scale(scale, scale);

  const pw = 30;
  const ph = 24;
  drawDirtyEllipse(ctx, 0, 0, pw, ph, 0.12, seed);

  const smearAlpha = alpha * 0.28;
  ctx.save();
  ctx.globalAlpha = smearAlpha;
  drawDirtyEllipse(ctx, -8, 5, pw * 0.65, ph * 0.45, 0.45, seed + 20);
  drawDirtyEllipse(ctx, 9, -4, pw * 0.55, ph * 0.4, -0.3, seed + 40);
  drawDirtyEllipse(ctx, 2, 8, pw * 0.5, ph * 0.38, 0.2, seed + 60);
  drawDirtyEllipse(ctx, -4, -7, pw * 0.45, ph * 0.35, -0.5, seed + 80);
  ctx.restore();

  const toes = [
    { ox: -19, oy: -28, rx: 11, ry: 12, rot: -0.38 },
    { ox: -6, oy: -35, rx: 12, ry: 13, rot: -0.1 },
    { ox: 7, oy: -35, rx: 12, ry: 13, rot: 0.1 },
    { ox: 19, oy: -28, rx: 11, ry: 12, rot: 0.38 },
  ];

  toes.forEach((t, i) => {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(t.ox, t.oy);
    ctx.rotate(t.rot);
    drawDirtyEllipse(ctx, 0, 0, t.rx, t.ry, 0, seed + 100 + i * 30);
    ctx.globalAlpha = alpha * 0.25;
    drawDirtyEllipse(ctx, -2, 3, t.rx * 0.6, t.ry * 0.5, 0.4, seed + 110 + i * 30);
    drawDirtyEllipse(ctx, 3, -2, t.rx * 0.5, t.ry * 0.4, -0.3, seed + 120 + i * 30);
    ctx.restore();
  });

  ctx.restore();
}

export function drawCursorPaw(ctx) {
  ctx.save();
  ctx.translate(45, 50);
  ctx.globalAlpha = 0.7;
  ctx.fillStyle = '#c4a47c';
  ctx.beginPath();
  ctx.ellipse(0, 5, 14, 11, 0, 0, Math.PI * 2);
  ctx.fill();
  [[-10, -11], [-3, -17], [4, -17], [11, -11]].forEach(([tx, ty]) => {
    ctx.beginPath();
    ctx.ellipse(tx, ty, 6, 7, 0, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.restore();
}
