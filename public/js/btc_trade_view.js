(function() {
    var script = document.createElement('script');
    script.src = "https://s3.tradingview.com/tv.js";
    script.async = true;
    script.onload = function() {
        new TradingView.widget({
            "width": "100%",
            "height": 500,
            "symbol": "BINANCE:BTCUSDT",
            "interval": "1",
            "timezone": "Etc/UTC",
            "theme": "light",
            "style": "1",
            "locale": "en",
            "toolbar_bg": "#f1f3f6",
            "enable_publishing": false,
            "hide_legend": false,
            "save_image": false,
            "container_id": "tradingview_chart"
        });
    };
    document.body.appendChild(script);
})();