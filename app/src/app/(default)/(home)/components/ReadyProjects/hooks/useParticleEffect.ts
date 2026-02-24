import { useEffect } from 'react';

export const useParticleEffect = () => {
  useEffect(() => {
    const canvas = document.getElementById("particle-canvas") as HTMLCanvasElement;
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: {
      x: number;
      y: number;
      radius: number;
      dx: number;
      dy: number;
    }[] = [];

    for (let i = 0; i < 100; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2,
        dx: (Math.random() - 0.5) * 0.5,
        dy: (Math.random() - 0.5) * 0.5,
      });
    }

    function animate() {
      requestAnimationFrame(animate);
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach((particle) => {
          particle.x += particle.dx;
          particle.y += particle.dy;

          if (particle.x < 0 || particle.x > canvas.width) particle.dx *= -1;
          if (particle.y < 0 || particle.y > canvas.height) particle.dy *= -1;

          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(59, 130, 246, 0.5)"; // Blue color for light mode
          ctx.fill();
        });
      }
    }

    animate();

    return () => cancelAnimationFrame(animate as unknown as number);
  }, []);
};
