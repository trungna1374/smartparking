import React, { Component } from 'react';
import {
    Col,
    Input,
} from 'reactstrap';
import { AppSwitch } from '@coreui/react'

class PlateInput extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        console.log(this.props.value.carNumPlate)
        return (
            <div>
                <Col xs="12" md="3"  >
                    <Input type="text" id={"plate" + this.props.keyInput} name={"plate" + this.props.keyInput} style={{ textAlign: "center" }} defaultValue={this.props.value.carNumPlate} />
                </Col>
                <Col xs="12" md="5" >
                    {/* <SelectSearch options={this.state.userDetails.listOfRfid} value={value.UID} name="rfid" placeholder="Choose RFID" /> */}
                    <Input type="select" name="rfid" id="rfid" defaultValue={this.props.value.UID}>
                        {this.props.listOfRfid.map((value1, key1) => (
                            <option key={key1} value={value1.value}>{value1.value}</option>
                        ))}
                    </Input>
                </Col>
                <Col>
                    <AppSwitch size="lg" className={'mx-1'} color={'success'} outline={'alt'} checked={this.props.value.status === 1} />
                </Col>
            </div>
        );
    }
}

export default PlateInput;