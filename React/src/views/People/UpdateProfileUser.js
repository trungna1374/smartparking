import React, { Component } from 'react';
import {
    Button,
    Card, CardBody, CardFooter, CardHeader,
    Col, Row,
    Form, FormGroup, Input, Label, FormFeedback,
    Modal, ModalBody, ModalFooter, ModalHeader
} from 'reactstrap';
import axios from "axios";
import { AppSwitch } from '@coreui/react'
import validator from 'validator';


const updateUserData = (userUpdateData) => {
    return axios.post('/updateUserOwnData', userUpdateData).then((res) => res.data)
}

class UserUpdate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userDetails: null,
            inputClicked: 0,
            accountId: "",
            username: "",
            phone: "",
            address: "",
            email: "",
            status: 0,
            listOfPlate: [],
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

    getUserRegisterDetailData = () => axios.get("/getDetailUser/" + this.props.match.params.id)
        .then((res) => res.data)
    componentWillMount() {
        if (this.state.userDetails == null) {
            this.getUserRegisterDetailData().then((res) => {
                var listOfPlate = []
                res.listOfPlate.forEach(element => {
                    listOfPlate.push({
                        UID: element.UID,
                        status: element.status,
                        carNumPlate: element.carNumPlate,
                        availableDate: element.availableDate,
                        id: element.id
                    })
                });
                this.setState({
                    userDetails: res,
                    accountId: res.accountId,
                    username: res.username,
                    phone: res.phone,
                    address: res.address,
                    email: res.email,
                    status: res.status,
                    listOfPlate: listOfPlate
                })

            })
        }
    }

    onChangeInput = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    refreshPage() {
        window.location.reload();
    }

    onUpdateClick = (event) => {
        event.preventDefault()
        var checkPhone = "ok"
        var checkAddress = "ok"
        var checkEmail = "ok"
        var readyForSubmit = true
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
        // if (this.state.availabledate.trim() === '') {
        //     checkAvailableDate = "Choose available Date"
        //     readyForSubmit = false
        // }

        this.setState({
            checkPhone: checkPhone,
            checkAddress: checkAddress,
            checkEmail: checkEmail,
        })

        if (readyForSubmit) {
            this.setState({
                modalClick: true
            })
        }
    }

    onUpdateData = (event) => {
        var obj = {
            accountId: this.state.accountId,
            phone: this.state.phone,
            address: this.state.address,
            email: this.state.email,
        }

        updateUserData(obj).then((response) => {
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
        window.location.reload();
    }



    printData = () => {
        if (this.state.userDetails != null)
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
                                            <Label>Account</Label>
                                        </Col>
                                        <Col xs="12" md="9">
                                            <Input type="text" id="userid" name="userid" defaultValue={this.state.userDetails.accountId} disabled />
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="3">
                                            <Label htmlFor="text-input">Username</Label>
                                        </Col>
                                        <Col xs="12" md="9">
                                            <Input type="text" id="username" name="username" invalid={this.state.checkFullname !== "ok"} onChange={this.onChangeInput} placeholder="Please enter fullname of user" defaultValue={this.state.userDetails.username} required disabled />
                                            <FormFeedback>{this.state.checkFullname}</FormFeedback>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="3">
                                            <Label htmlFor="text-input">Phone</Label>
                                        </Col>
                                        <Col xs="12" md="9">
                                            <Input type="text" id="phone" name="phone" invalid={this.state.checkPhone !== "ok"} onChange={this.onChangeInput} placeholder="Please enter phone of user" defaultValue={this.state.userDetails.phone} required />
                                            <FormFeedback>{this.state.checkPhone}</FormFeedback>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="3">
                                            <Label htmlFor="text-input">Address</Label>
                                        </Col>
                                        <Col xs="12" md="9">
                                            <Input type="text" id="address" name="address" invalid={this.state.checkAddress !== "ok"} onChange={this.onChangeInput} placeholder="Please enter address of user" defaultValue={this.state.userDetails.address} required />
                                            <FormFeedback>{this.state.checkAddress}</FormFeedback>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="3">
                                            <Label htmlFor="text-input">Email</Label>
                                        </Col>
                                        <Col xs="12" md="9">
                                            <Input type="text" id="email" name="email" invalid={this.state.checkEmail !== "ok"} onChange={this.onChangeInput} placeholder="Please enter email of user" defaultValue={this.state.userDetails.email} required />
                                            <FormFeedback>{this.state.checkEmail}</FormFeedback>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="3">
                                            <Label>Status</Label>
                                        </Col>
                                        <Col md="9">
                                            <AppSwitch size="lg" name={"status"} className={'mx-1'} color={'success'} outline={'alt'} onChange={this.onChangeRadioInput} checked={this.state.userDetails.status === 1} label disabled />
                                        </Col>
                                    </FormGroup>
                                    {this.state.userDetails.listOfPlate.length !== 0 ? (
                                        <FormGroup row>
                                            <Col md="3">
                                                <Label htmlFor="text-input">List of Plates</Label>
                                            </Col>
                                        </FormGroup>) : ("")}
                                    {
                                        this.state.userDetails.listOfPlate.map((value, key) => (
                                            <FormGroup row key={key}>
                                                <Col xs="12" md="3"  >
                                                    <Input type="text" id={"plate" + key} name={"plate" + key} onChange={this.onChangePlateNumberInput} style={{ textAlign: "center" }} defaultValue={value.carNumPlate} required disabled />
                                                </Col>
                                                <Col xs="12" md="4" >
                                                    <Input type="select" name={"rfid" + key} id={"rfid" + key} onChange={this.onChangeRFIDInput} defaultValue={value.UID} required disabled>
                                                        <option value={value.UID}>{value.UID}</option>
                                                        {this.state.userDetails.listOfRfid.map((value1, key1) => (
                                                            <option key={key1} value={value1.value}>{value1.value}</option>
                                                        ))}
                                                    </Input>
                                                </Col>
                                                <Col xs="12" md="3">
                                                    <Input type="date" id={"availabledate" + key} name={"availabledate" + key} onChange={this.onChangeAvailableDateInput} defaultValue={value.availableDate} placeholder="date" required disabled />
                                                </Col>
                                                <Col>
                                                    <AppSwitch size="lg" name={"statusPlate" + key} className={'mx-1'} color={'success'} outline={'alt'} onChange={this.onChangePlateRadioInput} checked={value.status === 1} label required disabled />
                                                </Col>
                                            </FormGroup>
                                        ))}
                                </Form>
                            </CardBody>
                            <CardFooter>
                                <Button className="mr-1 mb-1" type="submit" color="primary" onClick={this.onUpdateClick}><i className="fa fa-dot-circle-o"></i> Submit</Button>
                                <Button className="mr-1 mb-1" type="reset" color="danger" onClick={this.refreshPage}><i className="fa fa-ban"></i> Reset</Button>
                            </CardFooter>
                        </Card>
                        <Modal isOpen={this.state.modalClick} toggle={this.onRemoveModal} className='modal-primary' >
                            <ModalHeader toggle={this.onRemoveModal}>Confirm Message</ModalHeader>
                            <ModalBody>
                                Are you sure?
                            </ModalBody>
                            <ModalFooter>
                                <Button color="primary" onClick={this.onUpdateData}>Yes</Button>
                                <Button color="secondary" onClick={this.onRemoveModal}>No</Button>
                            </ModalFooter>
                        </Modal>
                        <Modal isOpen={this.state.errorModalClick} toggle={this.onRemoveModal} className='modal-danger' >
                            <ModalHeader toggle={this.onRemoveModal}>Update Status</ModalHeader>
                            <ModalBody>
                                Update error!
                            </ModalBody>
                            <ModalFooter>
                                <Button color="primary" onClick={this.onRemoveModal}>Close</Button>
                            </ModalFooter>
                        </Modal>

                        <Modal isOpen={this.state.successModalClick} toggle={this.onSuccess} className='modal-success' >
                            <ModalHeader toggle={this.onSuccess}>Update Status</ModalHeader>
                            <ModalBody>
                                Update successfully!
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

export default UserUpdate;