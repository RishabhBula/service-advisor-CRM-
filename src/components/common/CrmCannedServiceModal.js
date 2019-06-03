import React, { Component } from "react";
import {
   Modal,
   ModalBody,
   ModalHeader,
   Col,
   FormGroup,
   Label,
   Button,
   Input
} from "reactstrap";
import Async from "react-select/lib/Async";
import NoDataFound from "./NoFound";
import { logger } from "../../helpers";

export class CrmCannedServiceModal extends Component {
   constructor(props) {
      super(props);
      this.state = {
         serviceId: "",
         serviceData: [],
         serviceIndex: -1,
         isToggelOpen: false,
      };
   }
   componentDidUpdate = ({ serviceReducers }) => {
      if (serviceReducers && (serviceReducers !== this.props.serviceReducers)) {
         const {
            cannedServiceList
         } = this.props.serviceReducers
         this.setState({
            serviceData: cannedServiceList
         })
      }
   }
   handleAddCannedService = (e) => {
      if (e && e.value) {
         this.setState({
            serviceId: e,
            serviceData: [e.serviceData]
         })
      } else {
         this.setState({
            serviceId: "",
         })
         this.props.getCannedServiceList()
      }
   }
   searchCannedServices = (input, callback) => {
      this.props.getCannedServiceList({ input, callback });
   }
   handleServiceCollaps = (index) => {
      const { serviceIndex } = this.state
      if (serviceIndex === index) {
         this.setState({
            serviceIndex: -1,
            isToggelOpen: false
         })
      } else {
         this.setState({
            serviceIndex: index,
            isToggelOpen: true
         })
      }
   }
   handleAddToService = (service, index) => {
      const ServiceData = [...this.state.serviceData]
      ServiceData[index].isCannedAdded = true
      this.setState({
         serviceData: ServiceData
      })
      this.props.handleAddToService(service)
   }
   handleServiceItems = (e, serviceItem, index, sIndex) => {
      const { value } = e.target
      const ServiceData = [...this.state.serviceData]
      var bool_value = value === "true" ? false : true
      ServiceData[index].serviceItems[sIndex].isItemChecked = bool_value
      this.setState({
         serviceData: ServiceData
      }, () => {
         if (serviceItem && !serviceItem.isItemChecked) {
            const ServiceData = [...this.state.serviceData]
            ServiceData[index].serviceItems.splice(sIndex, 1)
            this.setState({
               serviceData: ServiceData
            })
         }
      })

   }
   render() {
      const { openCannedService, handleCannedServiceModal } = this.props
      const { serviceId, serviceData, serviceIndex, isToggelOpen } = this.state
      logger(serviceData)
      return (
         <>
            <Modal
               isOpen={openCannedService}
               toggle={handleCannedServiceModal}
               className='customer-modal custom-form-modal custom-modal-lg'
               backdrop={"static"}
            >
               <ModalHeader toggle={handleCannedServiceModal}>Canned Services</ModalHeader>
               <ModalBody>
                  <Col md={"12"}>
                     <FormGroup className={"fleet-block"}>
                        <Label htmlFor="name" className="customer-modal-text-style">
                           Search Canned Services
                        </Label>
                        <div className={"input-block"}>
                           <Async
                              placeholder={"Type to select Service from the list"}
                              loadOptions={this.searchCannedServices}
                              className="w-100 form-select"
                              value={serviceId}
                              onChange={e => {
                                 this.handleAddCannedService(e)
                              }}
                              isClearable={true}
                              noOptionsMessage={() => "Type Canned Service name"
                              }
                           />
                        </div>
                     </FormGroup>
                  </Col>
                  <div className={"table matrix-table d-flex flex-column"}>
                     <div className={"p-2 mb-0 border-secondary border d-flex justify-content-between"}>
                        <span width="250" className={"text-center"}>SERVICE NAME</span>
                        <span width="250" className={"text-center"}>Action</span>
                     </div>
                     <div>
                        {
                           serviceData && serviceData.length ?
                              serviceData.map((item, index) => {
                                 return (
                                    <>
                                       <div key={index} onClick={() => this.handleServiceCollaps(index)} className={"p-2 pl-5 mb-0 border-secondary border position-relative arrow-icon"}>
                                          {
                                             item.serviceItems && item.serviceItems.length ?
                                                isToggelOpen && (serviceIndex === index) ? <i className="icons icon-arrow-up arrow ml-2"></i> : <i className="icons arrow icon-arrow-down ml-2"></i> : null
                                          }
                                          <div className={"d-flex justify-content-between"}>
                                             <span>{item.serviceName}</span>
                                             <span><Button color={"primary"} disabled={item.isCannedAdded} className={"btn btn-round"} onClick={() => this.handleAddToService(item, index)}>
                                             {
                                                item.isCannedAdded ?
                                                <>Service Added <i className={"fa fa-check"} /></>
                                                 : "Add to service"
                                             }
                                             </Button></span>
                                          </div>
                                       </div>
                                       {
                                          item.serviceItems && item.serviceItems.length && (serviceIndex === index) && isToggelOpen ?
                                             item.serviceItems.map((serviceItem, sIndex) => {
                                                return (
                                                   <div className={"pl-3 p-2 mb-0 border-secondary border d-flex justify-content-between"}>
                                                      <Input type="checkbox" checked={serviceItem.isItemChecked} value={serviceItem.isItemChecked} onChange={(e) => this.handleServiceItems(e, serviceItem, index, sIndex)} className={"ml-0"} />
                                                      <span className={"pl-3"}>{serviceItem.description || serviceItem.brandName || serviceItem.discription || '-'}</span>
                                                   </div>
                                                )
                                             }) : null
                                       }
                                    </>
                                 )
                              }) :
                              <div>
                                 <div className={"text-center"} colSpan={12}>
                                    <NoDataFound showAddButton={false} message={"Currently there are no Canned Service added."} />
                                 </div>
                              </div>
                        }
                     </div>
                  </div>
               </ModalBody>
            </Modal>
         </>
      );
   }
}
