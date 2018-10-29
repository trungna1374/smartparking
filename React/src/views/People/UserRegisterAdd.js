import React, { Component } from 'react';
import {
    Button,
    Card, CardBody, CardFooter, CardHeader,
    Col, Row,
    Form, FormGroup, Input, Label, FormFeedback,
    Modal, ModalBody, ModalFooter, ModalHeader,
} from 'reactstrap';
import axios from "axios";
import { AppSwitch } from '@coreui/react'
import validator from 'validator';

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
            listOfNewPlate: [],
            checkFullname: "ok",
            checkPhone: "ok",
            checkAddress: "ok",
            checkEmail: "ok",
            checkAvailableDate: "ok",
            modalClick: false,
            errorModalClick: false,
            successModalClick: false
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

    onAddClick = (event) => {
        event.preventDefault()
        var checkFullname = "ok"
        var checkPhone = "ok"
        var checkAddress = "ok"
        var checkEmail = "ok"
        var checkAvailableDate = "ok"
        var readyForSubmit = true
        if (this.state.username.trim() === '') {
            checkFullname = "Fullname couldn't  be empty"
            readyForSubmit = false
        }
        if (this.state.phone.trim() === '') {
            checkPhone = "Phone couldn't  be empty"
            readyForSubmit = false
        }
        if (this.state.address.trim() === '') {
            checkAddress = "Address couldn't  be empty"
            readyForSubmit = false
        }
        if (this.state.email.trim() === '') {
            checkEmail = "Email couldn't  be empty"
            readyForSubmit = false
        } else
            if (!validator.isEmail(this.state.email)) {
                checkEmail = "'" + this.state.email + "' is not a valid email"
                readyForSubmit = false
            }
        if (this.state.availabledate.trim() === '') {
            checkAvailableDate = "Choose available Date"
            readyForSubmit = false
        }

        this.setState({
            checkFullname: checkFullname,
            checkPhone: checkPhone,
            checkAddress: checkAddress,
            checkEmail: checkEmail,
            checkAvailableDate: checkAvailableDate
        })

        if (readyForSubmit) {
            this.setState({
                modalClick: true
            })
        }
    }

    onAddData = (event) => {
        var obj = {
            username: this.state.username,
            phone: this.state.phone,
            address: this.state.address,
            email: this.state.email,
            availabledate: this.state.availabledate,
            status: this.state.status,
            listofnewplate: this.state.listOfNewPlate
        }
        addUserData(obj).then((response) => {
            if (JSON.stringify(response) === JSON.stringify('success')) {
                this.setState({
                    successModalClick: true
                })
            } else {
                this.setState({
                    errorModalClick: true
                })
            }
        })
    }

    onRemoveModal = (event) => {
        this.setState({
            modalClick: false,
            errorModalClick: false
        })
    }

    onSuccess = (event) => {
        this.props.history.push("/userregister");
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
                                        <Input type="text" id="username" name="username" invalid={this.state.checkFullname !== "ok"} onChange={this.onChangeInput} placeholder="Please enter fullname of user" required />
                                        <FormFeedback>{this.state.checkFullname}</FormFeedback>
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Col md="3">
                                        <Label htmlFor="text-input">Phone</Label>
                                    </Col>
                                    <Col xs="12" md="9">
                                        <Input type="text" id="phone" name="phone" invalid={this.state.checkPhone !== "ok"} onChange={this.onChangeInput} placeholder="Please enter phone of user" required />
                                        <FormFeedback>{this.state.checkPhone}</FormFeedback>
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Col md="3">
                                        <Label htmlFor="text-input">Address</Label>
                                    </Col>
                                    <Col xs="12" md="9">
                                        <Input type="text" id="address" name="address" invalid={this.state.checkAddress !== "ok"} onChange={this.onChangeInput} placeholder="Please enter address of user" required />
                                        <FormFeedback>{this.state.checkAddress}</FormFeedback>
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Col md="3">
                                        <Label htmlFor="text-input">Email</Label>
                                    </Col>
                                    <Col xs="12" md="9">
                                        <Input type="text" id="email" name="email" invalid={this.state.checkEmail !== "ok"} onChange={this.onChangeInput} placeholder="Please enter email of user" required />
                                        <FormFeedback>{this.state.checkEmail}</FormFeedback>
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Col md="3">
                                        <Label htmlFor="date-input">Available Date</Label>
                                    </Col>
                                    <Col xs="12" md="9">
                                        <Input type="date" id="availabledate" name="availabledate" invalid={this.state.checkAvailableDate !== "ok"} onChange={this.onChangeInput} placeholder="date" required />
                                        <FormFeedback>{this.state.checkAvailableDate}</FormFeedback>
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
                            <Button className="mr-1 mb-1" type="submit" color="primary" onClick={this.onAddClick}><i className="fa fa-dot-circle-o"></i> Submit</Button>
                            <Button className="mr-1 mb-1" type="reset" color="danger" onClick={this.refreshPage}><i className="fa fa-ban"></i> Reset</Button>
                        </CardFooter>
                    </Card>
                    <Modal isOpen={this.state.modalClick} toggle={this.onRemoveModal} className='modal-primary' >
                        <ModalHeader toggle={this.onRemoveModal}>Confirm Message</ModalHeader>
                        <ModalBody>
                            Are you sure?
                            </ModalBody>
                        <ModalFooter>
                            <Button color="primary" onClick={this.onAddData}>Yes</Button>
                            <Button color="secondary" onClick={this.onRemoveModal}>No</Button>
                        </ModalFooter>
                    </Modal>
                    <Modal isOpen={this.state.errorModalClick} toggle={this.onRemoveModal} className='modal-danger' >
                        <ModalHeader toggle={this.onRemoveModal}>Add Status</ModalHeader>
                        <ModalBody>
                            Add error!
                            </ModalBody>
                        <ModalFooter>
                            <Button color="primary" onClick={this.onRemoveModal}>Close</Button>
                        </ModalFooter>
                    </Modal>

                    <Modal isOpen={this.state.successModalClick} toggle={this.onSuccess} className='modal-success' >
                        <ModalHeader toggle={this.onSuccess}>Add Status</ModalHeader>
                        <ModalBody>
                            Add successfully! Move to User Register Page
                            </ModalBody>
                        <ModalFooter>
                            <Button color="primary" onClick={this.onSuccess}>Close</Button>
                        </ModalFooter>
                    </Modal>
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