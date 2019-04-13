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
import { ColorOptions, GroupedCarsOptions, carsOptions, groupedOptionsA } from "../../../config/Color";
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
         switchValue: true,
         expandForm: false,
         options: ColorOptions,
         selectedOption: null,
      };
   }
   handleClick = e => {
      this.setState({
         switchValue: !this.state.switchValue
      });
   };
   handleExpandForm = () => {
      this.setState({
         expandForm: !this.state.expandForm
      })
   }
   handleChange = (selectedOption) => {
    this.setState({ selectedOption });
  }
   render() {
      const { selectedOption } = this.state;
      const {
         vehicleModalOpen,
         handleVehicleModal,
         createVehicle } = this.props;
      const { expandForm } = this.state
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
                              required
                           />
                           {/* <p className="text-danger">this field is required</p> */}
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
                              id="make"
                              required
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
                              required
                           />
                             {/* <div className="error-tool-tip">this field is required</div> */}
                        </FormGroup>
                     </Col>
                     <Col md="6">
                        <FormGroup>
                           <Label htmlFor="name" className="customer-modal-text-style">
                              Type
                  			</Label>
                          <Select
                              defaultValue={carsOptions[1]}
                              options={groupedOptionsA}
                              formatGroupLabel={formatGroupLabel}
                              className="w-100 form-select"
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
                           <Input type="text" placeholder="100,00" id="rate" required />
                        </FormGroup>
                     </Col>
                     <Col md="6">
                        <FormGroup>
                           <Label htmlFor="name" className="customer-modal-text-style">
                              Color (optional)
                  			</Label>
                           <Select
                              value={selectedOption}
                              onChange={this.handleChange}
                              options={this.state.options}
                              className="w-100 form-select"
                              placeholder={"Pick a color"}
                              isClearable={true}
                              components={{ Option: CustomOption }}
                           />
                           {/* 
                           <Input type="select" placeholder="100,00" id="rate">
                              <option value="">Pick a color</option>
                           </Input> */}
                        </FormGroup>
                     </Col>
                  </Row>
                  <Row className="justify-content-center">
                     <Col md="6">
                        <FormGroup>
                           <Label htmlFor="name" className="customer-modal-text-style">
                              Licence Plate (optional)
                  			</Label>
                           <Input type="text" placeholder="AUM 100" id="rate" required />
                        </FormGroup>
                     </Col>
                     <Col md="6">
                        <FormGroup>
                           <Label htmlFor="name" className="customer-modal-text-style">
                              Unit #(optional)
                  			</Label>
                           <Input type="text" placeholder="BA1234" id="rate" />
                        </FormGroup>
                     </Col>
                  </Row>
                  <Row className="">
                     <Col md="6">
                        <FormGroup>
                           <Label htmlFor="name" className="customer-modal-text-style">
                              VIN(optional)
                  			</Label>
                           <Input type="text" placeholder="19UAYF3158T0000" id="rate" required />
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
                                    <Input type="text" placeholder="Sub Model" id="rate" required />
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
                                       Sub Model
                  						</Label>
                                    <Input type="text" placeholder="Sub Model" id="rate" required />
                                 </FormGroup>
                              </Col>
                              <Col md="6">
                                 <FormGroup>
                                    <Label htmlFor="name" className="customer-modal-text-style">
                                       Engine Size
												</Label>
                                    <Input type="text" placeholder="Engine Size" id="rate" />
                                 </FormGroup>
                              </Col>
                           </Row>
                           <Row className="justify-content-center">
                              <Col md="6">
                                 <FormGroup>
                                    <Label htmlFor="name" className="customer-modal-text-style">
                                       Production Date
                  						</Label>
                                    <Input type="text" placeholder="MM/YYYY" id="rate" required />
                                 </FormGroup>
                              </Col>
                              <Col md="6">
                                 <FormGroup>
                                    <Label htmlFor="name" className="customer-modal-text-style">
                                       Transmission
                  						</Label>
                                    <Input type="select" id="rate">
                                       <option value="">None</option>
                                    </Input>
                                 </FormGroup>
                              </Col>
                           </Row>
                           <Row className="">
                              <Col md="6">
                                 <FormGroup>
                                    <Label htmlFor="name" className="customer-modal-text-style">
                                       Drivetrain
                  						</Label>
                                    <Input type="select" placeholder="AUM 100" id="rate">
                                       <option value="">None	</option>
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
                           <Input type="textarea" placeholder="Enter a note..." id="name" required />
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
                  <Button color="primary" onClick={createVehicle}>
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
