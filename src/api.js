const BASE_URL = "https://centauri-backend.onrender.com";

const api = async (endpoint, options = {}) => {
  try {
    const isFormData = options.body instanceof FormData;

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      credentials: "include",
      headers: isFormData
        ? { ...options.headers }
        : {
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

export const getCart = () => api("/api/carts");

export const addToCart = (idProducto, cantidad) =>
  api(`/api/carts/${idProducto}`, {
    method: "POST",
    body: JSON.stringify({ cantidad }),
  });

export const removeFromCart = (idProducto) =>
  api(`/api/carts/${idProducto}`, { method: "DELETE" });

export const createOrder = () => api("/api/orders", { method: "POST" });

export const getOrders = () => api("/api/orders");

export const getEmployeeOrders = () => api("/api/orders/employee");

export const updateOrderStatus = (idPedido, idEstado, idEmpleado) =>
  api(`/api/orders/${idPedido}/status`, {
    method: "PATCH",
    body: JSON.stringify({ id_estado: idEstado, id_empleado: idEmpleado }),
  });

export const getAuthors = () => api("/api/authors");
export const getEditorials = () => api("/api/editorials");
export const getCategories = () => api("/api/categories");
export const getTypes = () => api("/api/types");

export const createProduct = (formData) =>
  api("/api/products", {
    method: "POST",
    body: formData,
  });

export const updateProduct = (id, data) =>
  api(`/api/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
