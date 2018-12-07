import React, { Component } from 'react';
import { Button, Card, CardBody, CardGroup, Col, Container, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';
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
          alert("SAI TAI KHOAN")
        }
      }
      )
      .catch(err => console.error(err))
  }

  render() {
    console.log(this.state)

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
                      <h2>Sign up</h2>
                      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut
                        labore et dolore magna aliqua.</p>
                      <Button color="primary" className="mt-3" active>Register Now!</Button>
                    </div>
                  </CardBody>
                </Card>
              </CardGroup>
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
