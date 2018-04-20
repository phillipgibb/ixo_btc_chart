import React, { Component } from 'react';
import logo from './logo.png';
import './App.css';
import Chart from 'chart.js'



class App extends Component {


    componentDidMount(){
         var btcChart =new Chart('btc-line-chart', {
             type: 'line',
             data: {
                 labels: ['January','February','March','April','May','June','July','August','September','October', 'November', 'December'],
                 datasets: [{
                     data: [7011,7211,6611,6011,6081,6111,6211,6111,6311,6411,6011,7011],
                     label: "BTC/USD",
                     borderColor: "#3e95cd",
                     fill: false
                 }
                 ]
             },
             options: {
                 title: {
                     display: true,
                     text: 'Price of BitCoin in USD'
                 }
             }
         });
     }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">IXO BitCoin Price Graph</h1>
        </header>
          <canvas id="btc-line-chart" width="600" height="250"></canvas>
      </div>
    );
  }
}

export default App;
