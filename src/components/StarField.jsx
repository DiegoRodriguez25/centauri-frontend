import { useEffect, useRef } from "react";

function StarField() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Estrellas normales
    const stars = Array.from({ length: 160 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.2 + 0.2,
      opacity: Math.random() * 0.4 + 0.1,
      speedX: (Math.random() - 0.5) * 0.4,
      speedY: (Math.random() - 0.5) * 0.4,
      offset: Math.random() * Math.PI * 2,
      pulseSpeed: Math.random() * 0.003 + 0.001,
      color:
        Math.random() > 0.7
          ? "255, 200, 160"
          : Math.random() > 0.5
            ? "180, 160, 255"
            : "160, 200, 255",
    }));

    // Estrellas brillantes
    const brightStars = Array.from({ length: 18 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.8 + 1.2,
      opacity: Math.random() * 0.4 + 0.5,
      speedX: (Math.random() - 0.5) * 0.25,
      speedY: (Math.random() - 0.5) * 0.25,
      offset: Math.random() * Math.PI * 2,
      pulseSpeed: Math.random() * 0.005 + 0.002,
      glowSize: Math.random() * 8 + 6,
      color: Math.random() > 0.5 ? "220, 200, 255" : "255, 230, 180",
    }));

    // Planetas
    const planets = Array.from({ length: 5 }, (_, i) => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 14 + 8,
      speedX: (Math.random() - 0.5) * 0.18,
      speedY: (Math.random() - 0.5) * 0.18,
      color: [
        "120, 80, 180",
        "180, 100, 100",
        "80, 140, 180",
        "160, 120, 80",
        "100, 160, 140",
      ][i],
      ringColor: [
        "150, 110, 210",
        "210, 130, 130",
        "110, 170, 210",
        "190, 150, 110",
        "130, 190, 170",
      ][i],
      hasRing: Math.random() > 0.4,
      opacity: Math.random() * 0.2 + 0.15,
      tilt: Math.random() * 0.6 - 0.3,
    }));

    const nebulae = [
      { x: 0.15, y: 0.25, r: 320, color: "120, 80, 200", opacity: 0.045 },
      { x: 0.75, y: 0.15, r: 280, color: "200, 100, 120", opacity: 0.035 },
      { x: 0.85, y: 0.65, r: 350, color: "80, 120, 220", opacity: 0.04 },
      { x: 0.4, y: 0.7, r: 300, color: "180, 80, 160", opacity: 0.03 },
      { x: 0.6, y: 0.35, r: 260, color: "100, 180, 200", opacity: 0.03 },
    ];

    let t = 0;

    const drawNebulae = () => {
      nebulae.forEach((n) => {
        const x = n.x * canvas.width;
        const y = n.y * canvas.height;
        const grad = ctx.createRadialGradient(x, y, 0, x, y, n.r);
        grad.addColorStop(0, `rgba(${n.color}, ${n.opacity})`);
        grad.addColorStop(0.5, `rgba(${n.color}, ${n.opacity * 0.4})`);
        grad.addColorStop(1, `rgba(${n.color}, 0)`);
        ctx.beginPath();
        ctx.arc(x, y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      });
    };

    const drawPlanet = (p) => {
      // Cuerpo del planeta
      const grad = ctx.createRadialGradient(
        p.x - p.r * 0.3,
        p.y - p.r * 0.3,
        p.r * 0.1,
        p.x,
        p.y,
        p.r,
      );
      grad.addColorStop(0, `rgba(${p.color}, ${p.opacity * 2})`);
      grad.addColorStop(0.6, `rgba(${p.color}, ${p.opacity * 1.2})`);
      grad.addColorStop(1, `rgba(${p.color}, ${p.opacity * 0.3})`);

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      // Anillo opcional
      if (p.hasRing) {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.tilt);
        ctx.scale(1, 0.28);
        ctx.beginPath();
        ctx.arc(0, 0, p.r * 1.9, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${p.ringColor}, ${p.opacity * 0.8})`;
        ctx.lineWidth = p.r * 0.35;
        ctx.stroke();
        ctx.restore();
      }
    };

    const drawBrightStar = (s, t) => {
      const pulse = Math.sin(t * s.pulseSpeed * 100 + s.offset) * 0.15;
      const currentOpacity = s.opacity + pulse;

      // Halo exterior
      const halo = ctx.createRadialGradient(
        s.x,
        s.y,
        0,
        s.x,
        s.y,
        s.glowSize * 2.5,
      );
      halo.addColorStop(0, `rgba(${s.color}, ${currentOpacity * 0.4})`);
      halo.addColorStop(0.4, `rgba(${s.color}, ${currentOpacity * 0.1})`);
      halo.addColorStop(1, `rgba(${s.color}, 0)`);
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.glowSize * 2.5, 0, Math.PI * 2);
      ctx.fillStyle = halo;
      ctx.fill();

      // Núcleo brillante
      const core = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 2.5);
      core.addColorStop(0, `rgba(255, 255, 255, ${currentOpacity})`);
      core.addColorStop(0.4, `rgba(${s.color}, ${currentOpacity * 0.8})`);
      core.addColorStop(1, `rgba(${s.color}, 0)`);
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r * 2.5, 0, Math.PI * 2);
      ctx.fillStyle = core;
      ctx.fill();

      // Destellos en cruz
      ctx.save();
      ctx.globalAlpha = currentOpacity * 0.35;
      ctx.strokeStyle = `rgba(255, 255, 255, 1)`;
      ctx.lineWidth = 0.5;
      const len = s.glowSize * 1.8;
      ctx.beginPath();
      ctx.moveTo(s.x - len, s.y);
      ctx.lineTo(s.x + len, s.y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(s.x, s.y - len);
      ctx.lineTo(s.x, s.y + len);
      ctx.stroke();
      ctx.restore();
    };

    const wrap = (val, max) => {
      if (val < -50) return max + 50;
      if (val > max + 50) return -50;
      return val;
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      t += 0.01;

      drawNebulae();

      // Estrellas normales
      stars.forEach((s) => {
        s.x += s.speedX;
        s.y += s.speedY;
        s.x = wrap(s.x, canvas.width);
        s.y = wrap(s.y, canvas.height);

        const pulse = Math.sin(t * s.pulseSpeed * 100 + s.offset) * 0.12;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${s.color}, ${Math.min(1, s.opacity + pulse)})`;
        ctx.fill();
      });

      // Planetas (detrás de las estrellas brillantes)
      planets.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.x = wrap(p.x, canvas.width);
        p.y = wrap(p.y, canvas.height);
        drawPlanet(p);
      });

      // Estrellas brillantes encima de todo
      brightStars.forEach((s) => {
        s.x += s.speedX;
        s.y += s.speedY;
        s.x = wrap(s.x, canvas.width);
        s.y = wrap(s.y, canvas.height);
        drawBrightStar(s, t);
      });

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
}

export default StarField;
