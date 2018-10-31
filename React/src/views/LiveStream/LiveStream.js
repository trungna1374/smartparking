import React, { Component } from 'react';
import socketIOClient from "socket.io-client";

class LiveStream extends Component {
    constructor(props) {
        super(props);
        this.state = {
            endpoint: "http://localhost:4000",
        }
    }
    componentWillMount() {
        const { endpoint } = this.state;
        this.socket = socketIOClient(endpoint);
        this.socket.on("liveStream", res => {
            console.log(res)
        })
        this.socket.emit('start-stream', 1000); 
    }

    componentWillUnmount() {
        this.socket.close();
    }
    render() {
        return (
            <div>
                
            </div>
        );
    }
}

export default LiveStream;