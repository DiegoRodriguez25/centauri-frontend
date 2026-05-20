import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/prisma/client.ts";
// import { env } from "../.env";

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

export { prisma };

// Si surge algun problema es necesario verificar desde donde se está ejecutando
// cada query, pues node suele buscar .env en el directorio de ejecucion
// soluciones posibles inlcluyen replicar el .env dentro de /server