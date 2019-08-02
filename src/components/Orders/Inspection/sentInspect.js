import React, { Component } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Input,
  Row,
  Col,
  FormGroup,
  FormFeedback,
  Label
} from "reactstrap";
import moment from "moment";
import { Async } from "react-select";
import Validator from "js-object-validation";
import {
  inspectValidations,
  inspectValidationMessage
} from "../../../validations/inspection";
import MaskedInput from "react-text-mask";

import { SendEmailAndSMS } from "../../SendReminderEmail&SMS/index";
import { ConfirmBox } from "../../../helpers/SweetAlert";

class SendInspection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      recipients: "",
      errors: {},
      customerData: {},
      vehicleData: {},
      orderId: "",
      templateData: "",
      subject: "",
      customerEmail: "",
      searchInput: "",
      search: "",
      messageTextSentError: "",
      isEmail: false,
      isSms: false,
      phone: "",
      incorrectNumber: false
    };
  }

  componentDidMount = () => {
    this.setState({
      customerData: this.props.customerData,
      vehicleData: this.props.vehicleData
    });
  };

  componentDidUpdate = ({ customerData, vehicleData }) => {
    let propsCustomerData = this.props.customerData;
    let propsVehicleData = this.props.vehicleData;
    if (
      (propsCustomerData && propsCustomerData !== customerData) ||
      (propsVehicleData && propsVehicleData !== vehicleData)
    ) {
      this.setState({
        customerData: propsCustomerData,
        vehicleData: propsVehicleData,
        isEmail: propsCustomerData && propsCustomerData.email ? true : false,
         isSms: propsCustomerData && propsCustomerData.phoneDetail && propsCustomerData.phoneDetail[0].value ? true : false,
        phone:
          propsCustomerData && propsCustomerData.phoneDetail
            ? propsCustomerData.phoneDetail[0].value
            : null
      });
    }
  };

  handleChangeInput = (e, name) => {
    const { errors } = this.state;
    if (name === "subject") {
      errors.subject = "";
      this.setState({
        subject: e.target.value,
        errors
      });
    } else if (name === "phone") {
      const { value } = e.target;
      this.setState({
        phone: value,
        isSms: value ? true : false,
        incorrectNumber: false
      });
    } else {
      errors.email = "";
      this.setState({
        customerData: {
          ...this.state.customerData,
          [name]: e.target.value ? e.target.value : ""
        },
        isEmail: e.target.value ? true : false
        //errors
      });
    }
  };
  /** */
  handleChange = e => {
    if (e && e.value) {
      this.setState(
        {
          search: e
        },
        () => {
          this.props.searchMessageTemplateList({
            search: this.state.search.label
          });
        }
      );
    } else {
      this.setState(
        {
          search: ""
        },
        () => {
          this.props.searchMessageTemplateList();
        }
      );
    }
    if (e && e !== "") {
      let content = e.templateData.messageText;
      let contentSubject = e.templateData.subject;
      const { customerData, vehicleData } = this.state;

      const replaceObj = {
        first_name: customerData.firstName,
        last_name: customerData.lastName,
        year: vehicleData && vehicleData.year ? vehicleData.year : null,
        make: vehicleData && vehicleData.make ? vehicleData.make : null,
        model: vehicleData && vehicleData.modal ? vehicleData.modal : null
      };

      for (const key in replaceObj) {
        if (replaceObj.hasOwnProperty(key)) {
          const val = replaceObj[key];
          content = content.replace(new RegExp(`{${key}}`, "g"), val);
          contentSubject = contentSubject.replace(
            new RegExp(`{${key}}`, "g"),
            val
          );
        }
      }
      const data = {
        messageText: content,
        subject: contentSubject
      };
      this.setState({
        subject: contentSubject,
        templateData: data,
        messageTextSentError: "",
        errors: {
          subject: ""
        }
      });
    }
  };
  /** */
  loadOptions = (search, callback) => {
    this.setState({ search: search.length > 1 ? search : null });
    this.props.searchMessageTemplateList({ search, callback });
  };
  /** */
  handleSentInspection = async () => {
    const { customerData, subject, isEmail, isSms, phone } = this.state;
    const { orderReducer, profileReducer, isOrder } = this.props;
    const customerId = customerData._id;
    const customerEmail = customerData.email;

    const orderTitle = orderReducer && orderReducer.orderItems
      ? orderReducer.orderItems.orderName
      : "Untitled order";

    const orderCreated =
      orderReducer && orderReducer.orderItems
        ? moment(orderReducer.orderItems.createdAt || "").format("MMM Do YYYY")
        : "";
    const companyName = profileReducer.profileInfo.companyName || "";

    try {
      var messageTextValue = document.getElementById("messageTextSent"),
        messageTextSent = messageTextValue.innerHTML;
      const validData = {
        subject: subject,
        email: customerEmail
      };
      if (messageTextSent === "") {
        this.setState({
          messageTextSentError: "Please enter message "
        });
      } else {
        this.setState({
          messageTextSentError: ""
        });
      }
      if (phone !== "" && phone.length < 13) {
        this.setState({
          incorrectNumber: true
        });
      }
      const { isValid, errors } = Validator(
        validData,
        inspectValidations,
        inspectValidationMessage
      );
      if (!isValid) {
        this.setState({
          errors: errors,
          isLoading: false
        });
        return;
      }

      const payload = {
        message: messageTextSent,
        subject: subject,
        customerId,
        email: customerEmail,
        phone,
        pdf: this.props.pdfBlob,
        orderTitle: orderTitle,
        companyName: companyName,
        orderCreated: orderCreated,
        isInvoice: isOrder ? true : false,
        isEmail,
        isSms
      };

      if (!isEmail && !isSms) {
        await ConfirmBox({
          text: "",
          title: "Please check Mail or SMS or Both to sent notification",
          showCancelButton: false,
          confirmButtonText: "Ok"
        });
        return
      }
      this.props.sendMessageTemplate(payload);

      // close and clear modal form
      this.props.toggle();

      this.setState({
        subject: "",
        search: "",
        templateData: [{ messageText: "" }]
      });
    } catch (error) { }
  };
  /** */
  onKeyPress = e => {
    this.setState({
      messageTextSentError: ""
    });
  };
  /** */
  handleFocus = id => {
    document.getElementById(id).addEventListener("paste", function (e) {
      e.preventDefault();
      var text = e.clipboardData.getData("text/plain");
      document.execCommand("insertHTML", false, text);
    });
  };
  /** */
  clearForm = () => {
    this.setState({
      errors: {
        email: "",
        subject: ""
      },
      messageTextSentError: "",
      search: "",
      subject: "",
      templateData: ""
    });
  };
  /** */
  handleAddtoMessage = () => {
    var messageTextValue = document.getElementById("messageTextSent"),
      messageTextSent = messageTextValue.innerHTML;
    this.props.messsageTemplateData(messageTextSent);
    // close and clear modal form
    this.props.toggle();
    this.setState({
      search: ""
    });
  };
  /**
   *
   */
  handleReminder = e => {
    const { name, checked } = e.target;
    this.setState({
      [name]: checked
    });
  };
  /**
   *
   */
  render() {
    const {
      templateData,
      recipients,
      errors,
      search,
      customerData,
      messageTextSentError,
      isEmail,
      isSms,
      incorrectNumber,
      phone
    } = this.state;
    const { isMessage, isOrder } = this.props;

    const email = customerData && customerData.email ? customerData.email : "";
    const phoneNumber = phone;

    return (
      <>
        <Modal
          isOpen={this.props.isOpen}
          toggle={this.props.toggle}
          backdrop={"static"}
          className="customer-modal custom-form-modal custom-modal-lg"
        >
          <ModalHeader>
            <Button className="close" onClick={this.props.toggle}>
              <span aria-hidden="true">×</span>
            </Button>
            {!isMessage && !isOrder
              ? "Send Inspection"
              : isMessage
                ? "Message Template"
                : "Sent Invoice"}
          </ModalHeader>
          <ModalBody>
            <span
              className={"btn btn-secondary btn-dashed ml-5 mb-4"}
              onClick={this.props.toggleMessageTemplate}
            >
              Manage Template
            </span>
            <div className="">
              <Row className="justify-content-center">
                <Col md="8">
                  <Row className="justify-content-center">
                    {!this.props.isMessage ? (
                      <>
                        <Col md="12">
                          <FormGroup>
                            <Label
                              htmlFor="name"
                              className="customer-modal-text-style"
                            >
                              Recipients{" "}
                              <span className={"asteric"}>*</span>
                            </Label>
                            <div className={"input-block"}>
                              <Input
                                type="text"
                                name="name"
                                onChange={e => this.handleChange(e)}
                                placeholder="John"
                                value={
                                  customerData ? customerData.firstName : ""
                                }
                                maxLength="50"
                                id="recipients"
                                invalid={errors.recipients && !recipients}
                                disabled
                              />
                              <FormFeedback>
                                {errors.recipients && !recipients
                                  ? errors.recipients
                                  : null}
                              </FormFeedback>
                            </div>
                          </FormGroup>
                        </Col>
                        <Col md="12">
                          <FormGroup>
                            <Label
                              htmlFor="name"
                              className="customer-modal-text-style"
                            >
                              Email
                              {/* <span className={"asteric"}>*</span> */}
                            </Label>
                            <div className={"input-block"}>
                              <Input
                                type="text"
                                name="customerEmail"
                                onChange={e =>
                                  this.handleChangeInput(e, "email")
                                }
                                placeholder="John@gmail.com"
                                value={
                                  customerData && customerData.email
                                    ? customerData.email
                                    : ""
                                }
                                maxLength="100"
                                id="customerEmail"
                                invalid={errors.email || false}
                              />
                              {errors.email ? (
                                <FormFeedback>{errors.email}</FormFeedback>
                              ) : null}
                            </div>
                          </FormGroup>
                        </Col>
                        <Col md="12">
                          <FormGroup>
                            <Label
                              htmlFor="name"
                              className="customer-modal-text-style"
                            >
                              Phone
                              {/* <span className={"asteric"}>*</span> */}
                            </Label>
                            <div className={"input-block"}>
                              <MaskedInput
                                mask={[
                                  "(",
                                  /[1-9]/,
                                  /\d/,
                                  /\d/,
                                  ")",
                                  " ",
                                  /\d/,
                                  /\d/,
                                  /\d/,
                                  "-",
                                  /\d/,
                                  /\d/,
                                  /\d/
                                ]}
                                name="phone"
                                className={
                                  !incorrectNumber
                                    ? "form-control"
                                    : "form-control is-invalid"
                                }
                                placeholder="(555) 055-0555"
                                size="20"
                                value={phone}
                                maxLength={13}
                                guide={false}
                                onChange={e =>
                                  this.handleChangeInput(e, "phone")
                                }
                              />

                              {incorrectNumber ? (
                                <FormFeedback>
                                  Phone number should not be less than ten
                                  digit.
                                </FormFeedback>
                              ) : null}
                            </div>
                          </FormGroup>
                        </Col>
                      </>
                    ) : null}
                    <Col md="12">
                      <FormGroup className={"fleet-block"}>
                        <Label
                          htmlFor="name"
                          className="customer-modal-text-style"
                        >
                          Template Title
                        </Label>
                        <div className={"input-block"}>
                          <Async
                            placeholder={"Type template title"}
                            loadOptions={this.loadOptions}
                            value={search}
                            onChange={e => this.handleChange(e)}
                            isClearable={true}
                            noOptionsMessage={() =>
                              search ? (
                                "No template found"
                              ) : (
                                  <span
                                    onClick={this.props.toggleMessageTemplate}
                                  >
                                    Add template
                                </span>
                                )
                            }
                          />
                        </div>
                      </FormGroup>
                    </Col>
                    {!this.props.isMessage ? (
                      <Col md="12">
                        <FormGroup>
                          <Label
                            htmlFor="name"
                            className="customer-modal-text-style"
                          >
                            Subject <span className={"asteric"}>*</span>
                          </Label>
                          <div className={"input-block"}>
                            <Input
                              type="text"
                              name="subject"
                              onChange={e =>
                                this.handleChangeInput(e, "subject")
                              }
                              placeholder="Inspection #1000 for your vehicle"
                              value={this.state.subject}
                              id="subject"
                              maxLength="60"
                              invalid={errors.subject || false}
                            />
                            {errors.subject ? (
                              <FormFeedback>{errors.subject}</FormFeedback>
                            ) : null}
                          </div>
                        </FormGroup>
                      </Col>
                    ) : null}
                    <Col md="12">
                      <FormGroup>
                        <Label
                          htmlFor="name"
                          className="customer-modal-text-style"
                        >
                          Message <span className={"asteric"}>*</span>
                        </Label>
                        <div className={"w-100"}>
                          <div
                            className={
                              messageTextSentError &&
                                messageTextSentError !== ""
                                ? "input-block message-input-warp is-invalid"
                                : "input-block message-input-warp"
                            }
                          >
                            <p
                              suppressContentEditableWarning
                              contentEditable={"true"}
                              onKeyPress={e => this.onKeyPress(e)}
                              className={"message-input"}
                              id={"messageTextSent"}
                              dangerouslySetInnerHTML={
                                templateData
                                  ? { __html: templateData.messageText }
                                  : null
                              }
                              onClick={e =>
                                this.handleFocus("messageTextSent")
                              }
                            />
                          </div>
                          {messageTextSentError &&
                            messageTextSentError !== "" ? (
                              <span className={" invalid-feedback "}>
                                Please enter message
                            </span>
                            ) : null}
                        </div>
                      </FormGroup>
                    </Col>
                  </Row>
                </Col>
                <Col md="4">
                  {!this.props.isMessage ? (
                    <SendEmailAndSMS
                      headingTitle={"Send Notification"}
                      handleReminder={this.handleReminder}
                      isEmail={isEmail}
                      isSms={isSms}
                      email={email}
                      phone={phoneNumber}
                    />
                  ) : null}
                </Col>
              </Row>
            </div>
          </ModalBody>
          <ModalFooter>
            <div className={"flex-1"}>
              <div className="required-fields">*Fields are Required.</div>
            </div>
            {!isMessage ? (
              <Button color="primary" onClick={this.handleSentInspection}>
                {isOrder ? "Sent Invoice" : "Sent Inspection"}
              </Button>
            ) : (
                <Button color="primary" onClick={this.handleAddtoMessage}>
                  Add to message
              </Button>
              )}{" "}
            <Button
              color="secondary"
              onClick={e => {
                this.props.toggle();
                this.clearForm();
              }}
            >
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </>
    );
  }
}

export default SendInspection;
