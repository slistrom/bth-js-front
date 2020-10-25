import React, {Component} from 'react';
import auth from "./auth.js";

let API;

if (process.env.NODE_ENV === 'development') {
    API = 'http://localhost:1339/account/';
} else {
    API = 'https://trading-api.listrom.me/account/';
}

class Account extends Component {
    constructor(props) {
        super(props);
        this.state = {
            balance: '',
            increase: '',
        };
    }

    checkSaldo() {
        let payload={
            "email":auth.email
        }

        fetch(API, {
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

    componentDidMount() {
        this.checkSaldo();
    };

    mySubmitHandler = (event) => {
        event.preventDefault();
        // console.log(this.state.increase);
        let payload={
            "email":auth.email,
            "increase": this.state.increase
        }

        fetch(API + "saldoupdate", {
            method: 'POST',
            headers: {
                "x-access-token": auth.token,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        })
            .then(response => response.json())
            .then(data => {
                this.checkSaldo();
            })
            .catch((error) => {
                console.error('Error:', error);
            });
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
                    <p>You need to log in to view your account.</p>
                </main>
            );
        } else {
            return (
                <main>
                    <h3>Your account information:</h3>
                    <p>Account balance: {this.state.balance} SEK</p>
                    <form onSubmit={this.mySubmitHandler}>
                        <p>Increase your balance:</p>
                        <input
                            type='number'
                            name='increase'
                            required
                            onChange={this.myChangeHandler}
                        />
                        <br /><br />
                        <input
                            className='button'
                            type='submit'
                            value='Deposit money to account'
                        />
                    </form>
                    <p></p>
                </main>
            );
        }
    }
}

export default Account;
