import { useEffect, useState } from "react";
import {
  BarChart3,
  BookOpen,
  ClipboardList,
  LayoutGrid,
  LogOut,
  ShoppingBag,
  User,
} from "lucide-react";

function Navbar({
  totalItems,
  onCartClick,
  onAuthClick,
  session,
  activeView,
  onViewChange,
  onLogout,
}) {
  const [scrolled, setScrolled] = useState(false);
  const [navHovered, setNavHovered] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = session
    ? session.rol === "empleado"
      ? [
          { id: "admin", label: "Admin", icon: <BarChart3 size={14} /> },
          { id: "catalog", label: "Catalogo", icon: <LayoutGrid size={14} /> },
        ]
      : [
          { id: "catalog", label: "Catalogo", icon: <BookOpen size={14} /> },
          {
            id: "clientReport",
            label: "Mis pedidos",
            icon: <ClipboardList size={14} />,
          },
        ]
    : [{ id: "catalog", label: "Catalogo", icon: <BookOpen size={14} /> }];

  return (
    <div
      style={{
        position: "fixed",
        top: "14px",
        left: "24px",
        right: "24px",
        zIndex: 50,
      }}
    >
      <nav
        onMouseEnter={() => setNavHovered(true)}
        onMouseLeave={() => setNavHovered(false)}
        style={{
          minHeight: "56px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px",
          padding: "8px 1.5rem",
          borderRadius: "28px",
          background: navHovered
            ? "rgba(83,74,183,0.18)"
            : scrolled
              ? "rgba(15,14,23,0.82)"
              : "rgba(15,14,23,0.55)",
          backdropFilter: "blur(16px)",
          border: navHovered
            ? "0.5px solid rgba(83,74,183,0.5)"
            : "0.5px solid rgba(255,255,255,0.08)",
          boxShadow: navHovered
            ? "0 0 30px rgba(83,74,183,0.15)"
            : "0 4px 24px rgba(0,0,0,0.3)",
          transition: "all 0.35s ease",
          flexWrap: "wrap",
        }}
      >
        <button
          onClick={() => onViewChange("catalog")}
          style={{
            fontSize: "17px",
            fontWeight: "700",
            background: "linear-gradient(135deg, #fffffe, #a8a4e6)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            border: "none",
            cursor: "pointer",
            fontFamily: "inherit",
            minWidth: "100px",
            textAlign: "left",
          }}
        >
          Centauri
        </button>

        <div className="nav-links">
          {links.map((link) => {
            const active = activeView === link.id;
            return (
              <button
                key={link.id}
                onClick={() => onViewChange(link.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "7px",
                  padding: "7px 18px",
                  borderRadius: "100px",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "13px",
                  fontFamily: "inherit",
                  fontWeight: active ? "600" : "400",
                  background: active ? "rgba(83,74,183,0.45)" : "transparent",
                  color: active ? "#fffffe" : "#a7a9be",
                  transition: "all 0.25s ease",
                }}
              >
                {link.icon}
                {link.label}
              </button>
            );
          })}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            justifyContent: "flex-end",
          }}
        >
          <button
            onClick={session ? onLogout : onAuthClick}
            title={session ? "Cerrar sesion" : "Login simulado"}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "7px",
              background: "transparent",
              border: "0.5px solid rgba(255,255,255,0.15)",
              borderRadius: "100px",
              padding: "7px 14px",
              cursor: "pointer",
              fontSize: "13px",
              color: "#a7a9be",
              fontFamily: "inherit",
              transition: "all 0.2s",
              maxWidth: "190px",
            }}
          >
            {session ? <LogOut size={13} /> : <User size={13} />}
            <span className="session-name">
              {session ? session.nombre : "Login"}
            </span>
          </button>

          {session?.rol !== "empleado" && (
            <button
              onClick={onCartClick}
              title="Abrir carrito"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "7px",
                background: "rgba(83,74,183,0.2)",
                border: "0.5px solid rgba(83,74,183,0.45)",
                borderRadius: "100px",
                padding: "7px 14px",
                cursor: "pointer",
                fontSize: "13px",
                color: "#fffffe",
                position: "relative",
                transition: "all 0.2s",
                fontFamily: "inherit",
              }}
            >
              <ShoppingBag size={14} />
              Carrito
              {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
            </button>
          )}
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
