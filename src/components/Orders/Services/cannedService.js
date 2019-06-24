import React, { Component } from "react";
import { CrmCannedServiceModal } from "../../common/CrmCannedServiceModal"

class CannedServiceUpdate extends Component {
   constructor(props) {
      super(props);
      this.state = {};
   }
   handlCannedServiceEdit = (cannedService) => {
      console.log("!!!!!!!!!!!", cannedService);
   }
   render() {
      return (
         <div>
            Canned Service Update works!!
            <CrmCannedServiceModal
               handlCannedEdit={() => this.handlCannedServiceEdit()}
            />
         </div>
      );
   }
}
export default CannedServiceUpdate;
