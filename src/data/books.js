export const tipos = [
  { id: 1, nombre: "Libro" },
  { id: 2, nombre: "Revista" },
  { id: 3, nombre: "Comic" },
];

export const autores = [
  { id: 1, nombre: "Gabriel Garcia Marquez" },
  { id: 2, nombre: "Antoine de Saint-Exupery" },
  { id: 3, nombre: "Stan Lee" },
  { id: 4, nombre: "Isabel Allende" },
  { id: 5, nombre: "Yuval Noah Harari" },
  { id: 6, nombre: "Hayao Miyazaki" },
  { id: 7, nombre: "Sally Rooney" },
  { id: 8, nombre: "National Geographic" },
];

export const editoriales = [
  { id: 1, nombre: "Sudamericana" },
  { id: 2, nombre: "Gallimard" },
  { id: 3, nombre: "Panini" },
  { id: 4, nombre: "Plaza & Janes" },
  { id: 5, nombre: "Debate" },
  { id: 6, nombre: "Planeta Comic" },
  { id: 7, nombre: "Random House" },
  { id: 8, nombre: "NG Books" },
];

export const categorias = [
  { id: 1, nombre: "Novela" },
  { id: 2, nombre: "Infantil" },
  { id: 3, nombre: "Comics" },
  { id: 4, nombre: "Historia" },
  { id: 5, nombre: "Revistas" },
  { id: 6, nombre: "Ensayo" },
];

export const usuarios = [
  {
    id: 1,
    nombre: "Laura Martinez",
    correo: "cliente@centauri.com",
    rol: "cliente",
  },
  {
    id: 2,
    nombre: "Andres Rojas",
    correo: "andres@centauri.com",
    rol: "cliente",
  },
  {
    id: 3,
    nombre: "Camila Torres",
    correo: "admin@centauri.com",
    rol: "empleado",
  },
];

export const clientes = [
  {
    id: 1,
    id_usuario: 1,
    cedula: "1012456789",
    direccion: "Calle 45 # 12-30, Bogota",
    activo: true,
    fecha_eliminacion: null,
  },
  {
    id: 2,
    id_usuario: 2,
    cedula: "79888444",
    direccion: "Carrera 11 # 82-34, Bogota",
    activo: true,
    fecha_eliminacion: null,
  },
];

export const empleados = [
  {
    id: 1,
    id_usuario: 3,
    cedula: "52999111",
    activo: true,
    fecha_terminacion: null,
  },
];

export const estados = [
  { id: 1, nombre: "solicitado" },
  { id: 2, nombre: "cancelado" },
];

export const books = [
  {
    id: 1,
    id_tipo: 1,
    id_autor: 1,
    id_editorial: 1,
    id_categoria: 1,
    nombre: "Cien anos de soledad",
    autor: "Gabriel Garcia Marquez",
    editorial: "Sudamericana",
    categoria: "Novela",
    anio: 1967,
    precio: 42000,
    existencias: 8,
    img: "https://nidodelibros.com/wp-content/uploads/2024/03/9786287641587-scaled.jpeg",
  },
  {
    id: 2,
    id_tipo: 1,
    id_autor: 2,
    id_editorial: 2,
    id_categoria: 2,
    nombre: "El principito",
    autor: "Antoine de Saint-Exupery",
    editorial: "Gallimard",
    categoria: "Infantil",
    anio: 1943,
    precio: 28000,
    existencias: 14,
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtuTw1qacT5NY3_UTUG0NFuDntwxyCQKQGcw&s",
  },
  {
    id: 3,
    id_tipo: 3,
    id_autor: 3,
    id_editorial: 3,
    id_categoria: 3,
    nombre: "Spider-Man: Azul",
    autor: "Stan Lee",
    editorial: "Panini",
    categoria: "Comics",
    anio: 2002,
    precio: 36000,
    existencias: 6,
    img: "https://m.media-amazon.com/images/I/81ifgI2d9LL._UF1000,1000_QL80_.jpg",
  },
  {
    id: 4,
    id_tipo: 1,
    id_autor: 4,
    id_editorial: 4,
    id_categoria: 1,
    nombre: "La casa de los espiritus",
    autor: "Isabel Allende",
    editorial: "Plaza & Janes",
    categoria: "Novela",
    anio: 1982,
    precio: 39000,
    existencias: 0,
    img: "https://images.cdn2.buscalibre.com/fit-in/360x360/9b/7a/9b7ad562ca37afb3d8f3712ab13c50e5.jpg",
  },
  {
    id: 5,
    id_tipo: 1,
    id_autor: 5,
    id_editorial: 5,
    id_categoria: 4,
    nombre: "Sapiens",
    autor: "Yuval Noah Harari",
    editorial: "Debate",
    categoria: "Historia",
    anio: 2011,
    precio: 58000,
    existencias: 9,
    img: "https://images.cdn2.buscalibre.com/fit-in/360x360/8d/c1/8dc1e0a3e995a7185d63074f8613c13b.jpg",
  },
  {
    id: 6,
    id_tipo: 3,
    id_autor: 6,
    id_editorial: 6,
    id_categoria: 3,
    nombre: "Nausicaa del Valle del Viento",
    autor: "Hayao Miyazaki",
    editorial: "Planeta Comic",
    categoria: "Comics",
    anio: 1982,
    precio: 65000,
    existencias: 4,
    img: "https://images.cdn1.buscalibre.com/fit-in/360x360/71/4c/714cd806368b0b626348430fded6a81f.jpg",
  },
  {
    id: 7,
    id_tipo: 1,
    id_autor: 7,
    id_editorial: 7,
    id_categoria: 6,
    nombre: "Intermezzo",
    autor: "Sally Rooney",
    editorial: "Random House",
    categoria: "Ensayo",
    anio: 2024,
    precio: 52000,
    existencias: 11,
    img: "https://images.cdn2.buscalibre.com/fit-in/360x360/d2/df/d2df393b84a267419207ac365186eea8.jpg",
  },
  {
    id: 8,
    id_tipo: 2,
    id_autor: 8,
    id_editorial: 8,
    id_categoria: 5,
    nombre: "National Geographic: Oceanos",
    autor: "National Geographic",
    editorial: "NG Books",
    categoria: "Revistas",
    anio: 2025,
    precio: 24000,
    existencias: 18,
    img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=700&q=80",
  },
];

export const pedidos = [
  {
    id: 1,
    precio: 112000,
    cantidad_productos: 3,
    fecha_pedido: "2026-03-12",
    id_cliente: 1,
    id_empleado: 1,
    id_estado: 1,
  },
  {
    id: 2,
    precio: 65000,
    cantidad_productos: 1,
    fecha_pedido: "2026-03-29",
    id_cliente: 1,
    id_empleado: 1,
    id_estado: 2,
  },
  {
    id: 3,
    precio: 154000,
    cantidad_productos: 4,
    fecha_pedido: "2026-04-07",
    id_cliente: 2,
    id_empleado: 1,
    id_estado: 1,
  },
  {
    id: 4,
    precio: 76000,
    cantidad_productos: 2,
    fecha_pedido: "2026-04-24",
    id_cliente: 1,
    id_empleado: 1,
    id_estado: 1,
  },
  {
    id: 5,
    precio: 106000,
    cantidad_productos: 2,
    fecha_pedido: "2026-05-06",
    id_cliente: 2,
    id_empleado: 1,
    id_estado: 1,
  },
];

export const detallesPedidos = [
  { id: 1, id_pedido: 1, id_producto: 1, cantidad: 1, precio: 42000 },
  { id: 2, id_pedido: 1, id_producto: 2, cantidad: 1, precio: 28000 },
  { id: 3, id_pedido: 1, id_producto: 3, cantidad: 1, precio: 36000 },
  { id: 4, id_pedido: 2, id_producto: 6, cantidad: 1, precio: 65000 },
  { id: 5, id_pedido: 3, id_producto: 5, cantidad: 2, precio: 58000 },
  { id: 6, id_pedido: 3, id_producto: 8, cantidad: 1, precio: 24000 },
  { id: 7, id_pedido: 3, id_producto: 2, cantidad: 1, precio: 28000 },
  { id: 8, id_pedido: 4, id_producto: 3, cantidad: 1, precio: 36000 },
  { id: 9, id_pedido: 4, id_producto: 4, cantidad: 1, precio: 40000 },
  { id: 10, id_pedido: 5, id_producto: 7, cantidad: 1, precio: 52000 },
  { id: 11, id_pedido: 5, id_producto: 8, cantidad: 1, precio: 24000 },
  { id: 12, id_pedido: 5, id_producto: 2, cantidad: 1, precio: 30000 },
];

export const formatCurrency = (value) =>
  "$" + Number(value || 0).toLocaleString("es-CO");

export const formatDate = (date) =>
  new Date(`${date}T00:00:00`).toLocaleDateString("es-CO", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });

export const getSessionUser = (role) => {
  if (role === "empleado") {
    const empleado = empleados[0];
    return { ...usuarios.find((u) => u.id === empleado.id_usuario), empleado };
  }

  const cliente = clientes[0];
  return { ...usuarios.find((u) => u.id === cliente.id_usuario), cliente };
};
