$(document).ready(function(){
    $('#deposit').on('submit',function(e){
       e.preventDefault();
        let userid = $('#userid').val();
        let amount = $('#amount').val();
        $.post('http://localhost:5000/api/transaction_history',
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