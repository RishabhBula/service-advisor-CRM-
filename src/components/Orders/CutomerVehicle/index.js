import React, { Component } from "react";
import {
   Col,
   Row,
   FormGroup,
   Label,
   FormFeedback
} from "reactstrap";
import Async from "react-select/lib/Async";
import * as classnames from "classnames";

class CutomerVehicle extends Component {
   constructor(props) {
      super(props);
      this.state = {
         customerId: "",
         vehicleId: "",
         selectedCustomer: {
            lable: "Type to select customer",
            value: ""
         },
         selectedVehicle: {
            lable: "Type to select vehicle",
            value: ""
         }
      };
   }
   loadCustomers = (input, callback) => {
      this.props.getCustomerData({ input, callback });
   };
   loadVehicles = (input, callback) => {
      this.props.getVehicleData({ input, callback });
   };
   handaleCustomerVehicleSelect = (e) => {
      if (e && e.value) {
         const { customerId, vehicleId } = this.state;
         this.props.customerVehicleData(customerId, vehicleId)
      } else {
         this.setState({
            customerId: "",
            vehicleId: ""
         })
      }
   }
   render() {
      const {
         selectedCustomer,
         selectedVehicle,
         customerId,
         vehicleId,
      } = this.state
      const { isError } = this.props
      return (
         <Col md={"12"}>
            <Row className={"custom-form-modal"}>
               <Col md={"6"}>
                  <FormGroup>
                     <Label htmlFor="name" className="customer-modal-text-style">
                        Customer <span className={"asteric"}>*</span>
                     </Label>
                     <div className={"input-block"}>
                        <Async
                           placeholder={"Type Customer name"}
                           loadOptions={this.loadCustomers}
                           value={selectedCustomer.value !== '' ? selectedCustomer : customerId}
                           isClearable={true}
                           className={classnames("w-100 form-select", {
                              "is-invalid":
                                 isError && !customerId
                           })}
                           onChange={e => {
                              this.setState({
                                 customerId: e
                              }, () => {
                                 this.handaleCustomerVehicleSelect(e)
                              });
                           }}
                        />
                        {isError && !customerId ? (
                           <FormFeedback>Customer data is required.</FormFeedback>
                        ) : null}
                     </div>
                  </FormGroup>
               </Col>
               <Col md={"6"}>
                  <FormGroup>
                     <Label htmlFor="name" className="customer-modal-text-style">
                        Vehicle <span className={"asteric"}>*</span>
                     </Label>
                     <div className={"input-block"}>
                        <Async
                           placeholder={"Type Vehicle name"}
                           loadOptions={this.loadVehicles}
                           className={classnames("w-100 form-select", {
                              "is-invalid":
                                 isError && !customerId
                           })}
                           value={selectedVehicle.value !== '' ? selectedVehicle : vehicleId}
                           isClearable={true}
                           onChange={e => {
                              this.setState({
                                 vehicleId: e
                              }, () => {
                                 this.handaleCustomerVehicleSelect(e)
                              });
                           }}
                        />
                        {isError && !customerId ? (
                           <FormFeedback>Vehicle data is required.</FormFeedback>
                        ) : null}
                     </div>
                  </FormGroup>
               </Col>
            </Row>
         </Col>
      );
   }
}

export default CutomerVehicle;
