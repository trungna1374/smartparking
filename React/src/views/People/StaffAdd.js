import React, { Component } from 'react';
import {
    Button,
    Card, CardBody, CardFooter, CardHeader,
    Col, Row,
    Form, FormGroup, Input, Label,FormFeedback,
    Modal, ModalBody, ModalFooter, ModalHeader
} from 'reactstrap';
import axios from "axios";
import { AppSwitch } from '@coreui/react'
import validator from 'validator';

const addStaffData = (staffAddData) => {
    return axios.post('/addStaffData', staffAddData).then((res) => res.data)
}

class StaffAdd extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fullname: "",
            phone: "",
            address: "",
            email: "",
            role: "admin",
            status: 0,
            checkFullname: "ok",
            checkPhone: "ok",
            checkAddress: "ok",
            checkEmail: "ok",
            modalClick: false,
            errorModalClick: false,
            successModalClick: false
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

    onAddClick = (event) => {
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
                modalClick: true
            })
        }
    }

    onAddData = (event) => {
        event.preventDefault()
        var obj = {
            username: this.state.fullname,
            phone: this.state.phone,
            address: this.state.address,
            email: this.state.email,
            role: this.state.role,
            status: this.state.status,
        }
        addStaffData(obj).then((response) => {
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
        this.props.history.push("/staff");
    }

    printData = () => {
        return (
            <Row>
                <Col xs="12" md="6">
                    <Card>
                        <CardHeader>
                            <strong>Staff Insert</strong>
                        </CardHeader>
                        <CardBody>
                            <Form action="sendUserUpdateForm" method="post" encType="multipart/form-data" className="form-horizontal">
                                <FormGroup row>
                                    <Col md="3">
                                        <Label htmlFor="text-input">Fullname</Label>
                                    </Col>
                                    <Col xs="12" md="9">
                                        <Input type="text" id="fullname" name="fullname" invalid={this.state.checkFullname !== "ok"} onChange={this.onChangeInput} placeholder="Please enter fullname of user" required />
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
                                        <Label htmlFor="select">Role</Label>
                                    </Col>
                                    <Col xs="12" md="9">
                                        <Input type="select" name="role" id="role" onChange={this.onChangeInput}>
                                            <option value="admin">Administrator</option>
                                            <option value="officer">Officer</option>
                                            <option value="security">Security</option>
                                        </Input>
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
                            Add successfully! Move to Staff Page
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

export default StaffAdd;