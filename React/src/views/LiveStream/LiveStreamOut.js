import React, { Component } from 'react';
import socketIOClient from "socket.io-client";
import Iframe from 'react-iframe';
import { Badge, Card, CardBody, CardHeader, Col, Row } from 'reactstrap';

class LiveStreamOut extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cardMessage: "",
            cardStatus: 0,
            plateMessage: "",
            plateStatus: 0,
            filename: "",
            ready: false,
            endpoint: "http://169.254.231.97:8001",
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
                ready: true
            })
        })
        this.socket.on("messageCardFromServer", res => {
            var result = JSON.parse(res)
            if (result.filename !== undefined || result.filename !== '') this.setState({ filename: result.filename })
            this.setState({
                cardStatus: result.status,
                cardMessage: result.message
            })
        })
        this.socket.on("messageCarFromServer", res => {
            var result = JSON.parse(res)
            this.setState({
                plateStatus: result.status,
                plateMessage: result.message
            })
        })
    }

    printCardCard = () => {
        if (parseInt(this.state.cardStatus, 10) === 1) {
            return (<Card>
                <CardHeader>
                    Card Notification {this.state.ready ? " (ready)" : " (not ready)"}
                    <Badge pill color="success" className="float-right">pass</Badge>
                </CardHeader>
                <CardBody>
                    {this.state.cardMessage.split('\n').map((item, key) => {
                        return <h1 key={key} style={{ color: 'green' }}>{item}</h1>
                    })}

                </CardBody>
            </Card>)
        }
        if (parseInt(this.state.cardStatus, 10) === 2) {
            return (<Card>
                <CardHeader>
                    Card Notification {this.state.ready ? " (ready)" : " (not ready)"}
                    <Badge pill color="warning" className="float-right">warning</Badge>
                </CardHeader>
                <CardBody>
                    {this.state.cardMessage.split('\n').map((item, key) => {
                        return <h1 key={key} style={{ color: 'green' }}>{item}</h1>
                    })}
                </CardBody>
            </Card>)
        }
        if (parseInt(this.state.cardStatus, 10) === 3) {
            return (<Card>
                <CardHeader>
                    Card Notification {this.state.ready ? " (ready)" : " (not ready)"}
                    <Badge pill color="danger" className="float-right">hold</Badge>
                </CardHeader>
                <CardBody>
                    {this.state.cardMessage.split('\n').map((item, key) => {
                        return <h1 key={key} style={{ color: 'green' }}>{item}</h1>
                    })}
                </CardBody>
            </Card>)
        }
        return (<Card>
            <CardHeader>
                Card Notification {this.state.ready ? " (ready)" : " (not ready)"}
            </CardHeader>
            <CardBody>
            </CardBody>
        </Card>)
    }

    printPlateCard = () => {
        if (parseInt(this.state.plateStatus, 10) === 1) {
            return (<Card>
                <CardHeader>
                    Plate Detection Notification {this.state.ready ? " (ready)" : " (not ready)"}
                    <Badge pill color="success" className="float-right">pass</Badge>
                </CardHeader>
                <CardBody>
                    <h1 style={{ color: 'green' }}>{this.state.plateMessage}</h1>
                </CardBody>
            </Card>)
        }
        if (parseInt(this.state.plateStatus, 10) === 2) {
            return (<Card>
                <CardHeader>
                    Plate Detection Notification {this.state.ready ? " (ready)" : " (not ready)"}
                    <Badge pill color="warning" className="float-right">warning</Badge>
                </CardHeader>
                <CardBody>
                    <h1 style={{ color: 'yellow' }}>{this.state.plateMessage}</h1>
                </CardBody>
            </Card>)
        }
        if (parseInt(this.state.plateStatus, 10) === 3) {
            return (<Card>
                <CardHeader>
                    Plate Detection Notification {this.state.ready ? " (ready)" : " (not ready)"}
                    <Badge pill color="danger" className="float-right">hold</Badge>
                </CardHeader>
                <CardBody>
                    <h1 style={{ color: 'red' }}>{this.state.plateMessage}</h1>
                </CardBody>
            </Card>)
        }
        return (<Card>
            <CardHeader>
                Plate Detection Notification {this.state.ready ? " (ready)" : " (not ready)"}
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
                        <Iframe url="http://169.254.231.97:8083"
                            width="700px"
                            height="700px"
                            id="myId"
                            className="myClassname"
                            display="initial"
                            position="relative"
                            allowFullScreen />
                    </Col>
                    <Col xs="12" sm="6" md="4">
                        {this.printCardCard()}
                        {this.printPlateCard()}
                        <img src={"\\in\\" + this.state.filename} height="360px" width="480px" />
                    </Col>

                </Row>
            </div>

        );
    }
}

export default LiveStreamOut;