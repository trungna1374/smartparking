import React, { Component } from 'react';
import { Row, Badge, Button, Table, Card, CardBody, CardFooter, CardHeader, Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import axios from "axios";
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
            activePage: 1
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

    onRemoveStaff = (e, accountId) => {
        removeStaffData({ accountid: accountId }).then((response) => {
            if (response === "success") {
                getStaffData().then((res) => {
                    this.setState({
                        staffData: res
                    })
                })
            }
        })
    }

    printStaffData = () => {
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
                    {this.state.staffData.map((value, key) => (
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
                                <Button className="fa fa-edit mr-1 mb-1" color="info" href={"#/people/staffUpdate/" + value.accountId}></Button>
                                <Button className="fa fa-trash-o mr-1 mb-1" color="danger" onClick={e => this.onRemoveStaff(e, value.accountId)}></Button>
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
                        <strong>Staff Management</strong>
                    </CardHeader>

                    <CardBody>
                        <Row>
                            <Button color="primary" href="#/people/staffadd" style={{ marginBottom: '1rem' }}>Add New Staff</Button>
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