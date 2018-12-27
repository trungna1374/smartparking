import React, { Component } from 'react';
import {
    Row, Badge, Button, Col,
    Input, Label,
    Table, Card, CardBody, CardHeader,
    Modal, ModalBody, ModalFooter, ModalHeader,
} from 'reactstrap';
import axios from "axios";
import SearchFiled from './SearchFiled'
// import Pagination from "react-js-pagination";

// require("bootstrap/less/bootstrap.less");
const getStaffData = () => axios.get("/getAllStaff").then((res) => res.data)
const removeStaffData = (userData) => axios.post("/removeStaffData", userData).then((res) => res.data)
class Staff extends Component {
    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.state = {
            activeTab: '1',
            staffData: null,
            activePage: 1,
            accountId: '',
            modalClick: false,
            errorModalClick: false,
            successModalClick: false,
            searchString: ''
        };
    }

    componentWillMount() {
        if (this.state.staffData == null) {
            getStaffData().then((res) => {
                this.setState({
                    staffData: res
                })
            })
        }
    }

    toggle(tab) {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab,
            });
        }
    }

    handlePageChange(pageNumber) {
        this.setState({ activePage: pageNumber });
    }

    onRemoveStaff = (e) => {
        removeStaffData({ accountid: this.state.accountId }).then((response) => {
            if (JSON.stringify(response) === JSON.stringify('success')) {
                getStaffData().then((res) => {
                    this.setState({
                        staffData: res
                    })
                })
                this.setState({
                    successModalClick: true,
                })
            } else {
                this.setState({
                    errorModalClick: true
                })
            }
        })
    }

    onRemoveClick = (event, accountId) => {
        event.preventDefault()

        this.setState({
            modalClick: true,
            accountId: accountId
        })
    }

    onRemoveModal = (event) => {
        this.setState({
            modalClick: false,
            errorModalClick: false,
            successModalClick: false
        })
    }
    onChangeShow = () => {
        this.setState({
            showAll: !this.state.showAll
        })
    }

    _onSearchChanged = text => this.setState({ searchString: text });


    printStaffData = () => {
        let staffList = this.state.staffData;
        if (this.state.staffData !== null && this.state.searchString.length !== 0) {
            staffList = this.state.staffData.filter((staff) => {
                if (this.state.showAll)
                    return staff.fullname.toLowerCase().includes(this.state.searchString.toLowerCase()) || staff.accountId.toLowerCase().includes(this.state.searchString.toLowerCase())
                else
                    return (staff.fullname.toLowerCase().includes(this.state.searchString.toLowerCase()) || staff.accountId.toLowerCase().includes(this.state.searchString.toLowerCase()))
                        && staff.status === 1
            });
        } else
            if (this.state.staffData !== null) {
                staffList = this.state.staffData.filter((staff) => {
                    if (this.state.showAll)
                        return true
                    else
                        return staff.status === 1
                });
            }
        if (this.state.staffData != null) {
            return (<Table responsive hover>
                <thead>
                    <tr>
                        <th>Account</th>
                        <th>Fullname</th>
                        <th>Phone</th>
                        <th>Address</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {staffList.map((value, key) => (
                        <tr key={key}>
                            <td>{value.accountId}</td>
                            <td>{value.fullname}</td>
                            <td>{value.phone}</td>
                            <td>{value.address}</td>
                            <td>{value.email}</td>
                            <td>{value.role}</td>
                            <td>
                                <Badge color={value.status === 1 ? "success" : "danger"}>{value.status === 1 ? "Active" : "Deactive"}</Badge>
                            </td>
                            <td>
                                <Button className="fa fa-edit mr-1 mb-1" color="info" href={"#/staff/staffupdate/" + value.accountId}></Button>
                                <Button className="fa fa-trash-o mr-1 mb-1" color="danger" onClick={e => this.onRemoveClick(e, value.accountId)}></Button>
                            </td>
                        </tr>
                    ))}
                    <Modal isOpen={this.state.modalClick} toggle={this.onRemoveModal} className='modal-primary' >
                        <ModalHeader toggle={this.onRemoveModal}>Confirm Message</ModalHeader>
                        <ModalBody>
                            Are you sure?
                            </ModalBody>
                        <ModalFooter>
                            <Button color="primary" onClick={this.onRemoveStaff}>Yes</Button>
                            <Button color="secondary" onClick={this.onRemoveModal}>No</Button>
                        </ModalFooter>
                    </Modal>
                    <Modal isOpen={this.state.errorModalClick} toggle={this.onRemoveModal} className='modal-danger' >
                        <ModalHeader toggle={this.onRemoveModal}>Remove Status</ModalHeader>
                        <ModalBody>
                            Remove error!
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary" onClick={this.onRemoveModal}>Close</Button>
                        </ModalFooter>
                    </Modal>

                    <Modal isOpen={this.state.successModalClick} toggle={this.onRemoveModal} className='modal-success' >
                        <ModalHeader toggle={this.onRemoveModal}>Remove Status</ModalHeader>
                        <ModalBody>
                            Remove successfully! Move to Staff Page
                            </ModalBody>
                        <ModalFooter>
                            <Button color="primary" onClick={this.onRemoveModal}>Close</Button>
                        </ModalFooter>
                    </Modal>
                </tbody>
                {/* <Pagination>
                    <PaginationItem>
                        <PaginationLink previous tag="button">Previos</PaginationLink>
                    </PaginationItem>
                    <PaginationItem active>
                        <PaginationLink tag="button">1</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationLink tag="button">2</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationLink tag="button">3</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationLink tag="button">4</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationLink next tag="button">Next</PaginationLink>
                    </PaginationItem>
                </Pagination> */}
                {/* <Pagination
                    activePage={this.state.activePage}
                    itemsCountPerPage={1}
                    totalItemsCount={450}
                    pageRangeDisplayed={5}
                    onChange={this.handlePageChange}
                /> */}
            </Table>)
        }
    }

    render() {
        return (
            <div className="animated fadeIn">
                <Card>
                    <CardHeader>
                        <strong>Staff Management</strong>
                    </CardHeader>
                    <CardBody>
                        <Row style={{ marginBottom: '1rem' }}>
                            {this.state.role !== "security" ? (<Col><Button color="primary" href="#/userregister/useradd">Add New Staff</Button></Col>) : (null)}
                            <Col className="offset-6" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <div style={{ marginTop: '10px' }}>
                                    <Input type="checkbox" checked={this.state.showAll} onChange={this.onChangeShow} />
                                    <Label >Show all Staffs</Label>
                                </div>
                            </Col>
                            <SearchFiled onSearchChanged={this._onSearchChanged} />
                        </Row>
                        <Row>
                            {this.printStaffData()}
                        </Row>
                    </CardBody>
                </Card>
            </div >
        );
    }
}

export default Staff;