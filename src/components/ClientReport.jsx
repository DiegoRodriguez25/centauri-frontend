import { CalendarDays, ClipboardList, Search } from "lucide-react";
import ReportChart from "./ReportChart";
import { categorias, estados, formatCurrency, formatDate } from "../data/books";

function ClientReport({ rows, chartData, user, filters, onFilterChange }) {
  const orderIds = new Set(rows.map((row) => row.id_pedido));
  const activeOrderIds = new Set(
    rows
      .filter((row) => row.estado === "solicitado")
      .map((row) => row.id_pedido),
  );
  const total = rows.reduce((sum, row) => sum + row.valor, 0);

  return (
    <main style={{ padding: "7rem 2rem 4rem" }}>
      <header style={{ marginBottom: "24px" }}>
        <p
          style={{
            color: "#534AB7",
            fontSize: "12px",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            marginBottom: "10px",
          }}
        >
          Cliente / Informe personal
        </p>
        <h1
          style={{
            fontSize: "clamp(2rem, 4vw, 3.4rem)",
            lineHeight: 1.1,
            background: "linear-gradient(135deg, #fffffe, #a8a4e6)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: "8px",
          }}
        >
          Pedidos de {user?.nombre || "cliente"}
        </h1>
        <p style={{ color: "#a7a9be", fontSize: "15px" }}>
          Consolidado de compras propias por categoria y estado.
        </p>
      </header>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(150px, 1fr))",
          gap: "14px",
          marginBottom: "20px",
        }}
        className="summary-grid"
      >
        <Metric label="Pedidos" value={orderIds.size} />
        <Metric label="Solicitados" value={activeOrderIds.size} />
        <Metric label="Total filtrado" value={formatCurrency(total)} />
      </section>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(280px, 0.85fr) minmax(320px, 1.15fr)",
          gap: "20px",
          alignItems: "start",
        }}
        className="report-layout"
      >
        <ReportChart
          title="Compras por categoria"
          subtitle="Porcentaje calculado sobre detalles de pedidos del cliente."
          data={chartData}
          variant="pie"
        />

        <article
          style={{
            background: "rgba(255,255,255,0.035)",
            border: "0.5px solid rgba(255,255,255,0.08)",
            borderRadius: "18px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "18px 20px",
              borderBottom: "0.5px solid rgba(255,255,255,0.07)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "10px",
              flexWrap: "wrap",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <ClipboardList size={18} color="#a8a4e6" />
              <div>
                <h2 style={{ fontSize: "18px" }}>Pedidos filtrables</h2>
                <p style={{ color: "#6b6d80", fontSize: "12px" }}>
                  {rows.length} registros encontrados
                </p>
              </div>
            </div>
            <div className="admin-filters client-filters">
              <SearchBox
                value={filters.search}
                onChange={(value) => onFilterChange("search", value)}
              />
              <DateRangeFilter
                mode={filters.dateMode}
                value={filters.dateValue}
                onModeChange={(value) => {
                  onFilterChange("dateMode", value);
                  onFilterChange("dateValue", "");
                }}
                onValueChange={(value) => onFilterChange("dateValue", value)}
              />
              <select
                value={filters.category}
                onChange={(event) => onFilterChange("category", event.target.value)}
              >
                <option value="">Categoria</option>
                {categorias.map((category) => (
                  <option key={category.id} value={category.nombre}>
                    {category.nombre}
                  </option>
                ))}
              </select>
              <select
                value={filters.status}
                onChange={(event) => onFilterChange("status", event.target.value)}
              >
                <option value="">Estado</option>
                {estados.map((status) => (
                  <option key={status.id} value={status.nombre}>
                    {status.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table className="centauri-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Pedido</th>
                  <th>Fecha</th>
                  <th>Producto</th>
                  <th>Categoria</th>
                  <th>Cantidad</th>
                  <th>Valor</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {rows.length ? (
                  rows.map((row, index) => (
                    <tr key={`${row.id_pedido}-${row.id_producto}-${index}`}>
                      <td>{index + 1}</td>
                      <td>#{row.id_pedido}</td>
                      <td>
                        <span className="cell-icon">
                          <CalendarDays size={13} />
                          {formatDate(row.fecha)}
                        </span>
                      </td>
                      <td>{row.producto}</td>
                      <td>{row.categoria}</td>
                      <td>{row.cantidad}</td>
                      <td>{formatCurrency(row.valor)}</td>
                      <td>
                        <span className={`status-pill ${row.estado}`}>
                          {row.estado}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8">No hay pedidos con esos filtros.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </article>
      </section>
    </main>
  );
}

function SearchBox({ value, onChange }) {
  return (
    <div className="filter-search">
      <Search size={14} color="#7f77dd" />
      <input
        type="text"
        placeholder="Buscar"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}

function DateRangeFilter({ mode, value, onModeChange, onValueChange }) {
  const inputType = mode === "week" ? "week" : mode === "month" ? "month" : "number";
  const placeholder =
    mode === "year" ? "Ano" : mode === "month" ? "Mes" : "Semana";

  return (
    <div className="date-range-filter">
      <select value={mode} onChange={(event) => onModeChange(event.target.value)}>
        <option value="">Periodo</option>
        <option value="week">Semana</option>
        <option value="month">Mes</option>
        <option value="year">Ano</option>
      </select>
      {mode && (
        <input
          type={inputType}
          min={mode === "year" ? "2020" : undefined}
          max={mode === "year" ? "2035" : undefined}
          placeholder={placeholder}
          value={value}
          onChange={(event) => onValueChange(event.target.value)}
        />
      )}
    </div>
  );
}

function Metric({ label, value }) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.035)",
        border: "0.5px solid rgba(255,255,255,0.08)",
        borderRadius: "14px",
        padding: "16px",
      }}
    >
      <p style={{ color: "#7f77dd", fontSize: "11px", marginBottom: "6px" }}>
        {label}
      </p>
      <strong style={{ color: "#fffffe", fontSize: "24px" }}>{value}</strong>
    </div>
  );
}

export default ClientReport;
