const route = require('express').Router();
const sqlDB = require('../models/sqlDB');

route.post('/user/signup',(req,res)=>{
    sqlDB.checkUser(req.body.name,(checkUserResult)=>{
        if(checkUserResult.error)
        {
            res.status(400).send(checkUserResult)
        }

        else if(!checkUserResult.result) {
            // user will be created
            sqlDB.createUser(req.body.name,(resultCreate)=>{
                res.status(200).send(resultCreate);
            });
        }
        else {
            // User Already Exist -
            res.status(401).send({...checkUserResult, message:"User Already Exist, Try login or choose another username"});
        }
    })

})

route.post('/user/login',(req,res) => {
    //Check if the username already exist -
    sqlDB.checkUser(req.body.name,(checkUserResult)=>{
        if(checkUserResult.error)
        {
            res.status(400).send(checkUserResult)
        }

        else if(!checkUserResult.result) {
            res.status(401).send({...checkUserResult, message:"User does not exist"})
        }
        else {
            // User Already Exist -
           res.status(200).send(checkUserResult);
        }
    })

});

route.get('/user',(req,res)=>{
    sqlDB.checkUser(req.body.name,(result) => {
        res.send(result);
    })
})

// Todos Route

route.get('/todos/:id',(req,res)=>{
    sqlDB.getTodos(req.params.id,(result) => {
        if(result.error)
        {
            res.status(400).send(result)
        }
        // returning array of results

        else res.status(200).send(result.result);
    })
});

route.post('/todos/:id',(req,res)=>{
    sqlDB.addTodo({
        task: req.body.task,
        done: false,
        userId: req.params.id
    }, (result)=>{
        if(result.error) res.status(400).send(result);
        else res.status(201).send(result.result);
    })
});

route.put('/todos/:id',(req,res) => {
    sqlDB.updateTodo(req.body.done,req.body.todoId,req.params.id,
        (result)=>{
            if(result.error) res.status(400).send(result);
            else res.status(200).send(result.result)
        })
})

route.delete('/todos/:id',(req,res) => {
    sqlDB.deleteTodo(req.body.todoId,req.params.id,
        (result)=>{
            if(result.error) res.status(400).send(result);
            else res.status(200).send(result.result)
        })
});

exports.route= route;