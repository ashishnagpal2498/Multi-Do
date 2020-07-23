const mysql = require('mysql2');
const config = require('../config.json')
const { v4: uuidv4 } = require('uuid');

const connection = mysql.createConnection(config.mysql)

const createUser = (name,cb) => {
    console.log('name - user',name);
    connection.query('INSERT INTO user(id,name) values(?,?)',
        [uuidv4(),name], (err,fields)=>{
        if(err)
        cb({
            result: err,
            error: true
        });
        else checkUser(name,cb);
        })
};

const checkUser = (name,cb) => {
    connection.query('select * from user where name = ?',[name],
        (err,result)=>{
            if(err) cb(
                {
                    result: null,
                    error: true,
                    message: "There has been some error"
                }
            );
            else if(!result[0]) cb({
                error: false,
                result: null,
                message: ""
            });
            else cb({
                    error: false,
                    result: result[0],
                    message: "User found successfully"
                });
        })
}

const getTodos = (userId,cb) => {
    connection.query('select * from todos where userId=?',
        [userId],
        (err, result) => {
            console.log(result);
            if(err) {
                cb({
                    error: true,
                    result: err,
                    message: "There is some error in finding todos"
                })
            }
            else cb({
                error: false,
                result,
                message: "Todos found successfully"
            });
        })
};

const addTodo = (object,cb) => {
    if(!object.task) return cb({
        error: true,
        result: null,
        message: "Cannot add todo"
    })
    connection.query(`INSERT INTO todos(id,task,done,userId) values(?,?,?,?)`,
        [uuidv4(),object.task,object.done,object.userId] ,
        (err,result) => {
            if(err) cb({
                error: true,
                result: err,
                message: "Cannot add todo"
            })
        else cb(
            { error: false,
                result,
                message: "todo added successfully"
        });
        })
};

const updateTodo = (done,id,userId,cb) => {
  done = done === "true" ? 1:0;
    console.log(typeof done);
    connection.query('update todos set done = ? where id= ? AND userId = ? ',[done,id,userId],
        (err,result) => {
            if (err) {
                cb({
                    error: true,
                    result: err,
                    message: "Could not update todo"
                })
            } else {
               // Return all items again -
                getTodos(userId,cb);
            }
        })
};

const deleteTodo = (id,userId,cb) =>{
    connection.query("delete from todos where id = ? AND userId = ? ", [id,userId],
        (err,result) => {
        if(err) cb({
            error: true,
            result: err,
            message: "Cannot delete todo"
        });
          else getTodos(userId,cb);
        })
}

exports = module.exports = {
    getTodos,addTodo, createUser, checkUser, updateTodo, deleteTodo
};
