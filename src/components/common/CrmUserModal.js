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
import { AppSwitch } from '@coreui/react'

export class CrmUserModal extends Component {
   constructor(props) {
      super(props);
      this.state = {
         switchValue: true,
      };
   }
   handleClick = (e) => {
      this.setState({
         switchValue: !this.state.switchValue
      });
   }
   render() {
      const { userModalOpen, handleUserModal } = this.props;
      const { switchValue } = this.state;
      console.log(switchValue);
      return (
         <>
            <Modal
               isOpen={userModalOpen}
               toggle={handleUserModal}
               className="customer-modal"
            >
               <ModalHeader toggle={toggleLarge}>Create New User</ModalHeader>
               <ModalBody>
                  <div className="">
                     <Row className="justify-content-center">
                        <Col md="6">
                           <FormGroup>
                              <Label htmlFor="name" className="customer-modal-text-style">First Name</Label>
                              <Input type="text" placeholder="John" id="name" required />
                           </FormGroup>
                        </Col>
                        <Col md="6">
                           <FormGroup>
                              <Label htmlFor="name" className="customer-modal-text-style">Last Name</Label>
                              <Input type="text" placeholder="Doe" id="name" required />
                           </FormGroup>
                        </Col>
                     </Row>
                  </div>

                  <div className="">
                     <Row className="justify-content-center">
                        <Col md="6">
                           <FormGroup>
                              <Label htmlFor="name" className="customer-modal-text-style">Email</Label>
                              <Input type="text" placeholder="john.doe@example.com" id="email" required />
                           </FormGroup>
                        </Col>
                        <Col md="6">
                           <FormGroup>
                              <Label htmlFor="name" className="customer-modal-text-style">Phone (optional)</Label>
                              <Input type="text" placeholder="(555) 055-0555" id="phone" required />
                           </FormGroup>
                        </Col>
                     </Row>
                  </div>
                  <div className="">
                     <Row className="justify-content-center">
                        <Col md="12">
                           <FormGroup>
                              <Label htmlFor="name" className="customer-modal-text-style">Type</Label>
                              <Input type="select" className="customer-modal-text-style" id="type" required>
                                 <option value="admin">Admin</option>
                              </Input>
                           </FormGroup>
                        </Col>
                     </Row>
                  </div>
                  <div className="">
                     <Row className="justify-content-center">
                        <Col md="12">
                           <FormGroup>
                              <Label htmlFor="name" className="customer-modal-text-style">Rate (optional)</Label>
                              <Input type="text" id="rate" required />
                           </FormGroup>
                        </Col>
                     </Row>
                  </div>
                  <div className="">
                     <Row className="justify-content-center pb-2">
                        <Col md="2">
                           <AppSwitch className={'mx-1'} value={switchValue} onClick={this.handleClick} variant={'3d'} color={'primary'} checked size={''} />
                        </Col>
                        <Col md="10">
                           <p className="customer-modal-text-style">Is this customer tax exempt?</p>
                        </Col>
                     </Row>
                  </div>
               </ModalBody>
               <ModalFooter>
                  <Button color="primary" onClick={toggleLarge}>
                     Do Something
            </Button>{" "}
                  <Button color="secondary" onClick={toggleLarge}>
                     Cancel
            </Button>
               </ModalFooter>
            </Modal>
         </>
      );
   }
}