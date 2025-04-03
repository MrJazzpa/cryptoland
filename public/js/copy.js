$(document).ready(function(){
    $("#copyMsg").text("");
   
    $("#copy_btn").click(function(){
         let copy = $("#copy_email").val();

         navigator.clipboard.writeText(copy).then(()=>{
            $("#copyMsg").fadeIn().delay(1000).fadeOut();
         }).catch(err=>console.error("error coping",err));
    });

    //copy btc wallet address
    $("#btc_copy_btn").click(function(){
        let copy = $("#btc_wallet_address").val();

        navigator.clipboard.writeText(copy).then(()=>{
           $("#btc_copyMsg").text("copied..").fadeIn().delay(1000).fadeOut();
        }).catch(err=>console.error("error coping",err));
   });
   //copy ehereum wallet address
    $("#eth_copy_btn").click(function(){
        let copy = $("#eth_wallet_address").val();

        navigator.clipboard.writeText(copy).then(()=>{
           $("#eth_copyMsg").text("copied..").fadeIn().delay(1000).fadeOut();
           
        }).catch(err=>console.error("error coping",err));
   });

   //copy Doge wallet address
   $("#doge_copy_btn").click(function(){
    let copy = $("#doge_wallet_address").val();

    navigator.clipboard.writeText(copy).then(()=>{
       $("#doge_copyMsg").text("copied..").fadeIn().delay(1000).fadeOut();
    }).catch(err=>console.error("error coping",err));
});


//copy ehereum wallet address
$("#usdt_copy_btn").click(function(){
    let copy = $("#usdt_wallet_address").val();

    navigator.clipboard.writeText(copy).then(()=>{
       $("#usdt_copyMsg").text("copied..").fadeIn().delay(1000).fadeOut();
    }).catch(err=>console.error("error coping",err));
});
})