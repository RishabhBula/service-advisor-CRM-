import React, { Component } from "react";
import {
  Card,
  Col,
  Input,
  FormGroup,
  Row,
  Label,
  Button
} from "reactstrap";
import NoDataFound from "../../common/NoFound";

class ServiceItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addNote: false,
      noteIndex: -1
    };
  }
  handleServiceModalOpenAdd = async (index, serviceType) => {
    let modelDetails = {};
    switch (serviceType) {
      case 'part':
        modelDetails = {
          partAddModalOpen: true
        };
        break;
      case 'tire':
        modelDetails = {
          tireAddModalOpen: true
        };
        break;
      case 'labor':
        modelDetails = {
          tireAddModalOpen: true
        };
        break;
      default:
        break;
    }
    await this.props.modelOperate(modelDetails);
    this.props.handleServiceModal(serviceType, index)
  }
  render() {
    const { addNote, noteIndex } = this.state
    const {
      services,
      serviceData,
      handleRemoveService,
      serviceReducers
    } = this.props
    return (
      <>
        <div>
          {
            services && services.length ? services.map((item, index) => {
              return (
                <>
                  <Card className={"service-card"}>
                    <div className={"custom-form-modal mt-3"}>
                      <Row>
                        <Col md={"6"}>
                          <FormGroup>
                            <Label htmlFor="name" className="customer-modal-text-style">
                              Service name <span className={"asteric"}>*</span>
                            </Label>
                            <Input value={item.name} />
                          </FormGroup>
                        </Col>
                        <Col md={"6"}>
                          <FormGroup>
                            <Label htmlFor="name" className="customer-modal-text-style">
                              Technician
                          </Label>
                            <Input />
                          </FormGroup>
                        </Col>
                      </Row>
                      <Col md="12">
                        <FormGroup>
                          {
                            addNote && noteIndex === index ?
                              <>
                                <Label htmlFor="name" className="customer-modal-text-style">
                                  Note
                                </Label>
                                <Input type={"textarea"} rows={"2"} cols={"3"} />
                              </>
                              :
                              <Label onClick={() => this.setState({
                                addNote: true,
                                noteIndex: index
                              })}>Add Note</Label>

                          }
                        </FormGroup>
                      </Col>
                      <table className={"table matrix-table"}>
                        <thead>
                          <tr>
                            <th width="250" className={"text-center"}>DESCRIPTION</th>
                            <th width="250" className={"text-center"}>PRICE</th>
                            <th width="250" className={"text-center"}>QTY</th>
                            <th width="250" className={"text-center"}>HRS</th>
                            <th width="250" className={"text-center"}>DISC</th>
                            <th width="250" className={"text-center"}>SUBTOTAL</th>
                            <th width="250" className={"text-center"}>STATUS</th>
                          </tr>
                        </thead>
                        <tbody>
                          {
                            serviceReducers.services[index] && serviceReducers.services[index].serviceItems.length ?
                              serviceReducers.services[index].serviceItems.map((service, sIndex) => {
                                console.log("************************", service)
                                return (
                                  <tr>
                                    <td>{service.description}</td>
                                    <td>{service.cost}</td>
                                    <td>{service.quantity}</td>
                                    <td>{service.hours || '-'}</td>
                                  </tr>
                                )
                              }) :
                              <tr>
                                <td className={"text-center"} colSpan={12}>
                                  <NoDataFound showAddButton={false} message={"Currently there are no Service details added."} />
                                </td>
                              </tr>
                          }
                        </tbody>
                      </table>
                      <div className={"p-4"}>
                        <Button
                          className={"mr-2"}
                          onClick={() => this.handleServiceModalOpenAdd(index, 'part')}>
                          Add Part
                        </Button>
                        <Button className={"mr-2"} onClick={() => this.handleServiceModalOpenAdd(index, 'tire')} >Add Tire</Button>
                        <Button className={"mr-2"} onClick={() => this.handleServiceModalOpenAdd(index, 'labor')}>Add Labor</Button>
                        <Button className={"mr-2"} onClick={() => this.handleServiceModalOpenAdd(index, 'subContract')}>Add Subcontract</Button>
                      </div>

                      <Button
                        className="btn-sm btn btn-danger remove-tire-btn"
                        onClick={() => handleRemoveService(index)}
                      >
                        <i className="fas fa-times" />
                      </Button>
                    </div>
                  </Card>
                </>
              )
            }) : null
          }
        </div>
      </>
    );
  }
}

export default ServiceItem;
