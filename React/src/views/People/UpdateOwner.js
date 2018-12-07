import React, { Component } from 'react';
import { Button, Card, CardBody, Col, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';
import axios from 'axios';
class Register extends Component {
    state = {};

    _getAccount = (e) => {
      let name = e.target.name;
      let value = e.target.value
      this.setState({
        [name]: value
      })
    }
  
    _onChangePassword = (e) => {
      e.preventDefault();
      axios
        .post("/checkoldpass", {
            oldpassword: this.state.oldpassword
        }, {
            validateStatus: (status) => {
              return status >= 200 && status < 500
            }
          }
        )
        .then(response => {
          this.setState({ data: response.data })
          if (response.data.success === 1) {
            axios
            .post("/changepassword", {
                newpassword: this.state.newpassword,
                repeat: this.state.repeat,
            }, {
                validateStatus: (status) => {
                  return status >= 200 && status < 500
                }
              }
            )
            .then(response => {
              this.setState({ data: response.data })
              if (response.data.success === 1) {
                alert("Change Password Successfully")
                window.location.reload();
              }
              else {
                alert("Repeat Password isn't correct")
              }
            }
            )
            .catch(err => console.error(err))
          }
          else {
            alert("Password Wrong")
          }
        }
        )
        .catch(err => console.error(err))
    }

  render() {
    
    return (

        <div className="animated fadeIn">
        <Row>
            <Col md="6">
              <Card className="mx-4">
                <CardBody className="p-4">
                  <Form onSubmit={this._onChangePassword}>
                    <h1>Change password</h1>
                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-lock"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input onChange={this._getAccount} type="password" placeholder="Old - Password" autoComplete="new-password" name="oldpassword" />
                    </InputGroup>
                    <InputGroup className="mb-4">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-lock"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input onChange={this._getAccount} type="password" placeholder="New password" autoComplete="new-password" name="newpassword" />
                    </InputGroup>
                    <InputGroup className="mb-4">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-lock"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input onChange={this._getAccount} type="password" placeholder="Repeat password" autoComplete="new-password" name="repeat" />
                    </InputGroup>
                    <Button color="success" block>Save</Button>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
    </div >
          
    );
  }
}

export default Register;
