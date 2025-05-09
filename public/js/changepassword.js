
$('#changepassword').on('submit',function(e){
    e.preventDefault();
    let oldpassoword = $('#oldpassword').val();
    let newpassoword = $('#newpassword').val();
    let comfirmpassoword = $('#comfirmpassword').val();
    let userid = $('#userid').val();
    $.post(' https://btfd-io.up.railway.app/api/changepassword',
    {
         Oldpass:oldpassoword,
         Newpass:newpassoword,
         Compass:comfirmpassoword,
         UserId:userid

    },function(data){
       if(data.status==200){
        $('#pmsg').html("<p class='alert alert-success'>Password has been Change</p>")
        $('#oldpassword').html('');
        $('#newpassword').html('');
        $('#comfirmpassword').html('');
       }else if(data.status==403){
        $('#pmsg').html(`<p class='alert alert-danger'>${data.error}</p>`)
       }else{
        $('#pmsg').html("<p class='alert alert-success'>Database Error</p>")
       }
    })
})
