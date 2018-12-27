import React, { Component } from 'react';
import SearchFiled from './SearchFiled'
import {
    Badge, Button,
    Table, Row, Col,
    Card, CardBody, CardHeader,
    Modal, ModalBody, ModalFooter, ModalHeader,
    Input, Label
} from 'reactstrap';
import axios from "axios";
// import Pagination from "react-js-pagination";

// require("bootstrap/less/bootstrap.less");
const getUserRegisterData = () => axios.get("/getAllUserRegister").then((res) => res.data)
const removeUserData = (userData) => axios.post("/removeUserData", userData).then((res) => res.data)
class UserRegister extends Component {
    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.state = {
            activeTab: '1',
            data: null,
            activePage: 1,
            modalClick: false,
            errorModalClick: false,
            successModalClick: false,
            accountId: '',
            role: '',
            searchString: '',
            showAll: false
        };
    }

    componentDidMount() {
        if (this.state.data == null) {
            getUserRegisterData().then((res) => {
                this.setState({
                    data: res
                })
            })
        }
        axios.get("/login/check").then(res => {
            if (res.data.user) {
                this.setState({
                    role: res.data.user.role,
                })
            }
        })
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

    onRemoveUser = (e) => {
        removeUserData({ accountid: this.state.accountId }).then((response) => {
            if (JSON.stringify(response) === JSON.stringify('success')) {
                getUserRegisterData().then((res) => {
                    this.setState({
                        data: res
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

    printUserData = () => {
        let userList = this.state.data;
        if (this.state.data !== null && this.state.searchString.length !== 0) {
            userList = this.state.data.filter((user) => {
                console.log(((user.status === 1) !== this.state.showAll))
                if (this.state.showAll)
                    return (user.username.toLowerCase().includes(this.state.searchString.toLowerCase()) || user.accountId.toLowerCase().includes(this.state.searchString.toLowerCase()))
                else
                    return user.username.toLowerCase().includes(this.state.searchString.toLowerCase()) || user.accountId.toLowerCase().includes(this.state.searchString.toLowerCase())
                        && user.status === 1
            });
        } else
            if (this.state.data !== null) {
                userList = this.state.data.filter((user) => {
                    if (this.state.showAll)
                        return true
                    else
                        return user.status === 1
                });
            }
        if (this.state.data != null) {
            return (<Table responsive hover>
                <thead>
                    <tr>
                        <th>Account</th>
                        <th>Username</th>
                        <th>Phone</th>
                        <th>Date Registered</th>
                        <th>Created By</th>
                        <th>Plates</th>
                        <th>Status</th>
                        {this.state.role !== "security" ? (<th>Action</th>) : (null)}
                    </tr>
                </thead>
                <tbody>

                    {userList.map((value, key) => (
                        <tr key={key}>
                            <td>{value.accountId}</td>
                            <td>{value.username}</td>
                            <td>{value.phone}</td>
                            <td>{value.createDate}</td>
                            <td>{value.createBy}</td>
                            <td>{value.numOfPlate}</td>
                            <td>
                                <Badge color={value.status === 1 ? "success" : "danger"}>{value.status === 1 ? "Active" : "Deactive"}</Badge>
                            </td>
                            {this.state.role !== "security" ? (
                                <td>
                                    <Button className="fa fa-search-plus  mr-1 mb-1" color="success" href={"#/userregister/userdetail/" + value.accountId}></Button>
                                    <Button className="fa fa-edit mr-1 mb-1" color="info" href={"#/userregister/userupdate/" + value.accountId}></Button>
                                    <Button className="fa fa-trash-o mr-1 mb-1" color="danger" onClick={e => this.onRemoveClick(e, value.accountId)}></Button>
                                </td>) :
                                (null)}
                        </tr>
                    ))}
                    <Modal isOpen={this.state.modalClick} toggle={this.onRemoveModal} className='modal-primary' >
                        <ModalHeader toggle={this.onRemoveModal}>Confirm Message</ModalHeader>
                        <ModalBody>
                            Are you sure?
                            </ModalBody>
                        <ModalFooter>
                            <Button color="primary" onClick={this.onRemoveUser}>Yes</Button>
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
                            Remove successfully! Move to UserRegister Page
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
                        <strong>User Register</strong>
                    </CardHeader>
                    <CardBody>
                        <Row style={{ marginBottom: '1rem' }}>

                            {this.state.role !== "security" ? (<Col><Button color="primary" href="#/userregister/useradd">Add New Users</Button></Col>) : (null)}
                            <Col className="offset-6" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <div style={{ marginTop: '10px' }}>
                                    <Input type="checkbox" checked={this.state.showAll} onChange={this.onChangeShow} />
                                    <Label >Show all User</Label>
                                </div>
                            </Col>
                            <SearchFiled onSearchChanged={this._onSearchChanged} />
                        </Row>
                        <Row>
                            {this.printUserData()}
                        </Row>

                    </CardBody>
                </Card>
            </div >
        );
    }
}

export default UserRegister;