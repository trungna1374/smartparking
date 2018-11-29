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
    return axios.post('/updateUserData', userUpdateData).then((res) => res.data)
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

    handleAddPlateInput = () => {
        this.setState({
            inputClicked: this.state.inputClicked + 1
        })
        this.setState({
            listOfNewPlate: this.state.listOfNewPlate.concat({
                carNumPlate: "",
                UID: this.state.userDetails.listOfRfid[0].value,
                availableDate: "",
                status: 0
            })
        })
    }

    createPlateInput = () => {
        var input = []
        if (this.state.userDetails != null)
            for (let index = 0; index < this.state.inputClicked; index++) {
                input.push(<FormGroup row key={index}>
                    <Col xs="12" md="3"  >
                        <Input type="text" id={"newPlate" + index} name={"newPlate" + index} onChange={this.onChangePlateNumberInput} style={{ textAlign: "center" }} placeholder="Enter Plate Number" required />
                    </Col>
                    <Col xs="12" md="4" >
                        <Input type="select" name={"newRfid" + index} id={"newRfid" + index} onChange={this.onChangeRFIDInput} placeholder="Choose RFID" required>
                            {this.state.userDetails.listOfRfid.map((value1, key1) => (
                                <option key={key1} value={value1.value}>{value1.value}</option>
                            ))}
                        </Input>
                    </Col>
                    <Col xs="12" md="3">
                        <Input type="date" id={"newAvailabledate" + index} name={"newAvailabledate" + index} invalid={this.state.checkAvailableDate !== "ok"} onChange={this.onChangeAvailableDateInput} placeholder="date" required />
                        <FormFeedback>{this.state.checkAvailableDate}</FormFeedback>
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
        } else {
            var listPlate = this.state.listOfPlate
            listPlate[event.target.name.substring(5)].carNumPlate = event.target.value
            this.setState({
                listOfPlate: listPlate
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
        } else {
            var listPlate = this.state.listOfPlate
            listPlate[event.target.name.substring(4)].UID = event.target.value
            this.setState({
                listOfPlate: listPlate
            })
        }
    }

    onChangeAvailableDateInput = (event) => {
        if (event.target.name.includes("newAvailabledate")) {
            var listPlate = this.state.listOfNewPlate
            listPlate[event.target.name.substring(16)].availableDate = event.target.value
            this.setState({
                listOfNewPlate: listPlate
            })
        } else {
            var listPlate = this.state.listOfPlate
            listPlate[event.target.name.substring(13)].availableDate = event.target.value
            this.setState({
                listOfPlate: listPlate
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
        } else {
            var listPlate = this.state.listOfPlate
            listPlate[event.target.name.substring(11)].status = event.target.checked ? 1 : 0
            this.setState({
                listOfPlate: listPlate
            })
        }
    }

    refreshPage() {
        window.location.reload();
    }

    onUpdateClick = (event) => {
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
        // if (this.state.availabledate.trim() === '') {
        //     checkAvailableDate = "Choose available Date"
        //     readyForSubmit = false
        // }

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

    onUpdateData = (event) => {
        var listOfReleaseRFID = []
        for (var i = 0; i < this.state.userDetails.listOfPlate.length; i++) {
            if (this.state.userDetails.listOfPlate[i].UID != this.state.listOfPlate[i].UID) {
                listOfReleaseRFID.push({
                    UID: this.state.userDetails.listOfPlate[i].UID
                })
            }
        }
        var obj = {
            accountId: this.state.accountId,
            username: this.state.username,
            phone: this.state.phone,
            address: this.state.address,
            email: this.state.email,
            status: this.state.status,
            listofplate: this.state.listOfPlate,
            listofnewplate: this.state.listOfNewPlate,
            listofreleaserfid: listOfReleaseRFID
        }

        console.log(obj)

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
        this.props.history.push("/userregister");
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
                                            <Input type="text" id="username" name="username" invalid={this.state.checkFullname !== "ok"} onChange={this.onChangeInput} placeholder="Please enter fullname of user" defaultValue={this.state.userDetails.username} required />
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
                                            <AppSwitch size="lg" name={"status"} className={'mx-1'} color={'success'} outline={'alt'} onChange={this.onChangeRadioInput} checked={this.state.userDetails.status === 1} label />
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="3">
                                            <Label htmlFor="text-input">List of Plates</Label>
                                        </Col>
                                    </FormGroup>
                                    {
                                        this.state.userDetails.listOfPlate.map((value, key) => (
                                            <FormGroup row key={key}>
                                                <Col xs="12" md="3"  >
                                                    <Input type="text" id={"plate" + key} name={"plate" + key} onChange={this.onChangePlateNumberInput} style={{ textAlign: "center" }} defaultValue={value.carNumPlate} required />
                                                </Col>
                                                <Col xs="12" md="4" >
                                                    <Input type="select" name={"rfid" + key} id={"rfid" + key} onChange={this.onChangeRFIDInput} defaultValue={value.UID} required>
                                                        <option value={value.UID}>{value.UID}</option>
                                                        {this.state.userDetails.listOfRfid.map((value1, key1) => (
                                                            <option key={key1} value={value1.value}>{value1.value}</option>
                                                        ))}
                                                    </Input>
                                                </Col>
                                                <Col xs="12" md="3">
                                                    <Input type="date" id={"availabledate" + key} name={"availabledate" + key} invalid={this.state.checkAvailableDate !== "ok"} onChange={this.onChangeAvailableDateInput} defaultValue={value.availableDate} placeholder="date" required />
                                                    <FormFeedback>{this.state.checkAvailableDate}</FormFeedback>
                                                </Col>
                                                <Col>
                                                    <AppSwitch size="lg" name={"statusPlate" + key} className={'mx-1'} color={'success'} outline={'alt'} onChange={this.onChangePlateRadioInput} checked={value.status === 1} label required />
                                                </Col>
                                            </FormGroup>
                                        ))}
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
                                Update successfully! Move to User Register Page
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