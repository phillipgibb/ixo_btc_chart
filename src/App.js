import React, { Component } from 'react';
import logo from './logo.png';
import './App.css';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { Container, Row, Col } from 'reactstrap';
import { Form, InputGroup, Input, InputGroupAddon, Button } from 'reactstrap';

import {Line} from 'react-chartjs-2';

let Client = require('coinbase').Client;

class App extends Component {

    constructor(props) {
        super(props);
        this.toggle = this.toggle.bind(this);
        this.select = this.select.bind(this);
        this.onPauseUnpause = this.onPauseUnpause.bind(this);
        this.state = {
            loading: 'initial',
            paused: false,
            dropdownOpen: false,
            refresh_rate: 15,
            segments: 10,
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

    onPauseUnpause = (e) => {
        e.preventDefault();
        if(!this.state.paused){
            clearInterval(this.timerId);
        }else{
            this.startTimer();
        }
        this.setState({paused: !this.state.paused});
    };

    onSegmentChange = (e) => {
         e.preventDefault();
         const { value } = this.input;
         if (value === '') {
             return;
         }
         this.setState({segments: value});
    };

    toggle() {
        this.setState(prevState => ({
            dropdownOpen: !prevState.dropdownOpen
        }));
        return this.state.dropdownOpen;
    }

    select(event) {
        this.setState({
        //   dropdownOpen: !this.state.dropdownOpen,
          refresh_rate: event.target.innerText
        });
        if (this.state.paused){
            clearInterval(this.timerId);
            this.startTimer();
        }
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
                let labels = self.state.chart_data.labels.slice(0);
                
                for(let i = 0; i < nrOfspots; i++){
                    if(labels[i+1]){
                        if(labels[i+1] === 'now'){
                            labels[i] = 2*labels[i];
                        }else{
                            labels[i] = labels[i]+(labels[i] - labels[i+1]);
                        }
                    }else {
                        labels[i] = self.state.refresh_rate;
                    }
                }
                labels.push('now');

                if (nrOfspots === self.state.segments) {
                    labels.shift();
                } else {
                    nrOfspots = nrOfspots + 1;
                }
                
                datasetsCopy.forEach((datasetcopy) => {
                    datasetcopy.data.push(price.data.amount);
                    if(datasetcopy.data.length === self.state.segments+1){
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

    startTimer(){
        this.timerId = setInterval(
            () => this.getSpotPrice(),
            this.state.refresh_rate * 1000
        );
    }

    componentDidMount() {
        this.getSpotPrice();
        this.startTimer();
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
            </header>
            <Container>
                <h1 className="text-center">IXO BitCoin Price Graph</h1>
                <Row>
                    <Col>
                        <Button onClick={this.onPauseUnpause}>{this.state.paused?'Continue':'Pause'}</Button>
                    </Col>
                    <Col>
                        <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
                            <DropdownToggle>Rate({this.state.refresh_rate} seconds)</DropdownToggle>
                            <DropdownMenu>
                                <DropdownItem toggle={true} onClick={this.select}>5</DropdownItem>
                                <DropdownItem toggle={true} onClick={this.select}>15</DropdownItem>
                                <DropdownItem toggle={true} onClick={this.select}>30</DropdownItem>
                                <DropdownItem toggle={true} onClick={this.select}>45</DropdownItem>
                                <DropdownItem toggle={true} onClick={this.select}>60</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </Col>
                    <Col>
                        <Form>
                            <InputGroup>
                                <Input type="text" placeholder={this.state.segments} ref={node => this.input = node}/>
                                <InputGroupAddon addonType="append"><Button onClick={this.onSegmentChange}>Change Nr of Segments</Button></InputGroupAddon>
                            </InputGroup>
                        </Form>
                    </Col>
                    </Row>
                    <Row>
                        <Line data={this.state.chart_data}  width={600} height={250} ref='chart'/>
                    </Row>
              </Container>
          </div>
        );
    }
}

export default App;
