import React, { Component } from 'react';
import * as classnames from "classnames";
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
import { PhoneOptions } from '../../config/Constants';
import MaskedInput from 'react-maskedinput';
import { logger } from '../../helpers/Logger';
import Validator from 'js-object-validation';
import { toast } from 'react-toastify';
import {
   CreateFleetValidations,
   CreateFleetValidMessaages,
} from '../../validations';
// import Cleave from 'cleave.js/react';

export class CrmFleetModal extends Component {
   constructor(props) {
      super(props);
      this.state = {
      };
   }


   handleAddTire = () => {

   };

   render() {
      const {
         tyreModalOpen,
         handleTierModal
      } = this.props;
      return (
         <>
            <Modal
               isOpen={tyreModalOpen}
               toggle={handleTierModal}
               backdrop={"static"}
               className='customer-modal custom-form-modal custom-modal-lg'
            >
               <ModalHeader toggle={handleTyreModal}>
                  Create New Tire
               </ModalHeader>
               <ModalBody>
                  <div className=''>
                     <Row className='justify-content-center'>
                        <Col md='6'>
                           <FormGroup>
                              <Label htmlFor='name' className='customer-modal-text-style'>
                                 Company Name <span className={"asteric"}>*</span>
                              </Label>
                           </FormGroup>
                        </Col>
                     </Row>
                  </div>
               </ModalBody>
               <ModalFooter>
                  <div class="required-fields">*Fields are Required.</div>
                  <Button
                     color='primary'
                     onClick={() =>
                        this.handleAddTire()
                     }
                  >
                     Add New Tier
                  </Button>{' '}
                  <Button color='secondary' onClick={handleTierModal}>
                     Cancel
                  </Button>
               </ModalFooter>
            </Modal>
         </>
      );
   }
}
