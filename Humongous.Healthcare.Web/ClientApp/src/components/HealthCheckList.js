import React, { Component } from 'react';
import { HealthCheck } from './HealthCheck';

export class HealthCheckList extends Component {
    // eslint-disable-next-line
    static displayName = HealthCheckList.name

    constructor(props) {
        super(props);
        this.state = { healthChecks: [], loading: true };
        this.handleSubmitHealthCheck = this.handleSubmitHealthCheck.bind(this);
    }

    componentDidMount() {
        this.populateHealthCheckData();
    }

    handleSubmitHealthCheck(event) {
        event.preventDefault();
        console.log('Handle click.');
    }

    handleDeleteHealthCheck = (id) => {
        return fetch(process.env.REACT_APP_API_URL + '/' + id,
            {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Ocp-Apim-Subscription-Key': process.env.REACT_APP_API_KEY 
                }
            })
            .then(response => {
                this.setState({
                    healthChecks: this.state.healthChecks.filter(i => i.id !== id),
                    loading: false
                });
            });
    }

    renderHealthChecksTable = (healthChecks) => {
        return (
            <table className='table table-striped' aria-labelledby="tabelLabel">
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Patient Id</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Symptoms</th>
                    </tr>
                </thead>
                <tbody>
                    {healthChecks.map(healthCheck =>
                        <HealthCheck 
                            key={healthCheck.id}
                            healthCheck={healthCheck}
                            onDelete={() => this.handleDeleteHealthCheck(healthCheck.id)}
                        />
                    )}
                </tbody>
                <tfoot>
                    <tr>
                        <td><a href="/submit-health-check">Add HealthCheck</a></td>
                    </tr>
                </tfoot>
            </table>
        );
    }

    render() {
        let contents = this.state.loading
            ? <p><em>Loading...</em></p>
            : this.renderHealthChecksTable(this.state.healthChecks);

        return (
            <div>
                <h1 id="tabelLabel">Health Checks</h1>
                <p>This component demonstrates fetching health check data from the API.</p>
                {contents}
            </div>
        )
    }

    async populateHealthCheckData() {
        const response = await fetch(process.env.REACT_APP_API_URL + '?subscription-key=' + process.env.REACT_APP_API_KEY);
        const data = await response.json();
        this.setState({ healthChecks: data, loading: false });
    }
}
