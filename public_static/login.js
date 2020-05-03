function signUpLogin(tag){
    event.preventDefault();
    let jTag = $(tag);
    let button = $('#loginSignupBtn');
    $('#error').css('display','none')
    $('#user').val("");
    if(jTag.attr('current-state') === 'signup'){
        //Change state to login -
        jTag.attr('current-state','login');
        jTag.empty();
        jTag.append('New user, Try Sign up ?');
        button.empty();
        button.append('Login')
    }
    else {
        jTag.attr('current-state','signup');
        jTag.empty();
        jTag.append('Old user, Try login ?');
        button.empty();
        button.append('Sign Up')
    }
}
function buttonClick(){
    let username = $('#user').val();
    console.log(username);
    const db = localStorage.getItem('db');
    const loginOrSignUp = $('#loginSignup').attr('current-state');
    console.log('kcdskdksdk',loginOrSignUp)
    const errorDiv = $('#error')
    $.post(`/${db}/user/${loginOrSignUp}`,{name:username},"json")
        .done(function (data) {
            console.log('callback')
                if(loginOrSignUp === 'login')
                {   console.log('login')

                        //Set the value into localStorage
                        localStorage.setItem('username',username);
                        localStorage.setItem('userId',data.result.id);
                        console.log("data --- ",data);
                        window.location = './todolist.html';
                }
                else {
                    alert('User create successfully, Kindly login');
                    window.location = "./login.html";
                }
        })
        .fail(function (error) {
            console.log('fail',error.responseJSON)
            let errorData = error.responseJSON;
                if(errorData.error)
                {
                    console.log('Error',errorData);
                }
                    //    SHow Error Message
                    errorDiv.empty();
                    console.log(errorData);
                    errorDiv.append(errorData.message);
                    errorDiv.css('display','block')
        })

}