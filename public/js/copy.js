$(document).ready(function(){
    $("#copy_btn").click(function(){
         let copy = $("#copy_email").val();

         navigator.clipboard.writeText(copy).then(()=>{
            $("#copyMsg").fadeIn().delay(1000).fadeOut();
         }).catch(err=>console.error("error coping",err));
    });
})