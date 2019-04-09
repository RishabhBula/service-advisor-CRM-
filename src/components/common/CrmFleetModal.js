import React, { Component } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Col,
  FormGroup,
  Label,
  Input
} from "reactstrap";
import { AppSwitch } from "@coreui/react";
import {
  AppConfig
} from "../../config/AppConfig";
import { PhoneOptions } from '../../config/Constants'
import MaskedInput from "react-maskedinput";

export class CrmFleetModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      switchValue: true,
      companyName: "",
      phoneDetail: [{
        phone: "mobile",
        value: ""
      }],
      email: "",
      notes: "",
      address1: "",
      address2: "",
      city: "",
      state: "",
      zipCode: "",
      permission: "",
      errors: {},
      phoneLength: AppConfig.phoneLength,

    };
  }
  handleClick = e => {
    this.setState({
      switchValue: !this.state.switchValue
    });
  };

  handlePhoneNameChange = (index, event) => {
    const { value } = event.target;
    const phoneDetail = [...this.state.phoneDetail]
    phoneDetail[index].phone = value;
    this.setState({
      phoneDetail
    })
  }
  handlePhoneValueChange = (index, event) => {
    const { value } = event.target;
    if (isNaN(value)) {
      return;
    }
    const phoneDetail = [...this.state.phoneDetail]
    phoneDetail[index].value = value;
    this.setState({
      phoneDetail
    })
  };
  handleChange = (event) => {
    const { name, value } = event.target;
    if (
      (name === 'phoneDetail' ||
        name === 'zipCode') &&
      (isNaN(value))
    ) {
      return;
    }
    else {
      this.setState({
        [name]: value,
      });
    }
  }
  handleAddPhoneDetails = () => {
    const { phoneDetail } = this.state;
    if (phoneDetail.length < 3) {
      phoneDetail.push({
        phone: "mobile",
        value: ""
      })
      console.log(phoneDetail);

      this.setState({
        phoneDetail: phoneDetail
      })
    }
  }
  handleRemovePhoneDetails = (event) => {
    const { phoneDetail } = this.state;
    if (phoneDetail.length) {
      let phoneArray = phoneDetail.findIndex(
        item => item.key === event.key
      )
      phoneDetail.splice(phoneArray, 1);
      console.log(phoneDetail);

      this.setState({
        phoneDetail: phoneDetail
      })
    }
  }
  render() {
    const {
      fleetModalOpen,
      handleFleetModal,
      modalClassName,
      handleAddFleet } = this.props;
    const { switchValue,
      companyName,
      phoneDetail,
      email,
      notes,
      address1,
      address2,
      city,
      state,
      zipCode,
    } = this.state;
    const fleetData = {
      companyName,
      phoneDetail,
      email,
      notes,
      address1,
      address2,
      city,
      state,
      zipCode,
    }
    const phoneOptions = PhoneOptions.map((item, index) => {
      return (
        <option value={item.key}>{item.text}</option>
      )
    })
    return (
      <>
        <Modal
          isOpen={fleetModalOpen}
          toggle={handleFleetModal}
          className={
            !modalClassName ? "customer-modal" : modalClassName
          }
        >
          <ModalHeader toggle={handleFleetModal}>Create New Fleet</ModalHeader>
          <ModalBody>
            <div className="">
              <Row className="justify-content-center">
                <Col md="12">
                  <FormGroup>
                    <Label htmlFor="name" className="customer-modal-text-style">
                      Company name (*)
                    </Label>
                    <Input
                      type="text"
                      name="companyName"
                      onChange={this.handleChange}
                      placeholder="company name"
                      value={companyName}
                      id="name" required />
                  </FormGroup>
                </Col>
              </Row>
            </div>

            <div className="">

              {
                phoneDetail.length ?
                  phoneDetail.map((item, index) => {
                    return <Row className="justify-content-center">
                      {
                        index < 1 ?
                          <>
                            <Col md="3">
                              <FormGroup>
                                <Label htmlFor="name" className="customer-modal-text-style">
                                  Phone
                                </Label>
                                <Input onChange={(e) => this.handlePhoneNameChange(index, e)} type="select" id="name" required>
                                  {phoneOptions}
                                </Input>
                              </FormGroup>
                            </Col>
                            <Col md="9">
                              <FormGroup>
                                <Label />
                                {
                                  phoneDetail[index].phone === 'mobile' ?
                                    <MaskedInput
                                      mask="(111) 111-111"
                                      name="phoneDetail"
                                      placeholder="(555) 055-0555"
                                      className="form-control"
                                      size="20"
                                      value={item.value}
                                      onChange={
                                        (e) => this.handlePhoneValueChange(index, e)
                                      }
                                    /> :
                                    <MaskedInput
                                      mask="(111) 111-111 ext 1111"
                                      name="phoneDetail"
                                      className="form-control"
                                      placeholder="(555) 055-0555 ext 1234"
                                      size="20"
                                      value={item.value}
                                      onChange={
                                        (e) => this.handlePhoneValueChange(index, e)
                                      }
                                    />
                                }
                              </FormGroup>
                            </Col>
                          </>
                          :
                          <>
                            <Col md="3">
                              <FormGroup>
                                <Label htmlFor="name">
                                </Label>
                                <Input onChange={(e) => this.handlePhoneNameChange(index, e)} type="select" id="name" required>
                                  {phoneOptions}
                                </Input>
                              </FormGroup>
                            </Col>
                            <Col md="8">
                              <FormGroup>
                                <Label />
                                {
                                  phoneDetail[index].phone === 'mobile' ?
                                    <MaskedInput
                                      mask="(111) 111-111"
                                      name="phoneDetail"
                                      placeholder="(555) 055-0555"
                                      className="form-control"
                                      size="20"
                                      value={item.value}
                                      onChange={
                                        (e) => this.handlePhoneValueChange(index, e)
                                      }
                                    /> :
                                    <MaskedInput
                                      mask="(111) 111-111 ext 1111"
                                      name="phoneDetail"
                                      className="form-control"
                                      placeholder="(555) 055-0555 ext 1234"
                                      size="20"
                                      value={item.value}
                                      onChange={
                                        (e) => this.handlePhoneValueChange(index, e)
                                      }
                                    />}
                              </FormGroup>
                            </Col>
                            <Col md="1" className="phone-remove-btn">
                              <FormGroup className="mb-0">
                                <Label />
                                <button onClick={this.handleRemovePhoneDetails} className="btn btn-danger btn-sm btn-round">x</button>
                              </FormGroup>
                            </Col>
                          </>
                      }
                    </Row>
                  })
                  : null
              }
              <div>
                {
                  phoneDetail.length < 3 ?
                    <span onClick={this.handleAddPhoneDetails} className="customer-add-phone">
                      Add another phone number
                    </span>
                    :
                    null
                }
              </div>
            </div>
            <div className="">
              <Row className="justify-content-center">
                <Col md="12">
                  <FormGroup>
                    <Label htmlFor="name" className="customer-modal-text-style">
                      Email (Optional)
                    </Label>
                    <Input
                      type="text"
                      className="customer-modal-text-style"
                      placeholder="john.doe@example.com"
                      id="name"
                      value={email}
                      onChange={this.handleChange}
                      name="email"
                      required
                    />
                  </FormGroup>
                </Col>
              </Row>
            </div>
            <div className="">
              <Row className="justify-content-center">
                <Col md="12">
                  <FormGroup>
                    <Label htmlFor="name" className="customer-modal-text-style">
                      Notes
                    </Label>
                    <Input
                      type="textarea"
                      placeholder="Enter a note..."
                      id="name"
                      value={notes}
                      onChange={this.handleChange}
                      name="notes"
                      required
                    />
                  </FormGroup>
                </Col>
              </Row>
            </div>
            <div className="">
              <Row className="justify-content-center">
                <Col md="12">
                  <FormGroup>
                    <Label htmlFor="name" className="customer-modal-text-style">
                      Address 1
                    </Label>
                    <Input
                      type="text"
                      placeholder="Address"
                      id="name"
                      value={address1}
                      onChange={this.handleChange}
                      name="address1"
                      required
                    />
                  </FormGroup>
                </Col>
              </Row>
            </div>
            <div className="">
              <Row className="justify-content-center">
                <Col md="12">
                  <FormGroup>
                    <Label htmlFor="name" className="customer-modal-text-style">
                      Address 2
                    </Label>
                    <Input
                      type="text"
                      placeholder="Address"
                      id="name"
                      value={address2}
                      onChange={this.handleChange}
                      name="address2"
                      required
                    />
                  </FormGroup>
                </Col>
              </Row>
            </div>
            <div className="">
              <Row className="justify-content-center">
                <Col md="6">
                  <FormGroup>
                    <Label htmlFor="name" className="customer-modal-text-style">
                      City
                    </Label>
                    <Input
                      type="text"
                      id="name"
                      name="city"
                      value={city}
                      onChange={this.handleChange}
                      placeholder="New York"
                      required
                    />
                  </FormGroup>
                </Col>
                <Col md="2">
                  <FormGroup>
                    <Label htmlFor="name" className="customer-modal-text-style">
                      State
                    </Label>
                    <Input
                      type="text"
                      name="state"
                      value={state}
                      onChange={this.handleChange}
                      id="name"
                      placeholder="NY" required />
                  </FormGroup>
                </Col>
                <Col md="4">
                  <FormGroup>
                    <Label htmlFor="name" name="zip" className="customer-modal-text-style">
                      Zip Code
                    </Label>
                    <Input
                      type="text"
                      id="name"
                      name="zipCode"
                      value={zipCode}
                      onChange={this.handleChange}
                      placeholder="Zip Code"
                      required
                    />
                  </FormGroup>
                </Col>
              </Row>
            </div>
            <div className="">
              <Row className="justify-content-center pb-2">
                <Col md="2">
                  <AppSwitch
                    className={"mx-1"}
                    value={switchValue}
                    onClick={this.handleClick}
                    variant={"3d"}
                    color={"primary"}
                    checked
                    size={""}
                  />
                </Col>
                <Col md="10">
                  <p className="customer-modal-text-style">
                    Is this customer tax exempt?
                  </p>
                </Col>
              </Row>
              <Row className="justify-content-center pb-2">
                <Col md="2">
                  <AppSwitch
                    className={"mx-1"}
                    value={switchValue}
                    onClick={this.handleClick}
                    variant={"3d"}
                    color={"primary"}
                    checked
                    size={""}
                  />
                </Col>
                <Col md="10">
                  <p className="customer-modal-text-style">
                    Does this customer receive a discount?
                  </p>
                </Col>
              </Row>
              <Row className="justify-content-center pb-2">
                <Col md="2">
                  <AppSwitch
                    className={"mx-1"}
                    value={switchValue}
                    onClick={this.handleClick}
                    variant={"3d"}
                    color={"primary"}
                    checked
                    size={""}
                  />
                </Col>
                <Col md="10">
                  <p className="customer-modal-text-style">
                    Does this customer have a labor rate override?
                  </p>
                </Col>
              </Row>
              <Row className="justify-content-center pb-2">
                <Col md="2">
                  <AppSwitch
                    className={"mx-1"}
                    value={switchValue}
                    onClick={this.handleClick}
                    variant={"3d"}
                    color={"primary"}
                    checked
                    size={""}
                  />
                </Col>
                <Col md="10">
                  <p className="customer-modal-text-style">
                    Does this customer have a pricing matrix override?
                  </p>
                </Col>
              </Row>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={() => handleAddFleet(fleetData)}>
              Add New Fleet
            </Button>{" "}
            <Button color="secondary" onClick={handleFleetModal}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </>
    );
  }
}
