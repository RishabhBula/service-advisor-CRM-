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


class SendInspection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      recipients:"Rishabh",
      errors:[],
      orderData: [],
      orderId:"5ce00c4e3e7c7c0c9aa50444",
      templateData: [
        {
          templateName:"",
          subject: "Inspection (#1000) for your 1987 Isuzu I-Mark S",
          messageText: "Below is a link to the inspection you requested from Fix-It-All Auto Repair. Please review and let us know if you have any questions.",
        }
      ],
      searchInput: "",
      search:"",
      
    };
  }
  
  componentDidUpdate = ({ inspectionData }) => {
    let propdata = this.props.inspectionData;
    if (propdata.inspectionData && inspectionData !== propdata) {
      this.setState({
        templateListData: propdata.messageTemplateData
      })
    }
  }

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
    if (e && e !== ""){
      this.setState({
        templateData: e.templateData
      })
    }
  };

  loadOptions = (search, callback) => {
    this.setState({ search: search.length > 1 ? search : null });
    this.props.searchMessageTemplateList({ search, callback });
  };

  render() {
    const { templateData, recipients, errors, search} = this.state

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
                        value={recipients}
                        maxLength='50'
                        id='recipients'
                        invalid={errors.recipients && !recipients}
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
                        onChange={(e) => this.handleChange(e)}
                        placeholder='Inspection #1000 for your vehicle'
                        value={templateData.subject}
                        id='name'
                      />
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
                        dangerouslySetInnerHTML={templateData.messageText ? { __html: templateData.messageText } : null}
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
            <Button color='primary'>
              Sent New Template
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