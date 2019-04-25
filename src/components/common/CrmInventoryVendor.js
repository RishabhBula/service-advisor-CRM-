import React, { Component } from 'react';
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
  Input,
} from 'reactstrap';
import Validator from "js-object-validation";
import { VendorValidations, VendorValidationMessage } from "../../validations/inventoryVendor";
import { PhoneOptions } from "../../config/Constants";
import MaskedInput from "react-text-mask";
import { validUrlCheck } from "../../helpers/Object"

export class CrmInventoryVendor extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isEditMode: false,
      name: '',
      accountNumber: '',
      url: '',
      contactPerson: {
        firstName: '',
        email: '',
        lastName: '',
        phoneNumber: {
          phone: 'mobile',
          value: ''
        }
      },
      address: {
        address: '',
        city: '',
        state: '',
        zip: ''
      },
      errors: {},
      urlErros: ''
    }
  }

  componentDidUpdate = ({ vendorAddModalOpen, vendorData }) => {
    if (vendorAddModalOpen !== this.props.vendorAddModalOpen && !this.props.vendorData) {
      this.removeAllState();
    }

    if (
      this.props.vendorData && this.props.vendorData._id &&
      (vendorData._id !== this.props.vendorData._id)
    ) {

      const {
        name,
        accountNumber,
        url,
        contactPerson,
        address,
      } = this.props.vendorData

      this.setState({
        isEditMode: true,
        name,
        accountNumber,
        url,
        contactPerson,
        address,
      })
    }
  }
  async removeAllState() {
    this.setState({
      name: '',
      accountNumber: '',
      url: '',
      contactPerson: {
        firstName: '',
        email: '',
        lastName: '',
        phoneNumber: {
          phone: 'mobile',
          value: ''
        }
      },
      address: {
        address: '',
        city: '',
        state: '',
        zip: ''
      },
      errors: {},
      urlErros: '',
    });
  }

  handleChange = (label, event) => {
    const { name, value } = event.target;
    if ((name === "accountNumber" && isNaN(value)) || (name === "zip" && isNaN(value))) {
      return
    }
    if (label !== '') {
      this.setState(state => {
        return {
          [label]: {
            ...state[label],
            [name]: value
          },
          errors: {
            ...state.errors,
            [name]: ""
          }

        };
      });
    } else {
      this.setState({
        [name]: value
      });
    }

  }
  handlePhoneValueChange = (event) => {
    const { value } = event.target;
    this.setState({
      contactPerson: {
        ...this.state.contactPerson,
        phoneNumber: {
          ...this.state.contactPerson.phoneNumber,
          value: value
        }
      }
    })
  }
  handlePhoneNameChange = (event) => {
    const { value } = event.target;
    this.setState({
      contactPerson: {
        ...this.state.contactPerson,
        phoneNumber: {
          value: "",
          phone: value
        }
      }
    })
  }

  handleAddVendor = e => {
    e.preventDefault();
    const {
      name,
      accountNumber,
      url,
      contactPerson,
      address,
      isEditMode
    } = this.state;
    let validData
    if (contactPerson.email !== '') {
      validData = {
        name: name,
        accountNumber: accountNumber,
        email: contactPerson.email
      }
    } else {
      validData = {
        name: name,
        accountNumber: accountNumber,
      }
    }
    if (url && !validUrlCheck(url)) {
      this.setState({
        urlErros: "Please enter Valid URL( http:// )"
      })
    }
    else {
      this.setState({
        urlErros: ""
      })
    }
    const data = {
      name,
      accountNumber,
      url,
      contactPerson,
      address
    }
    try {
      const { isValid, errors } = Validator(validData, VendorValidations, VendorValidationMessage);
      if (!isValid || (url && !validUrlCheck(url))) {
        this.setState({
          errors: errors,
          isLoading: false
        });

        return;
      }
      if (!isEditMode) {
        this.props.addVendor(data);
      }
      const vendorId = this.props.vendorData._id
      this.props.updateVendor(vendorId, data);

    } catch (error) {
      console.log(error)
    }
  };

  render() {
    const {
      isEditMode,
      name,
      url,
      accountNumber,
      contactPerson,
      address,
      errors,
      urlErros
    } = this.state;
    const phoneOptions = PhoneOptions.map((item, index) => <option key={index} value={item.key}>{item.text}</option>);
    return (
      <>
        <Modal
          isOpen={this.props.vendorAddModalOpen}
          toggle={this.props.handleVendorAddModal}
          backdrop={"static"}
          className='customer-modal custom-form-modal custom-modal-lg'
        >
          <ModalHeader toggle={this.props.handleVendorAddModal}>
            {!isEditMode ? 'Create New Vendor' : `Update Vendor`}
          </ModalHeader>
          <ModalBody>
            <div className=''>
              <Row className='justify-content-center'>
                <Col md='6'>
                  <FormGroup>
                    <Label htmlFor='name' className='customer-modal-text-style'>
                      Name <span className={"asteric"}>*</span>
                    </Label>
                    <div className={'input-block'}>
                      <Input
                        type='text'
                        name='name'
                        onChange={
                          (e) => this.handleChange('', e)
                        }
                        placeholder='John'
                        value={name}
                        maxLength='50'
                        id='name'
                        invalid={errors.name && !name}
                      />
                      <FormFeedback>
                        {errors.name && !name ? errors.name : null}
                      </FormFeedback>
                    </div>
                  </FormGroup>
                </Col>
                <Col md='6'>
                  <FormGroup>
                    <Label htmlFor='name' className='customer-modal-text-style'>
                      URL
                    </Label>
                    <div className={'input-block'}>
                      <Input
                        type='text'
                        name='url'
                        onChange={(e) => this.handleChange('', e)}
                        placeholder='http://google.com'
                        value={url}
                        id='name'
                        invalid={urlErros && url}
                      />
                      <FormFeedback>
                        {urlErros && url ? urlErros : null}
                      </FormFeedback>
                    </div>
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md='6'>
                  <FormGroup>
                    <Label htmlFor='name' className='customer-modal-text-style'>
                      Account Number <span className={"asteric"}>*</span>
                    </Label>
                    <div className={'input-block'}>
                      <Input
                        type='text'
                        name='accountNumber'
                        onChange={(e) => this.handleChange('', e)}
                        placeholder='898989898998'
                        value={accountNumber}
                        maxLength='20'
                        id='accountNumber'
                        invalid={errors.accountNumber && !accountNumber}
                      />
                      <FormFeedback>
                        {errors.accountNumber && !accountNumber ? errors.accountNumber : null}
                      </FormFeedback>
                    </div>
                  </FormGroup>
                </Col>
              </Row>
              <h5>Contact Person</h5>
              <Row>
                <Col md='6'>
                  <FormGroup>
                    <Label htmlFor='name' className='customer-modal-text-style'>
                      First Name
                    </Label>
                    <div className={'input-block'}>
                      <Input
                        type='text'
                        name='firstName'
                        onChange={(e) => this.handleChange('contactPerson', e)}
                        placeholder='John'
                        value={contactPerson.firstName}
                        maxLength='35'
                        id='name'
                      // invalid={errors.companyName}
                      />
                    </div>
                  </FormGroup>
                </Col>
                <Col md='6'>
                  <FormGroup>
                    <Label htmlFor='name' className='customer-modal-text-style'>
                      Last Name
                    </Label>
                    <div className={'input-block'}>
                      <Input
                        type='text'
                        name='lastName'
                        onChange={(e) => this.handleChange('contactPerson', e)}
                        placeholder='Deo'
                        value={contactPerson.lastName}
                        maxLength='35'
                        id='name'
                      // invalid={errors.companyName}
                      />
                      <FormFeedback>
                        {/* {errors && !companyName && errors.companyName ? "Company name is requiered" : null} */}
                      </FormFeedback>
                    </div>
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md='6'>
                  <FormGroup>
                    <Label htmlFor='name' className='customer-modal-text-style'>
                      Email
                    </Label>
                    <div className={'input-block'}>
                      <Input
                        type='text'
                        name='email'
                        onChange={(e) => this.handleChange('contactPerson', e)}
                        placeholder='john@gmail.com'
                        value={contactPerson.email}
                        id='email'
                        invalid={errors.email}
                      />
                      <FormFeedback>
                        {errors.email ? errors.email : null}
                      </FormFeedback>
                    </div>
                  </FormGroup>
                </Col>
                <Col md='6'>
                  <FormGroup className={"phone-number-feild"}>
                    <Label htmlFor='contactPhone' className='customer-modal-text-style'>
                      Phone Number
                    </Label>
                    <Input
                      onChange={e => {
                        this.handlePhoneNameChange(e)
                      }}
                      type="select"
                      name="phone"
                      value={contactPerson.phoneNumber.phone}
                      id="contactPhone"
                    >
                      {phoneOptions}
                    </Input>
                    <div className={'input-block'}>
                      <MaskedInput
                        mask={contactPerson.phoneNumber.phone === "mobile" ? ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/] : ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, ' ', 'ext', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, /\d/]}
                        // "(111) 111-111 ext 1111"
                        placeholder={contactPerson.phoneNumber.phone === "mobile" ? "(555) 055-0555" : "(555) 055-0555 ext 1234"}
                        name='value'
                        maxLength={contactPerson.phoneNumber.phone === "mobile" ? 13 : 22}
                        guide={false}
                        onChange={(e) => this.handlePhoneValueChange(e)}
                        value={contactPerson.phoneNumber.value || null}
                        className={"form-control"}
                        size='20'
                        id='phoneNumber'
                      // invalid={errors.companyName}
                      />
                      <FormFeedback>
                        {errors.phoneNumber ? errors.phoneNumber : null}
                      </FormFeedback>

                    </div>
                  </FormGroup>
                </Col>
              </Row>
              <h5>Address</h5>
              <Row>
                <Col md='6'>
                  <FormGroup>
                    <Label htmlFor='name' className='customer-modal-text-style'>
                      Address
                    </Label>
                    <div className={'input-block'}>
                      <Input
                        type='text'
                        name='address'
                        onChange={(e) => this.handleChange('address', e)}
                        placeholder='Address'
                        value={address.address}
                        maxLength='250'
                        id='address'
                      />
                    </div>
                  </FormGroup>
                </Col>
                <Col md='6'>
                  <FormGroup>
                    <Label htmlFor='name' className='customer-modal-text-style'>
                      City
                    </Label>
                    <div className={'input-block'}>
                      <Input
                        type='text'
                        name='city'
                        onChange={(e) => this.handleChange('address', e)}
                        placeholder='New York'
                        value={address.city}
                        maxLength='35'
                        id='city'
                      />
                    </div>
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md='6'>
                  <FormGroup>
                    <Label htmlFor='name' className='customer-modal-text-style'>
                      State
                    </Label>
                    <div className={'input-block'}>
                      <Input
                        type='text'
                        name='state'
                        onChange={(e) => this.handleChange('address', e)}
                        placeholder='NY'
                        value={address.state}
                        maxLength='35'
                        id='name'
                      />
                    </div>
                  </FormGroup>
                </Col>
                <Col md='6'>
                  <FormGroup>
                    <Label htmlFor='name' className='customer-modal-text-style'>
                      Zip
                    </Label>
                    <div className={'input-block'}>
                      <Input
                        type='text'
                        name='zip'
                        onChange={(e) => this.handleChange('address', e)}
                        placeholder='Zip Code'
                        value={address.zip}
                        maxLength='5'
                        id='name'
                      />
                    </div>
                  </FormGroup>
                </Col>
              </Row>
            </div>
          </ModalBody>
          <ModalFooter>
            <div className="required-fields">*Fields are Required.</div>
            <Button
              color='primary'
              onClick={this.handleAddVendor}
            >
              {!isEditMode ? "Add New Vendor " : "Edit Vendor"}
            </Button>{' '}
            <Button color='secondary' onClick={this.props.handleVendorAddModal}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </>
    )
  }
}

export default CrmInventoryVendor;