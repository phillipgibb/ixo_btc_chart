import React, { Component } from 'react';
import logo from './logo.png';
import './App.css';
// const LineChart = require('react-chartjs-2').Line;
import {Line} from 'react-chartjs-2';
let Client = require('coinbase').Client;


class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: 'initial',
            spot_points: 0,
            chart_data:{
                labels: [],
                datasets: [{
                    label: "USD/BTC",
                    fillColor: "rgba(220,220,220,0.2)",
                    strokeColor: "rgba(220,220,220,1)",
                    pointColor: "rgba(220,220,220,1)",
                    pointStrokeColor: "#fff",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgba(220,220,220,1)",
                    lineTension: 0,
                    data: []
                }]
            }
        };
        this.timerId = -1;
        this.coinbase_client = null;
        this.chartObject = null;
    }

    componentWillMount(){
        this.setState({ loading: 'true' });
        this.coinbase_client = new Client({
            'apiSecret': 'e9b34f284bb90f383facb54b7aaa5bb1c03e5d99b581f003ca025438e5b4b13b',
            'apiKey': '0a6c2e476fa354457c5781c5f0521981acb45f0ed3d63f43c75e056bc6acc2dd',
            'strictSSL': false
        });
    }

    getSpotPrice() {
        let self = this;
        self.coinbase_client.getSpotPrice({'currencyPair': 'BTC-USD'}, function(err, price) {
            if(!err) {
            
                const datasetsCopy = self.state.chart_data.datasets.slice(0);                
           
                let nrOfspots = self.state.spot_points;
                let labels = [];
                for(let i = nrOfspots; i > 0; i--){
                    labels.push(i*15);
                }
                labels.push('now');

                if (nrOfspots === 10) {
                    labels.shift();
                } else {
                    nrOfspots = nrOfspots + 1;
                }
                
                datasetsCopy.forEach((datasetcopy) => {
                    datasetcopy.data.push(price.data.amount);
                    if(datasetcopy.data.length === 11){
                        datasetcopy.data.shift();
                    }
                });
                
                self.setState({
                    chart_data: Object.assign({}, self.state.chart_data, {
                        datasets: datasetsCopy,
                        labels: labels,
                        options: self.state.chart_data.options
                    })
                    , spot_points: nrOfspots, loading: 'false'});
                if(self.chartObject){
                    self.chartObject.chartInstance.update();
                }
            }else{
                console.log(err);
            }
        });
    }

    componentDidMount() {
        this.getSpotPrice();
        this.timerId = setInterval(
            () => this.getSpotPrice(),
            15000
        );
    }

    componentDidUpdate(){
        if(this.state.loading === 'false') {
            this.chartObject = this.refs.chart;
        }
    }

    componentWillUnmount() {
        clearInterval(this.timerId);
    }

    render() {
        if(this.state.loading === 'initial'){
            return <h2>Intializing...</h2>;
        }
        if(this.state.loading === 'true'){
            return <h2>Loading...</h2>;
        }

        return (
          <div className="App">
            <header className="App-header">
              <img src={logo} className="App-logo" alt="logo" />
              <h1 className="App-title">IXO BitCoin Price Graph</h1>
            </header>
              <Line data={this.state.chart_data}  width={600} height={250} ref='chart'/>
          </div>
        );
    }
}

export default App;
