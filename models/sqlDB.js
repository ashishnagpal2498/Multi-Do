const mysql = require('mysql2');
const config = require('../config.json')
const { v4: uuidv4 } = require('uuid');

const connection = mysql.createConnection(config.mysql)

const createUser = (name,cb) => {
    console.log('name - user',name);
    connection.query('INSERT INTO user(id,name) values(?,?)',
        [uuidv4(),name], (err,fields)=>{
        if(err)
        cb(err);
        else cb(fields);
        })
};

const checkUser = (name,cb) => {
    connection.query('select * from user where name = ?',[name],
        (err,result)=>{
            if(err) cb(err);
            else if(result.length<0) cb(null);
            else cb(result);
        })
}

const getTodos = (userId,cb) => {
    connection.query('select * from todos where id=?',
        [userId],
        (err, result) => {
            console.log(result);
            cb(result);
        })
};

const addTodo = (object,cb) => {
    connection.query(`INSERT INTO todos(id,task,done,userId) values(?,?,?,?)`,
        [uuidv4(),object.task,object.done,object.userId] ,
        (err,result) => {
             cb(result);
        })
};

exports = module.exports = {
    getTodos,addTodo, createUser, checkUser
}
