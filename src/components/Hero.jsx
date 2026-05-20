import { useEffect, useState } from "react";

const phrases = [
  "Tu proxima obsesion.",
  "Tu proximo viaje.",
  "Tu proxima vida.",
];

function Hero({ session, productCount }) {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((current) => (current + 1) % phrases.length);
        setVisible(true);
      }, 400);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      style={{
        padding: "7rem 2rem 3rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 20% 50%, rgba(83,74,183,0.15) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(255,100,100,0.08) 0%, transparent 50%)",
          pointerEvents: "none",
        }}
      />

      <p
        style={{
          fontSize: "12px",
          letterSpacing: "0.2em",
          color: "#534AB7",
          textTransform: "uppercase",
          marginBottom: "1rem",
          fontWeight: "500",
        }}
      >
        Centauri libreria
      </p>

      <h1
        style={{
          fontSize: "clamp(2.5rem, 6vw, 5rem)",
          fontWeight: "700",
          lineHeight: "1.1",
          marginBottom: "1rem",
          background: "linear-gradient(135deg, #fffffe 0%, #a8a4e6 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        Gestion bibliografica
        <br />
        para pedidos reales.
      </h1>

      <div
        style={{
          fontSize: "clamp(1.1rem, 3vw, 1.7rem)",
          color: "#a7a9be",
          fontWeight: "300",
          minHeight: "2.5rem",
          transition: "opacity 0.4s, transform 0.4s",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(10px)",
        }}
      >
        {session?.rol === "empleado"
          ? "Informes, ventas y consolidados."
          : phrases[index]}
      </div>

      <div
        style={{
          marginTop: "2rem",
          display: "flex",
          gap: "12px",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: "40px",
            height: "2px",
            background: "linear-gradient(90deg, #534AB7, transparent)",
          }}
        />
        <span
          style={{ fontSize: "12px", color: "#534AB7", letterSpacing: "0.1em" }}
        >
          {productCount} titulos disponibles
        </span>
      </div>
    </section>
  );
}

export default Hero;
