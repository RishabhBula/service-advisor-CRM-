import React, { Component } from "react";
import {
   Col,
   Row,
   FormGroup,
   Input,
   Label
} from "reactstrap";
import Async from "react-select/lib/Async";

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
   render() {
      const {
         selectedCustomer,
         selectedVehicle,
         customerId,
         vehicleId,
      } = this.state
      return (
         <Col md={"12"}>
            <Row className={"custom-form-modal"}>
               <Col md={"6"}>
                  <FormGroup>
                     <Label htmlFor="name" className="customer-modal-text-style">
                        Customer <span className={"asteric"}>*</span>
                     </Label>
                     <Async
                        className={"w-100 form-select"}
                        placeholder={"Type Customer name"}
                        loadOptions={this.loadCustomers}
                        value={selectedCustomer.value !== '' ? selectedCustomer : customerId}
                        isClearable={true}
                        onChange={e => {
                           this.setState({
                              customerId: e
                           });
                        }}
                     />
                  </FormGroup>
               </Col>
               <Col md={"6"}>
                  <FormGroup>
                     <Label htmlFor="name" className="customer-modal-text-style">
                        Vehicle <span className={"asteric"}>*</span>
                     </Label>
                     <Async
                        placeholder={"Type Vehicle name"}
                        loadOptions={this.loadVehicles}
                        className={"w-100 form-select"}
                        value={selectedVehicle.value !== '' ? selectedVehicle : vehicleId}
                        isClearable={true}
                        onChange={e => {
                           this.setState({
                              vehicleId: e
                           });
                        }}
                     />
                  </FormGroup>
               </Col>
            </Row>
         </Col>
      );
   }
}

export default CutomerVehicle;
