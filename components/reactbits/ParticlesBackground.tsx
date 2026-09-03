'use client';

import React, { useEffect, useRef } from 'react';

interface ParticlesBackgroundProps {
  particleCount?: number;
  particleColor?: string;
  lineColor?: string;
  speed?: number;
  interactive?: boolean;
  className?: string;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseRadius: number;
  alpha: number;
}

export const ParticlesBackground: React.FC<ParticlesBackgroundProps> = ({
  particleCount = 45,
  particleColor = 'rgba(147, 197, 253, 0.5)',
  lineColor = 'rgba(147, 197, 253, 0.08)',
  speed = 0.4,
  interactive = true,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef<{ x: number | null; y: number | null; radius: number }>({
    x: null,
    y: null,
    radius: 120,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };

    window.addEventListener('resize', handleResize);

    // Initialize particles
    const particles: Particle[] = [];
    const count = Math.min(particleCount, Math.floor((width * height) / 18000) || 30);

    for (let i = 0; i < count; i++) {
      const radius = Math.random() * 1.5 + 0.8;
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * speed,
        vy: (Math.random() - 0.5) * speed,
        radius,
        baseRadius: radius,
        alpha: Math.random() * 0.5 + 0.2,
      });
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouseRef.current.x = null;
      mouseRef.current.y = null;
    };

    if (interactive) {
      canvas.parentElement?.addEventListener('mousemove', handleMouseMove);
      canvas.parentElement?.addEventListener('mouseleave', handleMouseLeave);
    }

    // Animation render loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            const alpha = (1 - dist / 110) * 0.15;
            ctx.strokeStyle = lineColor.replace(/[\d.]+\)$/, `${alpha})`);
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw & update particles
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        // Bounce on boundaries
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Mouse interaction (gentle repel & glow)
        if (interactive && mouseRef.current.x !== null && mouseRef.current.y !== null) {
          const mdx = p.x - mouseRef.current.x;
          const mdy = p.y - mouseRef.current.y;
          const mDist = Math.sqrt(mdx * mdx + mdy * mdy);

          if (mDist < mouseRef.current.radius) {
            const force = (1 - mDist / mouseRef.current.radius) * 1.5;
            p.x += (mdx / mDist) * force;
            p.y += (mdy / mDist) * force;
            p.radius = p.baseRadius * (1 + force * 1.5);
          } else {
            p.radius = p.baseRadius;
          }
        }

        // Draw particle dot
        ctx.fillStyle = particleColor;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (interactive) {
        canvas.parentElement?.removeEventListener('mousemove', handleMouseMove);
        canvas.parentElement?.removeEventListener('mouseleave', handleMouseLeave);
      }
      cancelAnimationFrame(animationFrameId);
    };
  }, [particleCount, particleColor, lineColor, speed, interactive]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none w-full h-full z-0 opacity-80 ${className}`}
    />
  );
};
