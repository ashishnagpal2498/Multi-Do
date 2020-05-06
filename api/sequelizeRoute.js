//Route which defined data ingoing and outgoing of the frontend and backend
const route = require('express').Router();
//Database ke liye -
const Todos = require('../models/sequelizeDB').module.Todos;
const User = require('../models/sequelizeDB').module.User;
const responseFunction = require('../utils').responseFunction

route.post('/user/signup',(req,res)=>{
   User.findOne({
       name: req.body.name
   }).then(result => {
       if(result)
       {
            //User already exist
           res.status(401).send(responseFunction("User Already Exist, Try login or choose another username"))
       }
       else
       {
           User.create({
               name:req.body.name
           },{
               returning :true
           }).then(users => res.send(users))
               .catch(err=> res.status(400).send(responseFunction("Some Error has Occurred")))
       }
   }).catch((err) =>{
       res.status(400).send(err);
   })
});

route.post('/user/login',(req,res)=>{
    User.findOne({
        name: req.body.name
    }).then(result => {
        if(!result)
        {
            console.log("No User Found")
            res.status(401).send({
                error: false,
                result: [],
                message:"User does not exist"
            })
        }
        else {
            res.status(201).send({
             error: false,
             result,
             message: "User found Successfully"
            })
        }
    })
        .catch((err) => res.send(400).send({
            error: true,
            result: err,
            message: "Error in finding User"
        }))
})

route.get('/todos/:id',(req,res)=>{
    //Find all the todos and send
    Todos.findAll({
        //where clause
        where:{
            userId: req.params.id
        }
    }).then((result)=> res.status(200).send(result))
        .catch((err)=>{console.error(err); res.status(400).send(err)})
})

route.post('/todos/:id',(req,res)=>{
    //Add the todo into the table.
    console.log(req.body,"prams",req.params)
    Todos.create({
        task: req.body.task,
        done: false,
        userId:req.params.id
        //this function has a second argument - returning
    }).then((result)=>{
        console.log('res',result)
        res.status(201).send({
            error: false,
            result,
            message: "Todo added successfully"
        })
    })
        .catch((err)=> {
            console.log('Error')
            res.status(400).send({
                error: true,
                result: err,
                message: "Todo cannot be added"
            })
        })
})

//To make the checkbox value -
route.put('/todos/:id',(req,res)=>{

    //Check if the value which is of Id is even correct or not
    if(isNaN(parseInt(req.params.id)))
    {
        return res.status(404).send({error:"The id send is not correct"})
    }
    //Update the value into the database
    Todos.update({
            done: req.body.done,
            task: req.body.task
        },
        {
            where: {
                userId:req.params.id,
                id: req.body.todoId
            }
        })
        .then(()=>{
            Todos.findAll({
                where :{
                    userId: req.params.id
                }
            })
                .then(result => {
                    res.status(200).send(result)

                }).catch(err => res.status(400).send({
                error: true,
                result: err,
                message: " Cannot find todos"
            }))
            })
        .catch((err)=> {console.error(err);
            res.status(400).send({
                error: true,
                result: err,
                message: "Error in Updating Todo"
            })
        })
})

route.delete('/todos/:id',(req,res) => {
    //Check if the value which is of Id is even correct or not
    if(isNaN(parseInt(req.params.id)))
    {
        return res.status(404).send(
           {
                error: true,
                result: null,
                message: "The Id send is not correct"
            })
    }

    Todos.destroy({
            where: {
                userId:req.params.id,
                id: req.body.todoId
            }
        })
        .then(()=>{
            Todos.findAll({
                where: {
                    userId: req.params.id
                }
            })
                .then(result => {
                    res.status(200).send(result)

                }).catch(err => res.status(400).send({
                error: true,
                result: err,
                message: " Cannot find todos"
            }))
        })
        .catch((err)=> {console.error(err);
            res.status(400).send({
                error: true,
                result: err,
                message: "Error in deleting Todo"
            })
        })
})


exports.route=route;