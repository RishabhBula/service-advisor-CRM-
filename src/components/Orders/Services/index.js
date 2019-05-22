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
         serviceItem: [
            {
               serviceName: "Service item data!!"
            }
         ],
         selectedService: ''
      };
   }

   handleSeviceAdd = () => {
      const { serviceItem } = this.state;
      if (serviceItem) {
         this.setState((state, props) => {
            return {
               serviceItem: state.serviceItem.concat([
                  {
                     serviceName: "Service item data!!"
                  }
               ])
            };
         });
      }
   }

   handleRemoveService = index => {
      const { serviceItem } = this.state;
      let t = [...serviceItem];
      t.splice(index, 1);
      if (serviceItem.length) {
         this.setState({
            serviceItem: t
         });
      }
   };
   handleServiceModal = (serviceType) => {
      this.setState({
         selectedService: serviceType ? serviceType : ''
      })
   }
   handleOpenModal = () => {
      const { selectedService } = this.state;
      const {
         modelInfoReducer,
         modelOperate,
         getPartDetails,
         addPartToService,
         addInventoryPart
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
                     getPartDetails={getPartDetails}
                     addPartToService={addPartToService}
                     addInventoryPart={addInventoryPart}
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
      const { serviceItem, selectedService } = this.state
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
                  serviceItem={serviceItem}
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
