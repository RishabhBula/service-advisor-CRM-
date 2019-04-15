import React, { Component } from "react";
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
   Input
} from "reactstrap";
import Select, { components } from 'react-select';
import chroma from 'chroma-js';
import { ColorOptions, GroupedCarsOptions, carsOptions, groupedOptions } from "../../../config/Color";
import { Transmission, Drivetrain } from "../../../config/Constants";
import MaskedInput from "react-maskedinput";
class CustomOption extends Component {   
  render() {
    const { data, innerRef, innerProps } = this.props;
    let style ={
      backgroundColor: data.value,
    }
   return (
        <div {...innerProps}   className="cursor_pointer">
        <span style={style} className="vehicles-select-color"></span>        
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

const formatGroupLabel = (data, innerRef, innerProps ) => (
  <div   {...innerProps} ref={innerRef} style={groupStyles}>
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
         typeSelected: null,
         colorSelected: null,
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
      };
   }

   createVehicleFun = () => {
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
      }
      this.props.submitCreateVehicleFun(data);
   }

   _onInputChange = e => {
      const { target } = e;
      const { name, value } = target;
         this.setState({
         [name]: value
      });
   }

   handleColor = selectedColor => {
      this.setState({colorSelected: selectedColor})
   }

   handleType = selectedType => {
      this.setState({
         typeSelected: selectedType
      })
   }

   handleExpandForm = () => {
      this.setState({
         expandForm: !this.state.expandForm
      })
   }
   handleChange = (selectedOption) => {
    this.setState({ selectedOption });
  }
  handleSelectedChange = (selectedOption) => {
      const { target } = selectedOption;
      const { name, value } = target;
         this.setState({
         [name]: value
      });
  }
   render() {
      const { selectedOption } = this.state;
      const {
         vehicleModalOpen,
         handleVehicleModal,
         createVehicle } = this.props;
      const { expandForm, 
            transmissionSelected,
            drivetrainSelected,
            typeSelected,
            colorSelected
         } = this.state
      return (
         <>
            <Modal
               isOpen={vehicleModalOpen}
               toggle={handleVehicleModal}
               className="customer-modal custom-form-modal custom-modal-lg"

            >
               <ModalHeader toggle={handleVehicleModal}>Create New Vehicle</ModalHeader>
               <ModalBody>                 
                  <Row className="justify-content-center">
                     <Col md="6">
                        <FormGroup>
                           <Label htmlFor="name" className="customer-modal-text-style">
                              Year
                  			</Label>
                           <div className={"input-block"}>
                           <Input
                              type="text"
                              placeholder="20XX"
                              id="year"
                              name="year" 
                              onChange={this._onInputChange} 
                           />
                           {/* <p className="text-danger">this field is </p> */}
                           </div>
                        </FormGroup>
                     </Col>
                     <Col md="6">
                        <FormGroup>
                           <Label htmlFor="name" className="customer-modal-text-style">
                              Make
                  			</Label>
                           <Input
                              type="text"
                              placeholder="Honda"                              
                              name="make" 
                              onChange={this._onInputChange} 
                           />
                           
                        </FormGroup>
                     </Col>
                  </Row>
                  <Row className="justify-content-center">
                     <Col md="6">
                        <FormGroup>
                           <Label htmlFor="name" className="customer-modal-text-style">
                              Modal
                  			</Label>
                           <Input
                              type="text"
                              className="customer-modal-text-style"
                              id="type"
                              placeholder="Accord"
                              name="modal" 
                              onChange={this._onInputChange}                              
                           />
                             {/* <div className="error-tool-tip">this field is </div> */}
                        </FormGroup>
                     </Col>
                     <Col md="6">
                        <FormGroup>
                           <Label htmlFor="name" className="customer-modal-text-style">
                              Type
                  			</Label>
                          <Select
                              defaultValue={typeSelected}
                              options={groupedOptions}
                              formatGroupLabel={formatGroupLabel}
                              className="w-100 form-select"
                              onChange={this.handleType}
                           />
                        </FormGroup>
                     </Col>
                  </Row>
                  <Row className="justify-content-center">
                     <Col md="6">
                        <FormGroup>
                           <Label htmlFor="name" className="customer-modal-text-style">
                              Miles (optional)
                  			</Label>
                           <Input type="text" placeholder="100,00" name="miles" onChange={this._onInputChange}  />
                        </FormGroup>
                     </Col>
                     <Col md="6">
                        <FormGroup>
                           <Label htmlFor="name" className="customer-modal-text-style">
                              Color (optional)
                  			</Label>
                           <Select
                              value={colorSelected}
                              onChange={this.handleColor}
                              options={this.state.colorOptions}
                              className="w-100 form-select"
                              placeholder={"Pick a color"}
                              isClearable={true}
                              components={{ Option: CustomOption }}
                           />
                        </FormGroup>
                     </Col>
                  </Row>
                  <Row className="justify-content-center">
                     <Col md="6">
                        <FormGroup>
                           <Label htmlFor="name" className="customer-modal-text-style">
                              Licence Plate (optional)
                  			</Label>
                           <Input type="text" placeholder="AUM 100" name="licensePlate" onChange={this._onInputChange}  />
                        </FormGroup>
                     </Col>
                     <Col md="6">
                        <FormGroup>
                           <Label htmlFor="name" className="customer-modal-text-style">
                              Unit #(optional)
                  			</Label>
                           <Input type="text" placeholder="BA1234"  name="unit" onChange={this._onInputChange}/>
                        </FormGroup>
                     </Col>
                  </Row>
                  <Row className="">
                     <Col md="6">
                        <FormGroup>
                           <Label htmlFor="name" className="customer-modal-text-style">
                              VIN(optional)
                  			</Label>
                           <Input type="text" placeholder="19UAYF3158T0000" name="vin" onChange={this._onInputChange}  />
                        </FormGroup>
                     </Col>
                    {
                        expandForm ?
                        <>                         
                           <Col md="6">
                              <FormGroup>
                                 <Label htmlFor="name" className="customer-modal-text-style">
                                    Sub Model
                                 </Label>
                                 <Input type="text" placeholder="Sub Model" name="subModal" onChange={this._onInputChange}/>
                              </FormGroup>
                           </Col>                           
                        </> : ""
                  }
                  </Row>
                  <Row className="justify-content-center">
                     <Col md="12 text-center">
                     {
                     !expandForm ?
                        <span
                           onClick={this.handleExpandForm}
                           className="customer-anchor-text customer-click-btn">Show More</span> :
                        ""
                     }
                     </Col>
                  </Row>
                  {
                     expandForm ?
                        <>
                           <Row className="justify-content-center">    
                              <Col md="6">
                                 <FormGroup>
                                    <Label htmlFor="name" className="customer-modal-text-style">
                                       Engine Size
												</Label>
                                    <Input type="text" name="engineSize" onChange={this._onInputChange} placeholder="Engine Size" id="rate" />
                                 </FormGroup>
                              </Col>
                              <Col md="6">
                                 <FormGroup>
                                    <Label htmlFor="name" className="customer-modal-text-style">
                                       Production Date
                  						</Label>
                                     <MaskedInput name="productionDate"  mask="11/1111"  placeholder="MM/YYYY" onChange={this._onInputChange}/>
                                 </FormGroup>
                              </Col>
                           </Row>
                           <Row className="justify-content-center">
                              <Col md="6">
                                 <FormGroup>
                                    <Label htmlFor="name" className="customer-modal-text-style">
                                       Transmission
                  						</Label>
                                    <Input
                                       type="select"
                                       className=""
                                       onChange={this.handleSelectedChange}
                                       name="transmission"
                                       id="matrixId"
                                       >
                                       <option value={""}>Select</option>
                                       {
                                          Transmission.length
                                          ? Transmission.map((item,index) => {
                                             return <option selected={item.key === transmissionSelected} value={item.key} key={index} >{item.text}</option>
                                          })
                                          : null
                                       }
                                    </Input>
                                 </FormGroup>
                              </Col>
                              <Col md="6">
                                 <FormGroup>
                                    <Label htmlFor="name" className="customer-modal-text-style">
                                       Drivetrain
                  						</Label>
                                     <Input
                                       type="select"
                                       className=""
                                       onChange={this.handleSelectedChange}
                                       name="drivetrain"
                                       id="matrixId"
                                       >
                                       <option value={""}>Select</option>
                                       {
                                          Drivetrain.length
                                          ? Drivetrain.map((item,index) => {
                                             return <option selected={item.key === drivetrainSelected} value={item.key} key={index} >{item.text}</option>
                                          })
                                          : null
                                       }
                                    </Input>
                                 </FormGroup>
                              </Col>
                           </Row>
                           <Row className="justify-content-center">
                              <Col md="12">
                                 <FormGroup>
                                    <Label htmlFor="name" className="customer-modal-text-style">
                                       Notes
                                    </Label>
                                    <Input name="notes" type="textarea" placeholder="Enter a note..." id="name" />
                                 </FormGroup>
                              </Col>
                           </Row>
                           <Row className="justify-content-center">
                              <Col md="12 text-center">
                              {
                                 expandForm ?
                                    <span
                                       onClick={this.handleExpandForm}
                                       className="customer-anchor-text customer-click-btn">Show Less</span> :
                                    ""
                              }
                              </Col>
                           </Row>                  
                  </> : ""
               }
               </ModalBody>
               <ModalFooter>
                  <Button color="primary" onClick={this.createVehicleFun}>
                     Save vehicle
                  </Button>{" "}
                  <Button color="secondary" onClick={handleVehicleModal}>
                     Cancel
                  </Button>
               </ModalFooter>
            </Modal>
         </>
      );
   }
}
