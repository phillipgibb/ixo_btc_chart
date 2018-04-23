# Initial React App for a BTC Chart. #

This is a Reactjs application that makes api calls to coinbase for the spot price of BitCoin.
The defaut rate - how many seconds coinbase is polled for the spot price is every 15 seconds,
The dafault number of segments - how many points are displayed is 10; it builds up to this as soon as it is started.
## Install ##

``` npm intsall ```

## Run ##

``` npm start ```

## Configuration ##
### Rate ###
While the app is running you can adjust the rate at which coinbase is called and hence the pace at which the the chart is updated.
This is done by choosing one of the Rates from the Rate dropdown

### Pause ###
The app can be paused by pressing the pause button

### Segments ###
The number of points on the graph can be changed, anything more th 50 is not recomended.

## Issues ##
1. The adjustement of the labels when the rate is changed is not accurate
2. The Number of segments is not validated and limited to reasonable boundaries.

### Dependencies ###

    auth0-js: 9.4.2
    bootstrap: 4.1.0
    chart.js: 2.7.2
    coinbase: 2.0.8
    jquery: 3.3.1
    react: 16.3.2
    react-chartjs-2: 2.7.0
    react-dom: 16.3.2
    react-scripts: 1.1.4
    reactstrap: 5.0.0
    
### Running Version ###

https://phillipgibb.github.io/ixo_btc_chart/
