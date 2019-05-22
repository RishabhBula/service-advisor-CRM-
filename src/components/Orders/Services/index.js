import React, { Component } from "react";
import {
   Col,
   Row,
   FormGroup,
   Input,
   Button
} from "reactstrap";
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
               serviceItems: []
            }
         ],
         selectedService: '',
         serviceIndex: -1
      };
   }

   handleSeviceAdd = async () => {
      if (this.state.servicesData) {
         // const { serviceReducers } = this.props;
         // const { services } = serviceReducers;
         // services.push(this.state.servicesData)
         // await this.props.addPartToService(services)
         this.setState((state, props) => {
            return {
               servicesData: state.servicesData.concat([
                  {
                     name: "",
                     technician: "",
                     note: "",
                     serviceItems: []
                  }
               ])
            };
         });
      }
   }

   handleRemoveService = index => {
      const { servicesData } = this.state;
      let t = [...servicesData];
      t.splice(index, 1);
      if (servicesData.length) {
         this.setState({
            servicesData: t
         });
      }
   };
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
         addInventoryPart,
         serviceReducers
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
                  serviceModal={true}
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
                  serviceModal={true}
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
         serviceReducers
      } = this.props;
      const { modelDetails } = modelInfoReducer;
      return (
         <div>
            <Row>
               <Col md={"6"}>
                  <FormGroup>
                     <Input type={"textarea"} rows={"4"} col={"12"} placeholder={"Customer Comments"} />
                  </FormGroup>
               </Col>
               <Col md={"6"}>
                  <FormGroup>
                     <Input type={"textarea"} rows={"4"} col={"12"} placeholder={"Recommendations"} />
                  </FormGroup>
               </Col>
            </Row>
            <div className={"d-flex justify-content-between pb-4"}>
               <ServiceItem
                  services={servicesData}
                  handleRemoveService={this.handleRemoveService}
                  handleServiceModal={this.handleServiceModal}
                  modelOperate={modelOperate}
                  modelDetails={modelDetails}
                  serviceReducers={serviceReducers}
               />
            </div>
            {
               selectedService ?
                  this.handleOpenModal() :
                  null
            }
            <Button color={"primary"} onClick={this.handleSeviceAdd}>+ Add new service</Button>
         </div>
      );
   }
}

export default Services;
