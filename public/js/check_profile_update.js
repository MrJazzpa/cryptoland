$(document).ready(function(){
    function display_Update_message(){
        let phone_number= $('#phone_number').val();
        let country = $('#country').val();
        let state = $('#state').val();
        let dob = $("#dob").val();
        let address= $("#address").val()
        if(phone_number=="null" && country == "null" && state == "null" && dob == "null" && address == "null"){

              $('#displaymessage').html("<h4 class='alert alert-warning text-dark' style='border:none;text-align:center'>Please Update Your Profile </h4>")

        }
      }

      display_Update_message();
})