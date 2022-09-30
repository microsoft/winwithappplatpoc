import { Component, Fragment } from "react";

export class HealthCheck extends Component {
    // eslint-disable-next-line
    static displayName = HealthCheck.name;

    constructor(props) {
        super(props);
        this.state = {
            id: this.props.healthCheck.id,
            patientid: this.props.healthCheck.patientid,
            date: this.props.healthCheck.date,
            healthstatus: this.props.healthCheck.healthstatus,
            symptoms: this.props.healthCheck.symptoms
        }
    }

    render() {
        return (
            <Fragment>
                <tr key={this.props.id}>
                    <td>{this.state.id}</td>
                    <td>{this.state.patientid}</td>
                    <td>{this.state.date}</td>
                    <td>{this.state.healthstatus}</td>
                    <td>
                        <ul>
                            {this.state.symptoms.map(symptom, index =>
                                <li key={index}>{symptom}</li>
                            )}
                        </ul>
                    </td>
                    <td>
                        <button onClick={this.props.onDelete}>Delete</button>
                    </td>
                </tr>
            </Fragment>
        )
    }
}

 