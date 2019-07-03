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
      recipients: "",
      errors: {},
      customerData: {},
      vehicleData: {},
      orderId: "",
      templateData: [],
      subject: "",
      customerEmail: "",
      searchInput: "",
      search: "",
      messageTextSentError:''
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
      })

    }
  }
  handleChangeInput = (e, name) => {
    const { errors } = this.state
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
    const {customerData, subject } = this.state
    const customerEmail = customerData.email
    try {
      var messageTextValue = document.getElementById('messageTextSent'),
        messageTextSent = messageTextValue.innerHTML;
      const validData = {
        subject: subject,
        email: customerEmail
      }
      if (messageTextSent === '') {
        this.setState({
          messageTextSentError : "Please enter message "
        })
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
      // close and clear modal form 
      this.props.toggle()
      this.setState({
        subject:'',
        search: '',
        templateData:[
          {messageText :''}
        ]
      })     
    }
    catch (error) { }
  }

  onKeyPress = (e) => {
    this.setState({
      messageTextSentError : ''
    });

  }
  handleFocus = (id) =>{
    document.getElementById(id).addEventListener("paste", function (e) {
      e.preventDefault();
      var text = e.clipboardData.getData("text/plain");
      document.execCommand("insertHTML", false, text);
    });
  }

  clearForm =()=>{
    this.setState({
      errors : {
        email:'',
        subject:''
      },
      messageTextSentError: '',
      search: '',
      subject:'',
    })

  }

  handleAddtoMessage = () =>{
    var messageTextValue = document.getElementById('messageTextSent'),
      messageTextSent = messageTextValue.innerHTML;
      this.props.messsageTemplateData(messageTextSent)
      // close and clear modal form 
      this.props.toggle()
      this.setState({
        search: '',
        templateData: [
          { messageText: '' }
        ]
      })
   
  }
  render() {
    const { templateData, recipients, errors, search, customerData, messageTextSentError } = this.state
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
                <Col md='8'>
                  <Row className='justify-content-center'>
                    {!this.props.isMessage  ? <>
                    <Col md='12'>
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
                    <Col md='12'>
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
                   </> : null}
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
                  {!this.props.isMessage ? 
                    <Col md='12'>
                      <FormGroup>
                        <Label htmlFor='name' className='customer-modal-text-style'>
                          Subject <span className={"asteric"}>*</span>
                        </Label>
                        <div className={'input-block'}>
                          <Input
                            type='text'
                            name='subject'
                            onChange={(e) => this.handleChangeInput(e, "subject")}
                            placeholder='Inspection #1000 for your vehicle'
                            value={this.state.subject}
                            id='subject'
                            maxLength='60'
                            invalid={errors.subject || false}
                          />
                          {errors.subject ? (
                            <FormFeedback>{errors.subject}</FormFeedback>
                          ) : null}
                        </div>
                      </FormGroup>
                    </Col>
                    : null}
                    <Col md='12'>
                      <FormGroup>
                        <Label htmlFor='name' className='customer-modal-text-style'>
                          Message  <span className={"asteric"}>*</span>
                        </Label>
                        <div className={"w-100"}>
                          <div className={messageTextSentError && messageTextSentError !== "" ? 'input-block message-input-warp is-invalid' : "input-block message-input-warp"}>
                            <p
                              suppressContentEditableWarning contentEditable={"true"}
                              onKeyPress={(e) => this.onKeyPress(e)}
                              className={"message-input"}
                              id={'messageTextSent'}
                              dangerouslySetInnerHTML={templateData && templateData.length ? { __html: templateData[0].messageText } : null}
                              onClick={(e) => this.handleFocus("messageTextSent")}
                            >
                            </p>
                          </div>
                          {messageTextSentError && messageTextSentError !== "" ? <span className={" invalid-feedback "}>Please enter message</span> : null}
                        </div>
                      </FormGroup>
                    </Col>
                  </Row>
                </Col>
                <Col md='4'>
                  Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                </Col>
              </Row>
            </div>
          </ModalBody>
          <ModalFooter>
            <div className={"flex-1"}>
              <div className="required-fields">*Fields are Required.</div>
            </div>
            {!this.props.isMessage ? 
            <Button color='primary' onClick={this.handleSentInspection}>
              Sent Inspection
            </Button> : <Button color='primary' onClick={this.handleAddtoMessage}>
                Add to message
            </Button> }{' '}
            <Button color='secondary' onClick={(e) => { this.props.toggle(); this.clearForm()}}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </>
    );
  }
}

export default (SendInspection)