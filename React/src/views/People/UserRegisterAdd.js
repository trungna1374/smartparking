import React, { Component } from 'react';
import { Button, Card, CardBody, CardFooter, CardHeader, Col, Form, FormGroup, Input, Label, Row, } from 'reactstrap';
import axios from "axios";
import { AppSwitch } from '@coreui/react'

const addUserData = (userAddData) => {
    return axios.post('/addUserData', userAddData).then((res) => res.data)
}

class UserRegisterAdd extends Component {
    constructor(props) {
        super(props);
        this.state = {
            inputClicked: 0,
            username: "",
            phone: "",
            address: "",
            email: "",
            availabledate: "",
            status: 0,
            listOfAvailableRFID: [],
            listOfNewPlate: []
        }
    }

    getUserRegisterDetailData = () => axios.get("/getAvailableRFID")
        .then((res) => res.data)
    componentWillMount() {
        if (this.state.userDetails == null) {
            this.getUserRegisterDetailData().then((res) => {
                this.setState({
                    listOfAvailableRFID: res
                })
            })
        }
    }

    handleAddPlateInput = () => {
        this.setState({
            inputClicked: this.state.inputClicked + 1
        })
        this.setState({
            listOfNewPlate: this.state.listOfNewPlate.concat({
                carNumPlate: "",
                UID: this.state.listOfAvailableRFID[0].UID,
                status: 0
            })
        })
    }

    createPlateInput = () => {
        var input = []
        if (this.state.listOfAvailableRFID != null)
            for (let index = 0; index < this.state.inputClicked; index++) {
                input.push(<FormGroup row key={index}>
                    <Col xs="12" md="3"  >
                        <Input type="text" id={"newPlate" + index} name={"newPlate" + index} onChange={this.onChangePlateNumberInput} style={{ textAlign: "center" }} placeholder="Enter Plate Number" required />
                    </Col>
                    <Col xs="12" md="5" >
                        <Input type="select" name={"newRfid" + index} id={"newRfid" + index} onChange={this.onChangeRFIDInput} placeholder="Choose RFID" required>
                            {this.state.listOfAvailableRFID.map((value1, key1) => (
                                <option key={key1} value={value1.UID}>{value1.UID}</option>
                            ))}
                        </Input>
                    </Col>
                    <Col>
                        <AppSwitch size="lg" name={"newStatusPlate" + index} className={'mx-1'} color={'success'} outline={'alt'} onChange={this.onChangePlateRadioInput} label />
                    </Col>
                </FormGroup>)
            }
        return input;
    }

    onChangeInput = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    onChangeRadioInput = (event) => {
        this.setState({
            [event.target.name]: event.target.checked ? 1 : 0
        })
    }

    onChangePlateNumberInput = (event) => {
        if (event.target.name.includes("newPlate")) {
            var listPlate = this.state.listOfNewPlate
            listPlate[event.target.name.substring(8)].carNumPlate = event.target.value
            this.setState({
                listOfNewPlate: listPlate
            })
        }
    }

    onChangeRFIDInput = (event) => {
        if (event.target.name.includes("newRfid")) {
            var listPlate = this.state.listOfNewPlate
            listPlate[event.target.name.substring(7)].UID = event.target.value
            this.setState({
                listOfNewPlate: listPlate
            })
        }
    }

    onChangePlateRadioInput = (event) => {
        if (event.target.name.includes("newStatusPlate")) {
            var listPlate = this.state.listOfNewPlate
            listPlate[event.target.name.substring(14)].status = event.target.checked ? 1 : 0
            this.setState({
                listOfNewPlate: listPlate
            })
        }
    }

    refreshPage() {
        window.location.reload();
    }

    submitForm = (event) => {
        event.preventDefault()
        var obj = {
            username: this.state.username,
            phone: this.state.phone,
            address: this.state.address,
            email: this.state.email,
            availabledate: this.state.availabledate,
            status: this.state.status,
            listofnewplate: this.state.listOfNewPlate
        }
        console.log(obj)
        addUserData(obj).then((response) => {
            console.log(response)
        })
    }

    printData = () => {
        return (
            <Row>
                <Col xs="12" md="6">
                    <Card>
                        <CardHeader>
                            <strong>User Update</strong>
                        </CardHeader>
                        <CardBody>
                            <Form action="sendUserUpdateForm" method="post" encType="multipart/form-data" className="form-horizontal">
                                <FormGroup row>
                                    <Col md="3">
                                        <Label htmlFor="text-input">Username</Label>
                                    </Col>
                                    <Col xs="12" md="9">
                                        <Input type="text" id="username" name="username" onChange={this.onChangeInput} placeholder="Please enter fullname of user" required />
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Col md="3">
                                        <Label htmlFor="text-input">Phone</Label>
                                    </Col>
                                    <Col xs="12" md="9">
                                        <Input type="text" id="phone" name="phone" onChange={this.onChangeInput} placeholder="Please enter phone of user" required />
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Col md="3">
                                        <Label htmlFor="text-input">Address</Label>
                                    </Col>
                                    <Col xs="12" md="9">
                                        <Input type="text" id="address" name="address" onChange={this.onChangeInput} placeholder="Please enter address of user" required />
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Col md="3">
                                        <Label htmlFor="text-input">Email</Label>
                                    </Col>
                                    <Col xs="12" md="9">
                                        <Input type="text" id="email" name="email" onChange={this.onChangeInput} placeholder="Please enter email of user" required />
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Col md="3">
                                        <Label htmlFor="date-input">Available Date</Label>
                                    </Col>
                                    <Col xs="12" md="9">
                                        <Input type="date" id="availabledate" name="availabledate" onChange={this.onChangeInput} placeholder="date" required />
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Col md="3">
                                        <Label>Status</Label>
                                    </Col>
                                    <Col md="9">
                                        <AppSwitch size="lg" name={"status"} className={'mx-1'} color={'success'} outline={'alt'} onChange={this.onChangeRadioInput} label />
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Col md="3">
                                        <Label htmlFor="text-input">List of Plates</Label>
                                    </Col>
                                </FormGroup>
                                {
                                    this.createPlateInput()
                                }
                                <FormGroup row>
                                    <Col>
                                        <Button onClick={this.handleAddPlateInput}>Add New</Button>
                                    </Col>
                                </FormGroup>
                            </Form>
                        </CardBody>
                        <CardFooter>
                            <Button className="mr-1 mb-1" type="submit" color="primary" onClick={this.submitForm}><i className="fa fa-dot-circle-o"></i> Submit</Button>
                            <Button className="mr-1 mb-1" type="reset" color="danger" onClick={this.refreshPage}><i className="fa fa-ban"></i> Reset</Button>
                        </CardFooter>
                    </Card>
                </Col>
            </Row>
        )
    }

    render() {
        return (
            <div>
                {this.printData()}
            </div>
        );
    }
}

export default UserRegisterAdd;