$(()=>{
    let loginbtn = $('#login')
    loginbtn.click(()=>{
        let username = $('#user').val();
        console.log(username);
        const db = localStorage.getItem('db');
        $.post(`/${db}/user`,{username:username},
            (data)=>{
                if(data.error)
                {

                }
                else{
                    //Set the value into localStorage
                    localStorage.setItem('username',username)
                    localStorage.setItem('userid',data.id)
                    console.log("data --- ",data);
                    window.location ="./todolist.html"
                }
            })
    });
})