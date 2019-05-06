import React, { Component } from "react";
import * as classnames from "classnames";
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Col,
  FormFeedback,
  FormGroup,
  Label,
  Input
} from "reactstrap";
import { AppSwitch } from "@coreui/react";
import { AppConfig } from "../../config/AppConfig";
import { PhoneOptions, DefaultErrorMessage } from "../../config/Constants";
import MaskedInput from "react-maskedinput";
import {
  CustomerDefaultPermissions,
  CustomerPermissionsText
} from "../../config/Constants";
import {
  CreateRateValidations,
  CreateRateValidMessaages
} from "../../validations";
import Async from "react-select/lib/Async";
import { CrmStandardModel } from "../common/CrmStandardModel";
import { logger } from "../../helpers/Logger";
import Validator from "js-object-validation";
import { ApiHelper } from "../../helpers/ApiHelper";
import { toast } from "react-toastify";
import {
  CreateFleetValidations,
  CreateFleetValidMessaages
} from "../../validations";

export class CrmFleetModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      switchValue: true,
      companyName: "",
      phoneDetail: [
        {
          phone: "mobile",
          value: ""
        }
      ],
      phoneErrors: [""],
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
      defaultOptions: [{ value: "", label: "Add New Customer" }],
      selectedLabourRate: { value: "", label: "Select..." },
      vendorValue: "",
      openStadardRateModel: false
    };
  }

  stdModelFun = () => {
    this.setState({
      openStadardRateModel: !this.state.openStadardRateModel
    });
  };

  handlePercentageChange = e => {
    const { fleetDefaultPermissions } = this.state;
    fleetDefaultPermissions["shouldReceiveDiscount"].percentageDiscount =
      e.target.value;
    this.setState({
      ...fleetDefaultPermissions
    });
  };

  handleStandardRate = selectValue => {
    if (selectValue) {
      if (selectValue.value === "") {
        this.setState({
          openStadardRateModel: !this.state.openStadardRateModel
        });
      } else {
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
      this.setState({
        selectedLabourRate: {
          value: "",
          label: "Select..."
        }
      });
    }
  };

  handleRateAdd = async data => {
    const profileData = this.props.profileInfoReducer;
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
          isLoading: false
        });
        return;
      } else {
        const ratedata = {
          data: data,
          userId: profileData._id,
          parentId: profileData.parentId
        };
        let result = await api.FetchFromServer(
          "/labour",
          "/addRate",
          "POST",
          true,
          undefined,
          ratedata
        );
        if (result.isError) {
          toast.error(result.messages[0] || DefaultErrorMessage);
        } else {
          toast.success(result.messages[0]);
          this.setState({
            openStadardRateModel: !this.state.openStadardRateModel,
            selectedLabourRate: {
              value: result.data.data._id,
              label: result.data.data.name + " - " + result.data.data.hourlyRate
            }
          });
        }
      }
    } catch (error) {
      logger(error);
    }
  };

  componentDidUpdate(prevProps) {
    if (prevProps.fleetModalOpen !== this.props.fleetModalOpen) {
      this.removeAllState();
    }
  }

  async removeAllState() {
    this.setState({
      companyName: "",
      phoneDetail: [
        {
          phone: "",
          value: ""
        }
      ],
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
      phoneErrors: [""],
      isEditMode: false,
      phoneLength: AppConfig.phoneLength,
      fleetDefaultPermissions: CustomerDefaultPermissions,
      percentageDiscount: 0,
      defaultOptions: [{ value: "", label: "Add New Customer" }],
      selectedLabourRate: { value: "", label: "Select..." },
      vendorValue: "",
      error: {},
      openStadardRateModel: false
    });
  }

  handleClick(singleState, e) {
    const { fleetDefaultPermissions } = this.state;
    fleetDefaultPermissions[singleState].status = e.target.checked;
    this.setState({
      ...fleetDefaultPermissions
    });
  }

  handlePhoneNameChange = (index, event) => {
    const { value } = event.target;
    const phoneDetail = [...this.state.phoneDetail];
    phoneDetail[index].phone = value;
    this.setState({
      phoneDetail
    });
  };

  handlePhoneValueChange = (index, event) => {
    const { value } = event.target;
    const phoneDetail = [...this.state.phoneDetail];
    phoneDetail[index].value = value;
    this.setState({
      phoneDetail
    });
  };

  handleChange = event => {
    const { name, value } = event.target;
    if ((name === "phoneDetail" || name === "zipCode") && isNaN(value)) {
      return;
    } else {
      this.setState({
        [name]: value
      });
    }
  };

  handleAddPhoneDetails = () => {
    const { phoneDetail } = this.state;
    if (phoneDetail.length < 3) {
      this.setState((state, props) => {
        return {
          phoneDetail: state.phoneDetail.concat([
            {
              phone: "mobile",
              value: ""
            }
          ]),
          phoneErrors: state.phoneErrors.concat([""])
        };
      });
    }
  };

  handleRemovePhoneDetails = index => {
    const { phoneDetail, phoneErrors } = this.state;
    let t = [...phoneDetail];
    let u = [...phoneErrors];
    t.splice(index, 1);
    u.splice(index, 1);
    if (phoneDetail.length) {
      this.setState({
        phoneDetail: t,
        phoneErrors: u
      });
    }
  };

  setStateAsync(state) {
    return new Promise(resolve => {
      this.setState(state, resolve);
    });
  }

  handleAddFleet = async (fleetData, isEditMode) => {
    try {
      const { phoneDetail } = this.state;
      if (phoneDetail.length) {
        let t = [];
        this.setState({ phoneErrors: t });
        await Promise.all(
          phoneDetail.map(async (key, i) => {
            if (key.value.length) {
              // t[i] = null
            } else {
              t[i] = "Phone number is required";
            }
          })
        );
        await this.setStateAsync({ phoneErrors: t });
      }

      const { isValid, errors } = Validator(
        fleetData,
        CreateFleetValidations,
        CreateFleetValidMessaages
      );
      if (
        (!isValid && fleetData.email !== "") ||
        Object.keys(this.state.phoneErrors).length ||
        fleetData.companyName === ""
      ) {
        this.setState({
          errors,
          isLoading: false
        });
        return;
      }

      const userData = this.props.profileInfoReducer;
      const userId = userData._id;
      const parentId = userData.parentId;
      const data = {
        fleetData,
        userId: userId,
        parentId: parentId
      };

      if (!isEditMode) {
        this.props.addFleet(data);
      } else {
        this.props.updateFleet(data);
      }

      this.setState({
        openCreate: !this.state.openCreate
      });
    } catch (error) {
      logger(error);
    }
  };

  render() {
    const {
      fleetModalOpen,
      handleFleetModal,
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
      return <option value={item.key} key={index}>{item.text}</option>;
    });
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
      percentageDiscount
    };
    return (
      <>
        <Modal
          isOpen={fleetModalOpen}
          toggle={handleFleetModal}
          backdrop={"static"}
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
                      Company Name <span className={"asteric"}>*</span>
                    </Label>
                    <div className={"input-block"}>
                      <Input
                        type="text"
                        name="companyName"
                        onChange={this.handleChange}
                        placeholder="Company Name"
                        value={companyName}
                        maxLength="20"
                        id="name"
                        invalid={errors.companyName && !companyName}
                      />
                      <FormFeedback>
                        {errors && !companyName && errors.companyName
                          ? "Company name is requiered"
                          : null}
                      </FormFeedback>
                    </div>
                  </FormGroup>
                </Col>
                <Col md="6">
                  <FormGroup>
                    <Label htmlFor="name" className="customer-modal-text-style">
                      Email
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
                        invalid={errors && errors.email && email}
                      />
                      <FormFeedback>
                        {errors && errors.email && email
                          ? "Please enter valid email address"
                          : null}
                      </FormFeedback>
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
                                  Phone <span className={"asteric"}>*</span>
                                </Label>
                                {/* <div></div> */}

                                <Input
                                  onChange={e =>
                                    this.handlePhoneNameChange(index, e)
                                  }
                                  type="select"
                                  id="name"
                                >
                                  {phoneOptions}
                                </Input>
                                {phoneDetail[index].phone === "mobile" ||
                                  phoneDetail[index].phone === "" ? (
                                    <div className="input-block select-number-tile">
                                      <MaskedInput
                                        mask="(111) 111-111"
                                        name="phoneDetail"
                                        placeholder="(555) 055-0555"
                                        className={classnames("form-control", {
                                          "is-invalid":
                                            this.state.phoneErrors[index] !== ""
                                        })}
                                        size="20"
                                        value={item.value}
                                        onChange={e =>
                                          this.handlePhoneValueChange(index, e)
                                        }
                                      />
                                      <FormFeedback>
                                        {this.state.phoneErrors[index]}
                                      </FormFeedback>
                                      {/* {
                                      console.log(typeof this.state.phoneErrors[index], "adadadaada")

                                    }
                                    <p className='text-danger'>
                                      {this.state.phoneErrors[index]}
                                    </p> */}
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
                                      <p className="text-danger">
                                        {this.state.phoneErrors[index]}
                                      </p>
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
                                  <i className="fa fa-close" />
                                </button>
                                <FormGroup className="phone-number-feild">
                                  <Label
                                    htmlFor="name"
                                    className="customer-modal-text-style"
                                  >
                                    Phone <span className={"asteric"}>*</span>
                                  </Label>
                                  {/* <div></div> */}
                                  <Input
                                    onChange={e =>
                                      this.handlePhoneNameChange(index, e)
                                    }
                                    type="select"
                                    id="name"
                                  >
                                    {phoneOptions}
                                  </Input>
                                  {phoneDetail[index].phone === "mobile" ||
                                    phoneDetail[index].phone === "" ? (
                                      <div className="input-block select-number-tile">
                                        <MaskedInput
                                          mask="(111) 111-111"
                                          name="phoneDetail"
                                          placeholder="(555) 055-0555"
                                          className={classnames("form-control", {
                                            "is-invalid":
                                              this.state.phoneErrors[index] !== ""
                                          })}
                                          size="20"
                                          value={item.value}
                                          onChange={e =>
                                            this.handlePhoneValueChange(index, e)
                                          }
                                        />
                                        <FormFeedback>
                                          {this.state.phoneErrors[index]}
                                        </FormFeedback>
                                        {/* <p className='text-danger'>
                                        {this.state.phoneErrors[index]}
                                      </p> */}
                                      </div>
                                    ) : (
                                      <div className="input-block select-number-tile">
                                        <MaskedInput
                                          mask="(111) 111-111 ext 1111"
                                          name="phoneDetail"
                                          className={classnames("form-control", {
                                            "is-invalid":
                                              this.state.phoneErrors[index] !== ""
                                          })}
                                          placeholder="(555) 055-0555 ext 1234"
                                          size="20"
                                          value={item.value}
                                          onChange={e =>
                                            this.handlePhoneValueChange(index, e)
                                          }
                                        />
                                        <FormFeedback>
                                          {this.state.phoneErrors[index]}
                                        </FormFeedback>
                                        {/* <p className='text-danger'>
                                          {this.state.phoneErrors[index]}
                                        </p> */}
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
                {phoneDetail.length < 2 ? (
                  <Col md="6">
                    <FormGroup className="mb-0 phone-info-block">
                      <p className={"phone-info-text mb-0"}>
                        You can add more phone number related to your office ,
                        home etc.
                      </p>
                    </FormGroup>
                  </Col>
                ) : null}
                {phoneDetail.length < 3 ? (
                  <Col md="12">
                    <FormGroup className={"mb-0"}>
                      <Label className={"customer-modal-text-style"} />
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
                      placeholder="NY"
                    />
                  </FormGroup>
                </Col>
                <Col md="6">
                  <FormGroup>
                    <Label
                      htmlFor="name"
                      name="zip"
                      className="customer-modal-text-style"
                    >
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
                    />
                  </FormGroup>
                </Col>
              </Row>
            </div>
            <Row className="custom-label-padding ">
              {CustomerPermissionsText
                ? CustomerPermissionsText.map((permission, index) => {
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
                      <Col
                        md="6"
                        key={index}
                        className={
                          permission.key === "shouldPricingMatrixOverride"
                            ? "price-matrix"
                            : null
                        }
                      >
                        <div className="d-flex">
                          <AppSwitch
                            className={"mx-1"}
                            checked={
                              fleetDefaultPermissions[permission.key].status
                            }
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
                          <div
                            className="custom-label col-12 d-flex"
                            key={index}
                          >
                            <Label
                              htmlFor="name"
                              className="customer-modal-text-style mr-2"
                            >
                              Percent Discount
                              </Label>
                            <FormGroup>
                              <Col md="4" className={"p-0"}>
                                {/* <Cleave
                                  placeholder="00.00%"
                                  options={{
                                    delimiter: '.',
                                    blocks: [1, 2],
                                    numeral: true
                                  }}
                                /> */}
                                <MaskedInput
                                  mask="11\.11 \%"
                                  placeholder="00.00%"
                                  name="percentageDiscount"
                                  size="20"
                                  onChange={this.handlePercentageChange}
                                  className="form-control"
                                  value={
                                    fleetDefaultPermissions[permission.key]
                                      .percentageDiscount
                                  }
                                />
                              </Col>
                            </FormGroup>
                          </div>
                        ) : null}
                        {labourRate &&
                          rateStandardListData &&
                          rateStandardListData.standardRateList &&
                          rateStandardListData.standardRateList.length ? (
                            <Col
                              md=""
                              className={"fleet-block rate-standard-list"}
                            >
                              <Async
                                defaultOptions={
                                  rateStandardListData.standardRateList
                                }
                                loadOptions={this.loadOptions}
                                onChange={this.handleStandardRate}
                                isClearable={
                                  this.state.selectedLabourRate.value !== ""
                                    ? true
                                    : false
                                }
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
                                {matrixListReducerData &&
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
                    </>
                  );
                })
                : null}
            </Row>
            <CrmStandardModel
              openStadardRateModel={this.state.openStadardRateModel}
              stdModelFun={this.stdModelFun}
              errors={errors}
              handleRateAdd={this.handleRateAdd}
            />
          </ModalBody>
          <ModalFooter>
            <div class="required-fields">*Fields are Required.</div>
            <Button
              color="primary"
              onClick={() =>
                this.handleAddFleet(fleetData, isEditMode, fleetId)
              }
            >
              {!isEditMode ? "Add New Fleet" : "Update Fleet Details"}
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
