import React, { Component } from 'react';
import {
    Button, Modal, ModalBody, ModalFooter, ModalHeader,
    Col,
    Form,
    FormGroup,
    Input,
    Label
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
            numOfSlot: 0,
            numOfAvailableSlot: 0,
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
                        lng: nextProps.activeMarker.position.lng()
                    })
                },
                error => {
                    console.error(error);
                }
            )
        }
    }

    componentDidMount() {

    }

    onChangeInput = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    onSave = (event) => {
        var obj = {
            parkname: this.state.parkName,
            address: this.state.address,
            lat: this.state.lat,
            lng: this.state.lng,
            numofslot: this.state.numOfSlot,
            numofavailableslot: this.state.numOfAvailableSlot
        }
        addParkData(obj).then((response) => {
            console.log(response)
            this.props.removeMarker()
        })
    }

    onCancel = () => {

    }

    render() {
        return (
            <div>
                <Modal isOpen={this.props.modal} toggle={this.props.toggle} className={this.props.className} size="lg">
                    <ModalHeader toggle={this.props.onCancel}>Add New Park</ModalHeader>
                    <ModalBody>
                        <Form action="sendUserUpdateForm" method="post" encType="multipart/form-data" className="form-horizontal">
                            <FormGroup row>
                                <Col md="3">
                                    <Label htmlFor="text-input">Park Name</Label>
                                </Col>
                                <Col xs="12" md="9">
                                    <Input type="text" id="parkName" name="parkName" onChange={this.onChangeInput} placeholder="Please enter park name" required />
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Col md="3">
                                    <Label htmlFor="text-input">Address</Label>
                                </Col>
                                <Col xs="12" md="9">
                                    <Input type="text" id="address" name="address" onChange={this.onChangeInput} placeholder="Please enter address of park" defaultValue={this.state.address} required />
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Col md="3">
                                    <Label htmlFor="text-input">Number Of Slot</Label>
                                </Col>
                                <Col xs="12" md="9">
                                    <Input type="number" id="numOfSlot" name="numOfSlot" onChange={this.onChangeInput} placeholder="Please enter number of available slot" required />
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Col md="3">
                                    <Label htmlFor="text-input">Number Of Available Slot</Label>
                                </Col>
                                <Col xs="12" md="9">
                                    <Input type="number" id="numOfAvailableSlot" name="numOfAvailableSlot" onChange={this.onChangeInput} placeholder="Please enter number of available slot" required />
                                </Col>
                            </FormGroup>
                        </Form>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.onSave}>Save</Button>
                        <Button color="secondary" onClick={this.onCancel}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}

export default NewParkModal;