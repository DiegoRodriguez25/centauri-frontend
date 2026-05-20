-- CreateTable
CREATE TABLE "Categorias" (
    "id" UUID NOT NULL,
    "nombre" VARCHAR(80) NOT NULL,

    CONSTRAINT "Categorias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Autores" (
    "id" UUID NOT NULL,
    "nombre" VARCHAR(45) NOT NULL,

    CONSTRAINT "Autores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Editoriales" (
    "id" UUID NOT NULL,
    "nombre" VARCHAR(45) NOT NULL,

    CONSTRAINT "Editoriales_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tipos" (
    "id" UUID NOT NULL,
    "nombre" VARCHAR(45) NOT NULL,

    CONSTRAINT "Tipos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Productos" (
    "id" UUID NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "existencias" INTEGER NOT NULL,
    "fecha_publicacion" DATE NOT NULL,
    "id_tipo" UUID NOT NULL,
    "id_autor" UUID NOT NULL,
    "id_editorial" UUID NOT NULL,
    "id_categoria" UUID NOT NULL,

    CONSTRAINT "Productos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Clientes" (
    "id" UUID NOT NULL,
    "id_usuario" UUID NOT NULL,
    "cedula" VARCHAR(30) NOT NULL,
    "nombre" VARCHAR(45) NOT NULL,
    "direccion" VARCHAR(200) NOT NULL,
    "activo" BOOLEAN NOT NULL,
    "fecha_eliminacion" DATE,

    CONSTRAINT "Clientes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Empleados" (
    "id" UUID NOT NULL,
    "id_usuario" UUID NOT NULL,
    "cedula" VARCHAR(30) NOT NULL,
    "nombre" VARCHAR(45) NOT NULL,
    "activo" BOOLEAN NOT NULL,
    "fecha_terminacion" DATE,

    CONSTRAINT "Empleados_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Usuarios" (
    "id" UUID NOT NULL,
    "usuario" VARCHAR(25) NOT NULL,
    "clave" TEXT NOT NULL,
    "correo" VARCHAR(150) NOT NULL,

    CONSTRAINT "Usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Estados" (
    "id" UUID NOT NULL,
    "nombre" VARCHAR(30) NOT NULL,

    CONSTRAINT "Estados_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pedidos" (
    "id" UUID NOT NULL,
    "precio" DOUBLE PRECISION NOT NULL,
    "cantidad_productos" INTEGER NOT NULL,
    "fecha_pedido" TIMESTAMP(3) NOT NULL,
    "id_cliente" UUID NOT NULL,
    "id_empleado" UUID NOT NULL,
    "id_estado" UUID NOT NULL,

    CONSTRAINT "Pedidos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Detalles_Pedidos" (
    "id_pedido" UUID NOT NULL,
    "id_producto" UUID NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "precio" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Detalles_Pedidos_pkey" PRIMARY KEY ("id_pedido","id_producto")
);

-- CreateTable
CREATE TABLE "Carritos" (
    "id_cliente" UUID NOT NULL,
    "id_producto" UUID NOT NULL,

    CONSTRAINT "Carritos_pkey" PRIMARY KEY ("id_cliente","id_producto")
);

-- CreateIndex
CREATE UNIQUE INDEX "Clientes_id_usuario_key" ON "Clientes"("id_usuario");

-- CreateIndex
CREATE UNIQUE INDEX "Empleados_id_usuario_key" ON "Empleados"("id_usuario");

-- AddForeignKey
ALTER TABLE "Productos" ADD CONSTRAINT "Productos_id_tipo_fkey" FOREIGN KEY ("id_tipo") REFERENCES "Tipos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Productos" ADD CONSTRAINT "Productos_id_autor_fkey" FOREIGN KEY ("id_autor") REFERENCES "Autores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Productos" ADD CONSTRAINT "Productos_id_editorial_fkey" FOREIGN KEY ("id_editorial") REFERENCES "Editoriales"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Productos" ADD CONSTRAINT "Productos_id_categoria_fkey" FOREIGN KEY ("id_categoria") REFERENCES "Categorias"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Clientes" ADD CONSTRAINT "Clientes_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Empleados" ADD CONSTRAINT "Empleados_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pedidos" ADD CONSTRAINT "Pedidos_id_cliente_fkey" FOREIGN KEY ("id_cliente") REFERENCES "Clientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pedidos" ADD CONSTRAINT "Pedidos_id_empleado_fkey" FOREIGN KEY ("id_empleado") REFERENCES "Empleados"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pedidos" ADD CONSTRAINT "Pedidos_id_estado_fkey" FOREIGN KEY ("id_estado") REFERENCES "Estados"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Detalles_Pedidos" ADD CONSTRAINT "Detalles_Pedidos_id_pedido_fkey" FOREIGN KEY ("id_pedido") REFERENCES "Pedidos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Detalles_Pedidos" ADD CONSTRAINT "Detalles_Pedidos_id_producto_fkey" FOREIGN KEY ("id_producto") REFERENCES "Productos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Carritos" ADD CONSTRAINT "Carritos_id_cliente_fkey" FOREIGN KEY ("id_cliente") REFERENCES "Clientes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Carritos" ADD CONSTRAINT "Carritos_id_producto_fkey" FOREIGN KEY ("id_producto") REFERENCES "Productos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
