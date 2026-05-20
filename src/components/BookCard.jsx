import { useState } from "react";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import { formatCurrency } from "../data/books";

function BookCard({ book, onAdd, onRemove, qty = 0 }) {
  const [hovered, setHovered] = useState(false);
  const [imgError, setImgError] = useState(false);
  const available = book.existencias > 0;
  const atStockLimit = qty >= book.existencias;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? "rgba(83,74,183,0.08)" : "rgba(255,255,255,0.03)",
        border: hovered
          ? "0.5px solid rgba(83,74,183,0.4)"
          : "0.5px solid rgba(255,255,255,0.07)",
        borderRadius: "16px",
        overflow: "hidden",
        transition: "all 0.3s ease",
        transform: hovered ? "translateY(-6px)" : "translateY(0)",
        cursor: "default",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ position: "relative", overflow: "hidden" }}>
        {!imgError ? (
          <img
            src={book.img}
            alt={book.nombre}
            onError={() => setImgError(true)}
            style={{
              width: "100%",
              aspectRatio: "2/3",
              objectFit: "cover",
              display: "block",
              transition: "transform 0.5s ease",
              transform: hovered ? "scale(1.05)" : "scale(1)",
              filter: available ? "none" : "grayscale(0.8) brightness(0.7)",
            }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              aspectRatio: "2/3",
              background: "linear-gradient(135deg, #1a1830, #2e2d3d)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "3rem",
              color: "#534AB7",
            }}
          >
            {book.nombre[0]}
          </div>
        )}

        <div className="category-pill">{book.categoria}</div>
        <div className={available ? "stock-pill" : "stock-pill empty"}>
          {available ? `${book.existencias} disponibles` : "Agotado"}
        </div>
      </div>

      <div
        style={{
          padding: "16px",
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            fontSize: "14px",
            fontWeight: "600",
            marginBottom: "4px",
            lineHeight: "1.4",
            color: "#fffffe",
          }}
        >
          {book.nombre}
        </div>
        <div
          style={{ fontSize: "12px", color: "#a7a9be", marginBottom: "2px" }}
        >
          {book.autor}
        </div>
        <div
          style={{ fontSize: "11px", color: "#6b6d80", marginBottom: "12px" }}
        >
          {book.editorial} / {book.anio}
        </div>

        <div
          style={{
            marginTop: "auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "10px",
          }}
        >
          <span
            style={{
              fontSize: "16px",
              fontWeight: "700",
              background: "linear-gradient(135deg, #fffffe, #a8a4e6)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {formatCurrency(book.precio)}
          </span>

          {qty > 0 ? (
            <div className="qty-control">
              <button onClick={() => onRemove(book.id)} title="Quitar unidad">
                <Minus size={13} />
              </button>
              <strong>{qty}</strong>
              <button
                onClick={() => onAdd(book)}
                disabled={atStockLimit}
                title="Agregar unidad"
              >
                <Plus size={13} />
              </button>
            </div>
          ) : (
            <button
              disabled={!available}
              onClick={() => onAdd(book)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                background: available
                  ? "rgba(83,74,183,0.2)"
                  : "rgba(255,255,255,0.05)",
                border: available
                  ? "0.5px solid rgba(83,74,183,0.5)"
                  : "0.5px solid rgba(255,255,255,0.08)",
                borderRadius: "100px",
                padding: "7px 13px",
                fontSize: "12px",
                color: available ? "#a8a4e6" : "#6b6d80",
                cursor: available ? "pointer" : "not-allowed",
                fontFamily: "inherit",
                fontWeight: "500",
                transition: "all 0.3s ease",
                whiteSpace: "nowrap",
              }}
            >
              <ShoppingCart size={13} />
              Agregar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default BookCard;
