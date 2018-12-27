import React, { Component } from 'react';
import { Button, Card, CardBody, CardGroup, Col, Container, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import axios from 'axios'

class Login extends Component {

  state = {};

  _getAccount = (e) => {
    let name = e.target.name;
    let value = e.target.value
    this.setState({
      [name]: value
    })
  }

  _onLogin = (e) => {
    e.preventDefault();
    axios
      .post("/login", {
        username: this.state.username,
        password: this.state.password
      }, {
          validateStatus: (status) => {
            return status >= 200 && status < 500
          }
        }
      )
      .then(response => {
        this.setState({ data: response.data })
        if (response.data.success === 1) {
          
          window.location.href = "/"
        }
        else {
          this.setState({
            updateErrorModalClick: true
          })
        }
      }
      )
      .catch(err => console.error(err))
  }

  onRemoveModal = (event) => {
    this.setState({
        updateErrorModalClick: false
    })
  }

  render() {

    const display = this.props.user ? ( 
      window.location.href = "/"
    ) : (
      <div className="app flex-row align-items-center Login">
        <Container>
          <Row className="justify-content-center">
            <Col md="8">
              <CardGroup>
                <Card className="p-4">
                  <CardBody>
                    <Form onSubmit={this._onLogin}>
                      <h1>Login</h1>
                      <p className="text-muted">Sign In to your account</p>
                      <InputGroup className="mb-3">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-user"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input onChange={this._getAccount} type="text" placeholder="Username" autoComplete="username" name="username" />
                      </InputGroup>
                      <InputGroup className="mb-4">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-lock"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input onChange={this._getAccount} type="password" placeholder="Password" autoComplete="current-password" name="password" />
                      </InputGroup>
                      <Row>
                        <Col xs="6">
                          <Button type="submit" className="myButton" htmlType="submit">Login
                          </Button>
                        </Col>
                        <Col xs="6" className="text-right">
                          <Button color="link" className="px-0">Forgot password?</Button>
                        </Col>
                      </Row>
                    </Form>
                  </CardBody>
                </Card>
                <Card className="text-white bg-primary py-5 d-md-down-none" style={{ width: 44 + '%' }}>
                  <CardBody className="text-center">
                    <div>
                      <h2>Smart Parking</h2>
                      <p></p>
                      <Button color="primary" className="mt-3" href="\" active>Back to Map</Button>
                    </div>
                  </CardBody>
                </Card>
                </CardGroup>
                <Modal isOpen={this.state.updateErrorModalClick} toggle={this.onRemoveModal} className='modal-danger' >
                            <ModalHeader toggle={this.onRemoveModal}></ModalHeader>
                            <ModalBody>
                                  Username or password was incorrect
                            </ModalBody>
                            <ModalFooter>
                                <Button onClick={this.onRemoveModal}>Close</Button>
                            </ModalFooter>
                        </Modal>
            </Col>
          </Row>
        </Container>
      </div>
    )

    return (
      <div>
        {display}
      </div>
    );
  }
}

export default Login;
