
//we take this as async but - return - toh wo
function getAlltodos(cb)
{
    $.get('/todos/',(data)=>{
        cb(data);
    })
}

function addNewTodo(task,cb)
{
    $.post('/todos/',
        {task:task
            ,userId:localStorage.getItem('userid')},
        (data)=>{
            cb(data);
        })
}

function setTodoDone(todoId, done, cb) {
    $.post(`/todos/${todoId}`,
        {done:done},
        (data)=>{
            cb(data);
        })
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
        todolistDiv.empty() //Todolist div -


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
            refreshTodos(todos);
        })
    })

})