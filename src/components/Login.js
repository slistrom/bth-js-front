import React, {Component} from 'react';
import {Link} from "react-router-dom";
// import { withRouter } from "react-router";
import auth from "./auth.js";

let API;

if (process.env.NODE_ENV === 'development') {
    API = 'http://localhost:1339/login/';
} else {
    API = 'https://trading-api.listrom.me/login/';
}

class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            pass: '',
            loginmsg: '',
        };
    }

    mySubmitHandler = (event) => {
        event.preventDefault();
        // const API = 'http://localhost:1339/login/';
        // const API = 'https://trading-api.listrom.me/login/';
        let payload={
            "email":this.state.email,
            "password":this.state.pass
        }

        fetch(API, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        })
        .then(response => response.json())
        .then(data => {
            if (data.data) {
                this.setState({loginmsg: `<span class="okmsg">${data.data.message}</span>`});
                auth.token = data.data.token;
                auth.email = this.state.email;
                // console.log(auth.email);
            }
            if (data.errors) {
                this.setState({loginmsg: `<span class="errmsg">${data.errors.detail}`});
            }
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

    myLogoutHandler = () =>  {
        auth.token = "";
        auth.email = "";
        this.setState({loginmsg: ''});
        this.props.history.push('/login');
    }

    render() {
        if(auth.token) {
            return (
                <main>
                    <p>You are currently logged in.</p>
                    <button className="button" onClick={this.myLogoutHandler}>
                        Logout
                    </button>
                </main>
            );
        } else {
            return (
                <main>
                    <p dangerouslySetInnerHTML={{__html: this.state.loginmsg}}></p>
                    <h3>Login</h3>
                    <form onSubmit={this.mySubmitHandler}>
                        <p>Enter your email:</p>
                        <input
                            type='text'
                            name='email'
                            required
                            onChange={this.myChangeHandler}
                        />
                        <p>Enter your password:</p>
                        <input
                            type='text'
                            name='pass'
                            required
                            onChange={this.myChangeHandler}
                        />
                        <p></p>
                        <input
                            className='button'
                            type='submit'
                            value='Login'
                        />
                    </form>
                    <p></p>
                    <Link className='button' to="/register/">Register new user</Link>
                </main>
            );
        }

    }
}

export default Login;
