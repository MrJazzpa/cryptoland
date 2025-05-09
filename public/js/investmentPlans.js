let plan;
		 let amount;
		 let percentage;
		 let times;
		 let min_amount;
		 let max_amount;
		$(document).ready(function(){
			$('.btn_basic_plan').on('click',function(){
				const container = $(this).closest('.data-container');
				 plan = container.data('plan');
				 amount = container.data('amount');
				 percentage = container.data('percentage');
				 times = container.data('times');
				 min_amount = container.data('min_amount');
				
                $('#staticBackdrop').modal('show');
				$('#investplan').text(plan);
				$('.investamount').text(amount)
				$('#percentage').text("Comission "+percentage+"%")
				$('#times').html(" Daily for "+times+" times ")
			
			})
		});
		$('#amount_plan').keyup(function(){
			let Amount = parseFloat($(this).val());

			if(!isNaN(Amount) && !isNaN(percentage)){

				let increament = Amount *(percentage/100);
				let newamount = Amount+increament;
				$('#Percentage_return').val(newamount);
				$('#number_times').val(times)
			}
		})


		$('#save_plan').on('submit',function(e){
			 e.preventDefault();
			  let amount_plan = $('#amount_plan').val();
			  let number_times = $('#number_times').val();
			  let percentage_return = $('#Percentage_return').val();
			 const userid = $('#userid').val();
			 $.post(`https://btfd-io.up.railway.app/api/getinvestment_plan_amount`,
				{
					Userid :userid,
                    Min_amount:min_amount,
					Max_amount:max_amount,
					Plan: plan,
					Amount_plan: amount_plan,
					Times:number_times,
					Percentage_return:percentage_return

			 },function(data){
                 if(data.status==200){
					$('#staticBackdrop').modal('hide')
					alert('Successfull')
					    $('#amount_plan').val('');
						$('#number_times').val('');
						$('#percentage_return').val('');
						
				 }else{
					  alert(data.error)
				 }
			 })
		})