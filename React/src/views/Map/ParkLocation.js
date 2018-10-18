import React, { Component } from 'react';
import ReactDOM from 'react-dom'
import { Map, InfoWindow, Marker, GoogleApiWrapper } from 'google-maps-react';
import { Card, CardHeader, CardBody, ButtonGroup, Button } from 'reactstrap';
import axios from "axios";
import socketIOClient from "socket.io-client";
import SelectPlacesAutocomplete from "./SelectPlacesAutocomplete"
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";
import './react-contextmenu.css'

class ParkLocation extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showingInfoWindow: false,
            showingNewInfoWindow: false,
            activeMarker: {},
            selectedPlace: {},
            data: null,
            endpoint: "http://localhost:4000",
            markerList: [],
            lat: 0,
            lng: 0
        };
    }

    componentWillMount() {
        const { endpoint } = this.state;
        const socket = socketIOClient(endpoint);
        socket.on("getPark", res => {
            if (JSON.stringify(this.state.data) !== JSON.stringify(res)) this.setState({ data: res })
        });
    }

    onMarkerClick = (props, marker, e) =>
        this.setState({
            selectedPlace: props,
            activeMarker: marker,
            showingInfoWindow: true,
            showingNewInfoWindow: false
        });
    onNewMarkerClick = (props, marker, e) =>
        this.setState({
            selectedPlace: props,
            activeMarker: marker,
            showingNewInfoWindow: true,
            showingInfoWindow: false
        });

    onMapClicked = (mapProps, map, clickEvent) => {
        if (this.state.showingInfoWindow || this.state.showingNewInfoWindow) {
            this.setState({
                showingInfoWindow: false,
                showingNewInfoWindow: false,
                activeMarker: null
            })
        }
    };

    onMapRightClick = (mapProps, map, clickEvent) => {
        this.setState({
            lat: clickEvent.latLng.lat(),
            lng: clickEvent.latLng.lng(),
            showingInfoWindow: false,
            showingNewInfoWindow: false,
            activeMarker: null
        })

    }

    handleClick = (e, data) => {
        var markerNewList = this.state.markerList
        markerNewList.push({ lat: this.state.lat, lng: this.state.lng })
        this.setState({
            markerList: markerNewList
        })
    }

    removeMarker = (e) => {
        console.log("props")
        // var markerNewList = this.state.markerList
        // var index = markerNewList.indexOf(props)
        // markerNewList.splice(1, index)
        // this.setState({
        //     markerList: markerNewList
        // })
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
            this.state.markerList.map((value, key) => (
                <InfoWindow
                    key={key}
                    marker={this.state.activeMarker}
                    visible={this.state.showingNewInfoWindow}
                    onOpen={e => {
                        this.onInfoWindowOpen(this.props, e);
                    }}>
                    <div id="iwc"></div>
                </InfoWindow>
            ))
        )
    }

    onInfoWindowOpen(props, e) {
        console.log(props)
        const button = (<div>
            <ButtonGroup vertical>
                <Button onClick={this.removeMarker}>Add New Park</Button>
                <Button onClick={this.removeMarker}>Remove Marker</Button>
            </ButtonGroup>
        </div>
        );
        ReactDOM.render(React.Children.only(button), document.getElementById("iwc"));
    }

    printMarker = () => {
        if (this.state.data != null)
            return (
                this.state.data.map((value, key) => (
                    < Marker key={key} onClick={this.onMarkerClick}
                        name={value.parkname}
                        availableSlot={value.numofavailableslot}
                        numOfNotparkCar={value.numofnotparkcar}
                        position={{ lat: value.lat, lng: value.lng }} />
                ))
            )
    }

    printInfoWindow = () => {
        if (this.state.data != null)
            return (
                this.state.data.map((value, key) => (
                    <InfoWindow
                        key={key}
                        marker={this.state.activeMarker}
                        visible={this.state.showingInfoWindow}
                    >
                        <div>
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
                        </div>
                    </InfoWindow>
                ))
            )
    }

    render() {
        return (
            <div className="animated fadeIn">
                <Card>
                    <CardHeader>
                        <strong>Staff Management</strong>
                    </CardHeader>

                    <CardBody>
                        <SelectPlacesAutocomplete />
                        <br />
                        <ContextMenuTrigger id="mapContext">
                            <div id="map" style={{ height: 700, position: 'relative', overflow: 'hidden' }}>
                                < Map google={this.props.google}
                                    initialCenter={{
                                        lat: 21.006800,
                                        lng: 105.795536
                                    }}
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
                            <MenuItem data={{ foo: 'bar' }} onClick={this.handleClick}>
                                Add Marker
                            </MenuItem>
                        </ContextMenu>
                    </CardBody>
                </Card>
            </div >
        )
    }
}

export default GoogleApiWrapper({
    apiKey: ("AIzaSyCI_tVWSp_4EATQm7BHHBfpzNuYFP3t0bo")
})(ParkLocation)