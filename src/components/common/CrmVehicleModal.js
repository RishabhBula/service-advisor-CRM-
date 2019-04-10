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

export class CrmVehicleModal extends Component {
   constructor(props) {
      super(props);
      this.state = {
         switchValue: true,
         expandForm: false
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
   render() {
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
               <ModalBody >
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
                     <Col md="6">
                        <FormGroup>
                           <Label htmlFor="name" className="customer-modal-text-style">
                              Year
                  			</Label>
                           <Input
                              type="text"
                              placeholder="20XX"
                              id="year"
                              required
                           />
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
                           >
                           </Input>
                        </FormGroup>
                     </Col>
                     <Col md="6">
                        <FormGroup>
                           <Label htmlFor="name" className="customer-modal-text-style">
                              Type
                  			</Label>
                           <Input
                              type="select"
                              className="customer-modal-text-style"
                              id="type"
                              required
                           >
                              <option value="">Select a type</option>
                           </Input>
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
                           <Input type="select" placeholder="100,00" id="rate">
                              <option value="">Pick a color</option>
                           </Input>
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
