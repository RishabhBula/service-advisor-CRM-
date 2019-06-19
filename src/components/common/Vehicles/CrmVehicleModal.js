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
  FormGroup,
  FormFeedback,
  Label,
  Input
} from "reactstrap";
import Select from "react-select";
import {
  VehicleValidations,
  VehicleValidationMessage
} from "../../../validations";
import Validator from "js-object-validation";
import { ColorOptions, groupedOptions } from "../../../config/Color";
import { Transmission, Drivetrain } from "../../../config/Constants";
import MaskedInput from "react-maskedinput";

class CustomOption extends Component {
  render() {
    const { data, innerProps } = this.props;
    let style = {
      backgroundColor: data.value
    };
    return (
      <div {...innerProps} className="cursor_pointer">
        <span style={style} className="vehicles-select-color" />
        {data.label}
      </div>
    );
  }
}
const groupStyles = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between"
};

const groupBadgeStyles = {
  backgroundColor: "#EBECF0",
  borderRadius: "2em",
  color: "#172B4D",
  display: "inline-block",
  fontSize: 12,
  fontWeight: "normal",
  lineHeight: "1",
  minWidth: 1,
  padding: "0.16666666666667em 0.5em",
  textAlign: "center"
};

const formatGroupLabel = (data, innerRef, innerProps) => (
  <div {...innerProps} ref={innerRef} style={groupStyles}>
    <span>{data.label}</span>
    <span style={groupBadgeStyles}>{data.options.length}</span>
  </div>
);

export class CrmVehicleModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expandForm: false,
      colorOptions: ColorOptions,
      selectedOption: null,
      year: "",
      make: "",
      modal: "",
      typeSelected: { value: "sedan", label: "Sedan", color: "#FF8B00", icons: "sedan.svg" },
      colorSelected: "",
      miles: "",
      licensePlate: "",
      unit: "",
      vin: "",
      subModal: "",
      engineSize: "",
      productionDate: "",
      transmissionSelected: "automatic",
      drivetrainSelected: "2x4",
      notes: "",
      errors: {},
      prodYearError: "",
      prodMonthError: "",
      isLoading: false
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.vehicleModalOpen !== this.props.vehicleModalOpen) {
      this.removeAllState();
    }
  }

  createVehicleFun = async () => {
    let yeardata = this.state.year === "" ? "" : this.state.year;
    let data = {
      year: yeardata,
      make: this.state.make,
      modal: this.state.modal,
      type: this.state.typeSelected ? this.state.typeSelected : { value: "sedan", label: "Sedan", color: "#FF8B00", icons: "sedan.svg" },
      color: this.state.colorSelected,
      miles: this.state.miles,
      licensePlate: this.state.licensePlate,
      unit: this.state.unit,
      vin: this.state.vin,
      subModal: this.state.subModal,
      engineSize: this.state.engineSize,
      productionDate: this.state.productionDate,
      transmission: this.state.transmissionSelected,
      drivetrain: this.state.drivetrainSelected,
      notes: this.state.notes
    };

    let validationData = {
      year: this.state.year,
      make: this.state.make,
      modal: this.state.modal
      // type: this.state.typeSelected,
      // color: this.state.colorSelected,
      // miles: this.state.miles,
      // licensePlate: this.state.licensePlate,
      // unit: this.state.unit,
      // vin: this.state.vin,
      // subModal: this.state.subModal,
      // engineSize: this.state.engineSize,
      // productionDate: this.state.productionDate,
      // transmission: this.state.transmissionSelected,
      // drivetrain: this.state.drivetrainSelected,
      // notes: this.state.year,
    };

    if (this.state.miles !== "") {
      validationData.miles = this.state.miles;
    }

    const { isValid, errors } = Validator(
      validationData,
      VehicleValidations,
      VehicleValidationMessage
    );
    try {
      const yearValidation = await this.yearValidation(this.state.year);

      if (!isValid || !yearValidation || this.state.prodMonthError || this.state.prodYearError) {
        this.setState(
          {
            errors: errors,
            isLoading: false
          },
          async () => {
            await this.yearValidation(this.state.year);
          }
        );
        return;
      }

      this.props.submitCreateVehicleFun(data);
    } catch (error) {
      console.log("====================================");
      console.log(error);
      console.log("====================================");
    }
  };

  _onInputChange = e => {
    const { target } = e;
    const { name, value } = target;
    if ((name === "year" || name === "miles") && isNaN(value)) {
      return;
    }
    if (name === "productionDate") {
      const splitedDate = value.split("/")
      var d = new Date();
      var n = d.getFullYear();
      if (parseInt(splitedDate[0]) > 12 && splitedDate[0]) {
        this.setState({
          prodMonthError: "Enter valid month."
        })
      }
      else if (parseInt(splitedDate[1]) >= n && splitedDate[1]) {
        this.setState({
          prodYearError: "Production year should be less than current year",
          prodMonthError: null
        })
      }
      else {
        this.setState({
          prodYearError: null,
          prodMonthError: null
        })
      }
    }
    this.setState({
      [name]: value
    });
  };

  handleColor = selectedColor => {
    this.setState({ colorSelected: selectedColor });
  };

  handleType = selectedType => {
    this.setState({
      typeSelected: selectedType
    });
  };

  handleExpandForm = () => {
    this.setState({
      expandForm: !this.state.expandForm
    });
  };

  handleChange = selectedOption => {
    this.setState({ selectedOption });
  };

  handleSelectedChange = selectedOption => {
    const { target } = selectedOption;
    const { name, value } = target;
    this.setState({
      [name]: value
    });
  };

  async removeAllState() {
    this.setState({
      expandForm: false,
      colorOptions: ColorOptions,
      selectedOption: null,
      year: "",
      make: "",
      modal: "",
      typeSelected: { value: "sedan", label: "Sedan", color: "#FF8B00", icons: "sedan.svg" },
      colorSelected: "",
      miles: "",
      licensePlate: "",
      unit: "",
      vin: "",
      subModal: "",
      engineSize: "",
      productionDate: "",
      transmissionSelected: "automatic",
      drivetrainSelected: "2x4",
      notes: "",
      prodMonthError: "",
      prodYearError: "",
      errors: {}
    });
  }

  yearValidation = async year => {
    const text = /^[0-9]+$/;
    let errors = { ...this.state.errors };

    if (year) {
      if (year.length === 4) {
        if (year !== "" && !text.test(parseInt(year))) {
          errors["year"] = "Please Enter Numeric Values Only";
          this.setState({ errors });
          return false;
        }

        if (year.length !== 4) {
          errors["year"] = "Year is not proper. Please check";
          this.setState({ errors });
          return false;
        }

        const current_year = new Date().getFullYear();
        if (year < current_year - 101 || year > current_year) {
          console.log("!!!!!!!!!!!!!!!!!!!!!!!!!", current_year - 101, current_year);

          errors["year"] = `Year should be in range ${current_year -
            101} to ${new Date().getFullYear()}`;
          this.setState({ errors });
          return false;
        }
        errors["year"] = "";
        this.setState({ errors });
        return true;
      } else {
        errors["year"] = "Year is not proper. Please check";
        this.setState({ errors });
        return false;
      }
    } else {
      errors["year"] = "Please enter year.";
      this.setState({ errors });
      return false;
    }
  };

  render() {
    const {
      year,
      type,
      errors,
      miles,
      subModal,
      engineSize,
      productionDate,
      transmission,
      drivetrain,
      notes,
      prodMonthError,
      prodYearError
    } = this.state;
    const { vehicleModalOpen, handleVehicleModal, isCustVehiclemodal } = this.props;
    const {
      expandForm,
      transmissionSelected,
      drivetrainSelected,
      typeSelected,
      colorSelected
    } = this.state;
    return (
      <>
        <Modal
          isOpen={vehicleModalOpen}
          toggle={handleVehicleModal}
          className="customer-modal custom-form-modal custom-modal-lg"
        >
          <ModalHeader toggle={handleVehicleModal}>
            Create New Vehicle
            {
              isCustVehiclemodal ?
                <div className={"step-align"}>
                  Step 2/2
                </div> :
                null
            }
          </ModalHeader>
          <ModalBody>
            <Row className="justify-content-center">
              <Col md="6">
                <FormGroup>
                  <Label htmlFor="name" className="customer-modal-text-style">
                    Year <span className={"asteric"}>*</span>
                  </Label>
                  <div className={"input-block"}>
                    <Input
                      type="text"
                      placeholder="20XX"
                      id="year"
                      name="year"
                      minLength="4"
                      maxLength="4"
                      /* onBlur={this.yearValidation}
                      onKeyPress={this.yearValidation} */
                      onChange={this._onInputChange}
                      value={year}
                      invalid={errors.year}
                    />
                    <FormFeedback>
                      {(!year && errors.year) || errors.hasOwnProperty("year")
                        ? errors.year
                        : null}
                    </FormFeedback>
                    {/* <FormFeedback>
                      {errors.year ? errors.year : null}
                    </FormFeedback> */}
                  </div>
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label htmlFor="name" className="customer-modal-text-style">
                    Make <span className={"asteric"}>*</span>
                  </Label>
                  <div className={"input-block"}>
                    <Input
                      type="text"
                      placeholder="Honda"
                      name="make"
                      onChange={this._onInputChange}
                      maxLength="25"
                      invalid={errors.make}
                    />
                    {/* {!make && errors.make ? (
                      <p className="text-danger">{errors.make}</p>
                    ) : null} */}
                    <FormFeedback>
                      {errors.make ? errors.make : null}
                    </FormFeedback>
                  </div>
                </FormGroup>
              </Col>
            </Row>
            <Row className="justify-content-center">
              <Col md="6">
                <FormGroup>
                  <Label htmlFor="name" className="customer-modal-text-style">
                    Model <span className={"asteric"}>*</span>
                  </Label>
                  <div className={"input-block"}>
                    <Input
                      type="text"
                      className="customer-modal-text-style"
                      id="type"
                      placeholder="Accord OR Q3 Or WR..."
                      name="modal"
                      onChange={this._onInputChange}
                      maxLength="25"
                      invalid={errors.modal}
                    />
                    {/* {!modal && errors.modal ? (
                      <p className="text-danger">{errors.modal}</p>
                    ) : null} */}
                    <FormFeedback>
                      {errors.modal ? errors.modal : null}
                    </FormFeedback>
                  </div>
                  {/* <div className="error-tool-tip">this field is </div> */}
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label htmlFor="name" className="customer-modal-text-style">
                    Type
                  </Label>
                  <div className={"input-block"}>
                    <Select
                      defaultValue={typeSelected}
                      options={groupedOptions}
                      formatGroupLabel={formatGroupLabel}
                      className="w-100 form-select"
                      classNamePrefix={"form-select-theme"}
                      onChange={this.handleType}
                    />
                    {!type && errors.type ? (
                      <p className="text-danger">{errors.type}</p>
                    ) : null}
                  </div>
                </FormGroup>
              </Col>
            </Row>
            <Row className="justify-content-center">
              <Col md="6">
                <FormGroup>
                  <Label htmlFor="name" className="customer-modal-text-style">
                    Miles
                  </Label>
                  <div className={"input-block"}>
                    <Input
                      type="text"
                      placeholder="100,00"
                      name="miles"
                      value={miles}
                      onChange={this._onInputChange}
                      maxLength={15}
                    />
                    {!miles && errors.miles ? (
                      <p className="text-danger">{errors.miles}</p>
                    ) : null}
                  </div>
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label htmlFor="name" className="customer-modal-text-style">
                    Color
                  </Label>
                  <div className={"input-block"}>
                    <Select
                      value={colorSelected}
                      onChange={this.handleColor}
                      options={this.state.colorOptions}
                      className="w-100 form-select"
                      classNamePrefix={"form-select-theme"}
                      placeholder={"Pick a color"}
                      isClearable={true}
                      components={{ Option: CustomOption }}
                    />
                  </div>
                </FormGroup>
              </Col>
            </Row>
            <Row className="justify-content-center">
              <Col md="6">
                <FormGroup>
                  <Label htmlFor="name" className="customer-modal-text-style">
                    Licence Plate
                  </Label>
                  <Input
                    type="text"
                    placeholder="AUM 100"
                    name="licensePlate"
                    onChange={this._onInputChange}
                    maxLength={15}
                  />
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label htmlFor="name" className="customer-modal-text-style">
                    Unit #
                  </Label>
                  <Input
                    type="text"
                    placeholder="BA1234"
                    name="unit"
                    onChange={this._onInputChange}
                    maxLength={15}
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row className="">
              <Col md="6">
                <FormGroup>
                  <Label htmlFor="name" className="customer-modal-text-style">
                    VIN
                  </Label>
                  <Input
                    type="text"
                    placeholder="19UAYF3158T0000"
                    name="vin"
                    onChange={this._onInputChange}
                    maxLength="50"
                  />
                </FormGroup>
              </Col>
              {expandForm ? (
                <>
                  <Col md="6">
                    <FormGroup>
                      <Label
                        htmlFor="name"
                        className="customer-modal-text-style"
                      >
                        Sub Model
                      </Label>
                      <div className={"input-block"}>
                        <Input
                          type="text"
                          placeholder="Sub Model"
                          name="subModal"
                          onChange={this._onInputChange}
                        />
                        {!subModal && errors.subModal ? (
                          <p className="text-danger">{errors.subModal}</p>
                        ) : null}
                      </div>
                    </FormGroup>
                  </Col>
                </>
              ) : (
                  ""
                )}
            </Row>
            {/* <Row className="justify-content-center">
              <Col md="12 text-center">
                {!expandForm ? (
                  <span
                    onClick={this.handleExpandForm}
                    className="customer-anchor-text customer-click-btn"
                  >
                    Show More
                  </span>
                ) : (
                  ""
                )}
              </Col>
            </Row> */}
            {/* {expandForm ? (
              <> */}
            <Row className="justify-content-center">
              <Col md="6">
                <FormGroup>
                  <Label
                    htmlFor="name"
                    className="customer-modal-text-style"
                  >
                    Engine Size
                      </Label>
                  <div className={"input-block"}>
                    <Input
                      type="text"
                      name="engineSize"
                      onChange={this._onInputChange}
                      placeholder="Engine Size"
                      id="rate"
                    />
                    {!engineSize && errors.engineSize ? (
                      <p className="text-danger">{errors.engineSize}</p>
                    ) : null}
                  </div>
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label
                    htmlFor="name"
                    className="customer-modal-text-style"
                  >
                    Production Date
                      </Label>
                  <div className={"input-block"}>
                    <MaskedInput
                      name="productionDate"
                      mask="11/1111"
                      placeholder="MM/YYYY"
                      onChange={this._onInputChange}
                      className={classnames("form-control", {
                        "is-invalid":
                          (prodMonthError || prodYearError) &&
                          productionDate
                      })}
                    />
                    <FormFeedback>
                      {prodYearError ? prodYearError : null}
                    </FormFeedback>
                    <FormFeedback>
                      {prodMonthError ? prodMonthError : null}
                    </FormFeedback>
                  </div>
                </FormGroup>
              </Col>
            </Row>
            <Row className="justify-content-center">
              <Col md="6">
                <FormGroup>
                  <Label
                    htmlFor="name"
                    className="customer-modal-text-style"
                  >
                    Transmission
                      </Label>
                  <div className={"input-block"}>
                    <Input
                      type="select"
                      className=""
                      onChange={this.handleSelectedChange}
                      name="transmissionSelected"
                      id="matrixId"
                    >
                      <option value={""}>Select</option>
                      {Transmission.length
                        ? Transmission.map((item, index) => {
                          return (
                            <option
                              selected={item.key === transmissionSelected}
                              value={item.key}
                              key={index}
                            >
                              {item.text}
                            </option>
                          );
                        })
                        : null}
                    </Input>
                    {!transmission && errors.transmission ? (
                      <p className="text-danger">{errors.transmission}</p>
                    ) : null}
                  </div>
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label
                    htmlFor="name"
                    className="customer-modal-text-style"
                  >
                    Drivetrain
                      </Label>
                  <div className={"input-block"}>
                    <Input
                      type="select"
                      className=""
                      onChange={this.handleSelectedChange}
                      name="drivetrain"
                      id="matrixId"
                    >
                      <option value={""}>Select</option>
                      {Drivetrain.length
                        ? Drivetrain.map((item, index) => {
                          return (
                            <option
                              selected={item.key === drivetrainSelected}
                              value={item.key}
                              key={index}
                            >
                              {item.text}
                            </option>
                          );
                        })
                        : null}
                    </Input>
                    {!drivetrain && errors.drivetrain ? (
                      <p className="text-danger">{errors.drivetrain}</p>
                    ) : null}
                  </div>
                </FormGroup>
              </Col>
            </Row>
            <Row className="justify-content-center">
              <Col md="12">
                <FormGroup>
                  <Label
                    htmlFor="name"
                    className="customer-modal-text-style"
                  >
                    Notes
                      </Label>
                  <div className={"input-block"}>
                    <Input
                      name="notes"
                      type="textarea"
                      placeholder="Enter a note..."
                      id="name"
                      maxLength={"300"}
                      onChange={this._onInputChange}
                    />
                    {!notes && errors.notes ? (
                      <p className="text-danger">{errors.notes}</p>
                    ) : null}
                  </div>
                </FormGroup>
              </Col>
            </Row>
            <Row className="justify-content-center">
              <Col md="12 text-center">
                {expandForm ? (
                  <span
                    onClick={this.handleExpandForm}
                    className="customer-anchor-text customer-click-btn"
                  >
                    Show Less
                      </span>
                ) : (
                    ""
                  )}
              </Col>
            </Row>
            {/* </>
            ) : (
              ""
            )} */}
          </ModalBody>
          <ModalFooter>
            <div className="required-fields">*Fields are Required.</div>
            <div className={isCustVehiclemodal ? "btn-reverse" : "btn-forward"}>
              <Button color="primary" onClick={this.createVehicleFun}>
                {
                  isCustVehiclemodal ?
                    "Add Vehicle and Finish" :
                    "Add Vehicle"
                }
              </Button>{" "}
              <Button color="secondary" onClick={handleVehicleModal}>
                {
                  isCustVehiclemodal ?
                    "< Back To Previous" :
                    "Cancel"
                }
              </Button>
            </div>
          </ModalFooter>
        </Modal>
      </>
    );
  }
}
