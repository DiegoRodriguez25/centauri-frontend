import bcrypt from "bcrypt";
import { prisma } from "../prisma.js";
import { AppError } from "../errors/appError.js";

export const login = async (data) => {
  const { correo, clave } = data;

  if (!correo || !clave) {
    throw new AppError("Correo y clave son obligatorios", 400);
  }

  // Buscar usuario por correo
  const usuarioEncontrado = await prisma.usuarios.findFirst({
    where: { correo },
    include: {
      cliente: true,
      empleado: true,
    },
  });

  if (!usuarioEncontrado) {
    throw new AppError("Credenciales inválidas", 401);
  }

  // Verificar clave
  const claveValida = await bcrypt.compare(clave, usuarioEncontrado.clave);

  if (!claveValida) {
    throw new AppError("Credenciales inválidas", 401);
  }

  const esEmpleado = !!usuarioEncontrado.empleado;

  let user = {
    id: usuarioEncontrado.id,
    usuario: usuarioEncontrado.usuario,
    correo: usuarioEncontrado.correo,
    rol: esEmpleado ? "empleado" : "cliente",
    id_cliente: usuarioEncontrado.cliente?.id,
    id_empleado: usuarioEncontrado.empleado?.id,
  };

  return user;
};

export const registro = async (data) => {
  const { usuario, clave, correo, cedula, nombre, direccion } = data;

  // Validación básica
  if (!usuario || !clave || !correo || !cedula || !nombre || !direccion) {
    throw new AppError(
      "Usuario, correo, clave, cedula, nombre y direccion son obligatorios",
      400,
    );
  }

  // Verificar si el usuario ya existe
  const usuarioExiste = await prisma.usuarios.findFirst({
    where: { correo },
  });

  if (usuarioExiste) {
    throw new AppError("Ya existe una cuenta con este correo", 400);
  }

  const clienteExiste = await prisma.clientes.findFirst({
    where: {
      cedula,
    },
  });

  if (clienteExiste) {
    throw new AppError("Ya existe un cliente con esta cedula", 400);
  }

  // Encriptar clave
  const claveEncriptada = await bcrypt.hash(clave, 10);

  // Transacción
  const resultado = await prisma.$transaction(async (tx) => {
    const nuevoUsuario = await tx.usuarios.create({
      data: {
        // id: crypto.randomUUID(),
        usuario,
        clave: claveEncriptada,
        correo,
      },
    });

    const nuevoCliente = await tx.clientes.create({
      data: {
        // id: crypto.randomUUID(),
        id_usuario: nuevoUsuario.id,
        cedula,
        nombre,
        direccion,
        activo: true,
      },
    });

    return { nuevoUsuario, nuevoCliente };
  });

  return {
    mensaje: "Usuario registrado exitosamente",
    data: {
      id: resultado.nuevoUsuario.id,
      id_cliente: resultado.nuevoCliente.id,
      usuario: resultado.nuevoUsuario.usuario,
      correo: resultado.nuevoUsuario.correo,
    },
  };
};
