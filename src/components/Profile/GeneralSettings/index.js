import React, { Component } from "react";
import {
  Row,
  Col,
  Form,
  Input,
  FormGroup,
  FormFeedback,
  Button,
  Label
} from "reactstrap";
import { logger } from "../../../helpers/Logger";
import Validator from "js-object-validation";
import { ProfileValidations, ProfileValidationsMessaages } from "../../../validations/profile.js";
import { countryWithTimezone, allServices, allVehicleServices, allPeopleArray } from "../../../config/Constants"
import { isValidURL } from "../../../helpers/Object";

class GenralSettings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errors: "",
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      address: "",
      companyName: "",
      companyNumber: "",
      vatNumber: "",
      website: "",
      currency: "",
      timeZone: "",
      peopleWork: {
        selected: "",
        allPeopleArray
      },
      servicesOffer: {
        selectedServices: [],
        allServices
      },
      vehicleService: {
        selectedVehicleServices: [],
        allVehicleServices
      },
      validErrors: {}
    };
  }

  componentDidMount = () => {
    if (this.props.profileData.profileInfo) {
      const {
        firstName,
        lastName,
        email,
        phoneNumber,
        address,
        currency,
        companyName,
        companyNumber,
        vatNumber,
        website,
        peopleWork,
      } = this.props.profileData.profileInfo;
      this.setState({
        firstName,
        lastName,
        email,
        phoneNumber,
        address,
        companyName,
        companyNumber,
        vatNumber,
        website,
        currency,
        peopleWork: {
          ...this.state.peopleWork,
          selected: peopleWork,
        },
        servicesOffer: {
          ...this.state.servicesOffer,
          selectedServices: this.props.profileData.profileInfo ? this.props.profileData.profileInfo.serviceOffer : [],
        },
        vehicleService: {
          ...this.state.vehicleService,
          selectedVehicleServices: this.props.profileData.profileInfo ? this.props.profileData.profileInfo.vehicleService : [],
        }

      })
    }
  }
  componentDidUpdate = ({ profileData }) => {

    if (profileData.profileInfo !== this.props.profileData.profileInfo) {
      const {
        firstName,
        lastName,
        phoneNumber,
        address,
        currency,
        companyName,
        companyNumber,
        vatNumber,
        website,
        timeZone,
        peopleWork,
      } = this.props.profileData.profileInfo;

      this.setState({
        firstName,
        lastName,
        phoneNumber,
        address,
        currency,
        companyName,
        companyNumber,
        vatNumber,
        website,
        timeZone,
        peoplework: {
          ...this.state.peopleWork,
          selected: peopleWork,
        },
        servicesOffer: {
          ...this.state.servicesOffer,
          selectedServices: this.props.profileData.profileInfo ? this.props.profileData.profileInfo.serviceOffer : [],
        },
        vehicleService: {
          ...this.state.vehicleService,
          selectedVehicleServices: this.props.profileData.profileInfo ? this.props.profileData.profileInfo.vehicleService : [],
        }
      })
    }
  }

  handleInputChange = e => {
    const { target } = e;
    const { name, value } = target;
    this.setState({
      [name]: value,
      errors: {
        ...this.state.errors,
        [name]: null
      }
    });

  };

  serviceOfferAction = event => {
    let servicesOffer = this.state.servicesOffer;
    if (servicesOffer.selectedServices.length) {
      let checkExistence = servicesOffer.selectedServices.some(
        item => item === event.key
      );
      if (!checkExistence) {
        servicesOffer.selectedServices.push(event.key);
      } else {
        let servicesArray = servicesOffer.selectedServices.findIndex(
          item => item === event.key
        );
        servicesOffer.selectedServices.splice(servicesArray, 1);
      }
    } else {
      servicesOffer.selectedServices.push(event.key);
    }

    this.setState({
      servicesOffer: servicesOffer,
      validErrors: {
        ...this.state.validErrors,
        servicesOffer: null
      }
    });
  };

  vehicleServicesAction = event => {
    let vehicleService = this.state.vehicleService;
    if (vehicleService.selectedVehicleServices.length) {
      console.log(vehicleService.selectedVehicleServices, 'vehicleService.selectedVehicleServices')
      console.log(event.key, 'item.key')
      let checkVehicleExistence = vehicleService.selectedVehicleServices.some(
        item =>
          item === event.key
      );

      if (!checkVehicleExistence) {
        vehicleService.selectedVehicleServices.push(event.key);
      } else {
        let vehicleExistance = vehicleService.selectedVehicleServices.findIndex(
          item => item === event.key
        );
        vehicleService.selectedVehicleServices.splice(
          vehicleExistance,
          1
        );
      }
    } else {
      vehicleService.selectedVehicleServices.push(event.key);
    }

    this.setState({
      vehicleService: vehicleService,
      validErrors: {
        ...this.state.validErrors,
        vehicleService: null
      }
    });
  };

  peopleWorkAction = event => {
    let peopleWork = this.state.peopleWork;
    peopleWork.selected = event;
    this.setState({
      peopleWork: peopleWork,
      errors: {
        ...this.state.errors,
        peopleWork: null
      }
    });
  };


  handleSubmit = e => {
    e.preventDefault();
    try {
      let validErrors = {};
      let hasErrors = false;
      const {
        firstName,
        lastName,
        phoneNumber,
        address,
        currency,
        companyName,
        vatNumber,
        companyNumber,
        website,
        timeZone,
        vehicleService: {
          selectedVehicleServices
        },
        servicesOffer: {
          selectedServices
        },
        peopleWork
      } = this.state;
      const { selected } = peopleWork;
      if (!selected) {
        validErrors.peopleWork = "Please select number of employees.";
        hasErrors = true;
      }

      if (!selectedServices.length) {
        validErrors.servicesOffer = "Please select at least one service.";
        hasErrors = true;
      }

      if (!selectedVehicleServices.length) {
        validErrors.vehicleService = "Please select at least one vehicle.";
        hasErrors = true;
      }

      if (website && !isValidURL(website)) {
        this.setState({
          urlError: "Please enter Valid URL( http:// )"
        })
      }
      else {
        this.setState({
          urlError: ""
        })
      }
      const servicesOfferTemp = [];
      for (let index = 0; index < selectedServices.length; index++) {
        const element = selectedServices[index];
        servicesOfferTemp.push(element);
      }
      const vehicleServicesOfferTemp = [];
      for (let index = 0; index < selectedVehicleServices.length; index++) {
        const element = selectedVehicleServices[index];
        vehicleServicesOfferTemp.push(element);
      }

      const payload = {
        firstName,
        lastName,
        contactNumber: phoneNumber,
        address,
        currency,
        companyName,
        companyNumber,
        vatNumber,
        website,
        timeZone,
        vehicleService: vehicleServicesOfferTemp,
        servicesOffer: servicesOfferTemp,
        peopleWork: selected,
      };

      const { isValid, errors } = Validator(
        payload,
        ProfileValidations,
        ProfileValidationsMessaages
      );

      if (!isValid || (!isValid && hasErrors) || hasErrors) {
        this.setState({
          validErrors,
          errors
        });
        return;
      }
      else {
        console.log(payload)
        this.props.updateProfileSetting(payload)
      }
    }
    catch (error) {
      logger(error);
    }
  }



  render() {
    const { errors, firstName, lastName, phoneNumber, address, currency} = this.state;
    const { profileData } = this.props;
    const timeZoneOptions = countryWithTimezone.filter(country => country.name === 'United States')
    const options = timeZoneOptions[0].timezones.map(
      (item, index) => {
        return <option key={index} value={item}>{item}</option>
      });



    return (
      <div>
        <Row>
          <Col lg={"12"} md={"12"} className={"custom-form-modal"}>
            <Form onSubmit={this.handleSubmit}>
              <Row>
                <Col lg={"6"} md={"6"} >
                  <FormGroup>
                    <Label htmlFor={"old password"} className="customer-modal-text-style">
                      First Name<span className="asteric">*</span>
                    </Label>
                    <div className="input-block">
                      <Input
                        type="text"
                        placeholder="First Name"
                        onChange={this.handleInputChange}
                        value={firstName}
                        name="firstName"
                        invalid={errors.firstName}
                      />
                      <FormFeedback>
                        {errors.firstName ? errors.firstName : null}
                      </FormFeedback>
                    </div>
                  </FormGroup>
                </Col>
                <Col lg={"6"} md={"6"} >
                  <FormGroup>
                    <Label htmlFor={"old password"} className="customer-modal-text-style">
                      Last Name <span className="asteric">*</span>
                    </Label>
                    <div className="input-block">
                      <Input
                        type="text"
                        placeholder="Last Name"
                        onChange={this.handleInputChange}
                        value={lastName}
                        name="lastName"
                        invalid={errors.lastName}
                      />
                      <FormFeedback>
                        {errors.lastName ? errors.lastName : null}
                      </FormFeedback>
                    </div>
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col lg={"6"} md={"6"} >
                  <FormGroup>
                    <Label htmlFor={"old password"} className="customer-modal-text-style">
                      Email<span className="asteric">*</span>
                    </Label>
                    <div className="input-block">
                      <Input
                        type="text"
                        placeholder="Email"
                        onChange={this.handleInputChange}
                        value={profileData.profileInfo.email}
                        name="email"
                        invalid={errors.email}
                        disabled
                      />
                      <FormFeedback>
                        {errors.email ? errors.email : null}
                      </FormFeedback>
                    </div>
                  </FormGroup>
                </Col>
                <Col lg={"6"} md={"6"} >
                  <FormGroup>
                    <Label htmlFor={"old password"} className="customer-modal-text-style">
                      Contact Number
                  </Label>
                    <div className="input-block">
                      <Input
                        type="text"
                        placeholder="Contact Number"
                        onChange={this.handleInputChange}
                        value={phoneNumber}
                        name="phoneNumber"
                        invalid={errors.phoneNumber}
                        maxLength={13}
                      />
                      <FormFeedback>
                        {errors.phoneNumber ? errors.phoneNumber : null}
                      </FormFeedback>
                    </div>
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col lg={"6"} md={"6"} >
                  <FormGroup>
                    <Label htmlFor={"old password"} className="customer-modal-text-style">
                      Currency
                  </Label>
                    <div className="input-block">
                      <Input
                        type="select"
                        placeholder="Currency"
                        onChange={this.handleInputChange}
                        value={currency}
                        name="currency"
                        invalid={errors.currency}
                      >
                        <option value={" "}>Select</option>
                        <option value={"usd"}>USD</option>
                      </Input>
                      <FormFeedback>
                        {errors.currency ? errors.currency : null}
                      </FormFeedback>
                    </div>
                  </FormGroup>
                </Col>
                <Col lg={"6"} md={"6"}>
                  <FormGroup>
                    <Label htmlFor={"old password"} className="customer-modal-text-style">
                      Time Zone
                </Label>
                    <div className="input-block">
                      <Input
                        type="select"
                        placeholder="Time Zone"
                        onChange={this.handleInputChange}
                        name="timeZone"
                        invalid={errors.timeZone}
                      >
                        {options}
                      </Input>

                      <FormFeedback>
                        {errors.timeZone ? errors.timeZone : null}
                      </FormFeedback>
                    </div>
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col lg={"12"} md={"12"} >
              <FormGroup>
                <Label htmlFor={"old password"} className="customer-modal-text-style">
                  Address
                  </Label>
                <div className="input-block">
                  <Input
                    type="textarea"
                    placeholder="Address"
                    onChange={this.handleInputChange}
                    value={address}
                    name="address"
                    invalid={errors.address}
                  />
                  <FormFeedback>
                    {errors.address ? errors.address : null}
                  </FormFeedback>
                </div>
              </FormGroup>
                </Col>
                </Row>
            </Form>
          </Col>
        </Row>
        <Row className={"m-0 d-flex justify-content-center"}>
          <Col xs="4" className={""}>
            <FormGroup>
              <Label htmlFor={"old password"} className="customer-modal-text-style">
              </Label>
              <div className="input-block">
                <Button
                  color="primary"
                  className="px-4 btn-theme"
                  type="submit"
                  block
                  onClick={this.handleSubmit}
                >
                  Update
                    </Button>
              </div>
            </FormGroup>

          </Col>
        </Row>
      </div>
    )
  }
}

export default GenralSettings