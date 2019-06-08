import React, { Component } from 'react';
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
} from 'reactstrap';
import { Async } from "react-select";
import Validator from "js-object-validation";
import { inspectValidations, inspectValidationMessage } from "../../../validations/inspection";

class SendInspection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      recipients: "Rishabh",
      errors: {},
      customerData: {},
      vehicleData: {},
      orderId: "",
      templateData: [],
      subject: "",
      customerEmail: "",
      searchInput: "",
      search: "",

    };
  }

  componentDidMount = () => {
    this.setState({
      customerData: this.props.customerData,
      vehicleData: this.props.vehicleData,
    })
  }

  componentDidUpdate = ({ customerData, vehicleData }) => {
    let propsCustomerData = this.props.customerData
    let propsVehicleData = this.props.vehicleData
    if ((propsCustomerData && propsCustomerData !== customerData) || (propsVehicleData && propsVehicleData !== vehicleData)) {
      this.setState({
        customerData: propsCustomerData,
        vehicleData: propsVehicleData,
        customerEmail: customerData.email
      })

    }
  }
  handleChangeInput = (e, name) => {
    const {errors} = this.state
    if (name === "subject") {
      errors.subject = ""
      this.setState({
        subject: e.target.value,
      })
    } else {
      errors.email = ""
      this.setState({
        customerData: {
          ...this.state.customerData,
          email: e.target.value,
        },
        errors
      })
    }
  };

  handleChange = (e) => {
    if (e && e.value) {
      this.setState({
        search: e
      },
        () => {
          this.props.searchMessageTemplateList({ 'search': this.state.search.label });
        });
    } else {
      this.setState({
        search: ""
      }, () => {
        this.props.searchMessageTemplateList();
      });
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
        model: vehicleData && vehicleData.modal ? vehicleData.modal : null,
      };

      for (const key in replaceObj) {
        if (replaceObj.hasOwnProperty(key)) {
          const val = replaceObj[key];
          content = content.replace(new RegExp(`{${key}}`, "g"), val);
          contentSubject = contentSubject.replace(new RegExp(`{${key}}`, "g"), val);
        }
      }
      const data = {
        messageText: content,
        subject: contentSubject,
      }
      this.state.templateData.push(data)
      this.setState({
        subject: contentSubject,
        templateData: this.state.templateData
      })

    }
  };

  loadOptions = (search, callback) => {
    this.setState({ search: search.length > 1 ? search : null });
    this.props.searchMessageTemplateList({ search, callback });
  };

  handleSentInspection = () => {
    const { templateData, customerData, subject, errors} = this.state
    const customerEmail = customerData.email
    try{
    
    // let errors ={};
    // let hasErrors = false;
    // if (customerData.email === ''){
    //     errors.email = 'Please add a valid email address';
    //     hasErrors = true
    // }
    // else if (subject === ''){
    //   errors.subject = 'Please add subject for temaplte';
    //   hasErrors = true
    // }
    // if (hasErrors) {
    //   this.setState({
    //     errors
    //   });
    //   return;
    // }
    var messageTextValue = document.getElementById('messageTextSent'),
      messageTextSent = messageTextValue.innerHTML;
    //const MessageData = templateData
      const validData = {
        subject: subject,
        email: customerEmail
      }

      const { isValid, errors } = Validator(validData, inspectValidations, inspectValidationMessage);
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
      email: customerEmail
    }

    this.props.sendMessageTemplate(payload)
    }
    catch (error) { }
  }



  render() {
    const { templateData, recipients, errors, search, customerData, customerEmail } = this.state

    return (
      <>
        <Modal
          isOpen={this.props.isOpen}
          toggle={this.props.toggle}
          backdrop={"static"}
          className='customer-modal custom-form-modal custom-modal-lg'
        >
          <ModalHeader >
            <Button className="close" onClick={this.props.toggle}>
              <span aria-hidden="true">×</span>
            </Button>
            Send Inspection
            </ModalHeader>
          <ModalBody>
            <Button onClick={this.props.toggleMessageTemplate}>Add template</Button>
            <div className="">
              <Row className='justify-content-center'>
                <Col md='6'>
                  <FormGroup>
                    <Label htmlFor='name' className='customer-modal-text-style'>
                      Recipients <span className={"asteric"}>*</span>
                    </Label>
                    <div className={'input-block'}>
                      <Input
                        type='text'
                        name='name'
                        onChange={(e) => this.handleChange(e)}
                        placeholder='John'
                        value={customerData ? customerData.firstName : ''}
                        maxLength='50'
                        id='recipients'
                        invalid={errors.recipients && !recipients}
                        disabled
                      />
                      <FormFeedback>
                        {errors.recipients && !recipients ? errors.recipients : null}
                      </FormFeedback>
                    </div>
                  </FormGroup>
                </Col>
                <Col md='6'>
                  <FormGroup>
                    <Label htmlFor='name' className='customer-modal-text-style'>
                      Email <span className={"asteric"}>*</span>
                    </Label>
                    <div className={'input-block'}>
                      <Input
                        type='text'
                        name='customerEmail'
                        onChange={(e) => this.handleChangeInput(e, "email")}
                        placeholder='John@gmail.com'
                        value={customerData && customerData.email ? customerData.email : ''}
                        maxLength='100'
                        id='customerEmail'
                        invalid={errors.email || false}
                      />
                      {errors.email ? (
                        <FormFeedback>{errors.email}</FormFeedback>
                      ) : null}
                    </div>
                  </FormGroup>
                </Col>
                <Col md='12'>
                  <FormGroup>
                    <Label htmlFor='name' className='customer-modal-text-style'>
                      Template Title
                    </Label>
                    <div className={"input-block"}>
                      <Async
                        placeholder={"Type template title"}
                        loadOptions={this.loadOptions}
                        value={search}
                        onChange={(e) => this.handleChange(e)}
                        isClearable={true}
                        noOptionsMessage={() =>
                          search ? "No template found"
                            :
                            <span onClick={this.props.toggleMessageTemplate}>Add template</span>
                        }
                      />
                    </div>
                   
                  </FormGroup>
                </Col>
                <Col md='12'>
                  <FormGroup>
                    <Label htmlFor='name' className='customer-modal-text-style'>
                      Subject
                    </Label>
                    <div className={'input-block'}>
                      <Input
                        type='text'
                        name='subject'
                        onChange={(e) => this.handleChangeInput(e, "subject")}
                        placeholder='Inspection #1000 for your vehicle'
                        value={this.state.subject}
                        id='subject'
                        maxLength='100'
                        invalid={errors.subject || false}
                      />
                      {errors.subject ? (
                        <FormFeedback>{errors.subject}</FormFeedback>
                      ) : null}
                    </div>
                  </FormGroup>
                </Col>
                <Col md='12'>
                  <FormGroup>
                    <Label htmlFor='name' className='customer-modal-text-style'>
                      Message
                    </Label>
                    <div className={'input-block'}>
                      <p
                        suppressContentEditableWarning contentEditable={"true"}
                        className={"message-input"}
                        id={'messageTextSent'}
                        dangerouslySetInnerHTML={templateData && templateData.length ? { __html: templateData[0].messageText } : null}
                      >
                      </p>
                    </div>
                  </FormGroup>
                </Col>
              </Row>
            </div>

          </ModalBody>
          <ModalFooter>
            <div className={"flex-1"}>
              <div className="required-fields">*Fields are Required.</div>
            </div>
            <Button color='primary' onClick={this.handleSentInspection}>
              Sent Inspection
            </Button>{' '}
            <Button color='secondary' onClick={this.props.toggle}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </>
    );
  }
}

export default (SendInspection)