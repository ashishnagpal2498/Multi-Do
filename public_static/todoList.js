
//we take this as async but - return - toh wo
const db = localStorage.getItem("db") || "";
const userId = localStorage.getItem("userId") || "";
function getAlltodos(cb)
{
    $.get(`/${db}/todos/${userId}`,"json")
        .done((data)=>{
            cb(data);
        })
        .fail((error)=>{
            alert(error.responseJSON);
        })
}

function addNewTodo(task,cb)
{
    $.post(`/${db}/todos/${userId}`,
        {task:task
            ,userId:localStorage.getItem('userid')},
        "json")
        .done((data)=>{
            cb(data.result);
        })
        .fail((error)=>{
            alert(error.responseJSON)
        })
}

function setTodoDone(todoId, done, cb) {
    console.log(typeof done)
    $.ajax({
        url: `/${db}/todos/${userId}`,
        type: 'PUT',
        data: {done,
            todoId},
        success:  (data)=>{
            cb(data);
        },
        fail: () => {
            console.log('Fail')
        }
    });
}
function setDone(el)
{   //console.log(el);
    //Making a elemnt Jquery
    let todo_id = $(el).attr('data-todoid')
    console.log(todo_id)
    if(el.checked)
    {
        setTodoDone(todo_id,true,(todos)=>{
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

$(function () {
    let newTaskBox = $('#newtask')
    let addTaskBtn = $('#addtask')
    let todolistDiv = $('#todolist')

    window.refreshTodos = (todos)=> {
        //I need to create an element and push into todolistDiv
        console.log(todos);
        todolistDiv.empty() //Todolist div -
        if(todos.length < 1){
            console.log('Empty list')
            todolistDiv.append("Todolist empty");
            return true;
        }
        for(todo of todos)
        {
            //Since we need to set value of check box if it is true in database -

            let chechBox = $(` <input data-todoid = "${todo.id}" onchange="setDone(this)" type="checkbox" class="col-1 todo-done">`)
            if(todo.done)
            {
                chechBox.prop('checked',true)
            }


            let todoItem = $(`
            <div class="row col-12 mt-2 mb-2 todoitem">
            <div class="col-6">${todo.task}</div>
        </div>`)
            todoItem.prepend(chechBox)
            todolistDiv.prepend(todoItem)
        }
    }

    getAlltodos((todos)=>{
        refreshTodos(todos);
    })

    addTaskBtn.click(()=>{
        addNewTodo(newTaskBox.val(),(todos)=>{
            getAlltodos(refreshTodos);
        })
    })

})