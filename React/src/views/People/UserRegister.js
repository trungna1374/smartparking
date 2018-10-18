import React, { Component } from 'react';
import { Badge, Button, Table, Row, Col, Card, CardBody, CardFooter, CardHeader, Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import axios from "axios";
// import Pagination from "react-js-pagination";

// require("bootstrap/less/bootstrap.less");
const getUserRegisterData = () => axios.get("/getAllUserRegister").then((res) => res.data)
class UserRegister extends Component {
    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.state = {
            activeTab: '1',
            data: null,
            activePage: 1
        };
    }

    componentWillMount() {
        if (this.state.data == null) {
            getUserRegisterData().then((res) => {
                this.setState({
                    data: res
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

    printUserData = () => {
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
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {this.state.data.map((value, key) => (
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
                            <td>
                                <Button className="fa fa-search-plus  mr-1 mb-1" color="success" href={"#/people/userdetail/" + value.accountId}></Button>
                                <Button className="fa fa-edit mr-1 mb-1" color="info" href={"#/people/userupdate/" + value.accountId}></Button>
                                <Button className="fa fa-trash-o mr-1 mb-1" color="danger" href={"#/people/userdelete/" + value.accountId}></Button>
                            </td>
                        </tr>
                    ))}

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
                        <Row>
                            <Button color="primary" href="#/people/useradd" style={{ marginBottom: '1rem' }}>Add New User</Button>
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