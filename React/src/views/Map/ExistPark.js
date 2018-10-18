import React, { Component } from 'react';
import socketIOClient from "socket.io-client";
import { InfoWindow, Marker } from 'google-maps-react';

class ExistPark extends Component {

    constructor(props) {
        super(props);

        this.state = {
            showingInfoWindow: false,
            activeMarker: {},
            selectedPlace: {},
            data: null,
            endpoint: "http://localhost:4000",
        };
    }

    componentDidMount() {
        const { endpoint } = this.state;
        const socket = socketIOClient(endpoint);
        socket.on("getPark", res => this.setState({ data: res }));
    }

    printMarker = () => {
        if (this.state.data != null) {
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
            
    }
    printInfoWindow = () => {
        if (this.state.data != null)
            return (
                this.state.data.map((value, key) => (
                    <InfoWindow
                        key={key}
                        marker={this.state.activeMarker}
                        visible={this.state.showingInfoWindow}>
                        <div>
                            <h1>{this.state.selectedPlace.name}</h1>
                            <table style={{ width: '100%' }}>
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
                            </table>
                        </div>
                    </InfoWindow>
                ))
            )
    }

    render() {
        return (
            <div>
                {this.printMarker()}
            </div>
        );
    }
}

export default ExistPark;