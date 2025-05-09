
    $('#eth_form').on('submit',function(e){
        e.preventDefault();
        let amount = $('#eth_amount').val();
        let eth_amount = $('#amount_in_eth').val();
        let deposit_type = $('#deposit_type').val();
        let deposit_crypto_coin = $('#deposit_eth_coin').val();
        userid =$('#userid').val();
        //alert(amount+""+btc_amount+""+deposit_type+""+deposit_crypto_coin)
        $.post('https://btfd-io.up.railway.app/api/deposit_crypto',
            {
            Amount:amount,
            crypto_Amount:eth_amount,
            Deposit_type:deposit_type,
            Deposit_Crypto_Coin:deposit_crypto_coin,
            Userid:userid
        },
        function(response){
               if(response.status==200){
                
                  $('#successModal').modal('show');
                  $('#Ethmodel').modal('hide');
               }
        })
    })
