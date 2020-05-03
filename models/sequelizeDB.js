const Sequelize = require('sequelize')
//Creating a variable for datatypes else every time we need to define a type
//we need to write sequelize . datatypes
const  dataTypes = Sequelize.DataTypes
const dbconfig = require('../config').Sequelize;

//Defining Database
const db = new Sequelize(
    dbconfig.database,
    dbconfig.user,
    dbconfig.password,
    {
        host: dbconfig.host,
        dialect: dbconfig.dialect
    }
)

//Defining a Table ;
const Todos = db.define(
    'todos',
    {
        id:{
            type:dataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },
        //Short hand notation if only type need to be defined
        task: dataTypes.STRING(40),
        done : {
            type: dataTypes.BOOLEAN,
            default:false
        }

    }
)

//Relations in Sequelize -
const User = db.define(
    'user',{
        id:{
            type:dataTypes.UUID,
            primaryKey:true,
            defaultValue: dataTypes.UUIDV4
        },
        name: {
            type:dataTypes.STRING,
            allowNull :false
        }
    }
)

Todos.belongsTo(User);
//Inner Join -
User.hasMany(Todos)


db.sync({alter: true}).then(()=>{
    console.log('Database Configured')
})

exports.module={
    Todos, User
};