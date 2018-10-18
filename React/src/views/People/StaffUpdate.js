import React, { Component } from 'react';
import {
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Col,
    Form,
    FormGroup,
    Input,
    Label,
    Row,
} from 'reactstrap';
import axios from "axios";
import { AppSwitch } from '@coreui/react'

const updateStaffData = (userUpdateData) => {
    return axios.post('/updateStaffData', userUpdateData).then((res) => res.data)
}

class StaffUpdate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            staffDetails: null,
            accountId: "",
            fullname: "",
            phone: "",
            address: "",
            email: "",
            role: "",
            status: 0,
        }
    }

    getStaffDetailData = () => axios.get("/getDetailStaff/" + this.props.match.params.id)
        .then((res) => res.data)
    componentWillMount() {
        if (this.state.staffDetails == null) {
            this.getStaffDetailData().then((res) => {
                this.setState({
                    staffDetails: res,
                    accountId: res.accountId,
                    fullname: res.fullname,
                    phone: res.phone,
                    address: res.address,
                    email: res.email,
                    role: res.role,
                    status: res.status,
                })
            })
        }
    }

    onChangeInput = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    onChangeRadioInput = (event) => {
        this.setState({
            [event.target.name]: event.target.checked ? 1 : 0
        })
    }

    refreshPage() {
        window.location.reload();
    }

    submitForm = (event) => {
        event.preventDefault()
        var obj = {
            accountId: this.state.accountId,
            fullname: this.state.fullname,
            phone: this.state.phone,
            address: this.state.address,
            email: this.state.email,
            role: this.state.role,
            status: this.state.status,
        }
        console.log(obj)
        updateStaffData(obj).then((response) => {
            console.log(response)
        })
    }

    printData = () => {
        if (this.state.staffDetails != null)
            return (
                <Row>
                    <Col xs="12" md="6">
                        <Card>
                            <CardHeader>
                                <strong>User Update</strong>
                            </CardHeader>
                            <CardBody>
                                <Form action="sendUserUpdateForm" method="post" encType="multipart/form-data" className="form-horizontal">
                                    <FormGroup row>
                                        <Col md="3">
                                            <Label>Account</Label>
                                        </Col>
                                        <Col xs="12" md="9">
                                            <Input type="text" id="accountid" name="accountid" defaultValue={this.state.staffDetails.accountId} disabled />
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="3">
                                            <Label htmlFor="text-input">Fullname</Label>
                                        </Col>
                                        <Col xs="12" md="9">
                                            <Input type="text" id="fullname" name="fullname" onChange={this.onChangeInput} placeholder="Please enter fullname of user" defaultValue={this.state.staffDetails.fullname} required />
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="3">
                                            <Label htmlFor="text-input">Phone</Label>
                                        </Col>
                                        <Col xs="12" md="9">
                                            <Input type="text" id="phone" name="phone" onChange={this.onChangeInput} placeholder="Please enter phone of user" defaultValue={this.state.staffDetails.phone} required />
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="3">
                                            <Label htmlFor="text-input">Address</Label>
                                        </Col>
                                        <Col xs="12" md="9">
                                            <Input type="text" id="address" name="address" onChange={this.onChangeInput} placeholder="Please enter address of user" defaultValue={this.state.staffDetails.address} required />
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="3">
                                            <Label htmlFor="text-input">Email</Label>
                                        </Col>
                                        <Col xs="12" md="9">
                                            <Input type="text" id="email" name="email" onChange={this.onChangeInput} placeholder="Please enter email of user" defaultValue={this.state.staffDetails.email} required />
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="3">
                                            <Label htmlFor="select">Role</Label>
                                        </Col>
                                        <Col xs="12" md="9">
                                            <Input type="select" name="role" id="role" onChange={this.onChangeInput} defaultValue={this.state.role}>
                                                <option value="admin">Administrator</option>
                                                <option value="staff">Officer</option>
                                                <option value="security">Security</option>
                                            </Input>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="3">
                                            <Label>Status</Label>
                                        </Col>
                                        <Col md="9">
                                            <AppSwitch size="lg" name={"status"} className={'mx-1'} color={'success'} outline={'alt'} onChange={this.onChangeRadioInput} checked={this.state.staffDetails.status === 1} label />
                                        </Col>
                                    </FormGroup>
                                </Form>
                            </CardBody>
                            <CardFooter>
                                <Button className="mr-1 mb-1" type="submit" color="primary" onClick={this.submitForm}><i className="fa fa-dot-circle-o"></i> Submit</Button>
                                <Button className="mr-1 mb-1" type="reset" color="danger" onClick={this.refreshPage}><i className="fa fa-ban"></i> Reset</Button>
                            </CardFooter>
                        </Card>
                    </Col>
                </Row>
            )
    }

    render() {
        return (
            <div>
                {this.printData()}
            </div>
        );
    }
}

export default StaffUpdate;