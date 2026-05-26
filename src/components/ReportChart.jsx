import { formatCurrency } from "../data/books";

const colors = [
  "#7f77dd",
  "#f97373",
  "#22c55e",
  "#f59e0b",
  "#38bdf8",
  "#e879f9",
];

function ReportChart({ title, subtitle, data, variant = "bars" }) {
  const total = data.reduce((sum, item) => sum + item.value, 0) || 1;
  const maxValue = Math.max(...data.map((item) => item.value), 1);

  // Construye segmentos SVG para la dona
  const buildDonutSegments = () => {
    const cx = 100,
      cy = 100,
      r = 80,
      strokeWidth = 28;
    const circumference = 2 * Math.PI * r;
    let offset = 0;
    return data.map((item, index) => {
      const pct = item.value / total;
      const dash = pct * circumference;
      const gap = circumference - dash;
      const rotation = offset * 360 - 90;
      offset += pct;
      return (
        <circle
          key={item.label}
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke={colors[index % colors.length]}
          strokeWidth={strokeWidth}
          strokeDasharray={`${dash} ${gap}`}
          strokeDashoffset={0}
          transform={`rotate(${rotation} ${cx} ${cy})`}
          strokeLinecap="butt"
          style={{ transition: "stroke-dasharray 0.6s ease" }}
        />
      );
    });
  };

  return (
    <article
      style={{
        background: "rgba(255,255,255,0.035)",
        border: "0.5px solid rgba(255,255,255,0.08)",
        borderRadius: "16px",
        padding: "20px",
        minHeight: "100%",
        boxShadow: "0 18px 60px rgba(0,0,0,0.14)",
      }}
    >
      <div style={{ marginBottom: "18px" }}>
        <p
          style={{
            color: "#534AB7",
            fontSize: "11px",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            marginBottom: "6px",
          }}
        >
          Informe consolidado
        </p>
        <h2 style={{ color: "#fffffe", fontSize: "20px", marginBottom: "4px" }}>
          {title}
        </h2>
        <p style={{ color: "#8b8da3", fontSize: "13px" }}>{subtitle}</p>
      </div>

      {variant === "pie" && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "200px 1fr",
            gap: "24px",
            alignItems: "center",
          }}
          className="report-chart-grid"
        >
          {/* Dona SVG */}
          <div
            style={{ position: "relative", width: "200px", height: "200px" }}
          >
            <svg viewBox="0 0 200 200" width="200" height="200">
              {/* Fondo del anillo */}
              <circle
                cx="100"
                cy="100"
                r="80"
                fill="none"
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="28"
              />
              {buildDonutSegments()}
              {/* Separadores blancos entre segmentos */}
              {data.map((item, index) => {
                const pct = data
                  .slice(0, index)
                  .reduce((s, d) => s + d.value / total, 0);
                const angle = pct * 2 * Math.PI - Math.PI / 2;
                const r1 = 80 - 14,
                  r2 = 80 + 14;
                const x1 = 100 + r1 * Math.cos(angle);
                const y1 = 100 + r1 * Math.sin(angle);
                const x2 = 100 + r2 * Math.cos(angle);
                const y2 = 100 + r2 * Math.sin(angle);
                return (
                  <line
                    key={`sep-${index}`}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="rgba(15,14,23,0.9)"
                    strokeWidth="2"
                  />
                );
              })}
            </svg>
            {/* Centro con número */}
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                textAlign: "center",
                pointerEvents: "none",
              }}
            >
              <strong
                style={{ color: "#fffffe", fontSize: "28px", fontWeight: 800 }}
              >
                {data.length}
              </strong>
              <p
                style={{ color: "#8b8da3", fontSize: "11px", marginTop: "2px" }}
              >
                categorías
              </p>
            </div>
          </div>

          {/* Leyenda */}
          <div style={{ display: "grid", gap: "10px" }}>
            {data.map((item, index) => (
              <div
                key={item.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "12px",
                  padding: "10px 0",
                  borderBottom: "0.5px solid rgba(255,255,255,0.06)",
                  color: "#d8d7ef",
                  fontSize: "13px",
                }}
              >
                <span
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <i
                    style={{
                      display: "inline-block",
                      width: "10px",
                      height: "10px",
                      borderRadius: "3px",
                      background: colors[index % colors.length],
                      flexShrink: 0,
                    }}
                  />
                  {item.label}
                </span>
                <strong
                  style={{
                    display: "grid",
                    textAlign: "right",
                    gap: "2px",
                    flexShrink: 0,
                  }}
                >
                  <span style={{ color: "#fffffe" }}>
                    {Math.round((item.value / total) * 100)}%
                  </span>
                  <small style={{ color: "#8b8da3", fontWeight: 500 }}>
                    {formatCurrency(item.value)}
                  </small>
                </strong>
              </div>
            ))}
          </div>
        </div>
      )}

      {variant === "bars" && (
        <div style={{ display: "grid", gap: "16px" }}>
          {data.map((item, index) => {
            const percent = Math.round((item.value / total) * 100);
            const width = Math.max(
              8,
              Math.round((item.value / maxValue) * 100),
            );
            return (
              <div key={item.label}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "10px",
                    marginBottom: "7px",
                    color: "#d8d7ef",
                    fontSize: "13px",
                  }}
                >
                  <span>{item.label}</span>
                  <strong style={{ color: "#fffffe", whiteSpace: "nowrap" }}>
                    {formatCurrency(item.value)} / {percent}%
                  </strong>
                </div>
                <div
                  style={{
                    height: "14px",
                    background: "rgba(255,255,255,0.06)",
                    borderRadius: "100px",
                    overflow: "hidden",
                    border: "0.5px solid rgba(255,255,255,0.05)",
                  }}
                >
                  <div
                    style={{
                      width: `${width}%`,
                      height: "100%",
                      borderRadius: "100px",
                      background: `linear-gradient(90deg, ${colors[index % colors.length]}, rgba(255,255,255,0.78))`,
                      boxShadow: `0 0 20px ${colors[index % colors.length]}55`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </article>
  );
}

export default ReportChart;
