import { useEffect, useMemo, useState } from "react";
import AdminPanel from "./components/AdminPanel";
import AuthModal from "./components/AuthModal";
import BookGrid from "./components/BookGrid";
import CartPanel from "./components/CartPanel";
import CatalogFilters from "./components/CatalogFilters";
import ClientReport from "./components/ClientReport";
import Hero from "./components/Hero";
import Navbar from "./components/Navbar";
import SearchBar from "./components/SearchBar";
import StarField from "./components/StarField";
import {
  categorias,
  clientes,
  detallesPedidos,
  estados,
  formatCurrency,
  pedidos,
  usuarios,
} from "./data/books";
import { getProducts } from "./api";

const initialPriceBounds = { min: 0, max: 100000 };

const getDefaultFilters = (bounds = initialPriceBounds) => ({
  category: "",
  minPrice: bounds.min,
  maxPrice: bounds.max,
  availableOnly: false,
});

const defaultAdminFilters = {
  search: "",
  dateMode: "",
  dateValue: "",
  category: "",
  client: "",
};

const defaultClientFilters = {
  search: "",
  dateMode: "",
  dateValue: "",
  category: "",
  status: "",
};

function App() {
  const [catalogBooks, setCatalogBooks] = useState([]);
  const [cart, setCart] = usePersistentState("centauri_cart", []);
  const [session, setSession] = usePersistentState("centauri_session", null);
  const [orders, setOrders] = usePersistentState("centauri_orders", pedidos);
  const [orderDetails, setOrderDetails] = usePersistentState(
    "centauri_order_details",
    detallesPedidos,
  );
  const [cartOpen, setCartOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState(() =>
    getDefaultFilters(initialPriceBounds),
  );
  const [adminFilters, setAdminFilters] = useState(defaultAdminFilters);
  const [clientFilters, setClientFilters] = useState(defaultClientFilters);
  const [adminPage, setAdminPage] = useState(1);
  const [activeView, setActiveView] = useState(getInitialView);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    getProducts()
      .then((res) => {
        const normalized = res.data.map((p) => ({
          id: p.id,
          nombre: p.nombre,
          autor: p.autor.nombre,
          editorial: p.editorial.nombre,
          categoria: p.categoria.nombre,
          precio: p.precio,
          existencias: p.existencias,
          img:
            p.imagen && p.imagen !== "none"
              ? `https://uvbncfsifguddloeabsu.supabase.co/storage/v1/object/public/Centauri-books/${p.imagen}`
              : "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=700&q=80",
        }));
        setCatalogBooks(normalized);
      })
      .catch(console.error);
  }, [session]);

  const priceBounds = useMemo(
    () => ({
      min: catalogBooks.length
        ? Math.min(...catalogBooks.map((b) => b.precio))
        : 0,
      max: catalogBooks.length
        ? Math.max(...catalogBooks.map((b) => b.precio))
        : 100000,
    }),
    [catalogBooks],
  );

  const filteredBooks = useMemo(() => {
    return catalogBooks.filter((book) => {
      const text =
        `${book.nombre} ${book.autor} ${book.editorial}`.toLowerCase();
      const matchesText = text.includes(query.toLowerCase());
      const matchesCategory =
        !filters.category || book.categoria === filters.category;
      const matchesPrice =
        book.precio >= Number(filters.minPrice || 0) &&
        book.precio <= Number(filters.maxPrice || priceBounds.max);
      const matchesStock = !filters.availableOnly || book.existencias > 0;
      return matchesText && matchesCategory && matchesPrice && matchesStock;
    });
  }, [catalogBooks, filters, priceBounds.max, query]);

  const enrichedOrders = useMemo(
    () => buildOrderRows(orders, orderDetails, catalogBooks),
    [catalogBooks, orders, orderDetails],
  );

  const adminRows = useMemo(() => {
    const search = adminFilters.search.toLowerCase();
    const client = adminFilters.client.toLowerCase();
    return enrichedOrders.filter((row) => {
      const isSolicited = row.estado === "solicitado";
      const matchesSearch =
        !search ||
        `${row.producto} ${row.cliente} ${row.categoria} ${row.id_producto}`
          .toLowerCase()
          .includes(search);
      const matchesDate = matchesDateRange(
        row.fecha,
        adminFilters.dateMode,
        adminFilters.dateValue,
      );
      const matchesCategory =
        !adminFilters.category || row.categoria === adminFilters.category;
      const matchesClient =
        !client ||
        `${row.cliente} ${row.id_cliente}`.toLowerCase().includes(client);
      return (
        isSolicited &&
        matchesSearch &&
        matchesDate &&
        matchesCategory &&
        matchesClient
      );
    });
  }, [adminFilters, enrichedOrders]);

  const adminChart = useMemo(
    () => summarizeByCategory(adminRows, "valor", catalogBooks),
    [adminRows, catalogBooks],
  );

  const clientRows = useMemo(() => {
    if (!session?.id_cliente) return [];
    const search = clientFilters.search.toLowerCase();
    return enrichedOrders.filter((row) => {
      const isOwnOrder = row.id_cliente === session.id_cliente;
      const matchesSearch =
        !search ||
        `${row.producto} ${row.categoria} ${row.id_producto} ${row.id_pedido}`
          .toLowerCase()
          .includes(search);
      const matchesDate = matchesDateRange(
        row.fecha,
        clientFilters.dateMode,
        clientFilters.dateValue,
      );
      const matchesCategory =
        !clientFilters.category || row.categoria === clientFilters.category;
      const matchesStatus =
        !clientFilters.status || row.estado === clientFilters.status;
      return (
        isOwnOrder &&
        matchesSearch &&
        matchesDate &&
        matchesCategory &&
        matchesStatus
      );
    });
  }, [clientFilters, enrichedOrders, session]);

  const clientChart = useMemo(() => {
    if (!session?.id_cliente) return [];
    return summarizeByCategory(clientRows, "valor", catalogBooks);
  }, [catalogBooks, clientRows, session]);

  const addToCart = (book) => {
    if (session?.rol === "empleado") {
      showNotice("El carrito esta disponible para clientes.");
      return;
    }
    setCart((previous) => {
      const existing = previous.find((item) => item.id === book.id);
      if (existing) {
        if (existing.qty >= book.existencias) {
          showNotice("No hay mas existencias para este producto.");
          return previous;
        }
        return previous.map((item) =>
          item.id === book.id ? { ...item, qty: item.qty + 1 } : item,
        );
      }
      return [...previous, { ...book, qty: 1 }];
    });
  };

  const removeOne = (id) => {
    setCart((previous) => {
      const existing = previous.find((item) => item.id === id);
      if (!existing) return previous;
      if (existing.qty === 1) return previous.filter((item) => item.id !== id);
      return previous.map((item) =>
        item.id === id ? { ...item, qty: item.qty - 1 } : item,
      );
    });
  };

  const updateQuantity = (id, quantity) => {
    setCart((previous) =>
      previous.flatMap((item) => {
        if (item.id !== id) return [item];
        const nextQty = Math.max(
          0,
          Math.min(Number(quantity) || 0, item.existencias),
        );
        return nextQty === 0 ? [] : [{ ...item, qty: nextQty }];
      }),
    );
  };

  const removeFromCart = (id) =>
    setCart((previous) => previous.filter((item) => item.id !== id));

  const cancelCart = () => {
    setCart([]);
    setCartOpen(false);
    showNotice("Carrito cancelado y limpiado.");
  };

  const checkout = () => {
    if (!session?.id_cliente) {
      showNotice("Inicia sesion como cliente para finalizar.");
      setAuthOpen(true);
      return;
    }
    if (!cart.length) return;
    const orderId = Math.max(0, ...orders.map((order) => order.id)) + 1;
    const detailStart =
      Math.max(0, ...orderDetails.map((detail) => detail.id)) + 1;
    const total = cart.reduce((sum, item) => sum + item.precio * item.qty, 0);
    const quantity = cart.reduce((sum, item) => sum + item.qty, 0);
    const today = new Date().toISOString().slice(0, 10);

    const newOrder = {
      id: orderId,
      precio: total,
      cantidad_productos: quantity,
      fecha_pedido: today,
      id_cliente: session.id_cliente,
      id_empleado: 1,
      id_estado: 1,
    };

    const newDetails = cart.map((item, index) => ({
      id: detailStart + index,
      id_pedido: orderId,
      id_producto: item.id,
      cantidad: item.qty,
      precio: item.precio,
    }));

    setOrders((previous) => [newOrder, ...previous]);
    setOrderDetails((previous) => [...newDetails, ...previous]);
    setCart([]);
    setCartOpen(false);
    setActiveView("clientReport");
    showNotice(`Pedido solicitado por ${formatCurrency(total)}.`);
  };
  const handleLogin = (user) => {
    const rol = user.id_empleado ? "empleado" : "cliente";
    user.rol = rol;
    setSession(user);
    setCart([]);
    setActiveView(rol === "empleado" ? "admin" : "catalog");
    showNotice(
      rol === "empleado"
        ? "Sesion de empleado activa."
        : "Sesion de cliente activa.",
    );
  };

  const logout = () => {
    setSession(null);
    setCart([]);
    setCatalogBooks([]);
    setActiveView("catalog");
    showNotice("Sesion cerrada.");
  };

  const addProduct = (product) => {
    const normalizedPrice = Number(product.precio) || 0;
    const selectedCategory = categorias.find(
      (c) => c.nombre === product.categoria,
    );
    setCatalogBooks((previous) => [
      {
        ...product,
        id: crypto.randomUUID(),
        id_tipo: 1,
        id_autor: 0,
        id_editorial: 0,
        id_categoria: selectedCategory?.id || 0,
        precio: normalizedPrice,
        anio: Number(product.anio) || new Date().getFullYear(),
        existencias: Number(product.existencias) || 0,
        img:
          product.img ||
          "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=700&q=80",
      },
      ...previous,
    ]);
    setActiveView("catalog");
    showNotice("Producto agregado al catalogo.");
  };

  const showNotice = (message) => {
    setNotice(message);
    window.clearTimeout(showNotice.timer);
    showNotice.timer = window.setTimeout(() => setNotice(""), 3200);
  };

  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  const visibleView =
    (activeView === "clientReport" && !session?.id_cliente) ||
    (activeView === "admin" && session?.rol !== "empleado")
      ? "catalog"
      : activeView;

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        background: "#0f0e17",
        opacity: 1,
      }}
    >
      <StarField />
      <div style={{ position: "relative", zIndex: 1 }}>
        <Navbar
          totalItems={totalItems}
          onCartClick={() => setCartOpen(true)}
          onAuthClick={() => setAuthOpen(true)}
          session={session}
          activeView={visibleView}
          onViewChange={setActiveView}
          onLogout={logout}
        />

        {notice && <div className="toast">{notice}</div>}

        {visibleView === "catalog" && (
          <>
            <Hero session={session} productCount={catalogBooks.length} />
            <SearchBar query={query} setQuery={setQuery} />
            <CatalogFilters
              categories={categorias}
              filters={filters}
              onChange={(field, value) =>
                setFilters((previous) => ({ ...previous, [field]: value }))
              }
              onReset={() => setFilters(getDefaultFilters(priceBounds))}
              priceBounds={priceBounds}
            />
            <BookGrid
              books={filteredBooks}
              onAdd={addToCart}
              onRemove={removeOne}
              cart={cart}
            />
          </>
        )}

        {visibleView === "clientReport" && session?.id_cliente && (
          <ClientReport
            rows={clientRows}
            chartData={clientChart}
            user={session}
            filters={clientFilters}
            onFilterChange={(field, value) =>
              setClientFilters((previous) => ({ ...previous, [field]: value }))
            }
          />
        )}

        {visibleView === "admin" && (
          <AdminPanel
            rows={adminRows}
            chartData={adminChart}
            filters={adminFilters}
            onFilterChange={(field, value) => {
              setAdminPage(1);
              setAdminFilters((previous) => ({ ...previous, [field]: value }));
            }}
            page={adminPage}
            onPageChange={setAdminPage}
            onAddProduct={addProduct}
          />
        )}

        <CartPanel
          open={cartOpen}
          onClose={() => setCartOpen(false)}
          cart={cart}
          onRemove={removeFromCart}
          onQtyChange={updateQuantity}
          onCheckout={checkout}
          onCancel={cancelCart}
          session={session}
        />
        <AuthModal
          open={authOpen}
          onClose={() => setAuthOpen(false)}
          onLogin={handleLogin}
        />
      </div>
    </div>
  );
}

function usePersistentState(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    if (value === null || value === undefined) {
      localStorage.removeItem(key);
      return;
    }
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}

function getInitialView() {
  try {
    const stored = localStorage.getItem("centauri_session");
    const role = stored ? JSON.parse(stored)?.rol : "";
    return role === "empleado" ? "admin" : "catalog";
  } catch {
    return "catalog";
  }
}

function buildOrderRows(orderList, detailList, productList) {
  return detailList
    .map((detail) => {
      const order = orderList.find((item) => item.id === detail.id_pedido);
      const product = productList.find(
        (book) => book.id === detail.id_producto,
      );
      const client = clientes.find((item) => item.id === order?.id_cliente);
      const user = usuarios.find((item) => item.id === client?.id_usuario);
      const state = estados.find((item) => item.id === order?.id_estado);

      return {
        id_pedido: order?.id,
        id_producto: product?.id,
        producto: product?.nombre || "Producto eliminado",
        cliente: user?.nombre || "Cliente sin nombre",
        id_cliente: client?.id || "-",
        categoria: product?.categoria || "Sin categoria",
        valor: detail.precio * detail.cantidad,
        cantidad: detail.cantidad,
        precio_unitario: detail.precio,
        fecha: order?.fecha_pedido || "",
        estado: state?.nombre,
      };
    })
    .sort((a, b) => b.fecha.localeCompare(a.fecha));
}

function summarizeByCategory(rows, valueKey, productList) {
  const totals = rows.reduce((acc, row) => {
    const product = row.id_producto
      ? productList.find((book) => book.id === row.id_producto)
      : null;
    const label = row.categoria || product?.categoria || "Sin categoria";
    const value = valueKey
      ? row[valueKey]
      : (row.precio || 0) * (row.cantidad || 1);
    acc[label] = (acc[label] || 0) + value;
    return acc;
  }, {});

  const data = Object.entries(totals)
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value);

  return data.length ? data : [{ label: "Sin pedidos", value: 1 }];
}

function matchesDateRange(date, mode, value) {
  if (!mode || !value || !date) return true;
  const orderDate = new Date(`${date}T00:00:00`);
  if (mode === "week") {
    const [year, week] = value.split("-W").map(Number);
    if (!year || !week) return true;
    const { start, end } = getWeekBounds(year, week);
    return orderDate >= start && orderDate <= end;
  }
  if (mode === "month") return date.startsWith(value);
  if (mode === "year") return orderDate.getFullYear() === Number(value);
  return true;
}

function getWeekBounds(year, week) {
  const firstThursday = new Date(year, 0, 4);
  const firstThursdayDay = firstThursday.getDay() || 7;
  const start = new Date(firstThursday);
  start.setDate(
    firstThursday.getDate() - firstThursdayDay + 1 + (week - 1) * 7,
  );
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  return { start, end };
}

export default App;
