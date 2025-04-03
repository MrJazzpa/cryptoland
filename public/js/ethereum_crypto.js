$(document).ready(function(){
    let staticETHPrice = parseFloat($('#static_eth_price').val().replace(/,/g,""))
let totalBalance = $('#static_account_balance').val();
let lastETHPrice = null;

function fetchETHPrice() {
    if(staticETHPrice==0.00){
        console.log("fund ETH wallet");
    }else{
        $.ajax({
            url: 'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd&include_24hr_change=true',
            type: 'GET',
            success: function(response) {
                let livePrice = response.ethereum.usd; // Get live ETH price
                let percentageChange24h = response.ethereum.usd_24h_change; // Get 24h percentage change
                console.log("Live ETH Price:", livePrice);
                console.log("ETH 24h Change Percentage:", percentageChange24h.toFixed(2) + "%");
    
                // First time fetching ETH price, set lastETHPrice & staticETHPrice
                if (lastETHPrice === null) {
                    lastETHPrice = livePrice;
                    updateETHUI(livePrice, 0, percentageChange24h); // No real-time change on first call
                    return;
                }
    
                // Calculate percentage change since last update
                let percentageChange = ((livePrice - lastETHPrice) / lastETHPrice) * 100;
                console.log("ETH Change Percentage:", percentageChange.toFixed(2) + "%");
    
                // Adjust static ETH price based on percentage change
                staticETHPrice *= (1 + (percentageChange / 100));
    
                // Adjust total account balance accordingly
                totalBalance *= (1 + (percentageChange / 100));
    
                // Update last ETH price
                lastETHPrice = livePrice;
    
                // Update UI
                updateETHUI(livePrice, percentageChange, percentageChange24h);
            },
            error: function() {
                console.error("Error fetching ETH price");
            }
        });
    }
}

function updateETHUI(livePrice, percentageChange, percentageChange24h) {
    // Format numbers with commas
    let formattedLivePrice = livePrice.toLocaleString("en-US", { minimumFractionDigits: 2 });
    let formattedStaticPrice = staticETHPrice.toLocaleString("en-US", { minimumFractionDigits: 2 });
    let formattedTotalBalance = totalBalance.toLocaleString("en-US", { minimumFractionDigits: 2 });
    let formattedChange = percentageChange.toFixed(2);
    let formatted24hChange = percentageChange24h.toFixed(2);

    // Update HTML using jQuery
    $("#staticETHPrice").html(`$${formattedStaticPrice}`);
   // $("#totalBalance").html(`$${formattedTotalBalance}`);
   // $('#dynamic_account_balance').val(`${formattedTotalBalance.toLocaleString()}`);
    $('#dynamic_eth_price').val(`${formattedStaticPrice.toLocaleString()}`);

    // Update real-time percentage change
    $("#ethChange").html(`<span class="${percentageChange >= 0 ? 'green' : 'red'}">${formattedChange}%</span>`);
    
    // Update 24h percentage change
    $("#ethChange24h").html(`<span class="${percentageChange24h >= 0 ? 'green' : 'red'}">${formatted24hChange}%</span>`);
}



let ethRate = 0; // Global variable to store ETH price

// Function to fetch ETH price from CoinGecko
function fetchnewETHPrice() {
    $.ajax({
        url: "https://api.coingecko.com/api/v3/simple/price",
        method: "GET",
        data: {
            ids: "ethereum",
            vs_currencies: "usd"
        },
        success: function (response) {
            ethRate = response.ethereum.usd; // Get ETH price
            console.log("ETH Price:", ethRate);
        },
        error: function (error) {
            console.error("Error fetching ETH price:", error);
        }
    });
}

fetchnewETHPrice();

// Convert USD to ETH on keypress
$("#eth_amount").on("keyup", function () {
    let usdAmount = parseFloat($(this).val());
    if (ethRate > 0 && usdAmount > 0) {
        let ethValue = (usdAmount / ethRate).toFixed(8);
        $("#amount_in_eth").val(ethValue);
    } else {
        $("#amount_in_eth").val(""); // Clear input if invalid
    }
});



// Fetch ETH price on page load and update every 10 seconds
fetchETHPrice();
// conerting from usd to eth

setInterval(fetchETHPrice, fetchnewETHPrice, 10000);

})


