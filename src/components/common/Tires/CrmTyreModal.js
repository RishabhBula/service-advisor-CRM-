import React, { Component } from "react";
import {
   Button,
   Modal,
   ModalBody,
   ModalFooter,
   ModalHeader,
   Row,
   Col,
   ButtonGroup,
   FormFeedback,
   FormGroup,
   Label,
   Input
} from "reactstrap";
import {
   tierPermission,
   tierPermissionText,
   MarkupChangeValues,
   MarginChangeValues,
} from "../../../config/Constants"
import { AppSwitch } from "@coreui/react";
import Validator from "js-object-validation";
import {
   CreateTierValidations,
   CreateTierValidMessaages
} from "../../../validations";
import MaskedInput from "react-maskedinput";
import Async from "react-select/lib/Async";
import {
   CalculateMarkupPercent,
   CalculateMarginPercent,
   CalculateRetailPriceByMarkupPercent,
   CalculateRetailPriceByMarginPercent
} from "../../../helpers/Sales";

export class CrmTyreModal extends Component {
   constructor(props) {
      super(props);
      this.state = {
         brandName: "",
         modalName: "",
         vendorId: "",
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
         ],
         tierPermission: tierPermission,
         errors: {},
         seasonBtnClass: "",
         selectedVendor: {
            label: "Type to select vendor",
            value: ""
         },
         isEditMode: false
      };
   }

   componentDidUpdate = ({ tyreModalOpen, tireData }) => {
      if (tyreModalOpen !== this.props.tyreModalOpen && !this.props.tireData) {
         this.removeAllState();
      }
      if (
         this.props.tireData &&
         this.props.tireData._id &&
         (tireData._id !== this.props.tireData._id)
      ) {
         const {
            brandName,
            modalName,
            vendorId,
            seasonality,
            tierSize,
            tierPermission
         } = this.props.tireData;
         this.setState({
            isEditMode: true,
            brandName,
            modalName,
            vendorId,
            seasonality,
            tierSize,
            tierPermission,
            selectedVendor: {
               label: vendorId && vendorId.name ? vendorId.name: "Type to select vendor",
               value: vendorId && vendorId._id? vendorId._id : '' 
            }
         });
      }
   }

   handleClick = (e) => {
      let { tierPermission } = this.state;
      tierPermission.showNoteOnQuotesInvoices = e.target.checked;
      this.setState({
         tierPermission
      });
   }

   handleTireSizeStates = (index, event) => {
      const { name, value } = event.target;
      if (
         (name === 'quantity' ||
            name === 'criticalQuantity' ||
            name === 'cost' ||
            name === 'retailPrice') &&
         isNaN(value)
      ) {
         return
      }
      const tierSize = [...this.state.tierSize];
      tierSize[index][name] = value;
      this.setState({
         tierSize
      });
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
                  }
               ])
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
            tierSize: t
         });
      }
   };
   handleButtonClick = (value) => {
      this.setState({
         seasonality: value,
         seasonBtnClass: "season-btn-active"
      })
   }

   handleRetailsPriceChange = (index, e) => {
      const { name, value } = e.target;
      const tierSize = [...this.state.tierSize];
      tierSize[index][name] = value;
      this.setState({
         tierSize
      },
         () => {
            this.setState({
               ...this.state.tierSize[index],
               markup:
                  parseFloat(tierSize[index].cost) && parseFloat(tierSize[index].price)
                     ? CalculateMarkupPercent(tierSize[index].cost, tierSize[index].price).toFixed(2)
                     : "",
               margin:
                  parseFloat(tierSize[index].cost) && parseFloat(tierSize[index].price)
                     ? CalculateMarginPercent(tierSize[index].cost, tierSize[index].price).toFixed(2)
                     : ""
            });
         }
      );
   };

   setPriceByMarkup = (index, markupPercent) => {
      const tierSize = [...this.state.tierSize];
      tierSize[index].retailPrice = tierSize[index].cost && markupPercent
         ? CalculateRetailPriceByMarkupPercent(tierSize[index].cost, markupPercent).toFixed(2)
         : tierSize[index].retailPrice
      this.setState({
         tierSize,
      });
   };

   setPriceByMargin = (index, marginPercent) => {
      const tierSize = [...this.state.tierSize];
      tierSize[index].retailPrice = tierSize[index].cost && marginPercent
         ? CalculateRetailPriceByMarginPercent(tierSize[index].cost, marginPercent).toFixed(2)
         : tierSize[index].cost.retailPrice
      this.setState({
         tierSize,
      });
   };

   loadOptions = (input, callback) => {
      this.props.getInventoryPartsVendors({ input, callback });
   };

   handleChange = event => {
      const { name, value } = event.target;
      this.setState({
         [name]: value
      });
   };

   handleAddTire = () => {
      const {
         brandName,
         modalName,
         vendorId,
         seasonality,
         tierSize,
         tierPermission
      } = this.state

      const payload = {
         brandName,
         modalName,
         vendorId: vendorId.value,
         seasonality,
         tierSize,
         tierPermission
      }
      const { isValid, errors } = Validator(
         payload,
         CreateTierValidations,
         CreateTierValidMessaages
      );
      if (!isValid) {
         this.setState({
            errors
         });
         return;
      } else {
         if (!this.state.isEditMode) {
            this.props.addTier(payload)
         } else {
            const tireId = this.props.tireData._id
            this.props.updateTire(tireId, payload)
         }
      }
   };

   async removeAllState() {
      this.setState({
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
         ],
         tierPermission: tierPermission,
         errors: {}
      });
   }

   render() {
      const { tyreModalOpen, handleTierModal, tireData } = this.props;
      const {
         tierSize,
         tierPermission,
         errors,
         modalName,
         seasonality,
         brandName,
         vendorId,
         isEditMode,
         selectedVendor,
         seasonBtnClass } = this.state;
      return (
         <>
            <Modal
               isOpen={tyreModalOpen}
               toggle={handleTierModal}
               backdrop={"static"}
               className="customer-modal custom-form-modal custom-modal-lg"
            >
               <ModalHeader toggle={handleTierModal}>{!isEditMode ? "Create New Tire" : `Update tire details`}</ModalHeader>
               <ModalBody>
                  <div className="">
                     <Row className="justify-content-center">
                        <Col md="4">
                           <FormGroup>
                              <Label htmlFor="name" className="customer-modal-text-style tire-col">
                                 Brand Name <span className={"asteric"}>*</span>
                              </Label>
                              <Input
                                 onChange={this.handleChange}
                                 className={"form-control"}
                                 name="brandName"
                                 value={brandName}
                                 placeholder={"MRF"}
                                 type={"text"}
                                 invalid={errors.brandName && !brandName}
                              />
                              <FormFeedback>
                                 {errors && !brandName && errors.brandName
                                    ? errors.brandName
                                    : null}
                              </FormFeedback>
                           </FormGroup>
                        </Col>
                        <Col md="4">
                           <FormGroup>
                              <Label htmlFor="name" className="customer-modal-text-style tire-col">
                                 Modal Name <span className={"asteric"}>*</span>
                              </Label>
                              <Input
                                 name="modalName"
                                 value={modalName}
                                 placeholder={"Road Grip"}
                                 onChange={this.handleChange}
                                 className={"form-control"}
                                 type={"text"}
                                 invalid={errors.modalName && !modalName} />
                              <FormFeedback>
                                 {errors && !modalName && errors.modalName
                                    ? errors.modalName
                                    : null}
                              </FormFeedback>
                           </FormGroup>
                        </Col>
                        <Col md="4">
                           <FormGroup className={"fleet-block"}>
                              <Label htmlFor="name" className="customer-modal-text-style tire-col">
                                 Vendor
                              </Label>
                              <Async
                                 placeholder={"Type vendor name"}
                                 loadOptions={this.loadOptions}
                                 className={"w-100 form-select"}
                                 value={tireData && selectedVendor.value !==''  ? selectedVendor : vendorId}
                                 isClearable={true}
                                 onChange={e => {
                                    this.setState({
                                       vendorId: e
                                    });
                                 }}
                              />
                           </FormGroup>
                        </Col>
                     </Row>
                     <div className="">
                        <h6>Seasonality</h6>
                        <FormGroup>
                           <ButtonGroup className="tyre-season">
                              <Button
                                 value={seasonality}
                                 className={seasonality === 'summer' ? seasonBtnClass : "season-btn"}
                                 onClick={() => this.handleButtonClick("summer")}
                              >
                                 Summer
                              </Button>
                              <Button
                                 value={seasonality}
                                 className={seasonality === 'winter' ? seasonBtnClass : "season-btn"}
                                 onClick={() => this.handleButtonClick("winter")}
                              >Winter</Button>
                              <Button
                                 value={seasonality}
                                 className={seasonality === 'all seasons' ? seasonBtnClass : "season-btn"}
                                 onClick={() => this.handleButtonClick("all seasons")}
                              >All Seasons</Button>
                           </ButtonGroup>
                        </FormGroup>
                     </div>
                     <h6>Sizes</h6>
                     {tierSize && tierSize.length
                        ? tierSize.map((item, index) => {
                           return (
                              <div className="tyre-size-col" key={index}>
                                 <Row>
                                    <Col md="6">
                                       <h6>Base Info</h6>
                                       <FormGroup>
                                          <MaskedInput
                                             mask="111/11R11 11"
                                             type="text"
                                             className={"form-control"}
                                             name="baseInfo"
                                             value={tierSize[index].baseInfo}
                                             onChange={e => this.handleTireSizeStates(index, e)}
                                             placeholder={"175/70R13 82T"}
                                          />
                                       </FormGroup>
                                       <h6>Note</h6>
                                       <FormGroup>
                                          <Input
                                             type="textarea"
                                             rows={"1"}
                                             value={tierSize[index].notes}
                                             name="notes"
                                             onChange={e => this.handleTireSizeStates(index, e)}
                                          />
                                       </FormGroup>
                                       <div className="child-row">
                                          <Row className="m-0">
                                             <Col md="6">
                                                <h6>Part #</h6>
                                                <FormGroup>
                                                   <Input
                                                      type="text"
                                                      name="part"
                                                      value={tierSize[index].part}
                                                      onChange={e => this.handleTireSizeStates(index, e)}
                                                      placeholder={""}
                                                   />
                                                </FormGroup>
                                             </Col>
                                             <Col md="6">
                                                <h6>Bin</h6>
                                                <FormGroup>
                                                   <Input
                                                      type="text"
                                                      name="bin"
                                                      value={tierSize[index].bin}
                                                      onChange={e => this.handleTireSizeStates(index, e)}
                                                      placeholder={"175abd"}
                                                   />
                                                </FormGroup>
                                             </Col>
                                          </Row>
                                          <Row className="m-0">
                                             <Col md="6">
                                                <h6>Quantity</h6>
                                                <FormGroup>
                                                   <Input
                                                      type="text"
                                                      name="quantity"
                                                      value={tierSize[index].quantity}
                                                      onChange={e => this.handleTireSizeStates(index, e)}
                                                      placeholder={"123"}
                                                   />
                                                </FormGroup>
                                             </Col>
                                             <Col md="6">
                                                <h6>Critical Quantity</h6>
                                                <FormGroup>
                                                   <Input
                                                      type="text"
                                                      name="criticalQuantity"
                                                      value={tierSize[index].criticalQuantity}
                                                      onChange={e => this.handleTireSizeStates(index, e)}
                                                      placeholder={"1"}
                                                   />
                                                </FormGroup>
                                             </Col>
                                          </Row>
                                       </div>
                                    </Col>
                                    <Col md="6">
                                       <h6>Pricing Matrix</h6>
                                       <FormGroup>
                                          <Input
                                             type="text"
                                             onChange={e => this.handleTireSizeStates(index, e)}
                                          />
                                       </FormGroup>
                                       <div className="child-row">
                                          <Row className="m-0">
                                             <Col md="6">
                                                <h6>Cost</h6>
                                                <FormGroup>
                                                   <Input
                                                      type="text"
                                                      name="cost"
                                                      value={tierSize[index].cost}
                                                      onChange={e => this.handleTireSizeStates(index, e)}
                                                      placeholder={"$0.00"}
                                                   />
                                                </FormGroup>
                                             </Col>
                                             <Col md="6">
                                                <h6>Retail Price</h6>
                                                <FormGroup>
                                                   <Input
                                                      type="text"
                                                      name="retailPrice"
                                                      value={tierSize[index].retailPrice}
                                                      onChange={e => this.handleRetailsPriceChange(index, e)}
                                                      placeholder={"$0.00"}
                                                   />
                                                </FormGroup>
                                             </Col>
                                          </Row>
                                       </div>
                                       <h6>Markup</h6>
                                       <FormGroup>
                                          <ButtonGroup className="tyre-season">
                                             {MarkupChangeValues.map((mark, i) => {
                                                return (
                                                   <Button
                                                      key={i}
                                                      type={"button"}
                                                      color={"primary"}
                                                      size={"sm"}
                                                      onClick={() => this.setPriceByMarkup(index, mark.value)}
                                                   >
                                                      {mark.key}
                                                   </Button>
                                                );
                                             })}
                                             <Button type={"button"} size={"sm"}>
                                                <Input
                                                   type={"text"}
                                                   placeholder={"Markup"}
                                                   defaultValue={tierSize[index].markup}
                                                   onChange={e => this.setPriceByMarkup(index, e.target.value)}
                                                />
                                             </Button>
                                          </ButtonGroup>
                                       </FormGroup>
                                       <h6>Margin</h6>
                                       <FormGroup>
                                          <ButtonGroup className="tyre-season">
                                             {MarginChangeValues.map((mark, i) => {
                                                return (
                                                   <Button
                                                      key={i}
                                                      type={"button"}
                                                      color={"primary"}
                                                      size={"sm"}
                                                      onClick={() => this.setPriceByMargin(index, mark.value)}
                                                   >
                                                      {mark.key}
                                                   </Button>
                                                );
                                             })}
                                             <Button type={"button"} size={"sm"}>
                                                <Input
                                                   type={"text"}
                                                   placeholder={"Margin"}
                                                   defaultValue={tierSize[index].margin}
                                                   onChange={e => this.setPriceByMargin(index, e.target.value)}
                                                />
                                             </Button>
                                          </ButtonGroup>
                                       </FormGroup>
                                    </Col>
                                 </Row>
                                 <Button
                                    className="btn-sm btn btn-danger remove-tire-btn"
                                    onClick={() => this.handleRemoveTierSize(index)}
                                 >
                                    <i className="fas fa-times" />
                                 </Button>
                              </div>
                           );
                        })
                        : null}
                     {tierSize.length < 5 ? (
                        <span
                           onClick={this.handleAddTierSize}
                           className="customer-add-phone customer-anchor-text customer-click-btn"
                        >
                           Add Tire Size
                        </span>
                     ) : null}

                     <Col md="6">
                        <div className="d-flex">
                           <p className="customer-modal-text-style">
                              {tierPermissionText.showNoteOnQuotesInvoices}
                           </p>
                           {
                              (tierPermission.showNoteOnQuotesInvoices)

                           }
                           <AppSwitch
                              className={"mx-1"}
                              checked={
                                 tierPermission.showNoteOnQuotesInvoices
                              }
                              onClick={this.handleClick}
                              variant={"3d"}
                              // value={tierPermission.showNoteOnQuotesInvoices}
                              color={"primary"}
                              size={"sm"}
                           />
                        </div>
                     </Col>
                  </div>
               </ModalBody>
               <ModalFooter>
                  <div className="required-fields">*Fields are Required.</div>
                  <Button color="primary" onClick={() => this.handleAddTire()}>
                     {!isEditMode ? "Add New Tier" : `Update tire details`}
                  </Button>{" "}
                  <Button color="secondary" onClick={handleTierModal}>
                     Cancel
                  </Button>
               </ModalFooter>
            </Modal>
         </>
      );
   }
}
