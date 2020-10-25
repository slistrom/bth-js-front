import React, {Component} from 'react';
import io from 'socket.io-client';
import Chart from 'chart.js';

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

let socket = io.connect("http://localhost:1339");

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
            }
        };
    }

    componentDidMount() {
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

    componentDidUpdate() {
        // this.drawCharts(this.state.amethyst);
        // myChart.update();

    }

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

    render() {
        return (
            <main>
                <h3>Trading</h3>
                <p>This is where you buy stuff!</p>
                <p>{this.state.products[0].name}</p>
                <p>{this.state.products[0].startingPoint}</p>
                <canvas id="amethystChart" className="crystalchart"></canvas>
                <canvas id="rosequartzChart" className="crystalchart"></canvas>
                <canvas id="seleniteChart" className="crystalchart"></canvas>
            </main>
        );
    }
}

export default Trading;
