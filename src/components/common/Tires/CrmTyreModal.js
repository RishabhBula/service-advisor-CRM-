import React, { Component } from "react";
import {
   Button,
   Modal,
   ModalBody,
   ModalFooter,
   ModalHeader,
   Row,
   Col,
   InputGroup,
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
import Async from "react-select/lib/Async";
import {
   CalculateMarkupPercent,
   CalculateMarginPercent,
   CalculateRetailPriceByMarkupPercent,
   CalculateRetailPriceByMarginPercent
} from "../../../helpers/Sales";
import LastUpdated from "../../common/LastUpdated";
import { logger } from "../../../helpers/Logger";

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
               quantity: '',
               criticalQuantity: "",
               priceMatrix: { value: "", label: "Type to select" },
               cost: 0,
               retailPrice: 0,
               markup: "",
               margin: ""
            }
         ],
         tierPermission: tierPermission,
         errors: {},
         selectedPriceMatrix: { value: "", label: "Type to select" },
         seasonBtnClass: "",
         selectedVendor: {
            label: "Type to select vendor",
            value: ""
         },
         selectedMatrix: [],
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
               label: vendorId ? vendorId.name : "Type to select vendor",
               value: vendorId ? vendorId._id : ''
            }
         });
         if (this.props.tireData && this.props.tireData.tierSize && this.props.tireData.tierSize.length) {
            this.props.tireData.tierSize.map((item, index) => {
               if (item.priceMatrix) {
                  const { matrixList } = this.props;
                  const selectedMatrix = matrixList.filter(matrix => matrix._id === item.priceMatrix)
                  const tierSize = [...this.state.tierSize];
                  if (selectedMatrix[0]) {
                     tierSize[index].priceMatrix = {
                        label: selectedMatrix[0].matrixName,
                        value: selectedMatrix[0]._id
                     }
                     this.setState({
                        tierSize,
                     })
                  }
               }
               return true
            })
         }
      }
   }

   handleClick = (e) => {
      let { tierPermission } = this.state;
      tierPermission.showNoteOnQuotesInvoices = e.target.checked;
      this.setState({
         tierPermission
      });
   }
   handleCostPricechange = (index, event) => {
      const { name, value } = event.target;
      const tierSize = [...this.state.tierSize]
      if (isNaN(value)) {
         return
      }
      else if (!tierSize[index].margin || !tierSize[index].markup) {
         tierSize[index][name] = value
         this.setState({
            tierSize
         })
      }
      else if (this.state.selectedMatrix && this.state.selectedMatrix.length) {
         tierSize[index][name] = value;
         this.setState({
            tierSize
         })
         this.handleSelectedPriceMatrix(tierSize, index, value, this.state.selectedMatrix)
         return true
      }
      else {
         tierSize[index][name] = value;
         tierSize[index].retailPrice = value && parseFloat(tierSize[index].markup)
            ? CalculateRetailPriceByMarkupPercent(value, parseFloat(tierSize[index].markup)).toFixed(2)
            : tierSize[index].retailPrice
         tierSize[index].retailPrice = value && parseFloat(tierSize[index].margin)
            ? CalculateRetailPriceByMarkupPercent(value, parseFloat(tierSize[index].margin)).toFixed(2)
            : tierSize[index].retailPrice
         this.setState({
            tierSize
         })
      }
   }

   handleTireSizeStates = (index, event) => {
      const { name, value } = event.target;
      if (
         (name === 'quantity' ||
            name === 'criticalQuantity' ||
            name === 'cost' ||
            name === 'part' ||
            name === 'retailPrice') &&
         isNaN(value)
      ) {
         return
      }
      const tierSize = [...this.state.tierSize];
      let t, r, e, q
      if (name === 'quantity' && value) {
         t = parseInt(value)
         tierSize[index].quantity = t;
      }
      else if (name === 'criticalQuantity' && value) {
         r = parseInt(value)
         tierSize[index].criticalQuantity = r;
      }
      else if (name === 'cost' && value) {
         e = parseInt(value)
         tierSize[index].cost = e;
      }
      else if (name === 'retailPrice' && value) {
         q = parseInt(value)
         tierSize[index].retailPrice = q;
      }
      else {
         tierSize[index][name] = value;
      }
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
                     cost: 0,
                     retailPrice: 0,
                     markup: "",
                     margin: ""
                  }
               ])
            };
         });
      }
   };

   handleSelectedPriceMatrix = (tierSize, index, cost, selectedMatrix) => {
      this.setState({
         selectedMatrix: selectedMatrix,
      })
      selectedMatrix[0].matrixRange.map((item, i) => {
         if (parseFloat(item.lower) <= parseFloat(cost) && (parseFloat(cost) <= parseFloat(item.upper) || item.upper === 'beyond')) {
            tierSize[index].margin = parseInt(item.margin);
            tierSize[index].markup = parseInt(item.markup);
            if (cost && parseInt(item.markup)) {
               tierSize[index].retailPrice = CalculateRetailPriceByMarkupPercent(cost, parseInt(item.markup)).toFixed(2)
            }
            else if (cost && item.margin) {
               tierSize[index].retailPrice = CalculateRetailPriceByMarginPercent(cost, parseInt(item.margin)).toFixed(2)
            }
            else {
               tierSize[index].retailPrice = cost
            }
            this.setState({
               tierSize
            })
         }
         return true
      })
   }

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
      if (name === 'retailPrice' && isNaN(value)) {
         return
      }
      const tierSize = [...this.state.tierSize];
      tierSize[index][name] = value;
      tierSize[index].markup = parseFloat(tierSize[index].cost) && parseFloat(tierSize[index].retailPrice)
         ? CalculateMarkupPercent(tierSize[index].cost, tierSize[index].retailPrice).toFixed(2)
         : "";
      tierSize[index].margin = parseFloat(tierSize[index].cost) && parseFloat(tierSize[index].retailPrice)
         ? CalculateMarginPercent(tierSize[index].cost, tierSize[index].retailPrice).toFixed(2)
         : ""
      this.setState({
         tierSize
      });
   };

   setPriceByMarkup = (index, markupPercent) => {
      const tierSize = [...this.state.tierSize];
      tierSize[index].markup = markupPercent;
      tierSize[index].retailPrice = tierSize[index].cost && markupPercent
         ? CalculateRetailPriceByMarkupPercent(tierSize[index].cost, markupPercent).toFixed(2)
         : tierSize[index].retailPrice
      this.setState({
         tierSize,
      });
   };

   setPriceByMargin = (index, marginPercent) => {
      const tierSize = [...this.state.tierSize];
      tierSize[index].margin = marginPercent;
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
         vendorId: vendorId ? vendorId.value : null,
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
               cost: 0,
               retailPrice: 0,
               markup: "",
               margin: ""
            }
         ],
         tierPermission: tierPermission,
         selectedPriceMatrix: { value: "", label: "Type to select" },
         errors: {}
      });
   }

   matrixLoadOptions = (input, callback) => {
      this.props.getPriceMatrix({ input, callback });
   }
   handlePriceMatrix = (e, index) => {
      if (e && e.value) {
         const tierSize = [...this.state.tierSize];
         tierSize[index].priceMatrix = {
            value: e.value,
            label: e.label
         }
         this.setState({
            tierSize
         })
         const { matrixList } = this.props;
         const selectedMatrix = matrixList.filter(matrix => matrix._id === e.value)
         this.handleSelectedPriceMatrix(tierSize, index, tierSize[index].cost, selectedMatrix)
      } else {
         const tierSize = [...this.state.tierSize];
         tierSize[index].priceMatrix = {
            value: "",
            label: "Type to select"
         }
         this.setState({
            tierSize,
            selectedMatrix: []
         })
      }
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
      } = this.state;
      logger(tireData, "@@@@@@@@@@@@@@@@@@@@@")
      return (
         <>
            <Modal
               isOpen={tyreModalOpen}
               toggle={handleTierModal}
               backdrop={"static"}
               className="customer-modal custom-form-modal custom-modal-lg"
            >
               <ModalHeader toggle={handleTierModal}>{!isEditMode ? "Create New Tire" : `Update tire details`}{" "}{isEditMode ? <LastUpdated updatedAt={tireData.updatedAt} /> : null}</ModalHeader>
               <ModalBody>
                  <div className="">
                     <Row className="justify-content-center">
                        <Col md="6">
                           <FormGroup>
                              <Label htmlFor="name" className="customer-modal-text-style tire-col">
                                 Brand Name <span className={"asteric"}>*</span>
                              </Label>
                              <div className="input-block">
                                 <Input
                                    onChange={this.handleChange}
                                    className={"form-control"}
                                    name="brandName"
                                    value={brandName}
                                    maxLength="20"
                                    placeholder={"MRF"}
                                    type={"text"}
                                    invalid={errors.brandName && !brandName}
                                 />
                                 <FormFeedback>
                                    {errors && !brandName && errors.brandName
                                       ? errors.brandName
                                       : null}
                                 </FormFeedback>
                              </div>
                           </FormGroup>
                        </Col>
                        <Col md="6">
                           <FormGroup>
                              <Label htmlFor="name" className="customer-modal-text-style tire-col">
                                 Modal Name <span className={"asteric"}>*</span>
                              </Label>
                              <div className="input-block">
                                 <Input
                                    name="modalName"
                                    value={modalName}
                                    placeholder={"Road Grip"}
                                    onChange={this.handleChange}
                                    maxLength="20"
                                    className={"form-control"}
                                    type={"text"}
                                    invalid={errors.modalName && !modalName} />
                                 <FormFeedback>
                                    {errors && !modalName && errors.modalName
                                       ? errors.modalName
                                       : null}
                                 </FormFeedback>
                              </div>
                           </FormGroup>
                        </Col>
                     </Row>
                     <Row>
                        <Col md="6">
                           <FormGroup className={"fleet-block"}>
                              <Label htmlFor="name" className="customer-modal-text-style tire-col">
                                 Vendor
                              </Label>
                              <Async
                                 placeholder={"Type vendor name"}
                                 loadOptions={this.loadOptions}
                                 className={"w-100 form-select"}
                                 value={tireData && selectedVendor.value !== '' ? selectedVendor : vendorId}
                                 isClearable={true}
                                 onChange={e => {
                                    this.setState({
                                       vendorId: e
                                    });
                                 }}
                              />
                           </FormGroup>
                        </Col>
                        <Col md={"6"}>
                           <FormGroup>
                              <Label htmlFor="name" className="customer-modal-text-style tire-col">
                                 Seasonality
                              </Label>
                              <ButtonGroup className="tyre-season">
                                 <Button
                                    value={seasonality}
                                    className={seasonality === 'summer' ? "margin-markup-btn-active" : "season-btn"}
                                    onClick={() => this.handleButtonClick("summer")}
                                 >
                                    Summer
                                 </Button>
                                 <Button
                                    value={seasonality}
                                    className={seasonality === 'winter' ? "margin-markup-btn-active" : "season-btn"}
                                    onClick={() => this.handleButtonClick("winter")}
                                 >Winter</Button>
                                 <Button
                                    value={seasonality}
                                    className={seasonality === 'all seasons' ? "margin-markup-btn-active" : "season-btn"}
                                    onClick={() => this.handleButtonClick("all seasons")}
                                 >All Seasons</Button>
                              </ButtonGroup>
                           </FormGroup>
                        </Col>
                     </Row>
                     <h5 className={"font-weight-bold"}>Sizes</h5>
                     {tierSize && tierSize.length
                        ? tierSize.map((item, index) => {
                           return (
                              <div className="tyre-size-col" key={index}>
                                 <Row>
                                    <Col md="6">
                                       <FormGroup>
                                          <Label htmlFor="name" className="customer-modal-text-style tire-col">
                                             Base Info
                                          </Label>
                                          <Input
                                             type="text"
                                             className={"form-control"}
                                             name="baseInfo"
                                             value={tierSize[index].baseInfo}
                                             onChange={e => this.handleTireSizeStates(index, e)}
                                             placeholder={"175/70R13 82T"}
                                          />
                                       </FormGroup>
                                       <FormGroup>
                                          <Label htmlFor="name" className="customer-modal-text-style tire-col">
                                             Note
                                          </Label>
                                          <Input
                                             type="textarea"
                                             rows={"1"}
                                             value={tierSize[index].notes}
                                             name="notes"
                                             maxLength="100"
                                             onChange={e => this.handleTireSizeStates(index, e)}
                                          />
                                       </FormGroup>
                                       <div className="child-row">
                                          <Row className="m-0">
                                             <Col md="6">
                                                <FormGroup>
                                                   <Label htmlFor="name" className="customer-modal-text-style tire-col">
                                                      Part #
                                                   </Label>
                                                   <Input
                                                      type="text"
                                                      name="part"
                                                      placeholder={"1234"}
                                                      maxLength="10"
                                                      value={tierSize[index].part}
                                                      onChange={e => this.handleTireSizeStates(index, e)}
                                                   />
                                                </FormGroup>
                                             </Col>
                                             <Col md="6">
                                                <FormGroup>
                                                   <Label htmlFor="name" className="customer-modal-text-style tire-col">
                                                      Bin
                                                   </Label>
                                                   <Input
                                                      type="text"
                                                      name="bin"
                                                      maxLength="10"
                                                      value={tierSize[index].bin}
                                                      onChange={e => this.handleTireSizeStates(index, e)}
                                                      placeholder={"175abd"}
                                                   />
                                                </FormGroup>
                                             </Col>
                                          </Row>
                                          <Row className="m-0">
                                             <Col md="6">
                                                <FormGroup>
                                                   <Label htmlFor="name" className="customer-modal-text-style tire-col">
                                                      Quantity
                                                    </Label>
                                                   <Input
                                                      type="text"
                                                      name="quantity"
                                                      maxLength="5"
                                                      value={tierSize[index].quantity}
                                                      onChange={e => this.handleTireSizeStates(index, e)}
                                                      placeholder={"123"}
                                                   />
                                                </FormGroup>
                                             </Col>
                                             <Col md="6">
                                                <FormGroup>
                                                   <Label htmlFor="name" className="customer-modal-text-style tire-col two-line-label">
                                                      Critical Quantity
                                                   </Label>
                                                   <Input
                                                      type="text"
                                                      name="criticalQuantity"
                                                      maxLength="5"
                                                      value={tierSize[index].criticalQuantity}
                                                      onChange={e => this.handleTireSizeStates(index, e)}
                                                      placeholder={"1"}
                                                   />
                                                </FormGroup>
                                             </Col>
                                          </Row>
                                       </div>
                                    </Col>
                                    <Col md="6" className={"fleet-block"}>
                                       <FormGroup>
                                          <Label htmlFor="name" className="customer-modal-text-style tire-col two-line-label">
                                             Pricing Matrix
                                          </Label>
                                          <Async
                                             placeholder={"Type to select price matrix"}
                                             loadOptions={this.matrixLoadOptions}
                                             className={"w-100 form-select"}
                                             onChange={(e) => this.handlePriceMatrix(e, index)}
                                             isClearable={tierSize[index].priceMatrix && tierSize[index].priceMatrix.value ? true : false}
                                             noOptionsMessage={() => "Type price matrix name"
                                             }
                                             value={tierSize[index].priceMatrix}
                                          />
                                       </FormGroup>
                                       <div className="child-row">
                                          <Row className="m-0">
                                             <Col md="6">
                                                <FormGroup>
                                                   <Label htmlFor="name" className="customer-modal-text-style tire-col">
                                                      Cost
                                                    </Label>
                                                   <InputGroup>
                                                      <div className="input-group-prepend">
                                                         <span className="input-group-text">
                                                            <i className="fa fa-dollar"></i>
                                                         </span>
                                                      </div>
                                                      <Input
                                                         type="text"
                                                         name="cost"
                                                         value={tierSize[index].cost}
                                                         onChange={e => this.handleCostPricechange(index, e)}
                                                         placeholder={"0.00"}
                                                      />
                                                   </InputGroup>
                                                </FormGroup>
                                             </Col>
                                             <Col md="6">
                                                <FormGroup>
                                                   <Label htmlFor="name" className="customer-modal-text-style tire-col">
                                                      Retail Price
                                                   </Label>
                                                   <InputGroup>
                                                      <div className="input-group-prepend">
                                                         <span className="input-group-text">
                                                            <i className="fa fa-dollar"></i>
                                                         </span>
                                                      </div>
                                                      <Input
                                                         type="text"
                                                         name="retailPrice"
                                                         value={tierSize[index].retailPrice}
                                                         onChange={e => this.handleRetailsPriceChange(index, e)}
                                                         placeholder={"0.00"}
                                                      />
                                                   </InputGroup>
                                                </FormGroup>
                                             </Col>
                                          </Row>
                                       </div>
                                       <FormGroup>
                                          <Label htmlFor="name" className="customer-modal-text-style tire-col">
                                             Markup
                                          </Label>
                                          <ButtonGroup className="tyre-season">
                                             {MarkupChangeValues.map((mark, i) => {
                                                return (
                                                   <Button
                                                      key={i}
                                                      type={"button"}
                                                      size={"sm"}
                                                      className={tierSize[index].markup === mark.value ? 'margin-markup-btn-active' : 'margin-markup-btn'}
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
                                                   value={tierSize[index].markup}
                                                   onChange={e => this.setPriceByMarkup(index, e.target.value)}
                                                />
                                             </Button>
                                          </ButtonGroup>
                                       </FormGroup>
                                       <FormGroup>
                                          <Label htmlFor="name" className="customer-modal-text-style tire-col">
                                             Margin
                                          </Label>
                                          <ButtonGroup className="tyre-season">
                                             {MarginChangeValues.map((mark, i) => {
                                                return (
                                                   <Button
                                                      key={i}
                                                      type={"button"}
                                                      size={"sm"}
                                                      className={tierSize[index].margin === mark.value ? 'margin-markup-btn-active' : 'margin-markup-btn'}
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
                                                   value={tierSize[index].margin}
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
                           <p className="customer-modal-text-style">
                              {tierPermissionText.showNoteOnQuotesInvoices}
                           </p>
                           {
                              (tierPermission.showNoteOnQuotesInvoices)

                           }
                        </div>
                     </Col>
                  </div>
               </ModalBody>
               <ModalFooter>
                  <div className="required-fields">*Fields are Required.</div>
                  <Button color="primary" onClick={() => this.handleAddTire()}>
                     {!isEditMode ? "Create New Tire" : `Update tire details`}
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