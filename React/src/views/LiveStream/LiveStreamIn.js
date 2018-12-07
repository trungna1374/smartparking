import React, { Component } from 'react';
import socketIOClient from "socket.io-client";
import Iframe from 'react-iframe';
import { Badge, Card, CardBody, CardHeader, Col, Row } from 'reactstrap';

class LiveStreamIn extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cardMessage: "",
            cardStatus: 0,
            plateMessage: "",
            plateStatus: 0,
            ready:false,
            endpoint: "http://192.168.107.238:8000",
        }
    }
    componentWillMount() {
        const { endpoint } = this.state;
        this.socket = socketIOClient(endpoint);
        this.socket.on("connect", () => {
            this.socket.emit('message', 'Connected')
        })
        this.socket.on("message", res => {
            this.setState({
                ready:true
            })
        })
        this.socket.on("messageCardFromServer", res => {
            var result = JSON.parse(res)
            this.setState({
                cardStatus: result.status,
                cardMessage: result.message
            })
        })
    }

    printCardCard = () => {
        if (this.state.cardStatus === 1) {
            return (<Card>
                <CardHeader>
                    Card Notification {this.state.ready?" (ready)":" (not ready)"}
                    <Badge pill color="success" className="float-right">pass</Badge>
                </CardHeader>
                <CardBody>
                    <h1 style={{ color: 'green' }}>{this.state.cardMessage}</h1>
                </CardBody>
            </Card>)
        }
        if (this.state.cardStatus === 2) {
            return (<Card>
                <CardHeader>
                    Card Notification {this.state.ready?" (ready)":" (not ready)"}
                    <Badge pill color="warning" className="float-right">warning</Badge>
                </CardHeader>
                <CardBody>
                    <h1 style={{ color: 'yellow' }}>{this.state.cardMessage}</h1>
                </CardBody>
            </Card>)
        }
        if (this.state.cardStatus === 3) {
            return (<Card>
                <CardHeader>
                    Card Notification {this.state.ready?" (ready)":" (not ready)"}
                    <Badge pill color="danger" className="float-right">hold</Badge>
                </CardHeader>
                <CardBody>
                    <h1 style={{ color: 'red' }}>{this.state.cardMessage}</h1>
                </CardBody>
            </Card>)
        }
        return (<Card>
            <CardHeader>
                Card Notification {this.state.ready?" (ready)":" (not ready)"}
            </CardHeader>
            <CardBody>
            </CardBody>
        </Card>)
    }

    printPlateCard = () => {
        if (this.state.plateStatus === 1) {
            return (<Card>
                <CardHeader>
                    Card Notification
                    <Badge pill color="success" className="float-right">pass</Badge>
                </CardHeader>
                <CardBody>
                    <h1 style={{ color: 'green' }}>{this.state.plateMessage}</h1>
                </CardBody>
            </Card>)
        }
        if (this.state.plateStatus === 2) {
            return (<Card>
                <CardHeader>
                    Plate Detection Notification
                    <Badge pill color="warning" className="float-right">warning</Badge>
                </CardHeader>
                <CardBody>
                    <h1 style={{ color: 'yellow' }}>{this.state.plateMessage}</h1>
                </CardBody>
            </Card>)
        }
        if (this.state.plateStatus === 3) {
            return (<Card>
                <CardHeader>
                    Plate Detection Notification
                    <Badge pill color="danger" className="float-right">hold</Badge>
                </CardHeader>
                <CardBody>
                    <h1 style={{ color: 'red' }}>{this.state.plateMessage}</h1>
                </CardBody>
            </Card>)
        }
        return (<Card>
            <CardHeader>
                Plate Detection Notification
            </CardHeader>
            <CardBody>
            </CardBody>
        </Card>)
    }

    render() {
        return (
            <div>
                <Row>
                    <Col>
                        <Iframe url="http://192.168.107.238:8081"
                            width="700px"
                            height="900px"
                            id="myId"
                            className="myClassname"
                            display="initial"
                            position="relative"
                            allowFullScreen />
                    </Col>
                    <Col xs="12" sm="6" md="4">
                        {this.printCardCard()}
                        {this.printPlateCard()}
                    </Col>

                </Row>
            </div>

        );
    }
}

export default LiveStreamIn;