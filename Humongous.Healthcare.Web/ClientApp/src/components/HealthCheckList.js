import React, { Component } from 'react';

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

    static renderHealthChecksTable(healthChecks) {
        return (
            <table className='table table-striped' aria-labelledby="tabelLabel">
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Patient Id</th>
                        <th>Date</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {healthChecks.map(healthCheck =>
                        <tr key={healthCheck.id}>
                            <td>{healthCheck.id}</td>
                            <td>{healthCheck.patientid}</td>
                            <td>{healthCheck.date}</td>
                            <td>{healthCheck.healthstatus}</td>
                        </tr>
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
            : HealthCheckList.renderHealthChecksTable(this.state.healthChecks);

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
