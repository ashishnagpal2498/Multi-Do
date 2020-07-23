
//we take this as async but - return - toh wo
const db = localStorage.getItem("db") || "";
const userId = localStorage.getItem("userId") || "";
function getAlltodos(cb)
{
    $.get(`/${db}/todos/${userId}`,"json")
        .done((data)=>{
            console.log('Data -> ----',data);
            console.log(Array.isArray(data));
            cb(data);

        })
        .fail((error)=>{
            alert(error.responseJSON.message);
        })
}

function addNewTodo(task,cb)
{
    $.post(`/${db}/todos/${userId}`,
        {task},
        "json")
        .done((data)=>{
            cb(data.result);
        })
        .fail((error)=>{
            alert(error.responseJSON.message)
        })
}

function setTodoDone(todoId, done, cb) {
    $.ajax({
        url: `/${db}/todos/${userId}`,
        type: 'PUT',
        data: {done,
            todoId},
        success:  (data)=>{
            cb(data);
        },
        fail: (err) => {
           alert(err.responseJSON.message)
        }
    });
}
function setDone(el)
{
    //Making a elemnt Jquery
    let todo_id = $(el).attr('data-todoid')
    if(el.checked)
    {
        setTodoDone(todo_id,true,(todos)=>{
            // Show actual result of what is stored on backend
            refreshTodos(todos);
        })
    }
    else
    {
        setTodoDone(todo_id,false,(todos)=>{
            refreshTodos(todos);
        })
    }

}

function closeModal() {
    let modal = $('#deleteModal')
    modal.css("display","none");
}

function deleteTodo(todoId) {
    $('#deleteModal').css("display","none")
    $.ajax({
        url: `${db}/todos/${userId}`,
        method: "delete",
        data: {todoId}
    })
        .done((data) => {
            refreshTodos(data);
        })
        .fail((err)=>{
            alert(err.responseJSON.message);
        })
}

function deleteItemConfirm(item,value){
    let tag = $(item);
    let modal = $('#deleteModal')
    let deleteTask = $('#delete-task');
    deleteTask.empty();
    deleteTask.append(value)
    modal.css("display","block");
    let buttonSucces = $('#button-success');
    buttonSucces.attr("onclick",`deleteTodo('${tag.attr("data-todoid")}')`);
}

function logoutUser(){
    localStorage.removeItem("username");
    localStorage.removeItem("userId");
    window.location = "../login.html"
}

$(function () {
    let user = localStorage.getItem("username") || "";
    let errorModal = $('#error-Modal')
    let errorLink = $('#error-link')
    let errorText = $('#error-text')
    if(!userId || !user)
    {
        errorModal.css('display','block')
        errorText.empty();
        errorLink.empty();
        errorText.append("User not Logged In ");
        errorLink.append("Click Here to Login");
        errorLink.attr("href","./login.html")
        return false;
    }
    else if(!db){
        errorModal.css('display','block')
        errorText.empty();
        errorLink.empty();
        errorText.append("Database not selected");
        errorLink.append("Click Here to select Database");
        errorLink.attr("href","./databaseSelection.html")
    }
    let newTaskBox = $('#newtask')
    let addTaskBtn = $('#addtask')
    let todolistDiv = $('#todolist')
    let emptyListDiv = $('#empty-list')
    let loader = $('#loader')
    let database = $('#database')
    let username = $('#username')
    database.empty();
    username.empty();
    database.append(db);
    username.append(user);
    window.refreshTodos = (todos)=> {
        emptyListDiv.css("display","none")
        loader.css("display","block")
        todolistDiv.empty();
        if(todos.length < 1){
           emptyListDiv.css("display","block");
            loader.css("display","none");
            return true;
        }
        let todoList = [];
        for(todo of todos)
        {
            let chechBox = $(` <input data-todoid = "${todo.id || todo._id}" onchange="setDone(this)" type="checkbox" >`)
            if(todo.done)
            {
                chechBox.prop('checked',true)
            }

           let todoItem = $(`<li><p>${todo.task}</p></li>`)
           let deleteBtn = $(`<div class="icons"><i class="fa fa-trash" data-todoid = "${todo.id || todo._id}" onclick="deleteItemConfirm(this,'${todo.task}')"></i>
                </div>`);
            todoItem.prepend(chechBox);
            todoItem.append(deleteBtn);
            todoList.push(todoItem);
        }
        todolistDiv.prepend(...todoList);
        loader.css("display","none")
    }

    getAlltodos((todos)=>{
        refreshTodos(todos);
    })

    addTaskBtn.click(()=>{
        addNewTodo(newTaskBox.val(),(todos)=>{
            newTaskBox.val("");
            getAlltodos(refreshTodos);
        })
    })

})