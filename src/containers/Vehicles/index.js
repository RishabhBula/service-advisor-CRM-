import React, { Component } from "react";
import * as qs from "query-string";
import {
  Card,
  CardHeader,
  CardBody,
  Row,
  Col,
  Button,
  UncontrolledTooltip
} from "reactstrap";
import { CrmVehicleModal } from '../../components/common/Vehicles/CrmVehicleModal'
import { CrmEditCustomerModal } from "../../components/common/CrmEditCustomerModal";
import CustomerList from "../../components/Customer/CustomerList";
import { connect } from "react-redux";
import { customerAddRequest, getMatrixList, modelOpenRequest, customerGetRequest,deleteCustomer, getRateStandardListRequest, setRateStandardListStart, customerEditRequest } from "../../actions";
import { logger } from "../../helpers/Logger";
import { isEqual } from "../../helpers/Object";

class Vehicles extends Component {
  constructor(props) {
    super(props);
    this.state = {
      vehicle: {},
    };
  }

  toggleCreateVehicle = () => {
    const { modelDetails } = this.props.modelInfoReducer;
    let data = {
      vehicleModel: !modelDetails.vehicleModel
    };
    this.props.modelOperate(data);
  }

  handleVehicleModal = () => {
  }
  

  render() {
   const { modelDetails } = this.props.modelInfoReducer;
    return (
      <>
        <Card>
          <CardHeader>
            <Row>
              <Col sm={"6"} className={"pull-left"}>
                <h4>
                  <i className={"fa fa-users"} /> Vehicles List
                </h4>
              </Col>
              <Col sm={"6"} className={"text-right"}>
                <Button
                  color="primary"
                  id="add-user"
                  onClick={this.toggleCreateVehicle}
                >
                  <i className={"fa fa-plus"} />
                  &nbsp; Add New
                </Button>
                <UncontrolledTooltip target={"add-user"}>
                  Add New Vehicles
                </UncontrolledTooltip>
              </Col>
            </Row>
          </CardHeader>
          <CardBody>
           
          </CardBody>
        </Card>
        <CrmVehicleModal 
          vehicleModalOpen={modelDetails.vehicleModel}
          handleVehicleModal={this.toggleCreateVehicle} />
        
      </>
    );
  }
}
const mapStateToProps = state => ({
  profileInfoReducer: state.profileInfoReducer,
  modelInfoReducer: state.modelInfoReducer,
});

const mapDispatchToProps = dispatch => ({ 
  modelOperate: (data) => {  
    dispatch(modelOpenRequest({modelDetails: data}));
  },

});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Vehicles);