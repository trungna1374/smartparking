import React, { Component } from 'react';
import ReactDOM from 'react-dom'
import { Map, InfoWindow, Marker, GoogleApiWrapper } from 'google-maps-react';
import { Card, CardHeader, CardBody, ButtonGroup, Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import socketIOClient from "socket.io-client";
import { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import SelectPlacesAutocomplete from "./SelectPlacesAutocomplete"
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";
import axios from "axios";
import './react-contextmenu.css'
import NewParkModal from './NewParkModal';

const removePark = (parkId) => {
    return axios.post('/removeParkData', parkId).then((res) => res.data)
}
class ParkLocation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            center: {
                lat: 21.006800,
                lng: 105.795536
            },
            showingInfoWindow: false,
            showingNewInfoWindow: false,
            activeMarker: null,
            selectedPlace: {},
            data: null,
            endpoint: "http://localhost:4000",
            markerList: [],
            lat: 0,
            lng: 0,
            removeModalClick: false,
            addParkModal: false
        }
    }

    componentWillMount() {
        const { endpoint } = this.state;
        this.socket = socketIOClient(endpoint);
        this.socket.on("getPark", res => {
            if (JSON.stringify(this.state.data) !== JSON.stringify(res)) this.setState({ data: res })
        })
        this.socket.emit('subscribeToGetPark', 1000); 
    }

    componentWillUnmount() {
        this.socket.close();
    }

    addNewPark = (e) => {
        this.setState({
            addParkModal: !this.state.addParkModal,
            showingNewInfoWindow: false
        })
    }

    onMarkerClick = (props, marker, e) =>
        this.setState({
            selectedPlace: props,
            activeMarker: marker,
            showingInfoWindow: true,
            showingNewInfoWindow: false
        })

    onNewMarkerClick = (props, marker, e) =>
        this.setState({
            selectedPlace: props,
            activeMarker: marker,
            showingNewInfoWindow: true,
            showingInfoWindow: false
        })

    onMapClicked = (mapProps, map, clickEvent) => {
        if (this.state.showingInfoWindow || this.state.showingNewInfoWindow) {
            this.setState({
                showingInfoWindow: false,
                showingNewInfoWindow: false,
                activeMarker: null
            })
        }
    }

    onMapRightClick = (mapProps, map, clickEvent) => {
        this.setState({
            lat: clickEvent.latLng.lat(),
            lng: clickEvent.latLng.lng(),
            showingInfoWindow: false,
            showingNewInfoWindow: false,
            activeMarker: null
        })
    }

    onAddMarkerClick = (e, data) => {
        this.setState({
            markerList: this.state.markerList.concat({ lat: this.state.lat, lng: this.state.lng })
        })
    }

    onAddressSelect = address => {
        geocodeByAddress(address)
            .then(results => getLatLng(results[0]))
            .then(latLng => {
                this.setState({
                    markerList: this.state.markerList.concat({ lat: latLng.lat, lng: latLng.lng }),
                    center: { lat: latLng.lat, lng: latLng.lng }
                })
            })
            .catch(error => console.error('Error', error));
    };

    onCloseRemoveModal = (event) => {
        this.setState({
            removeModalClick: false
        })
    }

    removeMarker = (e) => {
        var value = { lat: this.state.activeMarker.position.lat(), lng: this.state.activeMarker.position.lng() }
        var markerNewList = this.state.markerList
        for (var index = 0; index < markerNewList.length; index++) {
            if (JSON.stringify(markerNewList[index]) === JSON.stringify(value)) {
                markerNewList.splice(index, 1)
                break
            }
        }
        this.setState({
            markerList: markerNewList,
            showingNewInfoWindow: false,
            activeMarker: null,
            addParkModal: false
        })
    }

    onRemoveParkClick = (e) => {
        this.setState({
            removeModalClick: true
        })
    }

    removePark = (e) => {
        var obj = { parkid: this.state.selectedPlace.id }
        removePark(obj).then((response) => {
            console.log(response)
            this.setState({
                activeMarker: null,
                selectedPlace: null,
                showingInfoWindow: false
            })
            this.onCloseRemoveModal()
        })
    }

    printNewMaker = () => {
        return (
            this.state.markerList.map((value, key) => (
                < Marker key={key} onClick={this.onNewMarkerClick}
                    position={{ lat: value.lat, lng: value.lng }}
                />
            ))
        )
    }

    printNewInfoWindow = () => {
        return (
            <InfoWindow
                marker={this.state.activeMarker}
                visible={this.state.showingNewInfoWindow}
                onOpen={e => {
                    this.onNewInfoWindowOpen(e);
                }}>
                <div id={"newparkwindowinfo"}></div>
            </InfoWindow>
        )
    }

    onNewInfoWindowOpen(e) {
        const content = (<div>
            <ButtonGroup vertical>
                <Button onClick={this.addNewPark}>Add New Park</Button>
                <Button onClick={this.removeMarker}>Remove Marker</Button>
            </ButtonGroup>
        </div>
        );
        ReactDOM.render(React.Children.only(content), document.getElementById("newparkwindowinfo"));
    }

    printMarker = () => {
        if (this.state.data != null)
            return (
                this.state.data.map((value, key) => (
                    < Marker key={key} onClick={this.onMarkerClick}
                        id={value.parkId}
                        name={value.parkname}
                        availableSlot={value.numofavailableslot}
                        label={value.numofavailableslot.toString()}
                        numOfNotparkCar={value.numofnotparkcar}
                        position={{ lat: value.lat, lng: value.lng }} />
                ))
            )
    }

    printInfoWindow = () => {
        if (this.state.data != null)
            return (
                <InfoWindow
                    marker={this.state.activeMarker}
                    visible={this.state.showingInfoWindow}
                    onOpen={e => {
                        this.onInfoWindowOpen(e);
                    }}
                >
                    <div id="parkwindowinfo"></div>
                </InfoWindow>
            )
    }

    onInfoWindowOpen(e) {
        const content = (<div>
            <h1>{this.state.selectedPlace.name}</h1>
            <table style={{ width: '100%' }}>
                <tbody>
                    <tr>
                        <td>
                            <h2>Available Slots</h2>
                        </td>
                        <td style={{ padding: '15px' }}>
                            <h2>{this.state.selectedPlace.availableSlot}</h2>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <h2>Incoming</h2>
                        </td>
                        <td style={{ padding: '15px' }}>
                            <h2>{this.state.selectedPlace.numOfNotparkCar}</h2>
                        </td>
                    </tr>
                </tbody>
            </table>
            <ButtonGroup>
                <Button onClick={this.onRemoveParkClick}>Remove Park</Button>
            </ButtonGroup>
        </div>
        );
        ReactDOM.render(React.Children.only(content), document.getElementById("parkwindowinfo"));
    }

    render() {
        return (
            <div className="animated fadeIn">
                <Card>
                    <CardHeader>
                        <strong>Staff Management</strong>
                    </CardHeader>

                    <CardBody>
                        <SelectPlacesAutocomplete onAddressSelect={this.onAddressSelect} />
                        <br />
                        <ContextMenuTrigger id="mapContext">
                            <div id="map" style={{ height: 700, position: 'relative', overflow: 'hidden' }}>
                                < Map google={this.props.google}
                                    initialCenter={this.state.center}
                                    center={this.state.center}
                                    onClick={this.onMapClicked} onRightclick={this.onMapRightClick} loadingElement={<div style={{ height: `100%` }} />}
                                    containerElement={<div style={{ height: `100%` }} />}
                                    mapElement={<div style={{ height: `100%` }} />}>
                                    {this.printMarker()}
                                    {this.printInfoWindow()}
                                    {this.printNewMaker()}
                                    {this.printNewInfoWindow()}
                                    < Marker onClick={this.onMarkerClick}
                                        position={{
                                            lat: 21.006800,
                                            lng: 105.695536
                                        }} />
                                </Map>
                            </div>
                        </ContextMenuTrigger>
                        <ContextMenu id="mapContext">
                            <MenuItem data={{ foo: 'bar' }} onClick={this.onAddMarkerClick}>
                                Add Marker
                            </MenuItem>
                        </ContextMenu>
                        <NewParkModal
                            modal={this.state.addParkModal}
                            activeMarker={this.state.activeMarker}
                            removeMarker={this.removeMarker}
                            toggle={this.addNewPark} />
                        <Modal isOpen={this.state.removeModalClick} toggle={this.onCloseRemoveModal} className='modal-primary' >
                            <ModalHeader toggle={this.onCloseRemoveModal}>Confirm Message</ModalHeader>
                            <ModalBody>
                                Are you sure?
                            </ModalBody>
                            <ModalFooter>
                                <Button color="primary" onClick={this.removePark}>Yes</Button>
                                <Button color="secondary" onClick={this.onCloseRemoveModal}>No</Button>
                            </ModalFooter>
                        </Modal>
                    </CardBody>
                </Card>
            </div >
        )
    }
}

export default GoogleApiWrapper({
    apiKey: ("AIzaSyCI_tVWSp_4EATQm7BHHBfpzNuYFP3t0bo")
})(ParkLocation)