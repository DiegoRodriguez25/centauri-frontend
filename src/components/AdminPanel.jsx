import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  PackagePlus,
  Search,
  Table2,
} from "lucide-react";
import ReportChart from "./ReportChart";
import { categorias, formatCurrency, formatDate } from "../data/books";

const PAGE_SIZE = 6;

function AdminPanel({
  rows,
  chartData,
  filters,
  onFilterChange,
  page,
  onPageChange,
  onAddProduct,
}) {
  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const visibleRows = rows.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

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
          Empleado / Panel administrativo
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
          Informes de ventas
        </h1>
        <p style={{ color: "#a7a9be", fontSize: "15px" }}>
          Vista tabulada, consolidada y filtrable de todos los pedidos.
        </p>
      </header>

      <ProductForm onAddProduct={onAddProduct} />

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(320px, 1.1fr) minmax(280px, 0.9fr)",
          gap: "20px",
          alignItems: "start",
        }}
        className="report-layout"
      >
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
              gap: "14px",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Table2 size={18} color="#a8a4e6" />
              <div>
                <h2 style={{ fontSize: "18px" }}>Informe tabular</h2>
                <p style={{ color: "#6b6d80", fontSize: "12px" }}>
                  {rows.length} registros encontrados
                </p>
              </div>
            </div>
            <div className="admin-filters">
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
                onChange={(event) =>
                  onFilterChange("category", event.target.value)
                }
              >
                <option value="">Categoria</option>
                {categorias.map((category) => (
                  <option key={category.id} value={category.nombre}>
                    {category.nombre}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Cliente"
                value={filters.client}
                onChange={(event) => onFilterChange("client", event.target.value)}
              />
            </div>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table className="centauri-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Id_Producto</th>
                  <th>Producto</th>
                  <th>Cliente</th>
                  <th>ID_cliente</th>
                  <th>Categoria</th>
                  <th>Valor</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {visibleRows.map((row, index) => (
                  <tr key={`${row.id_pedido}-${row.id_producto}-${index}`}>
                    <td>{(safePage - 1) * PAGE_SIZE + index + 1}</td>
                    <td>{row.id_producto}</td>
                    <td>{row.producto}</td>
                    <td>{row.cliente}</td>
                    <td>{row.id_cliente}</td>
                    <td>{row.categoria}</td>
                    <td>{formatCurrency(row.valor)}</td>
                    <td>{formatDate(row.fecha)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <footer
            style={{
              padding: "14px 18px",
              borderTop: "0.5px solid rgba(255,255,255,0.07)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              color: "#a7a9be",
              fontSize: "13px",
            }}
          >
            <span>
              Pagina {safePage} - {totalPages}
            </span>
            <div style={{ display: "flex", gap: "8px" }}>
              <PageButton
                disabled={safePage === 1}
                onClick={() => onPageChange(safePage - 1)}
                icon={<ChevronLeft size={15} />}
              />
              <PageButton
                disabled={safePage === totalPages}
                onClick={() => onPageChange(safePage + 1)}
                icon={<ChevronRight size={15} />}
              />
            </div>
          </footer>
        </article>

        <ReportChart
          title="Ventas por categoria"
          subtitle="Porcentaje sobre el valor vendido en pedidos solicitados."
          data={chartData}
          variant="bars"
        />
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

function ProductForm({ onAddProduct }) {
  const [form, setForm] = useState({
    nombre: "",
    autor: "",
    editorial: "",
    categoria: categorias[0]?.nombre || "",
    anio: new Date().getFullYear(),
    precio: 1000,
    existencias: 1,
    img: "",
  });

  const update = (field, value) => {
    setForm((previous) => ({ ...previous, [field]: value }));
  };

  const submit = (event) => {
    event.preventDefault();
    if (!form.nombre.trim() || !form.autor.trim() || !form.editorial.trim()) return;
    onAddProduct({
      ...form,
      nombre: form.nombre.trim(),
      autor: form.autor.trim(),
      editorial: form.editorial.trim(),
      img: form.img.trim(),
    });
    setForm((previous) => ({
      ...previous,
      nombre: "",
      autor: "",
      editorial: "",
      precio: 1000,
      existencias: 1,
      img: "",
    }));
  };

  return (
    <section className="product-form-shell">
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <PackagePlus size={18} color="#a8a4e6" />
        <div>
          <h2 style={{ fontSize: "18px" }}>Nuevo producto</h2>
          <p style={{ color: "#8b8da3", fontSize: "12px" }}>
            Alta rapida para empleados.
          </p>
        </div>
      </div>

      <form className="product-form" onSubmit={submit}>
        <input
          type="text"
          placeholder="Titulo"
          value={form.nombre}
          onChange={(event) => update("nombre", event.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Autor"
          value={form.autor}
          onChange={(event) => update("autor", event.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Editorial"
          value={form.editorial}
          onChange={(event) => update("editorial", event.target.value)}
          required
        />
        <select
          value={form.categoria}
          onChange={(event) => update("categoria", event.target.value)}
        >
          {categorias.map((category) => (
            <option key={category.id} value={category.nombre}>
              {category.nombre}
            </option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Ano"
          min="1900"
          max="2035"
          value={form.anio}
          onChange={(event) => update("anio", event.target.value)}
        />
        <input
          type="number"
          placeholder="Precio"
          min="1000"
          step="1000"
          value={form.precio}
          onChange={(event) => update("precio", event.target.value)}
        />
        <input
          type="number"
          placeholder="Stock"
          min="0"
          value={form.existencias}
          onChange={(event) => update("existencias", event.target.value)}
        />
        <input
          type="url"
          placeholder="URL imagen"
          value={form.img}
          onChange={(event) => update("img", event.target.value)}
        />
        <button className="primary-action" type="submit">
          Agregar producto
        </button>
      </form>
    </section>
  );
}

function PageButton({ disabled, onClick, icon }) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      style={{
        width: "34px",
        height: "34px",
        borderRadius: "50%",
        border: "0.5px solid rgba(83,74,183,0.45)",
        background: disabled ? "rgba(255,255,255,0.03)" : "rgba(83,74,183,0.2)",
        color: disabled ? "#4a4a5a" : "#fffffe",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: disabled ? "not-allowed" : "pointer",
      }}
    >
      {icon}
    </button>
  );
}

export default AdminPanel;
