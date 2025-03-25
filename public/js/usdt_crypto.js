$(document).ready(function(){
    let staticUSDTPrice = parseFloat($('#static_usdt_price').val().replace(/,/g,""))
let totalBalance = $('#static_account_balance').val();
let lastUSDTPrice = null;

function fetchUSDTPrice() {
     if(staticUSDTPrice==0.00){
        console.log("fund USDT Wallet")
     }else{
        $.ajax({
            url: 'https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=usd&include_24hr_change=true',
            type: 'GET',
            success: function(response) {
                let livePrice = response.tether.usd; // Get live USDT price
                let percentageChange24h = response.tether.usd_24h_change; // Get 24h percentage change
                console.log("Live USDT Price:", livePrice);
                console.log("USDT 24h Change Percentage:", percentageChange24h.toFixed(2) + "%");
    
                // First time fetching USDT price, set lastUSDTPrice & staticUSDTPrice
                if (lastUSDTPrice === null) {
                    lastUSDTPrice = livePrice;
                    updateUSDTUI(livePrice, 0, percentageChange24h); // No real-time change on first call
                    return;
                }
    
                // Calculate percentage change since last update
                let percentageChange = ((livePrice - lastUSDTPrice) / lastUSDTPrice) * 100;
                console.log("USDT Change Percentage:", percentageChange.toFixed(2) + "%");
    
                // Adjust static USDT price based on percentage change
                staticUSDTPrice *= (1 + (percentageChange / 100));
    
                // Adjust total account balance accordingly
                totalBalance *= (1 + (percentageChange / 100));
    
                // Update last USDT price
                lastUSDTPrice = livePrice;
    
                // Update UI
                updateUSDTUI(livePrice, percentageChange, percentageChange24h);
            },
            error: function() {
                console.error("Error fetching USDT price");
            }
        });
     }
}

function updateUSDTUI(livePrice, percentageChange, percentageChange24h) {
    // Format numbers with commas
    let formattedLivePrice = livePrice.toLocaleString("en-US", { minimumFractionDigits: 2 });
    let formattedStaticPrice = staticUSDTPrice.toLocaleString("en-US", { minimumFractionDigits: 2 });
    let formattedTotalBalance = totalBalance.toLocaleString("en-US", { minimumFractionDigits: 2 });
    let formattedChange = percentageChange.toFixed(2);
    let formatted24hChange = percentageChange24h.toFixed(2);

    // Update HTML using jQuery
    $("#staticUSDTPrice").html(`$${formattedStaticPrice}`);
   // $("#totalBalance").html(`$${formattedTotalBalance}`);
    $('#dynamic_account_balance').val(`${formattedTotalBalance.toLocaleString()}`);
    $('#dynamic_usdt_price').val(`${formattedStaticPrice.toLocaleString()}`);

    // Update real-time percentage change
    $("#usdtChange").html(`<span class="${percentageChange >= 0 ? 'green' : 'red'}">${formattedChange}%</span>`);
    
    // Update 24h percentage change
    $("#usdtChange24h").html(`<span class="${percentageChange24h >= 0 ? 'green' : 'red'}">${formatted24hChange}%</span>`);
}

// Fetch USDT price on page load and update every 10 seconds
fetchUSDTPrice();
setInterval(fetchUSDTPrice, 10000);

})