const route = require('express').Router()
const mongoDb = require('mongodb')
const MongoClient = mongoDb.MongoClient;
const dbConfig = require('../config').MongoDb
const uri = "mongodb://localhost:27017/todoDB";
const client = new MongoClient(uri, { useNewUrlParser: true });

let todoCollection, UserCollection;

client.connect(err => {
    console.log('err',err);
    todoCollection = client.db("mongoTodo").collection("todos")
    UserCollection = client.db("mongoTodo").collection("user");
    // perform actions on the collection object
});

route.post('/user/login',(req,res)=>{
    UserCollection.find({name: req.body.name}).toArray(function (err,result){
        if(err) return res.status(400).send({error: true,result:err,message:"User cannot "})
        else {
            console.log(result);
            if(result.length < 1 )
               return res.status(401).send({
                    error: false,
                    result: result,
                    message: "User does not exist"
                })
            else {
              return  res.status(200).send({
                    error: false,
                    result:result[0],
                    message:"user found successfully"
                })
            }
        }
    })
})

route.post('/user/signup',(req,res) => {
    UserCollection.find({name: req.body.name})
        .toArray(function (err,result){
            if(err)  return res.status(400).send({
                error: true
            })
            else {
                if(result.length<1)
                {
                    UserCollection.insertOne({
                        name: req.body.name
                    }).then((result2) => {
                        return res.status(201).send({
                            error: false,
                            result: result2,
                            message: "User added successfully"
                        })
                    }).catch((err2)=> res.status(400).send({
                        error: true,
                        result: err2,
                        message: "User cannot be added"
                    }))
                }
                else {
                   return res.status(400).send({
                        error: false,
                        result: result,
                        message: " user already exist"
                    })
                }
            }
        })
});

route.get('/todos/:id',(req,res)=>{
    todoCollection.find({userId: req.params.id})
        .toArray(function (err,result){
            if(err) return res.status(400).send({
                error: true,
                result: err,
                message: "Cannot get Todos"
            });
            else return res.status(200).send(result);
        })
});

route.post('/todos/:id',(req,res)=>{
    todoCollection.insertOne({
        task: req.body.task,
        done: false,
        userId: req.params.id
    })
        .then((result) => res.status(201).send(result.result))
        .catch((err) => res.status(400).send({
            error: true,
            result: err,
            message: "Cannot Add Todo"
        }));
});

route.put('/todos/:id',(req,res) => {
    const done = req.body.done === 'true';
    console.log(req.body)
    console.log('done',done)
    //Imp - use Object Id -
    todoCollection.updateOne({
        _id: mongoDb.ObjectId(req.body.todoId)},
        { $set: {done:done}} )
        .then((result) => {
            console.log('result',result);
         todoCollection.find().toArray(function (err2,result2) {
             if(err2) res.status(400).send({
                 error: true,
                 result: err2,
                 message: "Error"
             })
             else {
                return res.status(200).send(result2)
             }
         })

    }).catch((err) => res.status(400).send({error: true, result: err,message:""}))
})

exports.route= route;

