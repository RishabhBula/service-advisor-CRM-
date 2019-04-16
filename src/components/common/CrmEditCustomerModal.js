import React, { Component } from "react";
// import Validator from "js-object-validation";
import MaskedInput from "react-maskedinput";
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
import Select from "react-select";
import { AppSwitch } from "@coreui/react";
import { CrmFleetModal } from "../common/CrmFleetModal";
import { CrmStandardModel } from "../common/CrmStandardModel";
// import { CrmSelect } from "../common/CrmSelect";
import { PhoneOptions } from "../../config/Constants";
import {
  CustomerDefaultPermissions,
  CustomerPermissionsText
} from "../../config/Constants";
import {
  AppConfig
} from "../../config/AppConfig";
import {
  CreateCustomerValidations,
  CreateCustomerValidMessaages,
  CreateRateValidations,
  CreateRateValidMessaages
} from "../../validations";
import { logger } from "../../helpers/Logger";
import Validator from "js-object-validation";
import Async from 'react-select/lib/Async';
import { ApiHelper } from "../../helpers/ApiHelper";
import { toast } from "react-toastify";

export class CrmEditCustomerModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedOption: null,
      expandForm: false,
      fleetModalOpen: false,
      firstName: "",
      lastName: "",
      phoneDetail: [
        {
          phone: "mobile",
          value: ""
        }
      ],
      email: "",
      notes: "",
      companyName: "",
      referralSource: "",
      fleet: "5ca5e3b88b27f17bc0dfaab5",
      address1: "",
      address2: "",
      city: "",
      state: "",
      zipCode: "",
      customerDefaultPermissions: CustomerDefaultPermissions,
      errors: {},
      phoneErrors: [''],
      phoneLength: AppConfig.phoneLength,
      openStadardRateModel: false,
      defaultOptions: [
        { value: "", label: "Add New Customer" }
      ],
      selectedLabourRate: { value: '', label: 'Select...' },
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.customerModalOpen !== this.props.customerModalOpen && !this.props.customerModalOpen) {
      this.setState({
        address1: "",
        address2: "",
        city: "",
        companyName: "",
        email: "",
        firstName: "",
        fleet: "5ca5e3b88b27f17bc0dfaab5",
        lastName: "",
        notes: "",
        customerDefaultPermissions: CustomerDefaultPermissions,
        referralSource: "",
        state: "",
        zipCode: "",
        phoneDetail: [
          {
            phone: "mobile",
            value: ""
          }
        ],
        selectedLabourRate: { value: '', label: 'Select...' },
        phoneErrors: [''],
        expandForm: false
      });
    }
    if (prevProps.customer._id !== this.props.customer._id) {
      const { customer } = this.props;
      this.setState({
        address1: customer.address1,
        address2: customer.address2,
        city: customer.city,
        companyName: customer.companyName,
        email: customer.email,
        firstName: customer.firstName,
        fleet: customer.fleet,
        lastName: customer.lastName,
        notes: customer.notes,
        customerDefaultPermissions: customer.permission,
        referralSource: customer.referralSource,
        state: customer.state,
        zipCode: customer.zipCode,
        phoneDetail: customer.phoneDetail && customer.phoneDetail.length ? customer.phoneDetail : [
          {
            phone: "mobile",
            value: ""
          }
        ]
      })
      if (customer.permission && customer.permission.shouldLaborRateOverride.laborRate !== "objectId") {
        this.handleGetRateData(customer.permission.shouldLaborRateOverride.laborRate)
      }
    }
  }
  handleGetRateData = async (rateId) => {
    let api = new ApiHelper();
    try {
      const data = {
        rateId: rateId
      }
      let result = await api.FetchFromServer(
        "/labour",
        "/getSingleRate",
        "POST",
        true,
        undefined,
        data
      )
      if (result.isError) {
        toast.error(result.messages[0]);
      } else {
        toast.success(result.messages[0]);
        this.setState({
          selectedLabourRate: {
            value: result.data.data._id,
            label:
              result.data.data.name +
              " - " +
              result.data.data.hourlyRate
          }
        })
      }
    } catch (error) {
      logger(error);
    }
  }

  setStateAsync(state) {
    return new Promise(resolve => {
      this.setState(state, resolve);
    });
  }

  handleClick(singleState, e) {
    const { customerDefaultPermissions } = this.state;
    customerDefaultPermissions[singleState].status = e.target.checked;
    this.setState({
      ...customerDefaultPermissions
    });
  };

  handleRateAdd = async (data) => {
    const profileData = this.props.profileInfo.profileInfo
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
          });
          this.props.onStdAdd();
        }
      }
    } catch (error) {
      // logger(error);
    }
  }

  handlePercentageChange = (e) => {
    const { customerDefaultPermissions } = this.state;
    customerDefaultPermissions["shouldReceiveDiscount"].percentageDiscount = e.target.value;
    this.setState({
      ...customerDefaultPermissions
    });
  }
  handleMatrixChange = (e) => {
    const { customerDefaultPermissions } = this.state;
    customerDefaultPermissions["shouldPricingMatrixOverride"].pricingMatrix =
      e.target.value;
    this.setState({
      ...customerDefaultPermissions
    });
  }

  handleChange = selectedOption => {
    this.setState({ selectedOption });
  };

  handleExpandForm = () => {
    this.setState({
      expandForm: !this.state.expandForm
    });
  };

  handleInputChange = e => {
    const { target } = e;
    const { name, value } = target;
    this.setState({
      [name]: value
    });
  }
  stdModelFun = () => {
    this.setState({
      openStadardRateModel: !this.state.openStadardRateModel
    })
  }
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

  handleAddPhoneDetails = () => {
    const { phoneDetail } = this.state;
    if (phoneDetail.length < 3) {
      this.setState((state, props) => {
        return {
          phoneDetail: state.phoneDetail.concat([{
            phone: "mobile",
            value: ""
          }]),
          phoneErrors: state.phoneErrors.concat([''])
        };
      });
    }
  }

  handleRemovePhoneDetails = (index) => {
    const { phoneDetail, phoneErrors } = this.state;
    let t = [...phoneDetail];
    let u = [...phoneErrors];
    t.splice(index, 1);
    u.splice(index, 1);
    if (phoneDetail.length) {
      this.setState({
        phoneDetail: t,
        phoneErrors: u,
      });
    }
  }

  handleStandardRate = (selectValue) => {
    if (selectValue) {
      if (selectValue.value === "") {
        this.setState({
          openStadardRateModel: !this.state.openStadardRateModel
        })
      }
      else {
        const { customerDefaultPermissions } = this.state;
        customerDefaultPermissions["shouldLaborRateOverride"].laborRate =
          selectValue.value;
        this.setState({
          ...customerDefaultPermissions,
          selectedLabourRate: selectValue
        });
        //this.props.setDefaultRate(selectValue);
      }
    }
    else {
      this.props.onTypeHeadStdFun({});
      this.setState({
        selectedLabourRate: {
          value: "",
          label: "Select..."
        }
      })
    }
  }

  loadOptions = async input => {
    return this.props.loadTypeRate(input)
  }

  updateNewCustomer = async () => {
    const {
      firstName,
      lastName,
      phoneDetail,
      email,
      notes,
      companyName,
      referralSource,
      address1,
      address2,
      city,
      state,
      zipCode,
      customerDefaultPermissions,
      fleet,
    } = this.state;
    let validationdata
    if (!email) {
      validationdata = {
        firstName: firstName,
        lastName: lastName
      }
    } else {
      validationdata = {
        firstName: firstName,
        lastName: lastName,
        email: email
      }
    }
    const customerData = {
      firstName: firstName,
      lastName: lastName,
      phoneDetail: phoneDetail,
      email: email,
      notes: notes,
      companyName: companyName,
      referralSource: referralSource,
      fleet: fleet,
      address1: address1,
      address2: address2,
      city: city,
      state: state,
      zipCode: zipCode,
      permission: customerDefaultPermissions,
      status: true
    };

    try {
      if (phoneDetail.length) {
        let t = [];
        this.setState({ phoneErrors: t });
        await Promise.all(
          phoneDetail.map(async (key, i) => {
            if (key.value.length) {
              // t[i] = null
            } else {
              t[i] = 'Phone number is required';
            }
          })
        );
        await this.setStateAsync({ phoneErrors: t });
      }

      const { isValid, errors } = Validator(
        validationdata,
        CreateCustomerValidations,
        CreateCustomerValidMessaages
      );

      if (!isValid || Object.keys(this.state.phoneErrors).length > 0 ||        
          (
            (customerData.firstName === '') ||
            (customerData.lastName === '')
          )
        
      ) {
        this.setState({
          errors: errors,
          isLoading: false,
        });
        return;
      }
      this.props.addCustomerFun(customerData);

    } catch (error) {
      // logger(error);
    }
  }

  async removeAllState() {
    this.setState({
      firstName: "",
      lastName: "",
      phoneDetail: "",
      email: "",
      notes: "",
      companyName: "",
      referralSource: "",
      address1: "",
      address2: "",
      city: "",
      state: "",
      zipCode: "",
      fleet: "",
      errors: {},
      phoneErrors: ['']
    })
  }

  handleCustomerModal = () => {
    const { customerModalOpen } = this.props;
    if (customerModalOpen) {
      this.setState({
        errors: {}
      })
    }
    this.props.handleCustomerModalFun();
    // if(this.props.customerModalOpen) {
    //   this.removeAllState();
    // }
  }
  render() {
    const { customerModalOpen,  matrixListReducerData, rateStandardListData, customer } = this.props;
    const {
      selectedOption,
      expandForm,
      fleetModalOpen,
      defaultOptions,
      phoneDetail,
      errors,
      firstName,
      lastName,
      email,
      vendorValue,
      selectedLabourRate,
    } = this.state;
    let customerDefaultPermissions = this.state.customerDefaultPermissions;
    if (!customerDefaultPermissions) {
      customerDefaultPermissions = {};
      for (const key in CustomerDefaultPermissions) {
        if (CustomerDefaultPermissions.hasOwnProperty(key)) {
          const element = CustomerDefaultPermissions[key];
          customerDefaultPermissions[key] = element;

        }
      }
    }

    const phoneOptions = PhoneOptions.map((item, index) => {
      return <option key={index} value={item.key}>{item.text}</option>;
    });
    return (
      <>
        <Modal
          isOpen={customerModalOpen}
          toggle={this.handleCustomerModal}
          className="customer-modal custom-form-modal custom-modal-lg"
        >
          <ModalHeader toggle={this.handleCustomerModal}>
            {"Update Customer"}
          </ModalHeader>
          <ModalBody>
            <div className="">
              <Row className="justify-content-center">
                <Col md="6">
                  <FormGroup>
                    <Label
                      htmlFor="name"
                      className="customer-modal-text-style"
                    >
                      First Name
                    </Label>
                    <div className={"input-block"}>
                      <Input
                        type="text"
                        placeholder="John"
                        name="firstName"
                        onChange={this.handleInputChange}
                        value={firstName}
                        maxLength="30"
                      />
                      {
                        !firstName && errors.firstName ?
                          <p className="text-danger">{errors.firstName}</p> :
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
                      Last Name
                    </Label>
                    <div className={"input-block"}>
                      <Input
                        type="text"
                        placeholder="Doe"
                        onChange={this.handleInputChange}
                        name="lastName"
                        value={this.state.lastName}
                        maxLength="30"
                      />
                      {
                        errors.lastName && !lastName ?
                          <p className="text-danger">{errors.lastName}</p> :
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
                                  value={item.phone}
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
                                    <p className="text-danger">{this.state.phoneErrors[index]}</p>
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
                                      <p className="text-danger">{this.state.phoneErrors[index]}</p>
                                    </div>
                                  )}
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
                                <div>
                                  <Input
                                    type="text"
                                    className="customer-modal-text-style"
                                    placeholder="john.doe@example.com"
                                    onChange={this.handleInputChange}
                                    name="email"
                                    value={this.state.email}
                                    maxLength="100"
                                  />
                                  {
                                    errors.email && email ?
                                      <span className="text-danger">{errors.email}</span> :
                                      null
                                  }
                                </div>
                              </FormGroup>
                            </Col>

                          </>
                        ) : (
                            <>
                              <Col md="6">
                                <button
                                  onClick={() => this.handleRemovePhoneDetails(index)}
                                  className="btn btn-danger btn-sm btn-round input-close"
                                >
                                  <i className="fa fa-close"></i>
                                </button>
                                <FormGroup className="phone-number-feild">
                                  <Label
                                    htmlFor="name"
                                    className="customer-modal-text-style"
                                  >
                                    Phone (Optional)
                                </Label>
                                  {/* <div></div> */}
                                  <Input
                                    onChange={e =>
                                      this.handlePhoneNameChange(index, e)
                                    }
                                    type="select"
                                    id="name"
                                    required
                                    value={item.phone}
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
                                      <p className="text-danger">{this.state.phoneErrors[index]}</p>
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
                                        <p className="text-danger">{this.state.phoneErrors[index]}</p>
                                      </div>
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
                    <FormGroup className="mb-0">
                      <Label></Label>
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
              <Row>
                <Col md="6">
                  <FormGroup>
                    <Label
                      htmlFor="name"
                      className="customer-modal-text-style"
                    >
                      Company
                    </Label>
                    <Input
                      type="text"
                      placeholder="Company"
                      name="companyName"
                      onChange={this.handleInputChange}
                      value={this.state.companyName}
                      maxLength="100"
                    />
                  </FormGroup>
                </Col>
                <Col md="6">
                  <FormGroup>
                    <Label
                      htmlFor="name"
                      className="customer-modal-text-style"
                    >
                      Fleet
                    </Label>
                    <Select
                      value={selectedOption}
                      onChange={this.handleChange}
                      className="w-100 form-select"
                      options={[{ value: '5ca5e3b88b27f17bc0dfaab5', label: 'Fleet 1' }]}
                    />
                  </FormGroup>
                </Col>
              </Row>
            </div>
            <div className="">
              <Row className="justify-content-center">

                <div>
                  {!expandForm ? (
                    <span
                      onClick={this.handleExpandForm}
                      className="customer-anchor-text customer-click-btn"
                    >
                      {" "}
                      Show More{" "}
                    </span>
                  ) : (
                      ""
                    )}
                </div>
              </Row>
            </div>
            {expandForm ? (
              <>
                <div className="">
                  <Row className="">
                    <Col md="6">
                      <FormGroup>
                        <Label
                          htmlFor="name"
                          className="customer-modal-text-style"
                        >
                          Address
                        </Label>
                        <Input
                          type="text"
                          placeholder="Address"
                          name="address1"
                          value={this.state.address1}
                          onChange={this.handleInputChange}
                          maxLength="200"
                        />
                      </FormGroup>
                    </Col>
                    <Col md="6">
                      <FormGroup>
                        <Label
                          htmlFor="name"
                          className="customer-modal-text-style"
                        >
                          City
                        </Label>
                        <Input
                          type="text"
                          placeholder="New York"
                          name="city"
                          onChange={this.handleInputChange}
                          value={this.state.city}
                          maxLength="30"
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                </div>
                <div className="">
                  <Row className="">
                    <Col md="6">
                      <FormGroup>
                        <Label
                          htmlFor="name"
                          className="customer-modal-text-style"
                        >
                          State
                        </Label>
                        <Input type="text" name="state"
                          value={this.state.state} onChange={this.handleInputChange} placeholder="NY" maxLength="30" />
                      </FormGroup>
                    </Col>
                    <Col md="6 ">
                      <FormGroup>
                        <Label
                          htmlFor="name"
                          className="customer-modal-text-style"
                        >
                          Zip Code
                        </Label>
                        <Input
                          type="text"
                          placeholder="Zip Code"
                          name="zipCode"
                          onChange={this.handleInputChange}
                          value={this.state.zipCode}
                          maxLength="6"
                        />
                      </FormGroup>
                    </Col>
                  </Row>

                </div>
                <div className="">
                  <Row className="">
                    <Col md="6">
                      <FormGroup>
                        <Label
                          htmlFor="name"
                          className="customer-modal-text-style"
                        >
                          Referral Source
                        </Label>
                        <Input
                          type="text"
                          placeholder="Referral"
                          name="referralSource"
                          onChange={this.handleInputChange}
                          maxLength="100"
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
                          customerDefaultPermissions[permission.key].status
                        ) {
                          discountShow = true;
                        }

                        if (
                          permission.key === "shouldLaborRateOverride" &&
                          customerDefaultPermissions[permission.key].status
                        ) {
                          labourRate = true;
                        }

                        if (
                          permission.key === "shouldPricingMatrixOverride" &&
                          customerDefaultPermissions[permission.key].status
                        ) {
                          pricingMatrix = true;
                        }
                        return (
                          <>
                            <Col md="6" key={index} key={index}>
                              <div className="d-flex">
                                <AppSwitch
                                  className={"mx-1"}
                                  checked={customerDefaultPermissions[permission.key]
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

                                <div className="custom-label" key={index}  >
                                  <Label
                                    htmlFor="name"
                                    className="customer-modal-text-style"
                                  >
                                    Percent Discount
                                </Label>
                                  <FormGroup>
                                    <MaskedInput
                                      mask="11\.11 \%"
                                      name="percentageDiscount"
                                      size="20"
                                      onChange={this.handlePercentageChange}
                                      className="form-control"
                                      value={customerDefaultPermissions[permission.key]
                                        .percentageDiscount}
                                      placeholder="00.00%"
                                    />
                                  </FormGroup>
                                </div>
                              ) : null}
                              {labourRate ? (
                                <Col md="">
                                  <Async
                                    defaultOptions={rateStandardListData.standardRateList}
                                    loadOptions={this.loadOptions}
                                    onChange={this.handleStandardRate}
                                    isClearable={selectedLabourRate.value !== '' ? true : false}
                                    value={selectedLabourRate}
                                  />

                                </Col>
                              ) : null}
                              {/* */}
                              {pricingMatrix ? (
                                <Col md="12">
                                  <Input
                                    type="select"
                                    className=""
                                    onChange={this.handleMatrixChange}
                                    name="matrixType"
                                    id="matrixId"
                                  >
                                    <option value={""}>Select</option>
                                    {matrixListReducerData.matrixList.length
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
                                </Col>
                              ) : null}
                            </Col>
                          </>);
                      }) : null}

                  {expandForm ? (
                    <Col md="12 text-center">
                      <span
                        onClick={this.handleExpandForm}
                        className="customer-anchor-text customer-click-btn"
                      >
                        {" "}
                        Show Less{" "}
                      </span>
                    </Col>
                  ) : null}
                </Row>
              </>
            ) : (
                ""
              )}
            {fleetModalOpen ? <CrmFleetModal /> : ""}
            <CrmStandardModel
              openStadardRateModel={this.state.openStadardRateModel}
              stdModelFun={this.stdModelFun}
              errors={errors}
              handleRateAdd={this.handleRateAdd}
            />
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.updateNewCustomer}>
              {"Update Customer"}
            </Button>{" "}
            <Button color="secondary" onClick={this.handleCustomerModal}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </>
    );
  }
}
