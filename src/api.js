const BASE_URL = "https://centauri-backend.onrender.com";

const api = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error en la solicitud");
    }

    return await response.json();
  } catch (error) {
    // Si es error de base de datos, reintenta una vez
    if (error.message?.includes("Base de datos no disponible")) {
      return api(endpoint, options);
    }
    throw error;
  }
};

export const login = (usuario, clave) =>
  api("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ correo: usuario, clave }),
  });

export const registro = (datos) =>
  api("/api/auth/registro", {
    method: "POST",
    body: JSON.stringify(datos),
  });

export const getProducts = (filtros = {}) => {
  const params = new URLSearchParams(filtros).toString();
  return api(`/api/products${params ? "?" + params : ""}`);
};

export const getProductById = (id) => api(`/api/products/${id}`);

export const getCart = () => api("/api/cart");

export const addToCart = (idProducto) =>
  api(`/api/cart/${idProducto}`, { method: "POST" });

export const removeFromCart = (idProducto) =>
  api(`/api/cart/${idProducto}`, { method: "DELETE" });

export const createOrder = () => api("/api/orders", { method: "POST" });
