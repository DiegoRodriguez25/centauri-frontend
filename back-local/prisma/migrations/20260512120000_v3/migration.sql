-- CreateIndex
CREATE UNIQUE INDEX "Categorias_nombre_key" ON "Categorias"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Editoriales_nombre_key" ON "Editoriales"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Tipos_nombre_key" ON "Tipos"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Estados_nombre_key" ON "Estados"("nombre");

-- Reconcile drift: add missing indexes and column

CREATE UNIQUE INDEX IF NOT EXISTS "Clientes_cedula_key" ON "Clientes"("cedula");

CREATE UNIQUE INDEX IF NOT EXISTS "Empleados_cedula_key" ON "Empleados"("cedula");

ALTER TABLE "Productos" ADD COLUMN IF NOT EXISTS "imagen" VARCHAR(200) NOT NULL DEFAULT 'none';

CREATE UNIQUE INDEX IF NOT EXISTS "Usuarios_correo_key" ON "Usuarios"("correo");