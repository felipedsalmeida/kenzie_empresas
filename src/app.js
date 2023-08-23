import cors from "cors"
import express from "express"
import database from "./database/index.js"
import User from "./database/models/user.js"
import AuthToken from "./middlewares/authToken.js"

import authRouter from "./routes/auth.js"
import companiesRouter from "./routes/companies.js"
import usersRouter from "./routes/user.js"
import adminRouter from "./routes/admin.js"
import departmentRouter from "./routes/department.js"
import sectorsRouter from "./routes/sectors.js"

import Helper from "./services/helper.js"



import createCompany from "../src/database/seed/createCompany.js"
import createDepartment from "../src/database/seed/createDepartment.js"
import populateSectors from "../src/database/seed/populateSectors.js"
import populateUsers from "../src/database/seed/populateUsers.js"

const app = express()

app.use(cors())
app.set("trust proxy", true)
app.use(express.json())


app.use("/auth", Helper.valideBody,authRouter) // Correto
app.use("/companies", Helper.valideBody, companiesRouter) // Correct
app.use("/departments", AuthToken.isAdmin, departmentRouter) // correct
app.use("/sectors",  sectorsRouter)
app.use("/admin", AuthToken.isAdmin, adminRouter)
app.use("/users", Helper.valideBody, usersRouter)

app.use("/test", Helper.valideBody, AuthToken.isAdmin, async (req, resp) => {
        const users = await User.findAll()

        return resp.json(users)
})

app.use((error, request, response, next) => {
    response.header("Access-Control-Allow-Origin", "*");
    return response.json({
        status: "Error",
        error:  error.msg,  
    })
})
database.sync().then(() => {
    console.log("Database connected")
})


try {
    await database.sync()
    const users = await populateUsers()
    // const groups = await populateGroups()
    const sectors = await populateSectors()
    
    createCompany(sectors[0].uuid, "Skina Lanches", "Podrão de qualidade")
    createCompany(sectors[0].uuid, "Gela Guela", "Sorvetes barateza")

    createCompany(sectors[1].uuid, "Mercado Kenzie", "Padrão de qualidade")
    createCompany(sectors[1].uuid, "Gortifruti da Terra", "Natural e sem agrotóxicos")

    createCompany(sectors[2].uuid, "Tecidos Dona Florinda", "Nossos tecidos são nossos tesouros")
    createCompany(sectors[2].uuid, "Malhas Alberto", "Compre suas roupas de academia aqui! melhor preço da região")

    createCompany(sectors[3].uuid, "DevModa", "Roupas para um estilo de uma pessoa desenvolvedora")
    createCompany(sectors[3].uuid, "Edna Moda", "Roupas de grifes, mas sem capas")

    createCompany(sectors[4].uuid, "KenzieX", "Levando nossos desenvolvedores a outro mundo")
    createCompany(sectors[4].uuid, "Evolution Tech", "Focamos nossos estudos e desenvolvimento em foguetes melhores e mais rapidos!!")

    createCompany(sectors[5].uuid, "Boacharria", "Se furar o pneu, conta comigo")
    createCompany(sectors[5].uuid, "Offcina", "Arrumamos seu carro")

    const nerdLab = await createCompany(sectors[6].uuid, "Nerd lab", "Criamos um site rapidão pra você")
    createCompany(sectors[6].uuid, "Chipset manutenções", "Arrumamos o PC")


    const ti = await createDepartment("TI", "Departamento de TI", nerdLab.uuid, users[1].uuid)
    const rh = await createDepartment("RH", "Recrutamento e seleção", nerdLab.uuid, users[2].uuid)

    createCompany(sectors[7].uuid, "Mercado Popular", "Melhor preço e qualidade!!")
    createCompany(sectors[7].uuid, "Atacadão Kenzie", "Liquidamos todas as ofertas!!")

} catch (error) {
    console.log(error)
}


app.listen(6278, () => {
    console.log("App is running http://localhost:6278/ 🚀 ")
})