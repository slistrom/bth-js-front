import React, {Component} from 'react';
import io from 'socket.io-client';
import Chart from 'chart.js';
import auth from "./auth";

var amethyst = {
    name: "Amethyst",
    rate: 1.002,
    variance: 0.6,
    startingPoint: 20,
};

var rosequartz = {
    name: "Rosequartz",
    rate: 1.001,
    variance: 0.4,
    startingPoint: 20,
};

var selenite = {
    name: "Selenite",
    rate: 1.003,
    variance: 0.2,
    startingPoint: 20,
};

var crystals = [amethyst, rosequartz, selenite];

let API;

if (process.env.NODE_ENV === 'development') {
    API = 'http://localhost:1339/';
} else {
    API = 'https://trading-api.listrom.me/';
}

let socket = io.connect("http://localhost:1339");
// let socket = io.connect("https://trading-api.listrom.me");

socket.on('connect', () => {
    console.log("Connected");
});

socket.on('disconnect', () => {
    console.log("Disconnected");
});

var amethystChart;
var rosequartzChart;
var seleniteChart;

class Trading extends Component {
    constructor() {
        super();
        this.state = {
            products: crystals,
            amethyst: {
                label: "Amethyst",
                labels: ['', '', '', '', '', '', '', '', '', ''],
                data: []
            },
            rosequartz: {
                label: "Rosequartz",
                labels: ['', '', '', '', '', '', '', '', '', ''],
                data: []
            },
            selenite: {
                label: "Selenite",
                labels: ['', '', '', '', '', '', '', '', '', ''],
                data: []
            },
            portfolio: [],
            balance: '',
            buyA: '',
            sellA: '',
            buyR: '',
            sellR: '',
            buyS: '',
            sellS: ''
        };
        // this.myChangeHandler = this.myChangeHandler.bind(this);
    }

    checkPortfolio() {
        let payload={
            "email":auth.email
        }

        fetch(API + "trading/portfolioget", {
            method: 'POST',
            headers: {
                "x-access-token": auth.token,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        })
            .then(response => response.json())
            .then(data => {
                if (data.data) {
                    this.setState({portfolio: data.data.portfolio});
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    checkSaldo() {
        let payload={
            "email":auth.email
        }

        fetch(API + "account", {
            method: 'POST',
            headers: {
                "x-access-token": auth.token,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        })
            .then(response => response.json())
            .then(data => {
                this.setState({balance: data.data.saldo})
                // console.log('Success:', data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    buyStock(prodname, amount, price) {
        let payload={
            "email":auth.email,
            "prodname": prodname,
            "amount": amount,
            "price": price
        }

        fetch(API + "trading/buystock", {
            method: 'POST',
            headers: {
                "x-access-token": auth.token,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                this.checkSaldo();
                this.checkPortfolio();
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    sellStock(prodname, amount, price) {
        let payload={
            "email":auth.email,
            "prodname": prodname,
            "amount": amount,
            "price": price
        }

        fetch(API + "trading/sellstock", {
            method: 'POST',
            headers: {
                "x-access-token": auth.token,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                this.checkSaldo();
                this.checkPortfolio();
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    componentDidMount() {
        if (auth.token) {
            this.checkSaldo();
            this.checkPortfolio();
        }
        this.drawAChart(this.state.amethyst);
        this.drawRChart(this.state.rosequartz);
        this.drawSChart(this.state.selenite);
        socket.on('stocks', (message) => {
            this.updateProducts(message);
            // this.drawCharts(this.state.amethyst);
            amethystChart.update();
            rosequartzChart.update();
            seleniteChart.update();
        });
    }

    // componentDidUpdate() {
    //     if (auth.token) {
    //         this.checkSaldo();
    //         this.checkPortfolio();
    //     }
    // }

    updateProducts(message) {
        // console.log(message);
        this.setState({products: message})
        if (this.state.amethyst.data.length <= 10) {
            this.state.amethyst.data.push(message[0].startingPoint);
        } else {
            this.state.amethyst.data.shift();
            this.state.amethyst.data.push(message[0].startingPoint);
        }
        if (this.state.rosequartz.data.length <= 10) {
            this.state.rosequartz.data.push(message[1].startingPoint);
        } else {
            this.state.rosequartz.data.shift();
            this.state.rosequartz.data.push(message[1].startingPoint);
        }
        if (this.state.selenite.data.length <= 10) {
            this.state.selenite.data.push(message[2].startingPoint);
        } else {
            this.state.selenite.data.shift();
            this.state.selenite.data.push(message[2].startingPoint);
        }
    }

    drawAChart(data) {
        var ctxA = document.getElementById('amethystChart');
        amethystChart = new Chart(ctxA, {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: [{
                    label: data.label,
                    data: data.data,
                }]
            },
            fill: false,
            options: {
            }
        });
    }

    drawRChart(data) {
        var ctxR = document.getElementById('rosequartzChart');
        rosequartzChart = new Chart(ctxR, {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: [{
                    label: data.label,
                    data: data.data,
                }]
            },
            fill: false,
            options: {
            }
        });
    }

    drawSChart(data) {
        var ctxS = document.getElementById('seleniteChart');
        seleniteChart = new Chart(ctxS, {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: [{
                    label: data.label,
                    data: data.data,
                }]
            },
            fill: false,
            options: {
            }
        });
    }

    buyAmethyst = () => {
        this.buyStock("amethyst", this.state.buyA, this.state.products[0].startingPoint);
        this.setState({buyA: ''});
    }

    sellAmethyst = () => {
        this.sellStock("amethyst", this.state.sellA, this.state.products[0].startingPoint);
        this.setState({sellA: ''});
    }

    buyRosequartz = () => {
        this.buyStock("rosequartz", this.state.buyR, this.state.products[1].startingPoint);
        this.setState({buyR: ''});
    }

    sellRosequartz = () => {
        this.sellStock("rosequartz", this.state.sellR, this.state.products[1].startingPoint);
        this.setState({sellR: ''});
    }

    buySelenite = () => {
        this.buyStock("selenite", this.state.buyS, this.state.products[2].startingPoint);
        this.setState({buyS: ''});
    }

    sellSelenite = () => {
        this.sellStock("selenite", this.state.sellS, this.state.products[2].startingPoint);
        this.setState({sellS: ''});
    }

    myChangeHandler = (event) => {
        let nam = event.target.name;
        let val = event.target.value;
        this.setState({[nam]: val});
    }

    render() {
        if(!auth.token) {
            return (
                <main>
                    <h3>Trading</h3>
                    <h4>You need to log in to view your portfolio and buy stocks.</h4>
                    <canvas id="amethystChart" className="crystalchart"></canvas>
                    <canvas id="seleniteChart" className="crystalchart"></canvas>
                    <canvas id="rosequartzChart" className="crystalchart"></canvas>
                </main>
            );
        } else {
            return (
                <main>
                    <h3>Trading</h3>
                    <h4>Your portfolio:</h4>
                    <p>Available funds in saldo: {this.state.balance} SEK.</p>
                    <h4>Stocks:</h4>
                    <Portfolio portfolio={this.state.portfolio}/>
                    <canvas id="amethystChart" className="crystalchart"></canvas>
                    <span><strong>Buy: </strong></span>
                    <input
                        type="number"
                        name="buyA"
                        className="stock-input"
                        value={this.state.buyA}
                        onChange={this.myChangeHandler}
                    /> {' '}
                    <button
                        className='button'
                        onClick={this.buyAmethyst}
                    >
                    Buy
                    </button>{' '}
                    <span><strong>Sell: </strong></span>
                    <input
                        type="number"
                        name="sellA"
                        className="stock-input"
                        value={this.state.sellA}
                        onChange={this.myChangeHandler}
                    /> {' '}
                    <button
                        className='button'
                        onClick={this.sellAmethyst}
                    >
                    Sell
                    </button>
                    <br /><br /><br /><br />
                    <canvas id="seleniteChart" className="crystalchart"></canvas>
                    <span><strong>Buy: </strong></span>
                    <input
                        type="number"
                        name="buyS"
                        className="stock-input"
                        value={this.state.buyS}
                        onChange={this.myChangeHandler}
                    /> {' '}
                    <button
                        className='button'
                        onClick={this.buySelenite}
                    >
                    Buy
                    </button>{' '}
                    <span><strong>Sell: </strong></span>
                    <input
                        type="number"
                        name="sellS"
                        className="stock-input"
                        value={this.state.sellS}
                        onChange={this.myChangeHandler}
                    /> {' '}
                    <button
                        className='button'
                        onClick={this.sellSelenite}
                    >
                    Sell
                    </button>
                    <br /><br /><br /><br />
                    <canvas id="rosequartzChart" className="crystalchart"></canvas>
                    <span><strong>Buy: </strong></span>
                    <input
                        type="number"
                        name="buyR"
                        className="stock-input"
                        value={this.state.buyR}
                        onChange={this.myChangeHandler}
                    /> {' '}
                    <button
                        className='button'
                        onClick={this.buyRosequartz}
                    >
                    Buy
                    </button>{' '}
                    <span><strong>Sell: </strong></span>
                    <input
                        type="number"
                        name="sellR"
                        className="stock-input"
                        value={this.state.sellR}
                        onChange={this.myChangeHandler}
                    /> {' '}
                    <button
                        className='button'
                        onClick={this.sellRosequartz}
                    >
                    Sell
                    </button>
                </main>
            );
        }
    }
}

function Portfolio(props) {
    if(props.portfolio.length === 0) {
        return (
            <p>Portfolio empty.</p>
        );
    } else {
        return (
            <div>
                {props.portfolio.map(item => (
                    <p key={item.prodname}>Stock: {item.prodname}. Quantity: {item.amount}</p>
                ))}
            </div>
        );
    }
}

export default Trading;
