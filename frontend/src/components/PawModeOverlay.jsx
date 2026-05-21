import { useEffect, useRef, useCallback } from 'react';
import { usePawMode } from '../context/PawModeContext';
import { drawPaw, drawCursorPaw, PAW_COLORS } from '../utils/pawDrawing';
import { createArmController } from '../utils/pawArm';
import CatArmSvg from './CatArmSvg';

let audioCtx = null;

function getAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioCtx;
}

function playMeow() {
  try {
    const ac = getAudio();
    const dur = 0.35 + Math.random() * 0.45;
    const f0 = 550 + Math.random() * 500;
    const f1 = 280 + Math.random() * 220;
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    const filt = ac.createBiquadFilter();
    osc.connect(filt);
    filt.connect(gain);
    gain.connect(ac.destination);
    filt.type = 'bandpass';
    filt.frequency.value = 1100;
    filt.Q.value = 4;
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(f0, ac.currentTime);
    osc.frequency.exponentialRampToValueAtTime(f1, ac.currentTime + dur * 0.65);
    osc.frequency.exponentialRampToValueAtTime(f0 * 0.75, ac.currentTime + dur);
    gain.gain.setValueAtTime(0, ac.currentTime);
    gain.gain.linearRampToValueAtTime(0.2, ac.currentTime + 0.04);
    gain.gain.linearRampToValueAtTime(0.1, ac.currentTime + dur * 0.55);
    gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + dur);
    osc.start(ac.currentTime);
    osc.stop(ac.currentTime + dur);
  } catch {
    /* ignore */
  }
}

export default function PawModeOverlay() {
  const { pawMode, incrementPawCount, clearSignal } = usePawMode();
  const canvasRef = useRef(null);
  const armWrapRef = useRef(null);
  const armSvgRef = useRef(null);
  const cursorRef = useRef(null);
  const pawsRef = useRef([]);
  const armCtrlRef = useRef(null);
  const loopRef = useRef(null);
  const lastTRef = useRef(0);

  const spawnPaw = useCallback((x, y) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const paw = {
      x,
      y,
      angle: Math.random() * 360,
      scale: 1.3 + Math.random() * 1.1,
      color: PAW_COLORS[Math.floor(Math.random() * PAW_COLORS.length)],
      alpha: 1,
      born: performance.now(),
      lifetime: 5000 + Math.random() * 4000,
      seed: Math.random() * 9999,
    };

    pawsRef.current.push(paw);
    drawPaw(ctx, paw.x, paw.y, paw.angle, paw.scale, paw.color, 1, paw.seed);
    playMeow();
    incrementPawCount();
  }, [incrementPawCount]);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const tmp = document.createElement('canvas');
    tmp.width = canvas.width;
    tmp.height = canvas.height;
    tmp.getContext('2d').drawImage(canvas, 0, 0);
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(tmp, 0, 0);
    pawsRef.current.forEach((p) => {
      drawPaw(ctx, p.x, p.y, p.angle, p.scale, p.color, p.alpha, p.seed);
    });
  }, []);

  useEffect(() => {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [resizeCanvas]);

  useEffect(() => {
    armCtrlRef.current = createArmController(
      armWrapRef.current,
      armSvgRef.current,
      spawnPaw,
    );
    return () => armCtrlRef.current?.destroy();
  }, [spawnPaw]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    function loop(ts) {
      loopRef.current = requestAnimationFrame(loop);
      if (ts - lastTRef.current < 40) return;
      lastTRef.current = ts;

      const paws = pawsRef.current;
      const anyFading = paws.some((p) => p.alpha < 1 && p.alpha > 0);
      if (!anyFading) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of paws) {
        const age = ts - p.born;
        const fadeStart = p.lifetime * 0.55;
        if (age >= fadeStart) {
          p.alpha = Math.max(0, 1 - (age - fadeStart) / (p.lifetime * 0.45));
        }
        if (p.alpha > 0) {
          drawPaw(ctx, p.x, p.y, p.angle, p.scale, p.color, p.alpha, p.seed);
        }
      }
      for (let i = paws.length - 1; i >= 0; i -= 1) {
        if (paws[i].alpha <= 0) paws.splice(i, 1);
      }
    }

    loopRef.current = requestAnimationFrame(loop);
    return () => {
      if (loopRef.current) cancelAnimationFrame(loopRef.current);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pawsRef.current = [];
  }, [clearSignal]);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;
    const fcc = cursor.getContext('2d');
    drawCursorPaw(fcc);
  }, []);

  useEffect(() => {
    if (!pawMode) return undefined;

    function onClick(e) {
      if (e.target.closest('[data-paw-ignore]')) return;
      e.preventDefault();
      e.stopPropagation();
      try {
        getAudio().resume();
      } catch {
        /* ignore */
      }
      armCtrlRef.current?.triggerArm(e.clientX, e.clientY);
    }

    function onTouch(e) {
      if (e.target.closest('[data-paw-ignore]')) return;
      const t = e.touches[0];
      if (!t) return;
      e.preventDefault();
      armCtrlRef.current?.triggerArm(t.clientX, t.clientY);
    }

    function onMove(e) {
      if (!cursorRef.current) return;
      cursorRef.current.style.left = `${e.clientX}px`;
      cursorRef.current.style.top = `${e.clientY}px`;
    }

    document.addEventListener('click', onClick, true);
    document.addEventListener('touchstart', onTouch, { passive: false, capture: true });
    document.addEventListener('mousemove', onMove);

    return () => {
      document.removeEventListener('click', onClick, true);
      document.removeEventListener('touchstart', onTouch, true);
      document.removeEventListener('mousemove', onMove);
    };
  }, [pawMode]);

  return (
    <>
      <canvas ref={canvasRef} className="paw-canvas" aria-hidden />
      <div ref={armWrapRef} className="cat-arm-wrap" style={{ display: 'none' }}>
        <div ref={armSvgRef}>
          <CatArmSvg />
        </div>
      </div>
      <canvas
        ref={cursorRef}
        className="paw-cursor"
        width={90}
        height={90}
        style={{ display: pawMode ? 'block' : 'none' }}
        aria-hidden
      />
    </>
  );
}
