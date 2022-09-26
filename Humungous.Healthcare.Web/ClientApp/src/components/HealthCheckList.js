import React, { Component } from 'react';

export class HealthCheckList extends Component {
    static displayName = HealthCheckList.name

    constructor(props) {
        super(props);
        this.state = { healthChecks: [], loading: true };
    }

    componentDidMount() {
        this.populateHealthCheckData();
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
                        <th>Symptoms</th>
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
        const response = await fetch('https://taw4-apiservice-jrc23a.azure-api.net/HealthCheck?subscription-key=5a896ea85a2147349c51371f09be4ea8');
        const data = await response.json();
        this.setState({ healthChecks: data, loading: false });
    }
}
