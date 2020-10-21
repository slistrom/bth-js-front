import React, {Component} from 'react';

class Register extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            pass: '',
        };
    }

    mySubmitHandler = (event) => {
        event.preventDefault();
        const API = 'https://trading-api.listrom.me/register/';
        let payload={
            "email":this.state.email,
            "password":this.state.pass
        }
        fetch(API, {
            method: 'POST', // or 'PUT'
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                this.props.history.push('/login');

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
        return (
            <main>
                <h3>User registration</h3>
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
                    />
                </form>
        </main>
        );
    }
}

export default Register;
