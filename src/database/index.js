import Department from "./models/department.js"
import Company from "./models/company.js"
import Sector from "./models/sector.js"
import Sequelize from "sequelize"
import User from "./models/user.js"

const config = {
    dialect: 'postgres',
    host: 'localhost',
    port: 5432,
    database: 'Kenzie Empresas',
    username: 'Felipe Almeida',
    password: '1234'
}

const database = new Sequelize(config)

User.init(database)
Sector.init(database)
Department.init(database)
Company.init(database)

User.associate(database.models)
Sector.associate(database.models)
Department.associate(database.models)
Company.associate(database.models)

export default database