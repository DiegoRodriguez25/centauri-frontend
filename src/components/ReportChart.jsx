import { formatCurrency } from "../data/books";

const colors = ["#7f77dd", "#f97373", "#22c55e", "#f59e0b", "#38bdf8", "#e879f9"];

function ReportChart({ title, subtitle, data, variant = "bars" }) {
  const total = data.reduce((sum, item) => sum + item.value, 0) || 1;
  const maxValue = Math.max(...data.map((item) => item.value), 1);
  const segments = data
    .map((item, index, items) => {
      const pct = (item.value / total) * 100;
      const start = items
        .slice(0, index)
        .reduce((sum, previous) => sum + (previous.value / total) * 100, 0);
      return `${colors[index % colors.length]} ${start}% ${start + pct}%`;
    })
    .join(", ");

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
            gridTemplateColumns: "170px 1fr",
            gap: "24px",
            alignItems: "center",
          }}
          className="report-chart-grid"
        >
          <div
            aria-label="Grafico de porcentajes"
            className="donut-chart"
            style={{
              width: "170px",
              height: "170px",
              borderRadius: "50%",
              background: `conic-gradient(${segments})`,
              boxShadow:
                "0 0 40px rgba(83,74,183,0.16), inset 0 0 0 34px rgba(15,14,23,0.94)",
              border: "1px solid rgba(255,255,255,0.08)",
              display: "grid",
              placeItems: "center",
            }}
          >
            <span
              style={{
                width: "96px",
                height: "96px",
                borderRadius: "50%",
                background: "rgba(18,16,32,0.96)",
                display: "grid",
                placeItems: "center",
                color: "#fffffe",
                fontSize: "20px",
                fontWeight: 800,
                border: "0.5px solid rgba(255,255,255,0.08)",
              }}
            >
              {data.length}
            </span>
          </div>
          <Legend data={data} total={total} />
        </div>
      )}

      {variant === "bars" && (
        <div style={{ display: "grid", gap: "16px" }}>
          {data.map((item, index) => {
            const percent = Math.round((item.value / total) * 100);
            const width = Math.max(8, Math.round((item.value / maxValue) * 100));
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

function Legend({ data, total }) {
  return (
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
          <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <i
              style={{
                width: "9px",
                height: "9px",
                borderRadius: "50%",
                background: colors[index % colors.length],
              }}
            />
            {item.label}
          </span>
          <strong style={{ display: "grid", textAlign: "right", gap: "2px" }}>
            <span>{Math.round((item.value / total) * 100)}%</span>
            <small style={{ color: "#8b8da3", fontWeight: 500 }}>
              {formatCurrency(item.value)}
            </small>
          </strong>
        </div>
      ))}
    </div>
  );
}

export default ReportChart;
