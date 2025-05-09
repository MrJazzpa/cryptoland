$(document).ready(function(){
    $('#deposit').on('submit',function(e){
       e.preventDefault();
        let userid = $('#userid').val();
        let amount = $('#amount').val();
        $.post('https://btfd-io.up.railway.app/api/transaction_history',
            {
                UserId:userid,
                Amount:amount
        },
        function(response){
             if(response.status==200){
                $('#transactionid').html("'"+response.tID+"'")
                $("#successModal").modal("show");
                $('#exampleModal').modal("hide");
             }
        })
    })
})