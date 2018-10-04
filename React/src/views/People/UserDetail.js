import React, { Component } from 'react';
import { Badge, Card, CardBody, CardHeader, Col, Row, Table, Button } from 'reactstrap';
import axios from "axios";

class UserDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userDetails: null
        }
    }
    getUserRegisterDetailData = () => axios.get("http://localhost:4000/getDetailUser/" + this.props.match.params.id)
        .then((res) => res.data)
    componentWillMount() {
        if (this.state.userDetails == null) {
            this.getUserRegisterDetailData().then((res) => {
                this.setState({
                    userDetails: res
                })

            })
        }
    }
    printData = () => {
        if (this.state.userDetails != null)
            return (<Table responsive hover borderless>
                <tbody>
                    <tr>
                        <td>Username</td>
                        <td>{this.state.userDetails.username}</td>
                    </tr>
                    <tr>
                        <td>Phone</td>
                        <td>{this.state.userDetails.phone}</td>
                    </tr>
                    <tr>
                        <td>Address</td>
                        <td>{this.state.userDetails.address}</td>
                    </tr>
                    <tr>
                        <td>Date Registered</td>
                        <td>{this.state.userDetails.createDate}</td>
                    </tr>
                    <tr>
                        <td>Created By</td>
                        <td>{this.state.userDetails.createBy}</td>
                    </tr>
                    <tr>
                        <td>Status</td>
                        <td>
                            <Badge color={this.state.userDetails.status === 1 ? "success" : "danger"}>{this.state.userDetails.status === 1 ? "Active" : "Deactive"}</Badge>
                        </td>
                    </tr>
                </tbody>
            </Table>)
    }

    printPlateData = () => {
        if (this.state.userDetails != null)
            if (this.state.userDetails.listOfPlate.length > 0)
                return (<Table responsive hover borderless>
                    <thead>
                        <tr>
                            <th>Plate Number</th>
                            <th>RFID</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.userDetails.listOfPlate.map((value, key) => (
                            <tr key={key}>
                                <td>
                                    {value.carNumPlate}
                                </td>
                                <td>
                                    {value.UID}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>)
    }

    render() {
        console.log(this.state.userDetails)
        return (
            <div className="animated fadeIn">
                <Row>
                    <Col lg={6}>
                        <Card>
                            <CardHeader>
                                <strong><i className="pr-1"></i>User Id: {this.props.match.params.id}</strong>
                            </CardHeader>
                            <CardBody>
                                {this.printData()}
                            </CardBody>
                            <CardHeader>
                                <strong><i className="pr-1"></i>Plate Number - RFID</strong>
                            </CardHeader>
                            <CardBody>
                                {this.printPlateData()}
                                <Button size="lg" className="fa fa-edit mr-1 mb-1" color="info" href={"#/people/userupdate/" + this.props.match.params.id}> Update</Button>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default UserDetail;