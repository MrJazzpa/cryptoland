$(document).ready(function(){
  /*  if($('#phone_number').val()!="" && $('#country').val()!="" ){
        $('#profile_btn').prop('disabled', true);
    }else{
        $('#profile_btn').prop('disabled', false);
    }*/
$('#update_user_info').on('submit',function(e){
    e.preventDefault();
     let userid = $('#userid').val();
     let phoneNumber = $('#phone_number').val().trim();
     let country = $('#country').val().trim();
     let state = $('#state').val().trim();
     let  date = $('#date').val().trim();
     let month = $('#month').val().trim();
     let year = $('#year').val().trim();
     let dob = date+"/"+month+"/"+year;
     let address= $('#address').val().trim();
    $.post('https://btfd-io.up.railway.app/api/update_user_info',
        {
             Userid:userid,
             phoneNumber:phoneNumber,
             Country:country,
             State:state,
             DOB:dob,
             Address:address
       },
    function(data){
      if(data.status==200){
          $('#update_msg').html("<p class='alert alert-success'>Profile has been Updated</p>")
          $('#profile_btn').prop('disabled', true);
      }else{
        $('#update_msg').html("<p class='alert alert-danger'>An Error Just Occured</p>")
      }
    })
})

})