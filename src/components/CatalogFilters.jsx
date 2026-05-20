import { Filter, RotateCcw, SlidersHorizontal } from "lucide-react";

function CatalogFilters({ categories, filters, onChange, onReset, priceBounds }) {
  const fieldStyle = {
    width: "100%",
    background: "rgba(255,255,255,0.04)",
    border: "0.5px solid rgba(255,255,255,0.1)",
    borderRadius: "10px",
    padding: "11px 12px",
    color: "#fffffe",
    fontFamily: "inherit",
    outline: "none",
  };

  const labelStyle = {
    display: "block",
    fontSize: "11px",
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: "#7f77dd",
    marginBottom: "8px",
  };

  return (
    <section
      style={{
        margin: "0 2rem 2rem",
        padding: "20px",
        background:
          "linear-gradient(135deg, rgba(255,255,255,0.055), rgba(83,74,183,0.055))",
        border: "0.5px solid rgba(255,255,255,0.08)",
        borderRadius: "16px",
        display: "grid",
        gridTemplateColumns: "minmax(180px, 0.75fr) minmax(280px, 1.4fr) minmax(150px, 0.75fr) minmax(150px, 0.75fr) auto auto",
        gap: "16px",
        alignItems: "end",
        boxShadow: "0 18px 60px rgba(0,0,0,0.16)",
      }}
      className="catalog-filters"
    >
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <SlidersHorizontal size={16} color="#a8a4e6" />
          <div>
            <p
              style={{
                color: "#fffffe",
                fontSize: "14px",
                fontWeight: 700,
                marginBottom: "2px",
              }}
            >
              Filtros
            </p>
            <p style={{ color: "#6b6d80", fontSize: "12px" }}>
              Catalogo bibliografico
            </p>
          </div>
        </div>
      </div>

      <div>
        <span style={labelStyle}>Categoria</span>
        <select
          className="catalog-category-select"
          value={filters.category}
          onChange={(event) => onChange("category", event.target.value)}
        >
          <option value="">Todas</option>
          {categories.map((category) => (
            <option key={category.id} value={category.nombre}>
              {category.nombre}
            </option>
          ))}
        </select>
      </div>

      <label>
        <span style={labelStyle}>Precio minimo</span>
        <input
          type="number"
          min={priceBounds.min}
          max={priceBounds.max}
          step="1000"
          value={filters.minPrice}
          onChange={(event) => onChange("minPrice", event.target.value)}
          style={fieldStyle}
        />
      </label>

      <label>
        <span style={labelStyle}>Precio maximo</span>
        <input
          type="number"
          min={priceBounds.min}
          max={priceBounds.max}
          step="1000"
          value={filters.maxPrice}
          onChange={(event) => onChange("maxPrice", event.target.value)}
          style={fieldStyle}
        />
      </label>

      <label
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          minHeight: "42px",
          padding: "0 12px",
          borderRadius: "12px",
          border: "0.5px solid rgba(255,255,255,0.1)",
          background: "rgba(255,255,255,0.04)",
          color: "#a7a9be",
          fontSize: "13px",
          whiteSpace: "nowrap",
        }}
      >
        <input
          type="checkbox"
          checked={filters.availableOnly}
          onChange={(event) => onChange("availableOnly", event.target.checked)}
          style={{ accentColor: "#7f77dd" }}
        />
        Disponible
      </label>

      <button
        onClick={onReset}
        title="Limpiar filtros"
        style={{
          height: "42px",
          width: "42px",
          borderRadius: "50%",
          border: "0.5px solid rgba(83,74,183,0.45)",
          background: "rgba(83,74,183,0.16)",
          color: "#a8a4e6",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
        }}
      >
        <RotateCcw size={15} />
      </button>

      <div
        style={{
          gridColumn: "1 / -1",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          color: "#6b6d80",
          fontSize: "12px",
        }}
      >
        <Filter size={13} />
        Los precios avanzan de $1.000 en $1.000 y los cambios se aplican sin recargar.
      </div>
    </section>
  );
}

export default CatalogFilters;
