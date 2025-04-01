$(document).ready(function(){
    $("#copy_btn").click(function(){
         let copy = $("#copy_email").val();

         navigator.clipboard.writeText(copy).then(()=>{
            $("#copyMsg").fadeIn().delay(1000).fadeOut();
         }).catch(err=>console.error("error coping",err));
    });


    $("#btc_copy_btn").click(function(){
        let copy = $("#btc_wallet_address").val();

        navigator.clipboard.writeText(copy).then(()=>{
           $("#btc_copyMsg").fadeIn().delay(1000).fadeOut();
        }).catch(err=>console.error("error coping",err));
   });
   
})