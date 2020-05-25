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
const buttonClick = () => {
    let username = $('#user').val();
    const db = localStorage.getItem('db');
    const loginOrSignUp = $('#loginSignup').attr('current-state');
    const errorDiv = $('#error')
    $.post(`/${db}/user/${loginOrSignUp}`,{name:username},"json")
        .done(function (data) {
                if(loginOrSignUp === 'login')
                {
                    //Set the value into localStorage
                        localStorage.setItem('username',username);
                        localStorage.setItem('userId',data.result.id || data.result._id);
                        window.location = '../todolist.html';
                }
                else {
                    alert('User create successfully, Kindly login');
                    window.location = "../login.html";
                }
        })
        .fail(function (error) {
            let errorData = error.responseJSON;
                if(errorData.error)
                {
                    console.log('Error',errorData);
                }
                    //    Show Error Message
                    errorDiv.empty();
                    errorDiv.append(errorData.message);
                    errorDiv.css('display','block')
        })

}
$(() => {
    const db = localStorage.getItem("db") || "";
    let errorModal = $('#error-Modal')
    let errorLink = $('#error-link')
    let errorText = $('#error-text')
    let currentDb = $('#current-db');
    if(!db){
        errorModal.css('display','block')
        errorText.empty();
        errorLink.empty();
        errorText.append("Database not selected");
        errorLink.append("Click Here to select Database");
        errorLink.attr("href","./databaseSelection.html");
        return false;
    }
    currentDb.empty();
  currentDb.append(db)
})

exports = module.exports = {
    buttonClick
}