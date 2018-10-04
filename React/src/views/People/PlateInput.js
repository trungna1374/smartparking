import React, { Component } from 'react';
import {
    Col,
    FormGroup,
    Input,
} from 'reactstrap';
import { AppSwitch } from '@coreui/react'

class PlateInput extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        return (
            <FormGroup row key={this.props.keyInput}>
                <Col xs="12" md="3"  >
                    <Input type="text" id={"plate" + this.props.keyInput} name={"plate" + this.props.keyInput} style={{ textAlign: "center" }} defaultValue={this.props.value.carNumPlate} />
                </Col>
                <Col xs="12" md="5" >
                    {/* <SelectSearch options={this.state.userDetails.listOfRfid} value={value.UID} name="rfid" placeholder="Choose RFID" /> */}
                    <Input type="select" name={"rfid" + this.props.keyInput} id={"rfid" + this.props.keyInput} defaultValue={this.props.value.UID}>
                        {this.props.listOfRfid.map((value1, key1) => (
                            <option key={key1} value={value1.value}>{value1.value}</option>
                        ))}
                    </Input>
                </Col>
                <Col>
                    <AppSwitch size="lg" name={"status" + this.props.keyInput} className={'mx-1'} color={'success'} outline={'alt'} checked={this.props.value.status === 1} />
                </Col>
            </FormGroup>
        );
    }
}

export default PlateInput;