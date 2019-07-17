import React, { Component } from "react";
import { Card, CardBody, Row, Col } from "reactstrap";
import VehicleIcons from "../../../containers/Icons/Vehicles"
import { CrmVehicleModal } from "../../common/Vehicles/CrmVehicleModal";
export class CustomerVehicles extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  handleVehicleModal = () => {
    const { modelDetails } = this.props.modelInfoReducer;
    let data = {
      vehicleModel: !modelDetails.vehicleModel,
      vehicleEditModel: false
    };
    this.props.modelOperate(data);
  }
  submitCreateVehicle = data => {
    const payload = {
      ...data,
      isCustomerDetails: true,
      customerId: this.props.customerId
    }
    this.props.vehicleAddAction(payload);
  };
  render() {
    const { customerVehicles, modelInfoReducer } = this.props
    const { modelDetails } = modelInfoReducer;
    return (
      <>
        <Row>
          {
            customerVehicles ? customerVehicles.map((vehicle, index) => {
              return (
                <Col key={index} md={"4"}>
                  <Card>
                    <CardBody className={"d-flex justify-content-center cursor_pointer"}>
                      <div className={"vehicle-details"}></div>
                      <div className={""}>
                        <div>
                          <h5>{vehicle.year}{" "}{vehicle.make}{" "}{vehicle.modal}</h5>
                        </div>
                        <div className={"vehicle-type-img d-inline-block d-flex justify-content-center"}>
                          <VehicleIcons
                            type={vehicle.type.value}
                            color={vehicle.type.color}
                          />
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                </Col>
              )
            }) : null
          }
          <Col md={"4"}>
            <Card>
              <CardBody className={"d-flex justify-content-center add-vehicle cursor_pointer"}>
                <div onClick={this.handleVehicleModal}>
                  <div>
                    <h5><small><i className={"icon-plus icons"} /></small>{" "}Add new vehicle</h5>
                  </div>
                  <div className={"vehicle-type-img d-inline-block d-flex justify-content-center"}>
                    <VehicleIcons
                      type={"sedan"}
                    />
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <CrmVehicleModal
          vehicleModalOpen={modelDetails.vehicleModel}
          handleVehicleModal={this.handleVehicleModal}
          submitCreateVehicleFun={this.submitCreateVehicle}
        />
      </>
    );
  }
}
