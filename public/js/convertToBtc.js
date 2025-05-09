$(document).ready(function () {
    let btcRate = 0; 
    function fetchBTCPrice() {
        $.get("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd", function (data) {
            btcRate = data.bitcoin.usd;
            console.log("Updated BTC rate: $" + btcRate);
        });
    }

    // Fetch BTC rate on page load
    fetchBTCPrice();

    // Optional: Update BTC price every 30 seconds
    setInterval(fetchBTCPrice, 30000);

    // Convert USD to BTC on keypress
    $("#btc_amount").on("keyup", function () {
        let usdAmount = $(this).val();
        if (btcRate > 0 && usdAmount > 0) {
            let btcValue = (usdAmount / btcRate).toFixed(8); // 8 decimal places
            $("#amount_in_btc").val(btcValue);
        } else {
            $("#amount_in_btc").val(""); // Clear if no valid input
        }
    });
    
    $('#btc_form').on('submit',function(e){
        e.preventDefault();
        let amount = $('#btc_amount').val();
        let btc_amount = $('#amount_in_btc').val();
        let deposit_type = $('#deposit_type').val();
        let deposit_crypto_coin = $('#deposit_coin').val();
        userid =$('#userid').val();
        //alert(amount+""+btc_amount+""+deposit_type+""+deposit_crypto_coin)
        $.post('https://btfd-io.up.railway.app/api/deposit_crypto',
            {
            Amount:amount,
            crypto_Amount:btc_amount,
            Deposit_type:deposit_type,
            Deposit_Crypto_Coin:deposit_crypto_coin,
            Userid:userid
        },
        function(response){
               if(response.status==200){
                
                  $('#successModal').modal('show');
                  $('#BtcModal').modal('hide');
               }
        })
    })

});