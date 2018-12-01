import React, { Component } from 'react';
import {
    Button, Col,
    Modal, ModalBody, ModalFooter, ModalHeader,
    Form, FormGroup, Input, Label, FormFeedback
} from 'reactstrap';
import Geocode from "react-geocode";
import axios from "axios";

Geocode.setApiKey("AIzaSyCI_tVWSp_4EATQm7BHHBfpzNuYFP3t0bo");

// Enable or disable logs. Its optional.
Geocode.enableDebug();

const addParkData = (parkAddData) => {
    return axios.post('/addParkData', parkAddData).then((res) => res.data)
}

class NewParkModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            parkName: "",
            address: "",
            lat: 0,
            lng: 0,
            numOfSlot: "",
            numOfAvailableSlot: "",
            checkParkName: "ok",
            checkAddress: "ok",
            checkNumOfSlot: "ok",
            checkNumOfAvailableSlot: "ok",
            modalClick: false,
            errorModalClick: false,
            successModalClick: false
        }
    }

    componentWillReceiveProps(nextProps) {
        // You don't have to do this check first, but it can help prevent an unneeded render
        if (nextProps.activeMarker !== null) {
            Geocode.fromLatLng(nextProps.activeMarker.position.lat(), nextProps.activeMarker.position.lng()).then(
                response => {
                    const address = response.results[0].formatted_address;
                    this.setState({
                        address: address,
                        lat: nextProps.activeMarker.position.lat(),
                        lng: nextProps.activeMarker.position.lng(),
                        parkName: "",
                        numOfSlot: "",
                        numOfAvailableSlot: "",
                        checkParkName: "ok",
                        checkAddress: "ok",
                        checkNumOfSlot: "ok",
                        checkNumOfAvailableSlot: "ok",
                        modalClick: false,
                        errorModalClick: false,
                        successModalClick: false
                    })
                },
                error => {
                    this.setState({
                        address: "",
                        lat: nextProps.activeMarker.position.lat(),
                        lng: nextProps.activeMarker.position.lng(),
                        parkName: "",
                        numOfSlot: "",
                        numOfAvailableSlot: "",
                        checkParkName: "ok",
                        checkAddress: "Error occur when try to get address, please type manually",
                        checkNumOfSlot: "ok",
                        checkNumOfAvailableSlot: "ok",
                        modalClick: false,
                        errorModalClick: false,
                        successModalClick: false
                    })
                }
            )
        }
    }

    onChangeInput = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    onAddClick = (event) => {
        event.preventDefault()
        var checkParkName = "ok"
        var checkAddress = "ok"
        var checkNumOfSlot = "ok"
        var checkNumOfAvailableSlot = "ok"
        var readyForSubmit = true
        if (this.state.parkName.trim() === '') {
            checkParkName = "Fullname couldn't  be empty"
            readyForSubmit = false
        }
        if (this.state.address.trim() === '') {
            checkAddress = "Address couldn't  be empty"
            readyForSubmit = false
        }
        if (this.state.numOfSlot.trim() === '') {
            checkNumOfSlot = "Email couldn't  be empty"
            readyForSubmit = false
        }
        if (this.state.numOfAvailableSlot.trim() === '') {
            checkNumOfAvailableSlot = "Email couldn't  be empty"
            readyForSubmit = false
        }

        if (this.state.numOfAvailableSlot.trim() !== '' && this.state.numOfSlot.trim() !== '') {
            if (parseInt(this.state.numOfAvailableSlot) > parseInt(this.state.numOfSlot)) {
                checkNumOfAvailableSlot = "Number of Available Slots couldn't  be greater than number of Slots"
                readyForSubmit = false
            }
        }

        this.setState({
            checkParkName: checkParkName,
            checkAddress: checkAddress,
            checkNumOfSlot: checkNumOfSlot,
            checkNumOfAvailableSlot: checkNumOfAvailableSlot
        })

        if (readyForSubmit) {
            this.setState({
                modalClick: true
            })
        }
    }

    onAddData = (event) => {
        var obj = {
            parkname: this.state.parkName,
            address: this.state.address,
            lat: this.state.lat,
            lng: this.state.lng,
            numofslot: this.state.numOfSlot,
            numofavailableslot: this.state.numOfAvailableSlot
        }
        addParkData(obj).then((response) => {
            if (JSON.stringify(response) === JSON.stringify('success')) {
                this.setState({
                    successModalClick: true
                })
                this.props.removeMarker()
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
            errorModalClick: false,
            successModalClick: false
        })
    }

    render() {
        return (
            <div>
                <Modal isOpen={this.props.modal} toggle={this.props.toggle} className='modal-primary' size="lg">
                    <ModalHeader toggle={this.props.toggle}>Add New Park</ModalHeader>
                    <ModalBody>
                        <Form action="sendUserUpdateForm" method="post" encType="multipart/form-data" className="form-horizontal">
                            <FormGroup row>
                                <Col md="3">
                                    <Label htmlFor="text-input">Park Name</Label>
                                </Col>
                                <Col xs="12" md="9">
                                    <Input type="text" id="parkName" name="parkName" invalid={this.state.checkParkName !== "ok"} onChange={this.onChangeInput} placeholder="Please enter park name" required />
                                    <FormFeedback>{this.state.checkParkName}</FormFeedback>
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Col md="3">
                                    <Label htmlFor="text-input">Address</Label>
                                </Col>
                                <Col xs="12" md="9">
                                    <Input type="text" id="address" name="address" invalid={this.state.checkAddress !== "ok"} onChange={this.onChangeInput} placeholder="Please enter address of park" defaultValue={this.state.address} required />
                                    <FormFeedback>{this.state.checkAddress}</FormFeedback>
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Col md="3">
                                    <Label htmlFor="text-input">Number Of Slot</Label>
                                </Col>
                                <Col xs="12" md="9">
                                    <Input type="number" id="numOfSlot" name="numOfSlot" invalid={this.state.checkNumOfSlot !== "ok"} onChange={this.onChangeInput} placeholder="Please enter number of available slot" required />
                                    <FormFeedback>{this.state.checkNumOfSlot}</FormFeedback>
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Col md="3">
                                    <Label htmlFor="text-input">Number Of Available Slot</Label>
                                </Col>
                                <Col xs="12" md="9">
                                    <Input type="number" id="numOfAvailableSlot" name="numOfAvailableSlot" invalid={this.state.checkNumOfAvailableSlot !== "ok"} onChange={this.onChangeInput} placeholder="Please enter number of available slot" required />
                                    <FormFeedback>{this.state.checkNumOfAvailableSlot}</FormFeedback>
                                </Col>
                            </FormGroup>
                        </Form>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.onAddClick}>Save</Button>
                        <Button color="secondary" onClick={this.props.toggle}>Cancel</Button>
                    </ModalFooter>
                </Modal>
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

                <Modal isOpen={this.state.successModalClick} toggle={this.onRemoveModal} className='modal-success' >
                    <ModalHeader toggle={this.onRemoveModal}>Add Status</ModalHeader>
                    <ModalBody>
                        Add successfully!
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.onRemoveModal}>Close</Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}

export default NewParkModal;