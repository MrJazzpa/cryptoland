$(document).ready(function(){
   $('#admin_login').on('submit',function(e){

    e.preventDefault();
    let username = $('#username').val();
    let password = $('#password').val();
    if(username == "" && password == ""){
        $('#msg').html("<p class='alert alert-warning' style'text-align:center'>Please fill the inputs before submitting</p>");
    }else{
          $.ajax({
              url:'/api/admin_login',
              method: 'POST',
              data:{
                     Username:username,
                     Password:password
              },
              success:function(data){
                if(data.status==200){
                   window.location.href='/admin-dashboard';
                }else{
                    $('#msg').html(`<p class='alert alert-danger' style'text-align:center'>${data.error}</p>`);
                }
              }
          })
    }

   });
});