import { CheckCircle2, Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { formatCurrency } from "../data/books";

function CartPanel({
  open,
  onClose,
  cart,
  onRemove,
  onQtyChange,
  onCheckout,
  onCancel,
  session,
}) {
  const total = cart.reduce((sum, item) => sum + item.precio * item.qty, 0);

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.6)",
          backdropFilter: "blur(4px)",
          zIndex: 99,
          opacity: open ? 1 : 0,
          pointerEvents: open ? "all" : "none",
          transition: "opacity 0.3s",
        }}
      />

      <aside
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          width: "min(460px, 100vw)",
          height: "100%",
          background: "#13121f",
          borderLeft: "0.5px solid rgba(83,74,183,0.2)",
          zIndex: 100,
          transform: open ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "1.5rem",
            borderBottom: "0.5px solid rgba(255,255,255,0.06)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <ShoppingBag size={18} color="#a8a4e6" />
            <div>
              <h2 style={{ fontSize: "17px", fontWeight: "700" }}>
                Registro de compras
              </h2>
              <p style={{ color: "#6b6d80", fontSize: "12px" }}>
                {session ? session.nombre : "Cliente invitado"}
              </p>
            </div>
          </div>
          <button className="icon-button" onClick={onClose} title="Cerrar">
            <X size={14} />
          </button>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "1rem 1.5rem" }}>
          {cart.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "4rem 0",
                color: "#6b6d80",
              }}
            >
              <ShoppingBag
                size={40}
                style={{ margin: "0 auto 1rem", opacity: 0.3 }}
              />
              <p style={{ fontSize: "14px" }}>Tu carrito esta vacio</p>
            </div>
          ) : (
            <div style={{ display: "grid", gap: "12px" }}>
              {cart.map((item) => (
                <div key={item.id} className="cart-line">
                  <img src={item.img} alt={item.nombre} />
                  <div style={{ minWidth: 0 }}>
                    <strong>{item.nombre}</strong>
                    <span>{item.autor}</span>
                    <p>{formatCurrency(item.precio)}</p>
                  </div>
                  <div className="cart-actions">
                    <div className="qty-control">
                      <button
                        onClick={() => onQtyChange(item.id, item.qty - 1)}
                        title="Reducir cantidad"
                      >
                        <Minus size={13} />
                      </button>
                      <input
                        aria-label={`Cantidad de ${item.nombre}`}
                        type="number"
                        min="1"
                        max={item.existencias}
                        value={item.qty}
                        onChange={(event) =>
                          onQtyChange(item.id, Number(event.target.value))
                        }
                      />
                      <button
                        onClick={() => onQtyChange(item.id, item.qty + 1)}
                        disabled={item.qty >= item.existencias}
                        title="Aumentar cantidad"
                      >
                        <Plus size={13} />
                      </button>
                    </div>
                    <strong>{formatCurrency(item.precio * item.qty)}</strong>
                    <button
                      className="delete-button"
                      onClick={() => onRemove(item.id)}
                      title="Eliminar"
                    >
                      <Trash2 size={14} />
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div
            style={{
              padding: "1.5rem",
              borderTop: "0.5px solid rgba(255,255,255,0.06)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "1rem",
                alignItems: "baseline",
              }}
            >
              <span style={{ fontSize: "13px", color: "#a7a9be" }}>Total</span>
              <span
                style={{
                  fontSize: "22px",
                  fontWeight: "700",
                  background: "linear-gradient(135deg, #fffffe, #a8a4e6)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {formatCurrency(total)}
              </span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              <button className="secondary-action" onClick={onCancel}>
                Cancelar
              </button>
              <button className="primary-action" onClick={onCheckout}>
                <CheckCircle2 size={16} />
                Finalizar
              </button>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}

export default CartPanel;
