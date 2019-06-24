import React, { Component } from "react";
import {
   Button,
   Modal,
   ModalBody,
   ModalFooter,
   ModalHeader,
   Col,
   FormGroup,
   Input,
   Label,
   Row
} from "reactstrap";
import { Async } from "react-select";
import 'react-dates/initialize';
import { SingleDatePicker } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';
import moment from 'moment';

export class CrmTimeClockModal extends Component {
   constructor(props) {
      super(props);
      this.state = {
         date: new Date()
      };
   }
   render() {
      const { openTimeClockModal, handleTimeClockModal } = this.props
      return (
         <>
            <Modal
               isOpen={openTimeClockModal}
               toggle={handleTimeClockModal}
               className='customer-modal custom-form-modal modal-lg'
               backdrop={"static"}
            >
               <ModalHeader toggle={handleTimeClockModal}>Add Time Manually</ModalHeader>
               <ModalBody>
                  <Col md="12">
                     <FormGroup>
                        <Label htmlFor="name" className="customer-modal-text-style">
                           Technician <span className="asteric">*</span>
                        </Label>
                        <div className={"input-block"}>
                           <Async
                              placeholder={"Type to select technician from the list"}
                              className={"w-100 form-select"}
                              isClearable={true}
                              noOptionsMessage={() => "Type Technician name"}
                           />
                        </div>
                     </FormGroup>
                  </Col>
                  <Col md="12">
                     <Row>
                        <Col md="4">
                           <FormGroup>
                              <Label htmlFor="name" className="customer-modal-text-style">
                                 Time In <span className="asteric">*</span>
                              </Label>
                              <div className={"input-block"}>
                                 <Input
                                    type="text"
                                    name="hourRate"
                                    placeholder="20"
                                    id="make"
                                    maxLength='3'
                                 />
                              </div>
                           </FormGroup>
                        </Col>
                        <Col md="4">
                           <FormGroup>
                              <Label htmlFor="name" className="customer-modal-text-style">
                                 Time Out <span className="asteric">*</span>
                              </Label>
                              <div className={"input-block"}>
                                 <Input
                                    type="text"
                                    name="hourRate"
                                    placeholder="20"
                                    id="make"
                                    maxLength='3'
                                 />
                              </div>
                           </FormGroup>
                        </Col>
                        <Col md="4">
                           <FormGroup>
                              <Label htmlFor="name" className="customer-modal-text-style">
                                 Duration <span className="asteric">*</span>
                              </Label>
                              <div className={"input-block"}>
                                 <Input
                                    type="text"
                                    name="hourRate"
                                    placeholder="20"
                                    id="make"
                                    maxLength='3'
                                 />
                              </div>
                           </FormGroup>
                        </Col>
                     </Row>
                  </Col>
                  <Col md="12">
                     <FormGroup>
                        <Label htmlFor="name" className="customer-modal-text-style">
                           Activity <span className="asteric">*</span>
                        </Label>
                        <div className={"input-block"}>
                           <Async
                              placeholder={"Type to select Activity from the list"}
                              className={"w-100 form-select"}
                              isClearable={true}
                              noOptionsMessage={() => "Type Activity name"}
                           />
                        </div>
                     </FormGroup>
                  </Col>
                  <Col md="12">
                     <FormGroup>
                        <Label htmlFor="name" className="customer-modal-text-style">
                           Date <span className="asteric">*</span>
                        </Label>
                        <div className={"input-block"}>
                           <SingleDatePicker
                              date={moment(this.state.date)} // momentPropTypes.momentObj or null
                              onDateChange={date => this.setState({ date })} // PropTypes.func.isRequired
                              id="Date" // PropTypes.string.isRequired,
                              focused={this.state.focused} // PropTypes.bool
                              onFocusChange={({ focused }) => this.setState({ focused })} // PropTypes.func.isRequired
                              className={"form-control"}
                           />
                        </div>
                     </FormGroup>
                  </Col>
                  <Col md="12">
                     <FormGroup>
                        <Label htmlFor="name" className="customer-modal-text-style">
                           Notes 
                        </Label>
                        <div className={"input-block"}>
                           <Input
                              type={"textarea"}
                              cols={"10"}
                              rows={"3"}
                           />
                        </div>
                     </FormGroup>
                  </Col>
               </ModalBody>
               <ModalFooter>
                  <Button color="primary" onClick={this.handleSubmit}>
                     Add Time Logs
                  </Button>{" "}
                  <Button color="secondary" onClick={handleTimeClockModal}>
                     Cancel
                  </Button>
               </ModalFooter>
            </Modal>
         </>
      );
   }
}
