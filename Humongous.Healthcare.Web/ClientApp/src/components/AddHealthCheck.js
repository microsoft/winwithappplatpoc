import React, { Component } from 'react';

export class AddHealthCheck extends Component {
    // eslint-disable-next-line
    static displayName = AddHealthCheck.name

    constructor(props) {
        super(props);
        this.state = { 
            id: '',
            patientid: '',
            date: '',
            healthstatus: '',
            symptoms: []
        };
    }

    componentDidMount() {

    }

    handleInput = (event) => {
        const name = event.target.name;
        const newState = {};
        newState[name] = event.target.value;
        this.setState(newState);
        event.preventDefault();
    }

    handleSubmit = (event) => {
        event.preventDefault();
        console.log("Test");
        this.createHealthCheck();
    }

    render() {
        return (
            <div>
                <h4>Submit a HealthCheck:</h4>
                <form onSubmit={this.handleSubmit}>
                    <input type="hidden" name="id" placeholder="Id" value="id" />
                    <input type="text" name="patientid" placeholder="Patient Id" value={this.state.patientid} onChange={this.handleInput} />
                    <input type="text" name="date" placeholder="Date" value={this.state.date} onChange={this.handleInput} />
                    <input type="text" name="healthstatus" placeholder="Health Status" value={this.state.healthstatus} onChange={this.handleInput} />
                    <button type="submit">Submit</button>
                </form>
            </div>
        )
    }

    async createHealthCheck() {
        await fetch(process.env.REACT_APP_API_URL,
            { 
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Ocp-Apim-Subscription-Key': process.env.REACT_APP_API_KEY
            },
            body: JSON.stringify(this.state)
            }
        );

        window.location = "/health-checks"
    }
}