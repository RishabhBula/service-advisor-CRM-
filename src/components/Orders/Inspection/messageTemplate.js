import React, { Component } from 'react';
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Button,
  Input,
  Row,
  Col,
  FormGroup,
  FormFeedback,
  Label
} from 'reactstrap';
import { stripHTML } from "../../../helpers"

class MessageTemplate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      recipients: "Rishabh",
      errors: false,
      isEditMode: false,
      eleId: "",
      templateListData: [],
      singleTemplateData:
      {
        templateName: "",
        subject: "",
        messages: "",
      },
      activeIndex: '' 
    };
  }

  componentDidMount = () => {
    this.props.getMessageTemplate()
  }

  componentDidUpdate = ({ inspectionData }) => {
    let propdata = this.props.inspectionData;
    if (propdata.inspectionData && inspectionData !== propdata) {
      this.setState({
        templateListData: propdata.messageTemplateData
      })
    }
  }

  handleChange = e => {

    this.setState({
      singleTemplateData:{
        ...this.state.singleTemplateData,
        [e.target.name]: e.target.value,
      },
      errors: false
    });
  };


  handleAddtemplate = (e) => {
    e.preventDefault();
    var subjectValue = document.getElementById('tagInput'),
      subject = subjectValue.textContent;
    var messageTextValue = document.getElementById('messageText'),
      messageText = messageTextValue.innerHTML;
    const { singleTemplateData} = this.state;
  
    const payload = {
      templateName : singleTemplateData.templateName ,
      subject,
      messageText,
    }
    if (payload.templateName  === '') {
      this.setState({
        errors: true
      })
    }
    else {
      if(!this.state.isEditMode){
       this.props.addMessageTemplate(payload)

      }
      else{
        payload._id = singleTemplateData._id
        this.props.updateMessageTemplate(payload)
      }
    }
  }

  handleFocus = (id) => {
    this.setState({
      eleId: id
    })
  }

  handelTag = (e, label) => {
    let id = this.state.eleId
    var tagInput = document.getElementById(id)
    tagInput.appendChild(document.createTextNode(label));
  }

  handleEditTemplate = (e, id, index) => {
    const { templateListData } = this.state;
    let i;
    for (i = 0; i < templateListData.length; i++) {
      if (templateListData[i]._id === id) {
        this.setState({
          singleTemplateData: templateListData[i],
          isEditMode: true,
          activeIndex: index
        })
      }
    }
  }

  handelTemplateDelete = (e,id) =>{
    this.props.deleteMessageTemplate(id)
  }

  render() {
    const { templateListData, errors, isEditMode, singleTemplateData, activeIndex} = this.state;
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
            Message Template
          </ModalHeader>
          <ModalBody>
            <div className="">
              <Row className='justify-content-center'>
                <Col md={"6"} sm={"6"}>
                  <h5>Template List</h5>
                  <div className={"message-template-block"}>
                    {templateListData && templateListData.length ?
                      templateListData.map((ele, index) => {
                        return (
                          <div key={index}>
                          <div  className={activeIndex === index ? 'template-tile d-flex active' : 'template-tile d-flex'} onClick={(e) => this.handleEditTemplate(e, ele._id, index)}>
                            <div>Template Name -: {ele.templateName || '-'}</div>
                            <div>Subject -: {ele.subject || '-'}</div>
                            <div>Message -: {ele.messageText ? stripHTML(ele.messageText) : '-'}</div>
                          </div>
                            <Button onClick={(e) => this.handelTemplateDelete(e, ele._id)} color={"danger"}>Delete</Button>
                          </div>
                        )
                      })
                      :
                      <p>No Message Template has been added yet!</p>
                    }
                  </div>
                </Col>
                <Col md={"6"} sm={"6"}>
                  <h5 className={"text-center mb-4"}>
                    {!isEditMode ? "Add New Message Template" : "Edit template"}
                    {isEditMode ? <Button
                      color={"warning"} 
                      size={"sm"}
                      className={"pull-right"}
                      onClick={()=>
                        this.setState({
                          singleTemplateData: {
                            templateName: "",
                            subject: "",
                            messages: "",
                          },
                          isEditMode:false
                        })
                      }>
                        Add New
                      </Button>
                      : null
                    }
                  </h5>
                  <Row className='justify-content-center m-0'>
                    <Col md='12'>
                      <FormGroup>
                        <Label htmlFor='name' className='customer-modal-text-style'>
                          Template Name <span className={"asteric"}>*</span>
                        </Label>
                        <div className={'input-block'}>
                          <Input
                            type='text'
                            name='templateName'
                            onChange={(e) => this.handleChange(e)}
                            placeholder='ex.Invoice Default'
                            value={singleTemplateData.templateName}
                            maxLength='120'
                            id='recipients'
                            invalid={errors && !errors !== ""}
                          />
                          {errors && errors !== "" ? <p className={"text-danger mb-0"}>Please enter a Template Name</p> : null}
                        </div>
                      </FormGroup>
                    </Col>
                    <Col md='12'>
                      <FormGroup>
                        <Label htmlFor='name' className='customer-modal-text-style'>
                          Subject
                    </Label>
                        <div className={'input-block'}>
                          <p contentEditable={"true"} className={"tagInput mb-0"} id={"tagInput"} onClick={(e) => this.handleFocus("tagInput")} dangerouslySetInnerHTML={singleTemplateData.subject ? { __html: singleTemplateData.subject } : null}>
                          </p>
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
                            id={'messageText'}
                            onClick={(e) => this.handleFocus("messageText")}
                            dangerouslySetInnerHTML={singleTemplateData.messageText ? {__html:singleTemplateData.messageText} : null}
                          >
                          </p>
                        </div>
                      </FormGroup>
                    </Col>
                  </Row>
                  <div className={"tagging-warp"}>
                    <span onClick={(e) => this.handelTag(e, '{first_name}')} className={"tags"}>Firstname</span>
                    <span onClick={(e) => this.handelTag(e, '{last_name}')} className={"tags"}>Lastname</span>
                    <span onClick={(e) => this.handelTag(e, '{vehicle}')} className={"tags"}>Vehicle</span>
                    <span onClick={(e) => this.handelTag(e, '{year}')} className={"tags"}>Year</span>
                    <span onClick={(e) => this.handelTag(e, '{make}')} className={"tags"}>Make</span>
                    <span onClick={(e) => this.handelTag(e, '{model}')} className={"tags"}>Model</span>
                  </div>
                </Col>
              </Row>

            </div>


          </ModalBody>
          <ModalFooter>
            <div className={"flex-1"}>
              <div className="required-fields">*Fields are Required.</div>
            </div>
            <Button
              color='primary'
              onClick={(e) => this.handleAddtemplate(e)}
            >
              {!isEditMode ? "Add New Template " : "Update Template"}
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

export default (MessageTemplate)