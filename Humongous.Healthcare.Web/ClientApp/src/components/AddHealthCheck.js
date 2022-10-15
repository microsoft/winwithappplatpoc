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
    
    handleAddSymptom = () => {
        this.setState({ symptoms: [...this.state.symptoms, ""] });
    }
    
    handleSymptomInput = (index, event) => {
        const symptoms = [...this.state.symptoms];
        symptoms[index] = event.target.value;
        this.setState({ symptoms });
    }
    
    handleDeleteSymptom = (index) => {
        return () => {
            const symptoms = this.state.symptoms;
            symptoms.splice(index, 1);
            this.setState({ symptoms });
        }
    }

    render() {
        return (
            <div>
                <h4>Submit a HealthCheck:</h4>
                <form onSubmit={this.handleSubmit}>
                    <input type="hidden" name="id" placeholder="Id" value="id" />
                    <div>
                        <label>
                            Patient ID:
                            <input type="text" name="patientid" placeholder="Patient Id" value={this.state.patientid} onChange={this.handleInput} />
                        </label>
                    </div>
                    <div>
                        <label>
                            Date:
                            <input type="date" name="date" placeholder="Date" value={this.state.date} onChange={this.handleInput} />
                        </label>
                    </div>
                    <div>
                        <label>
                            Health Status:
                            <input type="text" name="healthstatus" placeholder="Health Status" onChange={this.handleInput} />
                        </label>
                    </div>
                    <div>
                        <table className='table table-striped' aria-labelledby="tabelLabel">
                            <thead>
                                <tr>
                                    <th>Symptom</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.symptoms.map((symptom, index) =>
                                    <tr key={index}>
                                        <td>
                                            <input type="text" name="symptom" placeholder="Symptom" value={symptom || ""} onChange={e => this.handleSymptomInput(index, e)} />
                                        </td>
                                        <td><button className="button delete" type="button" onClick={this.handleDeleteSymptom(index)}>Delete</button></td>
                                    </tr>
                                )}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td>
                                        <button className="button add" type="button" onClick={this.handleAddSymptom}>Add Symptom</button>
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
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