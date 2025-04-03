$(document).ready(function(){
    let staticDOGEPrice =parseFloat($('#static_doge_price').val().replace(/,/g,""))
    let totalBalance = $('#static_account_balance').val();
    let lastDOGEPrice = null;
    let getliveprice=0;
function fetchDOGEPrice() {
    if(staticDOGEPrice==0.00){
         console.log("fund DOGE wallet");
    }else{
        $.ajax({
            url: 'https://api.coingecko.com/api/v3/simple/price?ids=dogecoin&vs_currencies=usd&include_24hr_change=true',
            type: 'GET',
            success: function(response) {
                let livePrice = response.dogecoin.usd; // Get live DOGE price
                let percentageChange24h = response.dogecoin.usd_24h_change; // Get 24h percentage change
                console.log("Live DOGE Price:", livePrice);
                console.log("DOGE 24h Change Percentage:", percentageChange24h.toFixed(2) + "%");
                  getliveprice=livePrice;
                if (lastDOGEPrice === null) {
                    lastDOGEPrice = livePrice;
                    updateDOGEUI(livePrice, 0, percentageChange24h); // No real-time change on first call
                    return;
                }
    
                // Calculate percentage change since last update
                let percentageChange = ((livePrice - lastDOGEPrice) / lastDOGEPrice) * 100;
                console.log("DOGE Change Percentage:", percentageChange.toFixed(2) + "%");
    
                // Adjust static DOGE price based on percentage change
                staticDOGEPrice *= (1 + (percentageChange / 100));
    
                // Adjust total account balance accordingly
                totalBalance *= (1 + (percentageChange / 100));
    
                // Update last DOGE price
                lastDOGEPrice = livePrice;
    
                // Update UI
                updateDOGEUI(livePrice, percentageChange, percentageChange24h);
            },
            error: function() {
                console.error("Error fetching DOGE price");
            }
        });
    }
}

function updateDOGEUI(livePrice, percentageChange, percentageChange24h) {
    // Format numbers with commas
    let formattedLivePrice = livePrice.toLocaleString("en-US", { minimumFractionDigits: 4 });
    let formattedStaticPrice = staticDOGEPrice.toLocaleString("en-US", { minimumFractionDigits: 4 });
    let formattedTotalBalance = totalBalance.toLocaleString("en-US", { minimumFractionDigits: 2 });
    let formattedChange = percentageChange.toFixed(2);
    let formatted24hChange = percentageChange24h.toFixed(2);

    // Update HTML using jQuery
    $("#staticDOGEPrice").html(`$${formattedStaticPrice}`);
   // $("#totalBalance").html(`$${formattedTotalBalance}`);
    $('#dynamic_account_balance').val(`${formattedTotalBalance.toLocaleString()}`);
    $('#dynamic_doge_price').val(`${formattedStaticPrice.toLocaleString()}`);

    // Update real-time percentage change
    $("#dogeChange").html(`<span class="${percentageChange >= 0 ? 'green' : 'red'}">${formattedChange}%</span>`);
    
    // Update 24h percentage change
    $("#dogeChange24h").html(`<span class="${percentageChange24h >= 0 ? 'green' : 'red'}">${formatted24hChange}% (24h)</span>`);
    
}
let dogeRate = 0; // Global variable to store DOGE price in USD

// Function to fetch the latest DOGE price from CoinGecko
function fetchNewDOGEPrice() {
    $.ajax({
        url: "https://api.coingecko.com/api/v3/simple/price",
        method: "GET",
        data: {
            ids: "dogecoin",
            vs_currencies: "usd"
        },
        success: function (response) {
            dogeRate = response.dogecoin.usd; // Update DOGE price
            console.log("DOGE Price:", dogeRate);
        },
        error: function (error) {
            console.error("Error fetching DOGE price:", error);
        }
    });
}

// Fetch DOGE price when the page loads
fetchNewDOGEPrice();

// Convert USD to DOGE on keyup event
$("#doge_amount").on("keyup", function () {
    let usdAmount = parseFloat($(this).val());
    if (dogeRate > 0 && usdAmount > 0) {
        let dogeValue = (usdAmount / dogeRate).toFixed(8);
        $("#amount_in_doge").val(dogeValue);
    } else {
        $("#amount_in_doge").val(""); // Clear input if invalid
    }
});


fetchDOGEPrice();

setInterval(fetchDOGEPrice, fetchNewDOGEPrice, 10000);

})