import React, { useEffect, useRef } from 'react';
import { aquaticAudio } from '../audio/aquaticAudioEngine';

export const WaterBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Particle bubbles
    const bubbles = Array.from({ length: 45 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 5 + 1.5,
      speedY: Math.random() * 0.8 + 0.3,
      speedX: Math.random() * 0.4 - 0.2,
      opacity: Math.random() * 0.5 + 0.2,
      pulse: Math.random() * Math.PI,
    }));

    // Interactive ripples
    let ripples = [];

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleClick = (e) => {
      ripples.push({
        x: e.clientX,
        y: e.clientY,
        radius: 5,
        maxRadius: 120 + Math.random() * 60,
        opacity: 0.8,
      });
      aquaticAudio.playBubbleSound();
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('click', handleClick);

    let time = 0;

    const render = () => {
      time += 0.015;
      ctx.clearRect(0, 0, width, height);

      // Deep water ocean gradient
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, '#030914');
      bgGrad.addColorStop(0.4, '#06172d');
      bgGrad.addColorStop(0.8, '#082346');
      bgGrad.addColorStop(1, '#020b18');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Render Caustic Rays (N64 DK64 Water Caustics)
      ctx.save();
      ctx.globalCompositeOperation = 'screen';

      for (let i = 0; i < 4; i++) {
        const cx = width * (0.2 + i * 0.25) + Math.sin(time * 0.8 + i) * 40;
        const cy = height * 0.3 + Math.cos(time * 0.5 + i) * 30;
        const causticGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, width * 0.4);
        causticGrad.addColorStop(0, `rgba(0, 242, 254, ${0.08 + Math.sin(time + i) * 0.03})`);
        causticGrad.addColorStop(0.5, `rgba(79, 172, 254, ${0.04 + Math.cos(time * 0.7) * 0.02})`);
        causticGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = causticGrad;
        ctx.fillRect(0, 0, width, height);
      }
      ctx.restore();

      // Render Floating Bubbles
      bubbles.forEach((b) => {
        b.y -= b.speedY;
        b.x += Math.sin(time + b.pulse) * 0.4 + b.speedX;
        b.pulse += 0.02;

        if (b.y < -20) {
          b.y = height + 20;
          b.x = Math.random() * width;
        }

        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);

        // Glassy bubble gradient
        const bubbleGrad = ctx.createRadialGradient(
          b.x - b.radius * 0.3,
          b.y - b.radius * 0.3,
          b.radius * 0.1,
          b.x,
          b.y,
          b.radius
        );
        bubbleGrad.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
        bubbleGrad.addColorStop(0.4, `rgba(0, 242, 254, ${b.opacity})`);
        bubbleGrad.addColorStop(1, 'rgba(11, 34, 61, 0.2)');

        ctx.fillStyle = bubbleGrad;
        ctx.strokeStyle = `rgba(0, 242, 254, ${b.opacity * 0.7})`;
        ctx.lineWidth = 0.8;
        ctx.fill();
        ctx.stroke();
      });

      // Render Interactive Ripples
      ripples.forEach((r, idx) => {
        r.radius += 2.5;
        r.opacity -= 0.015;

        if (r.opacity <= 0) {
          ripples.splice(idx, 1);
          return;
        }

        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(0, 242, 254, ${r.opacity})`;
        ctx.lineWidth = 2;
        ctx.stroke();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('click', handleClick);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-auto z-0"
    />
  );
};
