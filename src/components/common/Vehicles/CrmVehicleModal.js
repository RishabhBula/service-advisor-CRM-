import React, { Component } from 'react';
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
  Input,
} from 'reactstrap';
import Select, { components } from 'react-select';
import {
  VehicleValidations,
  VehicleValidationMessage,
} from '../../../validations';
import Validator from 'js-object-validation';
import {
  ColorOptions,
  GroupedCarsOptions,
  carsOptions,
  groupedOptions,
} from '../../../config/Color';
import { Transmission, Drivetrain } from '../../../config/Constants';
import MaskedInput from 'react-maskedinput';

class CustomOption extends Component {
  render() {
    const { data, innerRef, innerProps } = this.props;
    let style = {
      backgroundColor: data.value,
    };
    return (
      <div {...innerProps} className='cursor_pointer'>
        <span style={style} className='vehicles-select-color' />
        {data.label}
      </div>
    );
  }
}

const dot = (color = '#ccc') => ({
  alignItems: 'center',
  display: 'flex',
  ':before': {
    backgroundColor: color,
    borderRadius: 10,
    content: '" "',
    display: 'block',
    marginRight: 8,
    height: 10,
    width: 10,
  },
});

const groupStyles = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
};

const groupBadgeStyles = {
  backgroundColor: '#EBECF0',
  borderRadius: '2em',
  color: '#172B4D',
  display: 'inline-block',
  fontSize: 12,
  fontWeight: 'normal',
  lineHeight: '1',
  minWidth: 1,
  padding: '0.16666666666667em 0.5em',
  textAlign: 'center',
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
      year: '',
      make: '',
      modal: '',
      typeSelected: '',
      colorSelected: '',
      miles: '',
      licensePlate: '',
      unit: '',
      vin: '',
      subModal: '',
      engineSize: '',
      productionDate: '',
      transmissionSelected: 'automatic',
      drivetrainSelected: '2x4',
      notes: '',
      errors: {},
      isLoading: false
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.vehicleModalOpen !== this.props.vehicleModalOpen) {
      this.removeAllState();
    }
  }

  createVehicleFun = async() => {
    let yeardata = this.state.year === '' ? '' : this.state.year;
    let data = {
      year: yeardata,
      make: this.state.make,
      modal: this.state.modal,
      type: this.state.typeSelected,
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
      notes: this.state.year,
    };

    let validationData = {
      year: this.state.year,
      make: this.state.make,
      modal: this.state.modal,
      type: this.state.typeSelected,
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
      notes: this.state.year,
    };

    if (this.state.miles !== '') {
      validationData.miles = this.state.miles;
    }

    const { isValid, errors } = Validator(
      validationData,
      VehicleValidations,
      VehicleValidationMessage
    );
    try {
      if (!isValid) {
        this.setState({
          errors: errors,
          isLoading: false,
        }, () => {
          const yearValidation = this.yearValidation(this.state.year)
          if (!yearValidation) {
            return
          }});
        
        return;
      }

      this.props.submitCreateVehicleFun(data);
    } catch (error) {
      console.log('====================================');
      console.log(error);
      console.log('====================================');
    }
  };

  _onInputChange = e => {
    const { target } = e;
    const { name, value } = target;
    if ((name === 'year' || name === 'miles') && isNaN(value)) {
      return
    }
    this.setState({
      [name]: value,
    });
  };

  handleColor = selectedColor => {
    this.setState({ colorSelected: selectedColor });
  };

  handleType = selectedType => {
    this.setState({
      typeSelected: selectedType,
    });
  };

  handleExpandForm = () => {
    this.setState({
      expandForm: !this.state.expandForm,
    });
  };

  handleChange = selectedOption => {
    this.setState({ selectedOption });
  };

  handleSelectedChange = selectedOption => {
    const { target } = selectedOption;
    const { name, value } = target;
    this.setState({
      [name]: value,
    });
  };

  async removeAllState() {
    this.setState({
      expandForm: false,
      colorOptions: ColorOptions,
      selectedOption: null,
      year: '',
      make: '',
      modal: '',
      typeSelected: '',
      colorSelected: '',
      miles: '',
      licensePlate: '',
      unit: '',
      vin: '',
      subModal: '',
      engineSize: '',
      productionDate: '',
      transmissionSelected: 'automatic',
      drivetrainSelected: '2x4',
      notes: '',
      errors: {},
    });
  }

  yearValidation = async (year) => {
    const text = /^[0-9]+$/;
    let errors = { ...this.state.errors };

    if (year) {
      if (year.length === 4) {
        if (year.length !== 0) {
          if (year !== '' && !text.test(parseInt(year))) {
            errors['year'] = 'Please Enter Numeric Values Only';
            this.setState({ errors });
            return false;
          }

          if (year.length !== 4) {
            errors['year'] = 'Year is not proper. Please check';
            this.setState({ errors });
            return false;
          }

          const current_year = new Date().getFullYear();
          if (year < (current_year-101) || year >= current_year) {
            errors[
              "year"
            ] = `Year should be in range ${current_year-101} to ${new Date().getFullYear() -
              1}`;
            this.setState({ errors });
            return false;
          }
          errors['year'] = '';
          this.setState({ errors });
          return true;
        } else {
          errors['year'] = 'Please enter year.';
          this.setState({ errors });
        }
      } else {
        errors['year'] = 'Year is not proper. Please check';
        this.setState({ errors });
      }

    } else {
      errors['year'] = 'Please enter year.';
      this.setState({ errors });
    }
  };

  render() {
    const {
      selectedOption,
      year,
      make,
      modal,
      type,
      errors,
      miles,
      color,
      licensePlate,
      unit,
      vin,
      subModal,
      engineSize,
      productionDate,
      transmission,
      drivetrain,
      notes,
    } = this.state;
    const { vehicleModalOpen, handleVehicleModal, createVehicle } = this.props;
    const {
      expandForm,
      transmissionSelected,
      drivetrainSelected,
      typeSelected,
      colorSelected,
    } = this.state;
    return (
      <>
        <Modal
          isOpen={vehicleModalOpen}
          toggle={handleVehicleModal}
          className='customer-modal custom-form-modal custom-modal-lg'
        >
          <ModalHeader toggle={handleVehicleModal}>
            Create New Vehicle
          </ModalHeader>
          <ModalBody>
            <Row className='justify-content-center'>
              <Col md='6'>
                <FormGroup>
                  <Label htmlFor='name' className='customer-modal-text-style'>
                    Year
                  </Label>
                  <div className={'input-block'}>
                    <Input
                      type='text'
                      placeholder='20XX'
                      id='year'
                      name='year'
                      minLength='4'
                      maxLength='4'
                      /* onBlur={this.yearValidation}
                      onKeyPress={this.yearValidation} */
                      onChange={this._onInputChange}
                      value={year}
                    />
                    {(!year && errors.year) || errors.hasOwnProperty('year') ? (
                      <p className='text-danger'>{errors.year}</p>
                    ) : null}
                  </div>
                </FormGroup>
              </Col>
              <Col md='6'>
                <FormGroup>
                  <Label htmlFor='name' className='customer-modal-text-style'>
                    Make
                  </Label>
                  <div className={'input-block'}>
                    <Input
                      type='text'
                      placeholder='Honda'
                      name='make'
                      onChange={this._onInputChange}
                    />
                    {!make && errors.make ? (
                      <p className='text-danger'>{errors.make}</p>
                    ) : null}
                  </div>
                </FormGroup>
              </Col>
            </Row>
            <Row className='justify-content-center'>
              <Col md='6'>
                <FormGroup>
                  <Label htmlFor='name' className='customer-modal-text-style'>
                    Modal
                  </Label>
                  <div className={'input-block'}>
                    <Input
                      type='text'
                      className='customer-modal-text-style'
                      id='type'
                      placeholder='Accord'
                      name='modal'
                      onChange={this._onInputChange}
                    />
                    {!modal && errors.modal ? (
                      <p className='text-danger'>{errors.modal}</p>
                    ) : null}
                  </div>
                  {/* <div className="error-tool-tip">this field is </div> */}
                </FormGroup>
              </Col>
              <Col md='6'>
                <FormGroup>
                  <Label htmlFor='name' className='customer-modal-text-style'>
                    Type
                  </Label>
                  <div className={'input-block'}>
                    <Select
                      defaultValue={typeSelected}
                      options={groupedOptions}
                      formatGroupLabel={formatGroupLabel}
                      className='w-100 form-select'
                      onChange={this.handleType}
                    />
                    {!type && errors.type ? (
                      <p className='text-danger'>{errors.type}</p>
                    ) : null}
                  </div>
                </FormGroup>
              </Col>
            </Row>
            <Row className='justify-content-center'>
              <Col md='6'>
                <FormGroup>
                  <Label htmlFor='name' className='customer-modal-text-style'>
                    Miles (optional)
                  </Label>
                  <div className={'input-block'}>
                    <Input
                      type='text'
                      placeholder='100,00'
                      name='miles'
                      value={miles}
                      onChange={this._onInputChange}
                    />
                    {!miles && errors.miles ? (
                      <p className='text-danger'>{errors.miles}</p>
                    ) : null}
                  </div>
                </FormGroup>
              </Col>
              <Col md='6'>
                <FormGroup>
                  <Label htmlFor='name' className='customer-modal-text-style'>
                    Color (optional)
                  </Label>
                  <div className={'input-block'}>
                    <Select
                      value={colorSelected}
                      onChange={this.handleColor}
                      options={this.state.colorOptions}
                      className='w-100 form-select'
                      placeholder={'Pick a color'}
                      isClearable={true}
                      components={{ Option: CustomOption }}
                    />
                  </div>
                </FormGroup>
              </Col>
            </Row>
            <Row className='justify-content-center'>
              <Col md='6'>
                <FormGroup>
                  <Label htmlFor='name' className='customer-modal-text-style'>
                    Licence Plate (optional)
                  </Label>
                  <Input
                    type='text'
                    placeholder='AUM 100'
                    name='licensePlate'
                    onChange={this._onInputChange}
                  />
                </FormGroup>
              </Col>
              <Col md='6'>
                <FormGroup>
                  <Label htmlFor='name' className='customer-modal-text-style'>
                    Unit #(optional)
                  </Label>
                  <Input
                    type='text'
                    placeholder='BA1234'
                    name='unit'
                    onChange={this._onInputChange}
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row className=''>
              <Col md='6'>
                <FormGroup>
                  <Label htmlFor='name' className='customer-modal-text-style'>
                    VIN(optional)
                  </Label>
                  <Input
                    type='text'
                    placeholder='19UAYF3158T0000'
                    name='vin'
                    onChange={this._onInputChange}
                  />
                </FormGroup>
              </Col>
              {expandForm ? (
                <>
                  <Col md='6'>
                    <FormGroup>
                      <Label
                        htmlFor='name'
                        className='customer-modal-text-style'
                      >
                        Sub Model
                      </Label>
                      <div className={'input-block'}>
                        <Input
                          type='text'
                          placeholder='Sub Model'
                          name='subModal'
                          onChange={this._onInputChange}
                        />
                        {!subModal && errors.subModal ? (
                          <p className='text-danger'>{errors.subModal}</p>
                        ) : null}
                      </div>
                    </FormGroup>
                  </Col>
                </>
              ) : (
                  ''
                )}
            </Row>
            <Row className='justify-content-center'>
              <Col md='12 text-center'>
                {!expandForm ? (
                  <span
                    onClick={this.handleExpandForm}
                    className='customer-anchor-text customer-click-btn'
                  >
                    Show More
                  </span>
                ) : (
                    ''
                  )}
              </Col>
            </Row>
            {expandForm ? (
              <>
                <Row className='justify-content-center'>
                  <Col md='6'>
                    <FormGroup>
                      <Label
                        htmlFor='name'
                        className='customer-modal-text-style'
                      >
                        Engine Size
                      </Label>
                      <div className={'input-block'}>
                        <Input
                          type='text'
                          name='engineSize'
                          onChange={this._onInputChange}
                          placeholder='Engine Size'
                          id='rate'
                        />
                        {!engineSize && errors.engineSize ? (
                          <p className='text-danger'>{errors.engineSize}</p>
                        ) : null}
                      </div>
                    </FormGroup>
                  </Col>
                  <Col md='6'>
                    <FormGroup>
                      <Label
                        htmlFor='name'
                        className='customer-modal-text-style'
                      >
                        Production Date
                      </Label>
                      <div className={'input-block'}>
                        <MaskedInput
                          name='productionDate'
                          mask='11/1111'
                          placeholder='MM/YYYY'
                          onChange={this._onInputChange}
                        />
                        {!productionDate && errors.productionDate ? (
                          <p className='text-danger'>{errors.productionDate}</p>
                        ) : null}
                      </div>
                    </FormGroup>
                  </Col>
                </Row>
                <Row className='justify-content-center'>
                  <Col md='6'>
                    <FormGroup>
                      <Label
                        htmlFor='name'
                        className='customer-modal-text-style'
                      >
                        Transmission
                      </Label>
                      <div className={'input-block'}>
                        <Input
                          type='select'
                          className=''
                          onChange={this.handleSelectedChange}
                          name='transmission'
                          id='matrixId'
                        >
                          <option value={''}>Select</option>
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
                          <p className='text-danger'>{errors.transmission}</p>
                        ) : null}
                      </div>
                    </FormGroup>
                  </Col>
                  <Col md='6'>
                    <FormGroup>
                      <Label
                        htmlFor='name'
                        className='customer-modal-text-style'
                      >
                        Drivetrain
                      </Label>
                      <div className={'input-block'}>

                        <Input
                          type='select'
                          className=''
                          onChange={this.handleSelectedChange}
                          name='drivetrain'
                          id='matrixId'
                        >
                          <option value={''}>Select</option>
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
                          <p className='text-danger'>{errors.drivetrain}</p>
                        ) : null}
                      </div>
                    </FormGroup>
                  </Col>
                </Row>
                <Row className='justify-content-center'>
                  <Col md='12'>
                    <FormGroup>
                      <Label
                        htmlFor='name'
                        className='customer-modal-text-style'
                      >
                        Notes
                      </Label>
                      <div className={'input-block'}>
                        <Input
                          name='notes'
                          type='textarea'
                          placeholder='Enter a note...'
                          id='name'
                        />
                        {!notes && errors.notes ? (
                          <p className='text-danger'>{errors.notes}</p>
                        ) : null}
                      </div>
                    </FormGroup>
                  </Col>
                </Row>
                <Row className='justify-content-center'>
                  <Col md='12 text-center'>
                    {expandForm ? (
                      <span
                        onClick={this.handleExpandForm}
                        className='customer-anchor-text customer-click-btn'
                      >
                        Show Less
                      </span>
                    ) : (
                        ''
                      )}
                  </Col>
                </Row>
              </>
            ) : (
                ''
              )}
          </ModalBody>
          <ModalFooter>
            <Button color='primary' onClick={this.createVehicleFun}>
              Save vehicle
            </Button>{' '}
            <Button color='secondary' onClick={handleVehicleModal}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </>
    );
  }
}
