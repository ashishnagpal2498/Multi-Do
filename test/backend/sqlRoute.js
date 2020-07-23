const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../../server');
chai.should();

chai.use(chaiHttp);

describe("Sql Data Api test", ()=>{
    // Get Api test
    describe("Get Api data test",()=>{
        it('It should be an object',(done) => {
            chai.request(server)
                .get('/mysql/todos/b09ce90a-1036-4e2a-872b-8325b2e04574')
                .end((err,response) => {
                    // console.log('Response --> ',response)
                    //Assertions ->
                    response.should.have.status(200);
                    response.body.should.be.a("array");
                    // response.should.have.property("_id");
                    // response.should.have.property("task");
                    // response.should.have.property("userId");
                    done();
                })
        })
        it("Should give 404 error",(done)=>{
            chai.request(server)
                .get('/sql/todos/:id')
                .end((err,response) =>{
                    response.should.have.status(404);
                    response.should.be.a("object");
                    done();
                })
        })
    });

//     POST API test
    describe("Post Api Test ",()=>{
        it("It should insert a new task",(done) => {
            const task =  {
                task: "new Task",
                done: false
            };
            chai.request(server)
                .post('/mysql/todos/b09ce90a-1036-4e2a-872b-8325b2e04574')
                .send(task)
                .end((error,response) => {
                    response.should.have.status(201);
                    response.body.should.be.a("object");
                    done();
                })
        })
        it("Should not Post a New Task without body",(done) => {
            chai.request(server)
                .post('/mysql/todos/b09ce90a-1036-4e2a-872b-8325b2e04574')
                .end((err,response) => {
                    response.should.have.status(400)
                    response.body.should.be.a("object");
                    response.body.should.have.property("error").eq(true);
                    response.body.should.have.property("result")
                    response.body.should.have.property("message").eq('Cannot add todo')
                    done();
                })
        })
    })
})