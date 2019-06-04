import React, { Component } from "react";
import ServiceItem from "./serviceItem"
import CrmInventoryPart from '../../common/CrmInventoryPart'
import { CrmTyreModal } from '../../common/Tires/CrmTyreModal'
import { CrmLabourModal } from '../../common/Labours/CrmLabourModal'

class Services extends Component {
   constructor(props) {
      super(props);
      this.state = {
         servicesData: [
            {
               name: "",
               technician: "",
               note: "",
               serviceItems: [],
               epa: {
                  type: "%",
                  value: ""
               },
               discount: {
                  type: "%",
                  value: "",
               },
               taxes: {
                  type: "%",
                  value: ""
               },
               seviceTotal: "",
               isError: false
            }
         ],
         serviceElements: [],
         selectedService: '',
         serviceIndex: -1,
      };
   }
   handleSeviceAdd = async () => {
      if (this.state.servicesData) {
         const { serviceReducers } = this.props;
         const { services } = serviceReducers;
         services.push(this.state.servicesData[0])
         await this.props.addPartToService(services)
         this.setState((state, props) => {
            return {
               servicesData: state.servicesData.concat([
                  {
                     name: "",
                     technician: "",
                     note: "",
                     serviceItems: [],
                     epa: {
                        type: "",
                        value: ""
                     },
                     discount: {
                        type: "",
                        value: "",
                     },
                     taxes: {
                        type: "",
                        value: ""
                     },
                     seviceTotal: ""
                  }
               ])
            };
         });
      }
   }
   handleServiceModal = (serviceType, index) => {
      this.setState({
         selectedService: serviceType ? serviceType : '',
         serviceIndex: index
      })
   }
   handleOpenModal = () => {
      const { selectedService, serviceIndex } = this.state;
      const {
         modelInfoReducer,
         modelOperate,
         getPartDetails,
         addPartToService,
         addTireToService,
         addInventoryPart,
         serviceReducers,
         addInventryTire,
         getTireDetails,
         getLaborDetails,
         addLaborToService,
         addLaborInventry,
      } = this.props;
      const { modelDetails } = modelInfoReducer;
      const {
         tireAddModalOpen,
         partAddModalOpen,
      } = modelDetails;
      switch (selectedService) {
         case 'part':
            return (
               <>
                  <CrmInventoryPart
                     isOpen={partAddModalOpen}
                     serviceModal={true}
                     serviceIndex={serviceIndex}
                     getPartDetails={getPartDetails}
                     addPartToService={addPartToService}
                     addInventoryPart={addInventoryPart}
                     services={serviceReducers.services}
                     toggle={() =>
                        modelOperate({
                           partAddModalOpen: !partAddModalOpen
                        })
                     } />
               </>
            );
         case 'tire':
            return (
               <CrmTyreModal
                  tyreModalOpen={tireAddModalOpen}
                  serviceTireModal={true}
                  serviceIndex={serviceIndex}
                  services={serviceReducers.services}
                  addTier={addInventryTire}
                  addTireToService={addTireToService}
                  getTireDetails={getTireDetails}
                  handleTierModal={() =>
                     modelOperate({
                        tireAddModalOpen: !tireAddModalOpen
                     })
                  } />
            )
         case 'labor':
            return (
               <CrmLabourModal
                  tyreModalOpen={tireAddModalOpen}
                  serviceLaborModal={true}
                  serviceIndex={serviceIndex}
                  services={serviceReducers.services}
                  addLabour={addLaborInventry}
                  getLaborDetails={getLaborDetails}
                  addLaborToService={addLaborToService}
                  handleLabourModal={() =>
                     modelOperate({
                        tireAddModalOpen: !tireAddModalOpen
                     })
                  } />
            );
         default:
            return null;
      }
   }
   render() {
      const { servicesData, selectedService } = this.state
      const {
         modelInfoReducer,
         modelOperate,
         serviceReducers,
         getUserData,
         addPartToService,
         labelReducer,
         addNewLabel,
         addNewService,
         getCannedServiceList,
         orderId
      } = this.props;
      const { modelDetails } = modelInfoReducer;
      return (
         <div>
            <div className={"d-flex justify-content-between pb-4"}>
               <ServiceItem
                  servicesData={servicesData}
                  handleRemoveService={this.handleRemoveService}
                  handleServiceModal={this.handleServiceModal}
                  modelOperate={modelOperate}
                  modelDetails={modelDetails}
                  serviceReducers={serviceReducers}
                  getUserData={getUserData}
                  handleSeviceAdd={this.handleSeviceAdd}
                  addPartToService={addPartToService}
                  labelReducer={labelReducer}
                  addNewLabel={addNewLabel}
                  addNewService={addNewService}
                  getCannedServiceList={getCannedServiceList}
                  orderId={orderId}
               />
            </div>
            {
               selectedService ?
                  this.handleOpenModal() :
                  null
            }
         </div>
      );
   }
}

export default Services;
