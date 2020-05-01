const route = require('express').Router();
const sqlDB = require('../models/sqlDB');

route.get('/todos/:id',(req,res)=>{
    sqlDB.getTodos(req.params.id,(result) => {
        console.log(result);
    })
});

route.post('/user',(req,res) => {
    console.log('name ',req.body)
    sqlDB.createUser(req.body.name,(result)=>{
        console.log(result);
        res.send(result);
    })
});

route.get('/user',(req,res)=>{
    sqlDB.checkUser(req.body.name,(result) => {
        console.log(result);
        res.send(result);
    })
})

route.post('/todos/:id',(req,res)=>{

});

exports.route= route;