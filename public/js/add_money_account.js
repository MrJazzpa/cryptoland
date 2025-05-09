$(document).ready(function(){
  
    function add_amount(){


          let static_btc_price = $('#static_btc_price').val();
        let static_eth_price = $('#static_eth_price').val();
        let static_usdt_price = $('#static_usdt_price').val();
        let static_doge_price = $('#static_doge_price').val();

        let dynamic_btc_price = $('#dynamic_btc_price').val()
        let dynamic_eth_price = $('#dynamic_eth_price').val()
        let dynamic_usdt_price = $('#dynamic_usdt_price').val()
        let dynamic_doge_price = $('#dynamic_doge_price').val()
        let userid = $('#userid').val();
        if(static_btc_price=="0" && static_eth_price=="0" && static_usdt_price=="0" && static_doge_price=="0"){
            console.log("fund wallet")
        }else if(dynamic_btc_price=="0" && dynamic_eth_price=="0" && dynamic_usdt_price=="0" && dynamic_doge_price=="0"){
            console.log("fund wallet dynamic")
        }else{
            let sum = parseFloat(dynamic_btc_price.replace(/,/g,""))+parseFloat(dynamic_eth_price.replace(/,/g,"")) +parseFloat(dynamic_usdt_price.replace(/,/g,""))+parseFloat(dynamic_doge_price.replace(/,/g,""))
           // let formattedsum = sum.toLocaleString("en-us",{minimumFractionDigits:2});
            $.post('https://btfd-io.up.railway.app/api/add_value',{
                   Total_amount:sum,
                   btc_price :dynamic_btc_price,
                   eth_price:dynamic_eth_price,
                   doge_price:dynamic_doge_price,
                   usdt_price:dynamic_usdt_price,
                   UserId:userid
            },
            function(data){
                if(data.status==200){
                    $('#totalBalance').hide();
                    $('#totalBalance_current').html('$'+data.currentBalance)
                    
                   console.log("working")
                  
                }else{
                 console.log("not working")
                }
            })
        }
       // let $total_amount =  $dynamic_btc_price+dynamic_eth_price+$dynamic_usdt_price+$dynamic_doge_price
       
    }
     add_amount();
    setInterval(add_amount, 70000);
});