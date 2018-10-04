import React, { Component } from 'react';
import {
    Badge,
    Button,
    ButtonDropdown,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Col,
    Collapse,
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    Fade,
    Form,
    FormGroup,
    FormText,
    FormFeedback,
    Input,
    InputGroup,
    InputGroupAddon,
    InputGroupText,
    Label,
    Row,
    ButtonGroup,
} from 'reactstrap';
import axios from "axios";
import PlateInput from './PlateInput';

var options = []
class UserUpdate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userDetails: null,
            inputClicked: 0
        }
    }

    getUserRegisterDetailData = () => axios.get("http://localhost:4000/getDetailUser/" + this.props.match.params.id)
        .then((res) => res.data)
    componentWillMount() {
        if (this.state.userDetails == null) {
            this.getUserRegisterDetailData().then((res) => {
                res.listOfPlate.map((value, key) => {
                    var obj = {
                        value: value.UID,
                    }
                    res.listOfRfid.push(obj)
                })
                this.setState({
                    userDetails: res
                })
            })
        }
    }

    handleAddPlateInput = () => {
        this.setState({
            inputClicked: this.state.inputClicked + 1
        })
    }

    createPlateInput = () => {
        var input = []
        for (let index = 0; index < this.state.inputClicked; index++) {
            input.push(<PlateInput key={this.state.userDetails.listOfPlate.length + index} keyInput={this.state.userDetails.listOfPlate.length + index} value="" listOfRfid={this.state.userDetails.listOfRfid} />)
        }
        return input;
    }

    printData = () => {

        if (this.state.userDetails != null)
            return (
                <Row>
                    <Col xs="12" md="6">
                        <Card>
                            {console.log(this.state.userDetails.listOfRfid)}
                            <CardHeader>
                                <strong>User Update</strong>
                            </CardHeader>
                            <CardBody>
                                <Form action="" method="post" encType="multipart/form-data" className="form-horizontal">
                                    <FormGroup row>
                                        <Col md="3">
                                            <Label>User Id</Label>
                                        </Col>
                                        <Col xs="12" md="9">
                                            <Input type="text" id="userid" name="userid" defaultValue={this.props.match.params.id} disabled />
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="3">
                                            <Label htmlFor="text-input">Username</Label>
                                        </Col>
                                        <Col xs="12" md="9">
                                            <Input type="text" id="username" name="username" placeholder="Please enter fullname of user" defaultValue={this.state.userDetails.username} />
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="3">
                                            <Label htmlFor="text-input">Phone</Label>
                                        </Col>
                                        <Col xs="12" md="9">
                                            <Input type="text" id="phone" name="phone" placeholder="Please enter phone of user" defaultValue={this.state.userDetails.phone} />
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="3">
                                            <Label htmlFor="text-input">Phone</Label>
                                        </Col>
                                        <Col xs="12" md="9">
                                            <Input type="text" id="address" name="address" placeholder="Please enter address of user" defaultValue={this.state.userDetails.address} />
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="3">
                                            <Label>Status</Label>
                                        </Col>
                                        <Col md="9">
                                            <FormGroup check inline>
                                                <Input className="form-check-input" type="radio" id="inline-radio1" name="status" value="active" defaultChecked={this.state.userDetails.status === 1} />
                                                <Label className="form-check-label" check htmlFor="inline-radio1">Active</Label>
                                            </FormGroup>
                                            <FormGroup check inline>
                                                <Input className="form-check-input" type="radio" id="inline-radio2" name="status" value="deactive" defaultChecked={this.state.userDetails.status !== 1} />
                                                <Label className="form-check-label" check htmlFor="inline-radio2">Deactive</Label>
                                            </FormGroup>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="3">
                                            <Label htmlFor="text-input">List of Plates</Label>
                                        </Col>
                                    </FormGroup>
                                    {
                                        this.state.userDetails.listOfPlate.map((value, key) => (
                                            <PlateInput key={key} keyInput={key} value={value} listOfRfid={this.state.userDetails.listOfRfid} />
                                        ))}
                                    {
                                        this.createPlateInput()
                                    }
                                    <FormGroup row>
                                        <Col>
                                            <Button onClick={this.handleAddPlateInput}>Add New</Button>
                                        </Col>
                                    </FormGroup>
                                </Form>
                            </CardBody>
                            <CardFooter>
                                <Button type="submit" size="sm" color="primary"><i className="fa fa-dot-circle-o"></i> Submit</Button>
                                <Button type="reset" size="sm" color="danger"><i className="fa fa-ban"></i> Reset</Button>
                            </CardFooter>
                        </Card>
                    </Col>
                </Row>
            )
    }

    render() {
        console.log(this.state.userDetails)
        return (
            <div>
                {this.printData()}
            </div>
        );
    }
}

export default UserUpdate;