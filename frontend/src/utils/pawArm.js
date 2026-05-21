const ARM_W = 160;
const ARM_H = 340;
const PAW_TIP_Y = 330;

function easeInOut(t) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

function easeOut(t) {
  return 1 - (1 - t) ** 3;
}

function lerpPos(a, b, t) {
  return {
    x: a.x + (b.x - a.x) * t,
    y: a.y + (b.y - a.y) * t,
    rotate: a.rotate + (b.rotate - a.rotate) * t,
  };
}

function closestSide(tx, ty) {
  const W = window.innerWidth;
  const H = window.innerHeight;
  const dists = { top: ty, bottom: H - ty, left: tx, right: W - tx };
  return Object.entries(dists).sort((a, b) => a[1] - b[1])[0][0];
}

function slidedInPos(side, tx, ty) {
  let x;
  let y;
  let rotate;
  if (side === 'bottom') {
    rotate = 0;
    x = tx - ARM_W / 2;
    y = ty - PAW_TIP_Y;
  } else if (side === 'top') {
    rotate = 180;
    x = tx - ARM_W / 2;
    y = ty - (ARM_H - PAW_TIP_Y);
  } else if (side === 'left') {
    rotate = 90;
    x = tx - PAW_TIP_Y;
    y = ty - ARM_W / 2;
  } else {
    rotate = -90;
    x = tx - (ARM_H - PAW_TIP_Y);
    y = ty - ARM_W / 2;
  }
  return { x, y, rotate };
}

function offScreenPos(side, inPos) {
  const W = window.innerWidth;
  const H = window.innerHeight;
  const p = { ...inPos };
  if (side === 'bottom') p.y = H + 20;
  if (side === 'top') p.y = -ARM_H - 20;
  if (side === 'left') p.x = -ARM_H - 20;
  if (side === 'right') p.x = W + 20;
  return p;
}

export function createArmController(armWrap, armSvg, onStamp) {
  let armAnim = null;
  let armPending = null;

  function setArmTransform(x, y, rotate) {
    if (!armWrap || !armSvg) return;
    armWrap.style.left = `${x}px`;
    armWrap.style.top = `${y}px`;
    armSvg.style.transform = `rotate(${rotate}deg)`;
    armSvg.style.transformOrigin = '50% 50%';
  }

  function triggerArm(targetX, targetY) {
    if (!armWrap) return;

    if (armAnim) {
      armPending = { x: targetX, y: targetY };
      return;
    }

    const side = closestSide(targetX, targetY);
    const inPos = slidedInPos(side, targetX, targetY);
    const startPos = offScreenPos(side, inPos);

    const pressDepth = 22;
    const pressedPos = { ...inPos };
    if (side === 'bottom') pressedPos.y += pressDepth;
    if (side === 'top') pressedPos.y -= pressDepth;
    if (side === 'left') pressedPos.x -= pressDepth;
    if (side === 'right') pressedPos.x += pressDepth;

    const SLIDE_IN = 380;
    const PRESS = 130;
    const LIFT = 110;
    const SLIDE_OUT = 340;
    const TOTAL = SLIDE_IN + PRESS + LIFT + SLIDE_OUT;

    armWrap.style.display = 'block';
    let stamped = false;
    const t0 = performance.now();

    function tick(ts) {
      const e = ts - t0;
      let pos;

      if (e < SLIDE_IN) {
        pos = lerpPos(startPos, inPos, easeOut(e / SLIDE_IN));
      } else if (e < SLIDE_IN + PRESS) {
        const t = easeInOut((e - SLIDE_IN) / PRESS);
        pos = lerpPos(inPos, pressedPos, t);
        if (!stamped && t > 0.75) {
          stamped = true;
          onStamp(targetX, targetY);
        }
      } else if (e < SLIDE_IN + PRESS + LIFT) {
        pos = lerpPos(pressedPos, inPos, easeOut((e - SLIDE_IN - PRESS) / LIFT));
      } else if (e < TOTAL) {
        pos = lerpPos(inPos, startPos, easeInOut((e - SLIDE_IN - PRESS - LIFT) / SLIDE_OUT));
      } else {
        armWrap.style.display = 'none';
        armAnim = null;
        if (armPending) {
          const p = armPending;
          armPending = null;
          triggerArm(p.x, p.y);
        }
        return;
      }

      setArmTransform(pos.x, pos.y, pos.rotate);
      armAnim = requestAnimationFrame(tick);
    }

    armAnim = requestAnimationFrame(tick);
  }

  function destroy() {
    if (armAnim) cancelAnimationFrame(armAnim);
    armAnim = null;
    armPending = null;
  }

  return { triggerArm, destroy };
}
