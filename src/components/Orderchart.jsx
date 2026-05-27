import { useMemo, useState } from "react";
import { X, TrendingUp, ShoppingCart, DollarSign } from "lucide-react";
import { formatCurrency } from "../data/books";

const COLORS = [
  "#7f77dd",
  "#f97373",
  "#22c55e",
  "#f59e0b",
  "#38bdf8",
  "#e879f9",
];

function OrderChart({ rows, onClose, title, variant = "default" }) {
  const accent =
    variant === "activos"
      ? "#22c55e"
      : variant === "cancelados"
        ? "#f87171"
        : "#7f77dd";
  const accentBg =
    variant === "activos"
      ? "rgba(34,197,94,0.07)"
      : variant === "cancelados"
        ? "rgba(220,38,38,0.07)"
        : "rgba(127,119,221,0.07)";
  const accentBorder =
    variant === "activos"
      ? "rgba(34,197,94,0.22)"
      : variant === "cancelados"
        ? "rgba(220,38,38,0.22)"
        : "rgba(255,255,255,0.1)";
  const accentFill =
    variant === "activos"
      ? "rgba(34,197,94,0.12)"
      : variant === "cancelados"
        ? "rgba(220,38,38,0.12)"
        : "rgba(127,119,221,0.12)";
  const modalBg =
    variant === "activos"
      ? "#0f1a14"
      : variant === "cancelados"
        ? "#1a0f0f"
        : "#13121f";

  const [metric, setMetric] = useState("valor");
  const [groupBy, setGroupBy] = useState("dia");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterProduct, setFilterProduct] = useState("");

  const categories = useMemo(
    () => [...new Set(rows.map((r) => r.categoria).filter(Boolean))],
    [rows],
  );
  const products = useMemo(
    () => [...new Set(rows.map((r) => r.producto).filter(Boolean))],
    [rows],
  );

  const filtered = useMemo(() => {
    return rows.filter((row) => {
      const matchCat = !filterCategory || row.categoria === filterCategory;
      const matchProd = !filterProduct || row.producto === filterProduct;
      return matchCat && matchProd;
    });
  }, [rows, filterCategory, filterProduct]);

  const chartData = useMemo(() => {
    const groups = {};
    for (const row of filtered) {
      if (!row.fecha) continue;
      let key;
      const date = new Date(`${row.fecha}T00:00:00`);
      if (groupBy === "dia") {
        key = row.fecha;
      } else if (groupBy === "semana") {
        const startOfWeek = new Date(date);
        startOfWeek.setDate(date.getDate() - date.getDay() + 1);
        key = startOfWeek.toISOString().slice(0, 10);
      } else {
        key = row.fecha.slice(0, 7);
      }
      if (!groups[key]) groups[key] = { valor: 0, cantidad: 0 };
      groups[key].valor += row.valor;
      groups[key].cantidad += 1;
    }
    return Object.entries(groups)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, values]) => ({ key, ...values }));
  }, [filtered, groupBy]);

  const maxValue = Math.max(...chartData.map((d) => d[metric]), 1);

  const buildPath = () => {
    if (chartData.length === 0) return "";
    const W = 700,
      H = 200,
      PAD = 10;
    const points = chartData.map((d, i) => {
      const x = PAD + (i / Math.max(chartData.length - 1, 1)) * (W - PAD * 2);
      const y = H - PAD - (d[metric] / maxValue) * (H - PAD * 2);
      return `${x},${y}`;
    });
    return `M${points.join("L")}`;
  };

  const buildArea = () => {
    if (chartData.length === 0) return "";
    const W = 700,
      H = 200,
      PAD = 10;
    const points = chartData.map((d, i) => {
      const x = PAD + (i / Math.max(chartData.length - 1, 1)) * (W - PAD * 2);
      const y = H - PAD - (d[metric] / maxValue) * (H - PAD * 2);
      return `${x},${y}`;
    });
    const first = points[0].split(",");
    const last = points[points.length - 1].split(",");
    return `M${points.join("L")}L${last[0]},${H - PAD}L${first[0]},${H - PAD}Z`;
  };

  const formatKey = (key) => {
    if (groupBy === "mes") {
      const [year, month] = key.split("-");
      const months = [
        "Ene",
        "Feb",
        "Mar",
        "Abr",
        "May",
        "Jun",
        "Jul",
        "Ago",
        "Sep",
        "Oct",
        "Nov",
        "Dic",
      ];
      return `${months[parseInt(month) - 1]} ${year}`;
    }
    if (groupBy === "semana") return `Sem. ${key.slice(5)}`;
    return key.slice(5);
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 2000,
        background: "rgba(0,0,0,0.8)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          background: modalBg,
          border: `0.5px solid ${accentBorder}`,
          borderRadius: "20px",
          width: "100%",
          maxWidth: "860px",
          maxHeight: "90vh",
          overflowY: "auto",
          padding: "28px",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <TrendingUp size={20} color={accent} />
            <div>
              <h2 style={{ fontSize: "20px", color: "#fffffe" }}>{title}</h2>
              <p style={{ color: "#6b6d80", fontSize: "13px" }}>
                {filtered.length} registros · {chartData.length} periodos
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "rgba(255,255,255,0.06)",
              border: `0.5px solid ${accentBorder}`,
              borderRadius: "50%",
              width: "36px",
              height: "36px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "#a7a9be",
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Filtros */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "10px",
            padding: "16px",
            borderRadius: "12px",
            background: accentBg,
            border: `0.5px solid ${accentBorder}`,
          }}
        >
          <div style={{ display: "flex", gap: "6px" }}>
            <MetricBtn
              active={metric === "valor"}
              onClick={() => setMetric("valor")}
              icon={<DollarSign size={13} />}
              label="Valor"
              accent={accent}
            />
            <MetricBtn
              active={metric === "cantidad"}
              onClick={() => setMetric("cantidad")}
              icon={<ShoppingCart size={13} />}
              label="Cantidad"
              accent={accent}
            />
          </div>
          <select
            value={groupBy}
            onChange={(e) => setGroupBy(e.target.value)}
            style={selectStyle}
          >
            <option value="dia">Por día</option>
            <option value="semana">Por semana</option>
            <option value="mes">Por mes</option>
          </select>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            style={selectStyle}
          >
            <option value="">Todas las categorías</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <select
            value={filterProduct}
            onChange={(e) => setFilterProduct(e.target.value)}
            style={selectStyle}
          >
            <option value="">Todos los libros</option>
            {products.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        {/* Métricas resumen */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "12px",
          }}
        >
          <Metric
            label="Registros filtrados"
            value={filtered.length}
            accentBorder={accentBorder}
            accentBg={accentBg}
          />
          <Metric
            label="Valor total"
            value={formatCurrency(filtered.reduce((s, r) => s + r.valor, 0))}
            accentBorder={accentBorder}
            accentBg={accentBg}
          />
          <Metric
            label="Periodos"
            value={chartData.length}
            accentBorder={accentBorder}
            accentBg={accentBg}
          />
        </div>

        {/* Gráfico */}
        {chartData.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "40px",
              color: "#6b6d80",
              fontSize: "14px",
              background: accentBg,
              borderRadius: "12px",
              border: `0.5px solid ${accentBorder}`,
            }}
          >
            No hay datos para los filtros seleccionados.
          </div>
        ) : (
          <div
            style={{
              background: accentBg,
              border: `0.5px solid ${accentBorder}`,
              borderRadius: "14px",
              padding: "20px",
            }}
          >
            <svg
              viewBox="0 0 720 240"
              width="100%"
              style={{ overflow: "visible" }}
            >
              {[0, 25, 50, 75, 100].map((pct) => {
                const y = 10 + ((100 - pct) / 100) * 200;
                return (
                  <g key={pct}>
                    <line
                      x1="10"
                      y1={y}
                      x2="710"
                      y2={y}
                      stroke="rgba(255,255,255,0.05)"
                      strokeWidth="1"
                    />
                    <text
                      x="5"
                      y={y + 4}
                      fill="#6b6d80"
                      fontSize="9"
                      textAnchor="end"
                    >
                      {metric === "valor"
                        ? pct === 0
                          ? "$0"
                          : `$${Math.round((maxValue * pct) / 100 / 1000)}k`
                        : Math.round((maxValue * pct) / 100)}
                    </text>
                  </g>
                );
              })}
              <path d={buildArea()} fill={accentFill} />
              <path
                d={buildPath()}
                fill="none"
                stroke={accent}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {chartData.map((d, i) => {
                const W = 700,
                  H = 200,
                  PAD = 10;
                const x =
                  PAD + (i / Math.max(chartData.length - 1, 1)) * (W - PAD * 2);
                const y = H - PAD - (d[metric] / maxValue) * (H - PAD * 2);
                return (
                  <g key={d.key}>
                    <circle
                      cx={x}
                      cy={y}
                      r="5"
                      fill={accent}
                      stroke={modalBg}
                      strokeWidth="2"
                    />
                    <text
                      x={x}
                      y={y - 10}
                      fill="#fffffe"
                      fontSize="9"
                      textAnchor="middle"
                    >
                      {metric === "valor"
                        ? `$${(d.valor / 1000).toFixed(0)}k`
                        : d.cantidad}
                    </text>
                  </g>
                );
              })}
              {chartData.map((d, i) => {
                const W = 700,
                  PAD = 10;
                const x =
                  PAD + (i / Math.max(chartData.length - 1, 1)) * (W - PAD * 2);
                const showLabel =
                  chartData.length <= 12 ||
                  i % Math.ceil(chartData.length / 12) === 0;
                return showLabel ? (
                  <text
                    key={`label-${d.key}`}
                    x={x}
                    y={225}
                    fill="#6b6d80"
                    fontSize="9"
                    textAnchor="middle"
                  >
                    {formatKey(d.key)}
                  </text>
                ) : null;
              })}
            </svg>
          </div>
        )}

        {/* Tabla resumen */}
        {chartData.length > 0 && (
          <div style={{ overflowX: "auto" }}>
            <table className="centauri-table">
              <thead>
                <tr>
                  <th>Periodo</th>
                  <th>Valor total</th>
                  <th>Pedidos</th>
                </tr>
              </thead>
              <tbody>
                {chartData.map((d) => (
                  <tr key={d.key}>
                    <td>{formatKey(d.key)}</td>
                    <td>{formatCurrency(d.valor)}</td>
                    <td>{d.cantidad}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

const selectStyle = {
  background: "rgba(255,255,255,0.06)",
  border: "0.5px solid rgba(255,255,255,0.12)",
  borderRadius: "8px",
  color: "#d8d7ef",
  padding: "7px 12px",
  fontSize: "13px",
  cursor: "pointer",
};

function MetricBtn({ active, onClick, icon, label, accent }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "5px",
        background: active ? `${accent}22` : "rgba(255,255,255,0.05)",
        border: `0.5px solid ${active ? accent : "rgba(255,255,255,0.1)"}`,
        borderRadius: "8px",
        color: active ? accent : "#6b6d80",
        padding: "7px 12px",
        fontSize: "13px",
        cursor: "pointer",
        transition: "all 0.2s",
      }}
    >
      {icon} {label}
    </button>
  );
}

function Metric({ label, value, accentBorder, accentBg }) {
  return (
    <div
      style={{
        background: accentBg,
        border: `0.5px solid ${accentBorder}`,
        borderRadius: "10px",
        padding: "12px 16px",
      }}
    >
      <p style={{ color: "#6b6d80", fontSize: "11px", marginBottom: "4px" }}>
        {label}
      </p>
      <strong style={{ color: "#fffffe", fontSize: "20px" }}>{value}</strong>
    </div>
  );
}

export default OrderChart;
