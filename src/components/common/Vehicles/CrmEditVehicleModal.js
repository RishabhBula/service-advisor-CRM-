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
import chroma from 'chroma-js';
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

export class CrmEditVehicleModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expandForm: false,
      colorOptions: ColorOptions,
      selectedOption: null,
      year: '',
      make: '',
      modal: '',
      typeSelected: null,
      colorSelected: null,
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
      errors: {}
    };
  }

  componentDidUpdate(prevProps) {
    const { vehicleData } = this.props;
    if (
      prevProps.vehicleEditModalOpen !== this.props.vehicleEditModalOpen &&
      !this.props.vehicleEditModalOpen
    ) {
      this.setState({
        year: '',
        make: '',
        modal: '',
        typeSelected: null,
        colorSelected: null,
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
        errors: {}
      });
    }
    if (prevProps.vehicleData._id !== vehicleData._id) {
      this.setState({
        year: this.props.vehicleData.year,
        make: this.props.vehicleData.make,
        modal: this.props.vehicleData.modal,
        typeSelected: this.props.vehicleData.type,
        colorSelected: this.props.vehicleData.color,
        miles: this.props.vehicleData.miles,
        licensePlate: this.props.vehicleData.licensePlate,
        unit: this.props.vehicleData.unit,
        vin: this.props.vehicleData.vin,
        subModal: this.props.vehicleData.subModal,
        engineSize: this.props.vehicleData.engineSize,
        productionDate: this.props.vehicleData.productionDate,
        transmissionSelected: this.props.vehicleData.transmission,
        drivetrainSelected: this.props.vehicleData.drivetrain,
        notes: this.props.vehicleData.notes,
      });
    }
  }

  _onInputChange = e => {
    const { target } = e;
    const { name, value } = target;
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

  yearValidation = async ev => {
    const { target } = ev;
    const { value } = target;
    const year = value;
    const text = /^[0-9]+$/;
    let errors = { ...this.state.errors };

    if (year) {
      if (ev.type === 'blur') {
        if (year.length === 4 && ev.keyCode != 8 && ev.keyCode != 46) {
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
            if (year < 1920 || year >= current_year) {
              errors[
                'year'
              ] = `Year should be in range ${new Date().getFullYear() -
              101} to ${new Date().getFullYear() - 1}`;
              this.setState({ errors });
              return false;
            }
            errors['year'] = '';
            this.setState({ errors });
            return true;
          }
        } else {
          errors['year'] = 'Year is not proper. Please check';
          this.setState({ errors });
        }
      }
    } else {
      errors['year'] = 'Please enter year.';
      this.setState({ errors });
    }
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

  updateVehicleFun = () => {
    let data = {
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
    this.props.submitUpdateVehicleFun(data);
  };

  render() {
    const { selectedOption } = this.state;
    const {
      vehicleEditModalOpen,
      handleEditVehicleModal,
      createVehicle,
    } = this.props;
    const {
      expandForm,
      transmissionSelected,
      drivetrainSelected,
      typeSelected,
      colorSelected,
      year,
      make,
      modal,
      errors,
      miles,
      licensePlate,
      unit,
      vin,
      subModal,
      engineSize,
      productionDate,
      notes,
    } = this.state;
    return (
      <>
        <Modal
          isOpen={vehicleEditModalOpen}
          toggle={handleEditVehicleModal}
          className='customer-modal custom-form-modal custom-modal-lg'
        >
          <ModalHeader toggle={handleEditVehicleModal}>
            Update Vehicle
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
                      onBlur={this.yearValidation} 
                      onKeyPress={this.yearValidation}
                      onChange={this._onInputChange}
                      value={this.state.year}
                    />
                    {errors.hasOwnProperty('year') ? (
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
                  <Input
                    type='text'
                    placeholder='Honda'
                    name='make'
                    onChange={this._onInputChange}
                    value={this.state.make}
                  />
                  {!make && errors.make ? (
                    <p className='text-danger'>{errors.make}</p>
                  ) : null}
                </FormGroup>
              </Col>
            </Row>
            <Row className='justify-content-center'>
              <Col md='6'>
                <FormGroup>
                  <Label htmlFor='name' className='customer-modal-text-style'>
                    Modal
                  </Label>
                  <Input
                    type='text'
                    className='customer-modal-text-style'
                    id='type'
                    placeholder='Accord'
                    name='modal'
                    onChange={this._onInputChange}
                    value={this.state.modal}
                  />
                  {!modal && errors.modal ? (
                    <p className='text-danger'>{errors.modal}</p>
                  ) : null}
                  {/* <div className="error-tool-tip">this field is </div> */}
                </FormGroup>
              </Col>
              <Col md='6'>
                <FormGroup>
                  <Label htmlFor='name' className='customer-modal-text-style'>
                    Type
                  </Label>
                  <Select
                    defaultValue={typeSelected}
                    options={groupedOptions}
                    formatGroupLabel={formatGroupLabel}
                    className='w-100 form-select'
                    onChange={this.handleType}
                    value={typeSelected}
                  />
                  {!typeSelected && errors.type ? (
                    <p className='text-danger'>{errors.type}</p>
                  ) : null}
                </FormGroup>
              </Col>
            </Row>
            <Row className='justify-content-center'>
              <Col md='6'>
                <FormGroup>
                  <Label htmlFor='name' className='customer-modal-text-style'>
                    Miles (optional)
                  </Label>
                  <Input
                    type='text'
                    placeholder='100,00'
                    name='miles'
                    onChange={this._onInputChange}
                    value={this.state.miles}
                  />
                  {!miles && errors.miles ? (
                    <p className='text-danger'>{errors.miles}</p>
                  ) : null}
                </FormGroup>
              </Col>
              <Col md='6'>
                <FormGroup>
                  <Label htmlFor='name' className='customer-modal-text-style'>
                    Color (optional)
                  </Label>
                  <Select
                    value={colorSelected}
                    onChange={this.handleColor}
                    options={this.state.colorOptions}
                    className='w-100 form-select'
                    placeholder={'Pick a color'}
                    isClearable={true}
                    components={{ Option: CustomOption }}
                  />
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
                    value={this.state.licensePlate}
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
                    value={this.state.unit}
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
                    value={this.state.vin}
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
                      <Input
                        type='text'
                        placeholder='Sub Model'
                        name='subModal'
                        onChange={this._onInputChange}
                        value={this.state.subModal}
                      />
                      {!subModal && errors.subModal ? (
                        <p className='text-danger'>{errors.subModal}</p>
                      ) : null}
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
                      <Input
                        type='text'
                        name='engineSize'
                        onChange={this._onInputChange}
                        placeholder='Engine Size'
                        id='rate'
                        value={this.state.engineSize}
                      />
                      {!engineSize && errors.engineSize ? (
                        <p className='text-danger'>{errors.engineSize}</p>
                      ) : null}
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
                      <MaskedInput
                        name='productionDate'
                        mask='11/1111'
                        placeholder='MM/YYYY'
                        onChange={this._onInputChange}
                        value={this.state.productionDate}
                      />
                      {!productionDate && errors.productionDate ? (
                        <p className='text-danger'>{errors.productionDate}</p>
                      ) : null}
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
                      {!transmissionSelected && errors.transmission ? (
                        <p className='text-danger'>{errors.transmission}</p>
                      ) : null}
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
                      {!drivetrainSelected && errors.drivetrain ? (
                        <p className='text-danger'>{errors.drivetrain}</p>
                      ) : null}
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
                      <Input
                        name='notes'
                        type='textarea'
                        placeholder='Enter a note...'
                        id='name'
                        value={this.state.notes}
                      />
                      {!notes && errors.notes ? (
                        <p className='text-danger'>{errors.notes}</p>
                      ) : null}
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
            <Button color='primary' onClick={this.updateVehicleFun}>
              Update vehicle
            </Button>{' '}
            <Button color='secondary' onClick={handleEditVehicleModal}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </>
    );
  }
}
