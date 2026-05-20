import { useState } from "react";
import { LockKeyhole, Mail, ShieldCheck, UserRound, X } from "lucide-react";
import { login } from "../api";

const testAccess = {
  cliente: {
    user: "cliente@centauri.com",
    password: "cliente123",
  },
  empleado: {
    user: "admin@centauri.com",
    password: "admin123",
  },
};

function AuthModal({ open, onClose, onLogin }) {
  const [forms, setForms] = useState(testAccess);
  const [error, setError] = useState("");

  if (!open) return null;

  const updateField = (role, field, value) => {
    setForms((previous) => ({
      ...previous,
      [role]: {
        ...previous[role],
        [field]: value,
      },
    }));
    setError("");
  };

  const handleLogin = async (event, role) => {
    event.preventDefault();
    setError("");

    try {
      const user = await login(forms[role].user, forms[role].password);
      const rolUsuario = user.id_empleado ? "empleado" : "cliente";
      if (rolUsuario !== role) {
        setError("Las credenciales no corresponden a este tipo de usuario.");
        return;
      }

      onLogin(user);
      onClose();
    } catch (error) {
      setError(error.message || "Usuario o contrasena incorrectos.");
    }
  };

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.7)",
          backdropFilter: "blur(6px)",
          zIndex: 200,
          animation: "fadeIn 0.2s ease",
        }}
      />

      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 201,
          width: "min(760px, calc(100vw - 32px))",
          maxHeight: "calc(100vh - 40px)",
          overflowY: "auto",
          background: "rgba(18,16,32,0.98)",
          border: "0.5px solid rgba(83,74,183,0.3)",
          borderRadius: "16px",
          padding: "2rem",
          boxShadow:
            "0 24px 80px rgba(0,0,0,0.6), 0 0 40px rgba(83,74,183,0.1)",
          animation: "modalIn 0.3s cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        <style>{`
          @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
          @keyframes modalIn { from { opacity: 0; transform: translate(-50%, -48%) scale(0.96) } to { opacity: 1; transform: translate(-50%, -50%) scale(1) } }
        `}</style>

        <button
          className="icon-button"
          onClick={onClose}
          title="Cerrar"
          style={{ position: "absolute", right: "18px", top: "18px" }}
        >
          <X size={14} />
        </button>

        <p
          style={{
            fontSize: "11px",
            letterSpacing: "0.15em",
            color: "#534AB7",
            textTransform: "uppercase",
            marginBottom: "8px",
            fontWeight: "500",
          }}
        >
          Login simulado
        </p>
        <h2
          style={{
            fontSize: "24px",
            fontWeight: "700",
            marginBottom: "8px",
            background: "linear-gradient(135deg, #fffffe, #a8a4e6)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Escoge una vista de prueba
        </h2>
        <p style={{ color: "#a7a9be", fontSize: "14px", marginBottom: "22px" }}>
          Ingresa usuario y contrasena para probar como cliente o empleado.
        </p>

        {error && (
          <div
            style={{
              color: "#fca5a5",
              background: "rgba(248,113,113,0.1)",
              border: "0.5px solid rgba(248,113,113,0.25)",
              borderRadius: "10px",
              padding: "10px 12px",
              fontSize: "12px",
              marginBottom: "12px",
            }}
          >
            {error}
          </div>
        )}

        <div className="auth-role-grid">
          <form
            className="role-card login-card"
            onSubmit={(event) => handleLogin(event, "cliente")}
          >
            <UserRound size={22} />
            <span>
              <strong>Cliente</strong>
              <small>Usuario de compras y pedidos propios.</small>
            </span>
            <LoginField
              icon={<Mail size={14} />}
              label="Usuario cliente"
              type="email"
              value={forms.cliente.user}
              onChange={(value) => updateField("cliente", "user", value)}
            />
            <LoginField
              icon={<LockKeyhole size={14} />}
              label="Contrasena cliente"
              type="password"
              value={forms.cliente.password}
              onChange={(value) => updateField("cliente", "password", value)}
            />
            <button className="primary-action" type="submit">
              Entrar como cliente
            </button>
          </form>

          <form
            className="role-card login-card"
            onSubmit={(event) => handleLogin(event, "empleado")}
          >
            <ShieldCheck size={22} />
            <span>
              <strong>Empleado</strong>
              <small>
                Usuario con panel administrativo y carga de productos.
              </small>
            </span>
            <LoginField
              icon={<Mail size={14} />}
              label="Usuario empleado"
              type="email"
              value={forms.empleado.user}
              onChange={(value) => updateField("empleado", "user", value)}
            />
            <LoginField
              icon={<LockKeyhole size={14} />}
              label="Contrasena empleado"
              type="password"
              value={forms.empleado.password}
              onChange={(value) => updateField("empleado", "password", value)}
            />
            <button className="primary-action" type="submit">
              Entrar como empleado
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

function LoginField({ icon, label, type, value, onChange }) {
  return (
    <label className="login-field">
      <span>{label}</span>
      <div>
        {icon}
        <input
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      </div>
    </label>
  );
}

export default AuthModal;
