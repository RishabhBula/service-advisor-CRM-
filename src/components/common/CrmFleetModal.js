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
import {
  CustomerDefaultPermissions,
  CustomerPermissionsText,
} from "../../config/Constants";
import {
  CreateRateValidations,
  CreateRateValidMessaages
} from "../../validations";
import Async from 'react-select/lib/Async';
import { CrmStandardModel } from '../common/CrmStandardModel'
import { logger } from "../../helpers/Logger";
import Validator from "js-object-validation";
import { ApiHelper } from "../../helpers/ApiHelper";
import { toast } from "react-toastify";

export class CrmFleetModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      switchValue: true,
      companyName: "",
      phoneDetail: [{
        phone: "",
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
      fleetId: "",
      errors: {},
      isEditMode: false,
      phoneLength: AppConfig.phoneLength,
      fleetDefaultPermissions: CustomerDefaultPermissions,
      percentageDiscount: 0,
      defaultOptions: [
        { value: "", label: "Add New Customer" }
      ],
      vendorValue: '',
      openStadardRateModel: false
    };
  }
  stdModelFun = () => {
    this.setState({
      openStadardRateModel: !this.state.openStadardRateModel
    })
  }
  handleStandardRate = (selectValue) => {
    if (selectValue) {
      if (selectValue.value === "") {
        this.setState({
          openStadardRateModel: !this.state.openStadardRateModel
        })
      }
      else {
        console.log("##########Selected Value",selectValue);
        
        const { fleetDefaultPermissions } = this.state;
        fleetDefaultPermissions["shouldLaborRateOverride"].laborRate =
          selectValue.value;
        this.setState({
          ...fleetDefaultPermissions
        });
        this.props.setDefaultRate(selectValue);
      }
    } else{
      this.props.onTypeHeadStdFun({});
    }
  }
  handleRateAdd = async (data) => {
    const profileData = this.props.profileInfoReducer.profileInfo
    let api = new ApiHelper();
    try {
      const { isValid, errors } = Validator(
        data,
        CreateRateValidations,
        CreateRateValidMessaages
      );
      if (!isValid) {
        this.setState({
          errors: errors,
          isLoading: false,
        });
        return;
      } else {
        const ratedata = {
          data: data,
          userId: profileData._id,
          parentId: profileData.parentId
        }
        let result = await api.FetchFromServer(
          "/labour",
          "/addRate",
          "POST",
          true,
          undefined,
          ratedata
        )
        if (result.isError) {
          toast.error(result.messages[0]);
        } else {
          toast.success(result.messages[0]);
          this.setState({
            openStadardRateModel: !this.state.openStadardRateModel
          })
        }
      }
    } catch (error) {
      logger(error);
    }
  }
  componentDidUpdate({ fleetData }) {
    if (
      this.props.fleetData &&
      this.props.fleetData._id &&
      fleetData._id !== this.props.fleetData._id
    ) {
      const {
        companyName,
        phoneDetail: [{
          phone,
          value
        }],
        email,
        notes,
        address1,
        address2,
        city,
        state,
        zipCode,
        permission,
        _id
      } = this.props.fleetData;
      this.setState({
        isEditMode: true,
        companyName,
        phoneDetail: [{
          phone,
          value
        }],
        email,
        notes,
        address1,
        address2,
        city,
        state,
        zipCode,
        permission,
        fleetId: _id
      })
    }
  }
  handleClick(singleState, e) {
    const { fleetDefaultPermissions } = this.state;
    fleetDefaultPermissions[singleState].status = e.target.checked;
    this.setState({
      ...fleetDefaultPermissions
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
      handleAddFleet,
      errorMessage,
      matrixListReducerData,
      rateStandardListData
    } = this.props;
    const {
      companyName,
      phoneDetail,
      email,
      notes,
      address1,
      address2,
      city,
      state,
      zipCode,
      fleetDefaultPermissions,
      vendorValue,
      errors,
      percentageDiscount,
      isEditMode,
      fleetId
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
      fleetDefaultPermissions,
      percentageDiscount,
    }
    const phoneOptions = PhoneOptions.map((item, index) => {
      return (
        <option value={item.key}>{item.text}</option>
      )
    })
    console.log("adfsadfsfdsdfs",rateStandardListData);
    
    return (
      <>
        <Modal
          isOpen={fleetModalOpen}
          toggle={handleFleetModal}
          className={
            !modalClassName ? "customer-modal" : modalClassName
          }
        >
          <ModalHeader toggle={handleFleetModal}>
            {!isEditMode ? "Add New Fleet" : `Update Fleet details`}
          </ModalHeader>
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
                    {
                      errorMessage && !companyName && errorMessage.companyName ?
                        <p className="text-danger">Company name is required.</p> :
                        null
                    }
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
                    {
                      errorMessage && email && errorMessage.email ?
                        <p className="text-danger">{errorMessage.email}</p> :
                        null
                    }
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
              {CustomerPermissionsText.map((permission, index) => {
                let discountShow = false;
                let labourRate = false;
                let pricingMatrix = false;
                if (
                  permission.key === "shouldReceiveDiscount" &&
                  fleetDefaultPermissions[permission.key].status
                ) {
                  discountShow = true;
                }

                if (
                  permission.key === "shouldLaborRateOverride" &&
                  fleetDefaultPermissions[permission.key].status
                ) {
                  labourRate = true;
                }

                if (
                  permission.key === "shouldPricingMatrixOverride" &&
                  fleetDefaultPermissions[permission.key].status
                ) {
                  pricingMatrix = true;
                }
                return (
                  <Row
                    className="justify-content-center pb-2"
                    key={index}
                  >
                    <Col md="2">
                      <AppSwitch
                        className={"mx-1"}
                        checked={
                          fleetDefaultPermissions[permission.key]
                            .status
                        }
                        onClick={this.handleClick.bind(
                          this,
                          permission.key
                        )}
                        variant={"3d"}
                        color={"primary"}
                        size={"sm"}
                      />
                    </Col>
                    <Col md="10">
                      <p className="customer-modal-text-style">
                        {permission.text}
                      </p>
                    </Col>
                    {discountShow ? (
                      <Col md="12">
                        <Label
                          htmlFor="name"
                          className="customer-modal-text-style"
                        >
                          Percent Discount
                            </Label>
                        <FormGroup>
                          <MaskedInput
                            mask="11 \%"
                            name="percentageDiscount"
                            size="20"
                            onChange={this.handleInputChange}
                          />
                        </FormGroup>
                      </Col>
                    ) : null}

                    {labourRate ? (
                      <Col md="">
                        <Async
                          defaultOptions={rateStandardListData.standardRateList}
                          loadOptions={this.loadOptions}
                          onChange={this.handleStandardRate}
                          isClearable={true}
                          value={rateStandardListData.selectedOptions}
                        />
                      </Col>
                    ) : null}
                    {/* */}
                    {pricingMatrix ? (
                      <Col md="12">
                        <Input type="select" className="">
                          <option value={""}>Select</option>
                          {
                            matrixListReducerData.matrixList.length ?
                              matrixListReducerData.matrixList.map((item, index) => {
                                return (
                                  <option value={item.id} key={index}>
                                    {item.name}
                                  </option>
                                );
                              })
                              : null
                          }

                        </Input>
                      </Col>
                    ) : null}
                  </Row>
                );
              })}
            </div>
            <CrmStandardModel
              openStadardRateModel={this.state.openStadardRateModel}
              stdModelFun={this.stdModelFun}
              errors={errors}
              handleRateAdd={this.handleRateAdd}
            />
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={() => handleAddFleet(fleetData, isEditMode, fleetId)}>
              {
                !isEditMode ?
                  "Add New Fleet" :
                  "Update Fleet Details"
              }
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
