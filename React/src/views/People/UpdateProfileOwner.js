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

const updateStaffData = (userUpdateData) => {
    return axios.post('/updateStaffData', userUpdateData).then((res) => res.data)
}

class UpdateProfileOwner extends Component {
    constructor(props) {
        super(props);
        this.state = {
            staffDetails: null,
            accountId: "",
            fullname: "",
            phone: "",
            address: "",
            email: "",
            role: "",
            status: 0,
            checkFullname: "ok",
            checkPhone: "ok",
            checkAddress: "ok",
            checkEmail: "ok",
            updateModalClick: false,
            updateErrorModalClick: false,
            updateSuccessModalClick: false
        }
    }

    getStaffDetailData = () => axios.get("/getDetailStaff/baopn")
        .then((res) => res.data)
    componentWillMount() {
        if (this.state.staffDetails == null) {
            this.getStaffDetailData().then((res) => {
                this.setState({
                    staffDetails: res,
                    accountId: res.accountId,
                    fullname: res.fullname,
                    phone: res.phone,
                    address: res.address,
                    email: res.email,
                    role: res.role,
                    status: res.status,
                })
            })
        }
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

    refreshPage() {
        window.location.reload();
    }

    onUpdateClick = (event) => {
        event.preventDefault()
        var checkFullname = "ok"
        var checkPhone = "ok"
        var checkAddress = "ok"
        var checkEmail = "ok"
        var readyForSubmit = true
        if (this.state.fullname.trim() === '') {
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

        this.setState({
            checkFullname: checkFullname,
            checkPhone: checkPhone,
            checkAddress: checkAddress,
            checkEmail: checkEmail
        })

        if (readyForSubmit) {
            this.setState({
                updateModalClick: true
            })
        }
    }

    onUpdateData = (event) => {
        var obj = {
            accountId: this.state.accountId,
            fullname: this.state.fullname,
            phone: this.state.phone,
            address: this.state.address,
            email: this.state.email,
            role: this.state.role,
            status: this.state.status,
        }
        updateStaffData(obj).then((response) => {
            if (JSON.stringify(response) === JSON.stringify('success')) {
                this.setState({
                    updateSuccessModalClick: true
                })
            } else {
                this.setState({
                    updateErrorModalClick: true
                })
            }
        })
        this.setState({
            updateModalClick: false
        })
    }

    onRemoveModal = (event) => {
        this.setState({
            updateModalClick: false,
            updateErrorModalClick: false
        })
    }

    onSuccess = (event) => {
        this.props.history.push("/staff");
    }

    printData = () => {
        if (this.state.staffDetails != null)
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
                                            <Input type="text" id="accountid" name="accountid" defaultValue={this.state.staffDetails.accountId} disabled />
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="3">
                                            <Label htmlFor="text-input">Fullname</Label>
                                        </Col>
                                        <Col xs="12" md="9">
                                            <Input disabled type="text" id="fullname" name="fullname" invalid={this.state.checkFullname !== "ok"} onChange={this.onChangeInput} placeholder="Please enter fullname of user" defaultValue={this.state.staffDetails.fullname} required />
                                            <FormFeedback>{this.state.checkFullname}</FormFeedback>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="3">
                                            <Label htmlFor="text-input">Phone</Label>
                                        </Col>
                                        <Col xs="12" md="9">
                                            <Input type="text" id="phone" name="phone" invalid={this.state.checkPhone !== "ok"} onChange={this.onChangeInput} placeholder="Please enter phone of user" defaultValue={this.state.staffDetails.phone} required />
                                            <FormFeedback>{this.state.checkPhone}</FormFeedback>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="3">
                                            <Label htmlFor="text-input">Address</Label>
                                        </Col>
                                        <Col xs="12" md="9">
                                            <Input type="text" id="address" name="address" invalid={this.state.checkAddress !== "ok"} onChange={this.onChangeInput} placeholder="Please enter address of user" defaultValue={this.state.staffDetails.address} required />
                                            <FormFeedback>{this.state.checkAddress}</FormFeedback>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="3">
                                            <Label htmlFor="text-input">Email</Label>
                                        </Col>
                                        <Col xs="12" md="9">
                                            <Input type="text" id="email" name="email" invalid={this.state.checkEmail !== "ok"} onChange={this.onChangeInput} placeholder="Please enter email of user" defaultValue={this.state.staffDetails.email} required />
                                            <FormFeedback>{this.state.checkEmail}</FormFeedback>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="3">
                                            <Label htmlFor="select">Role</Label>
                                        </Col>
                                        <Col xs="12" md="9">
                                            <Input disabled type="select" name="role" id="role" onChange={this.onChangeInput} defaultValue={this.state.role}>
                                                <option value="admin">Administrator</option>
                                                <option value="staff">Officer</option>
                                                <option value="security">Security</option>
                                            </Input>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="3">
                                            <Label>Status</Label>
                                        </Col>
                                        <Col md="9">
                                            <AppSwitch size="lg" name={"status"} className={'mx-1'} color={'success'} outline={'alt'} onChange={this.onChangeRadioInput} checked={this.state.staffDetails.status === 1} label />
                                        </Col>
                                    </FormGroup>
                                </Form>
                            </CardBody>
                            <CardFooter>
                                <Button className="mr-1 mb-1" type="submit" color="primary" onClick={this.onUpdateClick}><i className="fa fa-dot-circle-o"></i> Submit</Button>
                                <Button className="mr-1 mb-1" type="reset" color="danger" onClick={this.refreshPage}><i className="fa fa-ban"></i> Reset</Button>
                            </CardFooter>
                        </Card>
                        <Modal isOpen={this.state.updateModalClick} toggle={this.onRemoveModal} className='modal-primary' >
                            <ModalHeader toggle={this.onRemoveModal}>Confirm Message</ModalHeader>
                            <ModalBody>
                                Are you sure?
                            </ModalBody>
                            <ModalFooter>
                                <Button color="primary" onClick={this.onUpdateData}>Yes</Button>
                                <Button color="secondary" onClick={this.onRemoveModal}>No</Button>
                            </ModalFooter>
                        </Modal>
                        <Modal isOpen={this.state.updateErrorModalClick} toggle={this.onRemoveModal} className='modal-danger' >
                            <ModalHeader toggle={this.onRemoveModal}>Update Status</ModalHeader>
                            <ModalBody>
                                Update error!
                            </ModalBody>
                            <ModalFooter>
                                <Button color="primary" onClick={this.onRemoveModal}>Close</Button>
                            </ModalFooter>
                        </Modal>

                        <Modal isOpen={this.state.updateSuccessModalClick} toggle={this.onSuccess} className='modal-success' >
                            <ModalHeader toggle={this.onSuccess}>Update Status</ModalHeader>
                            <ModalBody>
                                Update successfully! Move to Staff Page
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

export default UpdateProfileOwner;