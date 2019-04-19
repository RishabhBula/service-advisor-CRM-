import React, { Component } from 'react';
import {
   Button,
   Modal,
   ModalBody,
   ModalFooter,
   ModalHeader,
   Row,
   Col,
   ButtonGroup,
   FormGroup,
   Label,
   Input,
} from 'reactstrap';

export class CrmTyreModal extends Component {
   constructor(props) {
      super(props);
      this.state = {
         brandName: "",
         modalName: "",
         vendor: "",
         seasonality: "",
         tierSize: [
            {
               baseInfo: "",
               notes: "",
               part: "",
               bin: "",
               quantity: "",
               criticalQuantity: "",
               priceMatrix: "",
               cost: "",
               retailPrice: "",
               markup: "",
               margin: ""
            }
         ]
      };
   }

   handleAddTierSize = () => {
      const { tierSize } = this.state;
      if (tierSize.length < 5) {
         this.setState((state, props) => {
            return {
               tierSize: state.tierSize.concat([
                  {
                     baseInfo: "",
                     notes: "",
                     part: "",
                     bin: "",
                     quantity: "",
                     criticalQuantity: "",
                     priceMatrix: "",
                     cost: "",
                     retailPrice: "",
                     markup: "",
                     margin: ""
                  },
               ]),
            };
         });
      }
   };

   handleRemoveTierSize = index => {
      const { tierSize } = this.state;
      let t = [...tierSize];
      t.splice(index, 1);
      if (tierSize.length) {
         this.setState({
            tierSize: t,
         });
      }
   };

   handleAddTire = () => {

   };

   render() {
      const {
         tyreModalOpen,
         handleTierModal
      } = this.props;
      const {
         tierSize
      } = this.state
      return (
         <>
            <Modal
               isOpen={tyreModalOpen}
               toggle={handleTierModal}
               backdrop={"static"}
               className='customer-modal custom-form-modal custom-modal-lg'
            >
               <ModalHeader toggle={handleTierModal}>
                  Create New Tire
               </ModalHeader>
               <ModalBody>
                  <div className=''>
                     <Row className='justify-content-center'>
                        <Col md='4'>
                           <FormGroup>
                              <Label htmlFor='name' className='customer-modal-text-style'>
                                 Brand Name
                              </Label>
                              <Input
                                 className={"form-control"}
                                 type={"text"}
                              />
                           </FormGroup>
                        </Col>
                        <Col md='4'>
                           <FormGroup>
                              <Label htmlFor='name' className='customer-modal-text-style'>
                                 Modal Name
                              </Label>
                              <Input
                                 className={"form-control"}
                                 type={"text"}
                              />
                           </FormGroup>
                        </Col>
                        <Col md='4'>
                           <FormGroup>
                              <Label htmlFor='name' className='customer-modal-text-style'>
                                 Vendor
                              </Label>
                              <Input
                                 className={"form-control"}
                                 type={"text"}
                              />
                           </FormGroup>
                        </Col>
                     </Row>
                     <div className="">
                        <h6>Seasonality</h6>
                        <FormGroup>
                           <ButtonGroup className="tyre-season">
                              <Button color="info">Summer</Button>
                              <Button color="info">Winter</Button>
                              <Button color="info">All Seasons</Button>
                           </ButtonGroup>
                        </FormGroup>
                     </div>
                     <h6>Sizes</h6>
                     {tierSize && tierSize.length
                        ? tierSize.map((item, index) => {
                           return (
                              <div className="tyre-size-col">
                                 <Row>
                                    <Col md="6">
                                       <h6>Base Info</h6>
                                       <FormGroup>
                                          <Input type="text" placeholder={"175/70R13 82T"} />
                                       </FormGroup>
                                       <h6>Note</h6>
                                       <FormGroup>
                                          <Input type="textarea" col={"2"} row={"5"} placeholder={"175/70R13 82T"} />
                                       </FormGroup>
                                       <div className="child-row">
                                          <Row className="m-0">
                                             <Col md="6">
                                                <h6>Part #</h6>
                                                <FormGroup>
                                                   <Input type="text" placeholder={"175/70R13 82T"} />
                                                </FormGroup>
                                             </Col>
                                             <Col md="6">
                                                <h6>Bin</h6>
                                                <FormGroup>
                                                   <Input type="text" placeholder={"175/70R13 82T"} />
                                                </FormGroup>
                                             </Col>
                                          </Row>
                                          <Row className="m-0">
                                             <Col md="6">
                                                <h6>Quantity</h6>
                                                <FormGroup>
                                                   <Input type="text" placeholder={"175/70R13 82T"} />
                                                </FormGroup>
                                             </Col>
                                             <Col md="6">
                                                <h6>Critical Quantity</h6>
                                                <FormGroup>
                                                   <Input type="text" placeholder={"175/70R13 82T"} />
                                                </FormGroup>
                                             </Col>
                                          </Row>
                                       </div>
                                    </Col>
                                    <Col md="6">
                                       <h6>Pricing Matrix</h6>
                                       <FormGroup>
                                          <Input type="text" placeholder={"175/70R13 82T"} />
                                       </FormGroup>
                                       <div className="child-row">
                                          <Row className="m-0">
                                             <Col md="6">
                                                <h6>Cost</h6>
                                                <FormGroup>
                                                   <Input type="text" placeholder={"175/70R13 82T"} />
                                                </FormGroup>
                                             </Col>
                                             <Col md="6">
                                                <h6>Retail Price</h6>
                                                <FormGroup>
                                                   <Input type="text" placeholder={"175/70R13 82T"} />
                                                </FormGroup>
                                             </Col>
                                          </Row>
                                       </div>
                                       <h6>Markup</h6>
                                       <FormGroup>
                                          <ButtonGroup className="tyre-season">
                                             <Button color="info">15%</Button>
                                             <Button color="info">25%</Button>
                                             <Button color="info">35%</Button>
                                             <Button color="info">50%</Button>
                                             <Input type={"text"} placeholder="Enter %" />
                                          </ButtonGroup>
                                       </FormGroup>
                                       <h6>Margin</h6>
                                       <FormGroup>
                                          <ButtonGroup className="tyre-season">
                                             <Button color="info">15%</Button>
                                             <Button color="info">25%</Button>
                                             <Button color="info">35%</Button>
                                             <Button color="info">50%</Button>
                                             <Input type={"text"} placeholder="Enter %" />
                                          </ButtonGroup>
                                       </FormGroup>
                                    </Col>
                                 </Row>
                                 <Button className="btn-sm" onClick={()=> this.handleRemoveTierSize(index)}><i className="fas fa-times" /></Button>
                              </div>
                           )
                        }) : null}
                     {tierSize.length < 5 ? (
                        <span
                           onClick={this.handleAddTierSize}
                           className='customer-add-phone customer-anchor-text customer-click-btn'
                        >
                           Add Tier Size
                      </span>
                     ) : null}
                  </div>
               </ModalBody>
               <ModalFooter>
                  <div className="required-fields">*Fields are Required.</div>
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
