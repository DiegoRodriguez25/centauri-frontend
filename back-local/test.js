import { prisma } from "./prisma.js";

// const prisma = new PrismaClient()

const createTipo = async (name) => {
    console.log(name);


    const team = await prisma.tipos.delete(
        {
            where:
                { id: name }
        }
    )

    console.log("Deleted ", team);

    return team


}

const readTipo = async (name) => {

    let tipo = await prisma.tipos.findMany({
        where: {
            nombre: name
        }
    })

    return tipo
}

let tipos = await readTipo("Hola")

// let tipo = tipos[0].id

console.log(tipos);
// console.log(tipo);
// createTipo(tipo)