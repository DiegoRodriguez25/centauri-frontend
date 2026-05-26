import { useEffect, useRef, useState } from "react";
import {
  AlertTriangle,
  Ban,
  ChevronLeft,
  ChevronRight,
  ImagePlus,
  PackagePlus,
  RefreshCw,
  Search,
  Table2,
  XCircle,
} from "lucide-react";
import ReportChart from "./ReportChart";
import { formatCurrency, formatDate } from "../data/books";
import {
  getAuthors,
  getCategories,
  getEditorials,
  getTypes,
  createProduct,
} from "../api";

const PAGE_SIZE = 6;

function AdminPanel({
  rows,
  cancelledRows,
  chartData,
  filters,
  onFilterChange,
  page,
  onPageChange,
  onAddProduct,
  onCancelOrder,
  onRefresh,
  loading,
}) {
  const [confirmRow, setConfirmRow] = useState(null);
  const [cancelledPage, setCancelledPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const visibleRows = rows.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

  const totalCancelledPages = Math.max(
    1,
    Math.ceil((cancelledRows?.length || 0) / PAGE_SIZE),
  );
  const safeCancelledPage = Math.min(cancelledPage, totalCancelledPages);
  const visibleCancelledRows = (cancelledRows || []).slice(
    (safeCancelledPage - 1) * PAGE_SIZE,
    safeCancelledPage * PAGE_SIZE,
  );

  const handleConfirmCancel = async () => {
    if (!confirmRow) return;
    await onCancelOrder(confirmRow.id_pedido);
    setConfirmRow(null);
  };

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
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <div>
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
          </div>
          <button
            onClick={onRefresh}
            disabled={loading}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: "rgba(83, 74, 183, 0.15)",
              border: "0.5px solid rgba(168, 164, 230, 0.3)",
              borderRadius: "10px",
              color: "#a8a4e6",
              padding: "10px 18px",
              fontSize: "13px",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.6 : 1,
              transition: "all 0.2s",
            }}
          >
            <RefreshCw
              size={14}
              style={{
                animation: loading ? "spin 1s linear infinite" : "none",
              }}
            />
            {loading ? "Actualizando..." : "Refrescar pedidos"}
          </button>
        </div>
      </header>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .cancel-btn {
          display: flex; align-items: center; gap: 5px;
          background: rgba(220, 38, 38, 0.12);
          border: 0.5px solid rgba(220, 38, 38, 0.3);
          border-radius: 7px; color: #f87171;
          padding: 5px 10px; font-size: 12px;
          cursor: pointer; transition: all 0.2s;
        }
        .cancel-btn:hover { background: rgba(220, 38, 38, 0.25); }
        .modal-overlay {
          position: fixed; inset: 0; z-index: 1000;
          background: rgba(0,0,0,0.7); backdrop-filter: blur(4px);
          display: flex; align-items: center; justify-content: center;
        }
        .modal-box {
          background: #1a1929; border: 0.5px solid rgba(255,255,255,0.1);
          border-radius: 18px; padding: 32px; max-width: 400px; width: 90%;
          display: flex; flex-direction: column; gap: 16px; align-items: center;
          text-align: center;
        }
        .modal-actions { display: flex; gap: 12px; margin-top: 8px; }
        .modal-confirm {
          background: rgba(220,38,38,0.2); border: 0.5px solid rgba(220,38,38,0.4);
          color: #f87171; border-radius: 9px; padding: 10px 22px;
          font-size: 14px; cursor: pointer; transition: all 0.2s;
        }
        .modal-confirm:hover { background: rgba(220,38,38,0.35); }
        .modal-cancel {
          background: rgba(255,255,255,0.06); border: 0.5px solid rgba(255,255,255,0.12);
          color: #a7a9be; border-radius: 9px; padding: 10px 22px;
          font-size: 14px; cursor: pointer; transition: all 0.2s;
        }
        .modal-cancel:hover { background: rgba(255,255,255,0.1); }
        .img-upload-area {
          border: 1.5px dashed rgba(168,164,230,0.3);
          border-radius: 10px; padding: 18px;
          display: flex; flex-direction: column; align-items: center;
          gap: 8px; cursor: pointer; transition: all 0.2s;
          background: rgba(83,74,183,0.05);
          color: #8b8da3; font-size: 13px; text-align: center;
        }
        .img-upload-area:hover { border-color: rgba(168,164,230,0.6); background: rgba(83,74,183,0.1); }
      `}</style>

      {/* Modal confirmación cancelar */}
      {confirmRow && (
        <div className="modal-overlay">
          <div className="modal-box">
            <AlertTriangle size={36} color="#f87171" />
            <h2 style={{ fontSize: "20px", color: "#fffffe" }}>
              ¿Desea cancelar este pedido?
            </h2>
            <p style={{ color: "#a7a9be", fontSize: "14px" }}>
              Pedido{" "}
              <strong style={{ color: "#fffffe" }}>
                #{confirmRow.id_pedido}
              </strong>{" "}
              — {confirmRow.producto} ({confirmRow.cliente})
            </p>
            <p style={{ color: "#6b6d80", fontSize: "12px" }}>
              Esta acción cambiará el estado del pedido a Cancelado.
            </p>
            <div className="modal-actions">
              <button
                className="modal-cancel"
                onClick={() => setConfirmRow(null)}
              >
                Volver
              </button>
              <button className="modal-confirm" onClick={handleConfirmCancel}>
                Sí, cancelar pedido
              </button>
            </div>
          </div>
        </div>
      )}

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
        {/* Tabla pedidos activos */}
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
                <h2 style={{ fontSize: "18px" }}>Pedidos activos</h2>
                <p style={{ color: "#6b6d80", fontSize: "12px" }}>
                  {rows.length} registros
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
              <input
                type="text"
                placeholder="Cliente"
                value={filters.client}
                onChange={(event) =>
                  onFilterChange("client", event.target.value)
                }
              />
            </div>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table className="centauri-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Pedido</th>
                  <th>Producto</th>
                  <th>Cliente</th>
                  <th>Categoria</th>
                  <th>Valor</th>
                  <th>Fecha</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan="8"
                      style={{ textAlign: "center", color: "#a7a9be" }}
                    >
                      Cargando pedidos...
                    </td>
                  </tr>
                ) : visibleRows.length ? (
                  visibleRows.map((row, index) => (
                    <tr key={`${row.id_pedido}-${row.id_producto}-${index}`}>
                      <td>{(safePage - 1) * PAGE_SIZE + index + 1}</td>
                      <td>#{row.id_pedido}</td>
                      <td>{row.producto}</td>
                      <td>{row.cliente}</td>
                      <td>{row.categoria}</td>
                      <td>{formatCurrency(row.valor)}</td>
                      <td>{formatDate(row.fecha)}</td>
                      <td>
                        <button
                          className="cancel-btn"
                          onClick={() => setConfirmRow(row)}
                        >
                          <Ban size={12} /> Cancelar
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8">No hay pedidos activos.</td>
                  </tr>
                )}
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
          subtitle="Porcentaje sobre el valor vendido en pedidos activos."
          data={chartData}
          variant="bars"
        />
      </section>

      {/* Tabla pedidos cancelados */}
      <section style={{ marginTop: "24px" }}>
        <article
          style={{
            background: "rgba(220, 38, 38, 0.04)",
            border: "0.5px solid rgba(220, 38, 38, 0.15)",
            borderRadius: "18px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "18px 20px",
              borderBottom: "0.5px solid rgba(220,38,38,0.1)",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <XCircle size={18} color="#f87171" />
            <div>
              <h2 style={{ fontSize: "18px", color: "#f87171" }}>
                Pedidos cancelados
              </h2>
              <p style={{ color: "#6b6d80", fontSize: "12px" }}>
                {cancelledRows?.length || 0} registros
              </p>
            </div>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table className="centauri-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Pedido</th>
                  <th>Producto</th>
                  <th>Cliente</th>
                  <th>Categoria</th>
                  <th>Valor</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {visibleCancelledRows.length ? (
                  visibleCancelledRows.map((row, index) => (
                    <tr
                      key={`cancelled-${row.id_pedido}-${row.id_producto}-${index}`}
                      style={{ opacity: 0.6 }}
                    >
                      <td>{(safeCancelledPage - 1) * PAGE_SIZE + index + 1}</td>
                      <td>#{row.id_pedido}</td>
                      <td>{row.producto}</td>
                      <td>{row.cliente}</td>
                      <td>{row.categoria}</td>
                      <td>{formatCurrency(row.valor)}</td>
                      <td>{formatDate(row.fecha)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" style={{ color: "#6b6d80" }}>
                      No hay pedidos cancelados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {totalCancelledPages > 1 && (
            <footer
              style={{
                padding: "14px 18px",
                borderTop: "0.5px solid rgba(220,38,38,0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                color: "#a7a9be",
                fontSize: "13px",
              }}
            >
              <span>
                Pagina {safeCancelledPage} - {totalCancelledPages}
              </span>
              <div style={{ display: "flex", gap: "8px" }}>
                <PageButton
                  disabled={safeCancelledPage === 1}
                  onClick={() => setCancelledPage(safeCancelledPage - 1)}
                  icon={<ChevronLeft size={15} />}
                />
                <PageButton
                  disabled={safeCancelledPage === totalCancelledPages}
                  onClick={() => setCancelledPage(safeCancelledPage + 1)}
                  icon={<ChevronRight size={15} />}
                />
              </div>
            </footer>
          )}
        </article>
      </section>
    </main>
  );
}

function ProductForm({ onAddProduct }) {
  const [authors, setAuthors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editorials, setEditorials] = useState([]);
  const [types, setTypes] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    nombre: "",
    id_autor: "",
    id_editorial: "",
    id_categoria: "",
    id_tipo: "",
    fecha_publicacion: "",
    precio: 1000,
    existencias: 1,
  });
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    Promise.all([getAuthors(), getCategories(), getEditorials(), getTypes()])
      .then(([auth, cats, eds, typs]) => {
        setAuthors(auth.data || []);
        setCategories(cats.data || []);
        setEditorials(eds.data || []);
        setTypes(typs.data || []);
        setForm((prev) => ({
          ...prev,
          id_autor: auth.data?.[0]?.id || "",
          id_categoria: cats.data?.[0]?.id || "",
          id_editorial: eds.data?.[0]?.id || "",
          id_tipo: typs.data?.[0]?.id || "",
        }));
      })
      .catch(() => setNotice("Error al cargar opciones del formulario."))
      .finally(() => setLoadingOptions(false));
  }, []);

  const update = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const submit = async (event) => {
    event.preventDefault();
    if (
      !form.nombre.trim() ||
      !form.id_autor ||
      !form.id_editorial ||
      !form.id_categoria ||
      !form.id_tipo ||
      !form.fecha_publicacion
    ) {
      setNotice("Completa todos los campos obligatorios.");
      return;
    }

    setSubmitting(true);
    setNotice("");

    try {
      const formData = new FormData();
      formData.append("nombre", form.nombre.trim());
      formData.append("id_autor", form.id_autor);
      formData.append("id_editorial", form.id_editorial);
      formData.append("id_categoria", form.id_categoria);
      formData.append("id_tipo", form.id_tipo);
      formData.append("fecha_publicacion", `${form.fecha_publicacion}-01-01`);
      formData.append("precio", form.precio);
      formData.append("existencias", form.existencias);
      if (imageFile) formData.append("imagen", imageFile);

      await createProduct(formData);

      setNotice("¡Producto agregado correctamente!");
      setForm((prev) => ({
        ...prev,
        nombre: "",
        fecha_publicacion: "",
        precio: 1000,
        existencias: 1,
      }));
      setImageFile(null);
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";

      // Notificar al catálogo para que recargue
      if (onAddProduct) onAddProduct();
    } catch (error) {
      setNotice(error.message || "Error al agregar el producto.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="product-form-shell">
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <PackagePlus size={18} color="#a8a4e6" />
        <div>
          <h2 style={{ fontSize: "18px" }}>Nuevo producto</h2>
          <p style={{ color: "#8b8da3", fontSize: "12px" }}>
            Alta para empleados — se guarda directamente en la base de datos.
          </p>
        </div>
      </div>

      {notice && (
        <p
          style={{
            marginTop: "10px",
            fontSize: "13px",
            padding: "10px 14px",
            borderRadius: "8px",
            background:
              notice.includes("Error") || notice.includes("Completa")
                ? "rgba(220,38,38,0.1)"
                : "rgba(34,197,94,0.1)",
            color:
              notice.includes("Error") || notice.includes("Completa")
                ? "#f87171"
                : "#22c55e",
            border: `0.5px solid ${notice.includes("Error") || notice.includes("Completa") ? "rgba(220,38,38,0.3)" : "rgba(34,197,94,0.3)"}`,
          }}
        >
          {notice}
        </p>
      )}

      {loadingOptions ? (
        <p style={{ color: "#8b8da3", fontSize: "13px", marginTop: "12px" }}>
          Cargando opciones...
        </p>
      ) : (
        <form className="product-form" onSubmit={submit}>
          <input
            type="text"
            placeholder="Título *"
            value={form.nombre}
            onChange={(e) => update("nombre", e.target.value)}
            required
          />

          <select
            value={form.id_autor}
            onChange={(e) => update("id_autor", e.target.value)}
            required
          >
            <option value="">Autor *</option>
            {authors.map((a) => (
              <option key={a.id} value={a.id}>
                {a.nombre}
              </option>
            ))}
          </select>

          <select
            value={form.id_editorial}
            onChange={(e) => update("id_editorial", e.target.value)}
            required
          >
            <option value="">Editorial *</option>
            {editorials.map((e) => (
              <option key={e.id} value={e.id}>
                {e.nombre}
              </option>
            ))}
          </select>

          <select
            value={form.id_categoria}
            onChange={(e) => update("id_categoria", e.target.value)}
            required
          >
            <option value="">Categoría *</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </select>

          <select
            value={form.id_tipo}
            onChange={(e) => update("id_tipo", e.target.value)}
            required
          >
            <option value="">Tipo *</option>
            {types.map((t) => (
              <option key={t.id} value={t.id}>
                {t.nombre}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Año de publicación *"
            min="1000"
            max="2035"
            value={form.fecha_publicacion}
            onChange={(e) => update("fecha_publicacion", e.target.value)}
            required
          />

          <input
            type="number"
            placeholder="Precio"
            min="0"
            step="1000"
            value={form.precio}
            onChange={(e) => update("precio", e.target.value)}
          />

          <input
            type="number"
            placeholder="Stock"
            min="0"
            value={form.existencias}
            onChange={(e) => update("existencias", e.target.value)}
          />

          {/* Upload imagen */}
          <div
            className="img-upload-area"
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            style={{ gridColumn: "1 / -1" }}
          >
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Preview"
                style={{
                  width: "100%",
                  maxHeight: "160px",
                  objectFit: "contain",
                  borderRadius: "8px",
                }}
              />
            ) : (
              <>
                <ImagePlus size={28} color="#a8a4e6" />
                <span>Haz clic o arrastra una imagen aquí</span>
                <small style={{ color: "#6b6d80" }}>
                  JPG, PNG, WEBP — se sube a Supabase
                </small>
              </>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleImageChange}
          />

          <button
            className="primary-action"
            type="submit"
            disabled={submitting}
            style={{
              opacity: submitting ? 0.6 : 1,
              cursor: submitting ? "not-allowed" : "pointer",
            }}
          >
            {submitting ? "Guardando..." : "Agregar producto"}
          </button>
        </form>
      )}
    </section>
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
  const inputType =
    mode === "week" ? "week" : mode === "month" ? "month" : "number";
  const placeholder =
    mode === "year" ? "Ano" : mode === "month" ? "Mes" : "Semana";
  return (
    <div className="date-range-filter">
      <select
        value={mode}
        onChange={(event) => onModeChange(event.target.value)}
      >
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
