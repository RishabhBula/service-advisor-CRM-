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
      selectedLabourRate: {},
      vendorValue: '',
      openStadardRateModel: false
    };
  }
  stdModelFun = () => {
    this.setState({
      openStadardRateModel: !this.state.openStadardRateModel
    })
  }
  handlePercentageChange = (e) => {
    const { fleetDefaultPermissions } = this.state;
    fleetDefaultPermissions["shouldReceiveDiscount"].percentageDiscount = e.target.value;
    this.setState({
      ...fleetDefaultPermissions
    });
  }
  handleStandardRate = (selectValue) => {
    if (selectValue) {
      if (selectValue.value === "") {
        this.setState({
          openStadardRateModel: !this.state.openStadardRateModel
        })
      }
      else {
        const { fleetDefaultPermissions } = this.state;
        fleetDefaultPermissions["shouldLaborRateOverride"].laborRate =
          selectValue.value;
        this.setState({
          ...fleetDefaultPermissions,
          selectedLabourRate: selectValue
        });
        //this.props.setDefaultRate(selectValue);
      }
    } else {
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
            openStadardRateModel: !this.state.openStadardRateModel,
            selectedLabourRate: {
              value: result.data.data._id,
              label:
                result.data.data.name +
                " - " +
                result.data.data.hourlyRate
            }
          })
        }
      }
    } catch (error) {
      logger(error);
    }
  }
  componentDidUpdate(prevProps) {
    if (prevProps.fleetModalOpen !== this.props.fleetModalOpen) {
      this.removeAllState();
    }
  }

  async removeAllState() {
    this.setState({
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
      selectedLabourRate: {},
      vendorValue: '',
      openStadardRateModel: false
    })
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
      phoneErrors,
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
      errors,
      percentageDiscount,
      isEditMode,
      fleetId,
      selectedLabourRate
    } = this.state;
    const phoneOptions = PhoneOptions.map((item, index) => {
      return (
        <option value={item.key}>{item.text}</option>
      )
    })

    let fleetDefaultPermissions = this.state.fleetDefaultPermissions;
    if (!fleetDefaultPermissions) {
      fleetDefaultPermissions = {};
      for (const key in CustomerDefaultPermissions) {
        if (CustomerDefaultPermissions.hasOwnProperty(key)) {
          const element = CustomerDefaultPermissions[key];
          fleetDefaultPermissions[key] = element;
        }
      }
    }
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
    return (
      <>
        <Modal
          isOpen={fleetModalOpen}
          toggle={handleFleetModal}
          className="customer-modal custom-form-modal custom-modal-lg"
        >
          <ModalHeader toggle={handleFleetModal}>
            {!isEditMode ? "Add New Fleet" : `Update Fleet details`}
          </ModalHeader>
          <ModalBody>
            <div className="">
              <Row className="justify-content-center">
                <Col md="6">
                  <FormGroup>
                    <Label htmlFor="name" className="customer-modal-text-style">
                      Company Name
                    </Label>
                    <div className={"input-block"}>
                      <Input
                        type="text"
                        name="companyName"
                        onChange={this.handleChange}
                        placeholder="Company Name"
                        value={companyName}
                        maxLength="20"
                        id="name" required />
                      {
                        errorMessage && !companyName && errorMessage.companyName ?
                          <p className="text-danger">Company name is required.</p> :
                          null
                      }
                    </div>
                  </FormGroup>
                </Col>
                <Col md="6">
                  <FormGroup>
                    <Label
                      htmlFor="name"
                      className="customer-modal-text-style"
                    >
                      Email (Optional)
                    </Label>
                    <div className={"input-block"}>
                      <Input
                        type="text"
                        className="customer-modal-text-style"
                        placeholder="john.doe@example.com"
                        onChange={this.handleChange}
                        maxLength="40"
                        name="email"
                        value={email}
                      />
                      {
                        errorMessage.email && email ?
                          <p className="text-danger">{errorMessage.email}</p> :
                          null
                      }
                    </div>
                  </FormGroup>
                </Col>
              </Row>
            </div>

            <div className="">
              <Row className="">
                {/* <Row className="justify-content-center"> */}
                {phoneDetail && phoneDetail.length
                  ? phoneDetail.map((item, index) => {
                    console.log(index, phoneErrors[index]);
                    return (
                      <>
                        {index < 1 ? (
                          <>

                            <Col md="6">
                              <FormGroup className="phone-number-feild">
                                <Label
                                  htmlFor="name"
                                  className="customer-modal-text-style"
                                >
                                  Phone
                                </Label>
                                {/* <div></div> */}

                                <Input
                                  onChange={e =>
                                    this.handlePhoneNameChange(index, e)
                                  }
                                  type="select"
                                  id="name"
                                  required

                                >
                                  {phoneOptions}
                                </Input>
                                {phoneDetail[index].phone === "mobile" ? (
                                  <div className="input-block select-number-tile">
                                    <MaskedInput
                                      mask="(111) 111-111"
                                      name="phoneDetail"
                                      placeholder="(555) 055-0555"
                                      className="form-control"
                                      size="20"
                                      value={item.value}
                                      onChange={e =>
                                        this.handlePhoneValueChange(index, e)
                                      }
                                    />
                                    <p className="text-danger">{phoneErrors[index]}</p>
                                  </div>
                                ) : (
                                    <div className="input-block select-number-tile">
                                      <MaskedInput
                                        mask="(111) 111-111 ext 1111"
                                        name="phoneDetail"
                                        className="form-control"
                                        placeholder="(555) 055-0555 ext 1234"
                                        size="20"
                                        value={item.value}
                                        onChange={e =>
                                          this.handlePhoneValueChange(index, e)
                                        }
                                      />
                                      <p className="text-danger">{phoneErrors[index]}</p>
                                    </div>
                                  )}
                              </FormGroup>
                            </Col>

                          </>
                        ) : (
                            <>
                              <Col md="6">
                                <button
                                  onClick={this.handleRemovePhoneDetails}
                                  className="btn btn-danger btn-sm btn-round input-close"
                                >
                                  <i className="fa fa-close"></i>
                                </button>
                                <FormGroup className="phone-number-feild">
                                  <Label
                                    htmlFor="name"
                                    className="customer-modal-text-style"
                                  >
                                    Phone (optional)
                                </Label>
                                  {/* <div></div> */}
                                  <Input
                                    onChange={e =>
                                      this.handlePhoneNameChange(index, e)
                                    }
                                    type="select"
                                    id="name"
                                    required

                                  >
                                    {phoneOptions}
                                  </Input>
                                  {phoneDetail[index].phone === "mobile" ? (
                                    <MaskedInput
                                      mask="(111) 111-111"
                                      name="phoneDetail"
                                      placeholder="(555) 055-0555"
                                      className="form-control"
                                      size="20"
                                      value={item.value}
                                      onChange={e =>
                                        this.handlePhoneValueChange(index, e)
                                      }
                                    />
                                  ) : (
                                      <MaskedInput
                                        mask="(111) 111-111 ext 1111"
                                        name="phoneDetail"
                                        className="form-control"
                                        placeholder="(555) 055-0555 ext 1234"
                                        size="20"
                                        value={item.value}
                                        onChange={e =>
                                          this.handlePhoneValueChange(index, e)
                                        }
                                      />
                                    )}
                                </FormGroup>
                              </Col>
                            </>
                          )}
                      </>
                    );
                  })
                  : null}

                {phoneDetail.length < 3 ? (
                  <Col md="12">
                    <FormGroup className={"mb-0"}>
                      <Label className={"customer-modal-text-style"}></Label>
                      <span
                        onClick={this.handleAddPhoneDetails}
                        className="customer-add-phone customer-anchor-text customer-click-btn"
                      >
                        Add another phone number
                    </span>
                    </FormGroup>
                  </Col>
                ) : null}
              </Row>
            </div>

            <div className="">
              <Row className="justify-content-center">
                <Col md="6">
                  <FormGroup>
                    <Label htmlFor="name" className="customer-modal-text-style">
                      Address
                    </Label>
                    <Input
                      type="text"
                      placeholder="Address"
                      id="name"
                      value={address1}
                      maxLength="200"
                      onChange={this.handleChange}
                      name="address1"
                      required
                    />
                  </FormGroup>
                </Col>
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
                      maxLength="100"
                      onChange={this.handleChange}
                      placeholder="New York"
                      required
                    />
                  </FormGroup>
                </Col>
                <Col md="6">
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
                      maxLength="100"
                      placeholder="NY" required />
                  </FormGroup>
                </Col>
                <Col md="6">
                  <FormGroup>
                    <Label htmlFor="name" name="zip" className="customer-modal-text-style">
                      Zip Code
                    </Label>
                    <Input
                      type="text"
                      id="name"
                      name="zipCode"
                      value={zipCode}
                      maxLength="5"
                      onChange={this.handleChange}
                      placeholder="Zip Code"
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
                      maxLength="500"
                      onChange={this.handleChange}
                      name="notes"
                      required
                    />
                  </FormGroup>
                </Col>
              </Row>
            </div>
            <Row className="custom-label-padding ">

              {
                CustomerPermissionsText ?
                  CustomerPermissionsText.map((permission, index) => {
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
                      <>
                        <Col md="6" key={index}>
                          <div className="d-flex">
                            <AppSwitch
                              className={"mx-1"}
                              checked={fleetDefaultPermissions[permission.key]
                                .status}
                              onClick={this.handleClick.bind(
                                this,
                                permission.key
                              )}
                              variant={"3d"}
                              color={"primary"}
                              size={"sm"}
                            />
                            <p className="customer-modal-text-style">
                              {permission.text}
                            </p>
                          </div>
                          {discountShow ? (
                            <div className="custom-label col-12" key={index}  >
                              <Label
                                htmlFor="name"
                                className="customer-modal-text-style"
                              >
                                Percent Discount
                            </Label>
                              <FormGroup>
                                <Col md="4" className={"p-0"}>
                                  <MaskedInput
                                    mask="11\.11 \%"
                                    placeholder="00.00%"
                                    name="percentageDiscount"
                                    size="20"
                                    onChange={this.handlePercentageChange}
                                    className="form-control"
                                    value={fleetDefaultPermissions[permission.key]
                                      .percentageDiscount}
                                  />
                                </Col>
                              </FormGroup>
                            </div>
                          ) : null}
                          {labourRate &&
                            rateStandardListData &&
                            rateStandardListData.standardRateList &&
                            rateStandardListData.standardRateList.length ? (
                              <Col md="">
                                <Async
                                  defaultOptions={rateStandardListData.standardRateList}
                                  loadOptions={this.loadOptions}
                                  onChange={this.handleStandardRate}
                                  isClearable={true}
                                  value={selectedLabourRate}
                                />

                              </Col>
                            ) : null}
                          {/* */}
                          {pricingMatrix ? (
                            <Col md="12">
                              <FormGroup>
                                <Input
                                  type="select"
                                  className=""
                                  onChange={this.handleMatrixChange}
                                  name="matrixType"
                                  id="matrixId"
                                >
                                  <option value={""}>Select</option>
                                  {
                                    matrixListReducerData &&
                                      matrixListReducerData.matrixList &&
                                      matrixListReducerData.matrixList.length
                                      ? matrixListReducerData.matrixList.map(
                                        (item, index) => {
                                          return (
                                            <option
                                              value={item._id}
                                              key={index}
                                            >
                                              {item.name}
                                            </option>
                                          );
                                        }
                                      )
                                      : null}
                                </Input>
                              </FormGroup>
                            </Col>
                          ) : null}
                        </Col>
                      </>);
                  }) : null}
            </Row>
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
