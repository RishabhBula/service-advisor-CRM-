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
import { connect } from "react-redux";
import {
  CrmVehicleModal,
} from "../../components/common/Vehicles/CrmVehicleModal";
import { CrmEditVehicleModal } from "../../components/common/Vehicles/CrmEditVehicleModal";
import { CrmEditCustomerModal } from "../../components/common/CrmEditCustomerModal";
import VehicleList from "../../components/Vehicles/VehiclesList";
import {
  modelOpenRequest,
  vehicleAddRequest,
  vehicleGetRequest,
  vehicleEditRequest,
  deleteVehicle
} from "../../actions";
import { logger } from "../../helpers/Logger";
import { isEqual } from "../../helpers/Object";

class Vehicles extends Component {
  constructor(props) {
    super(props);
    this.state = {
      vehicleData: {},
      vehicleId: ""
    };
  }

  componentDidMount() {
    const query = qs.parse(this.props.location.search);
    this.props.getVehicleList({ ...query, page: query.page || 1 });
  }

  toggleCreateVehicle = () => {
    const { modelDetails } = this.props.modelInfoReducer;
    let data = {
      vehicleModel: !modelDetails.vehicleModel,
      vehicleEditModel: false
    };
    this.props.modelOperate(data);
  };

  submitCreateVehicle = data => {
    this.props.vehicleAddAction(data);
  };

  toggleUpdateVehicle = dataValue => {
    this.setState({
      vehicleData: dataValue,
      vehicleId: dataValue._id
    });
    const { modelDetails } = this.props.modelInfoReducer;
    let data = {
      vehicleModel: false,
      vehicleEditModel: !modelDetails.vehicleEditModel
    };
    this.props.modelOperate(data);
  };

  toggleEditVehicle = dataValue => {
    this.setState({
      vehicleData: {},
      vehicleId: ""
    });
    const { modelDetails } = this.props.modelInfoReducer;
    let data = {
      vehicleModel: false,
      vehicleEditModel: !modelDetails.vehicleEditModel
    };
    this.props.modelOperate(data);
  };

  submitUpdateVehicle = dataValue => {
    dataValue.vehicleId = this.state.vehicleId;
    this.props.editVehicleAction(dataValue);
  };

  deleteVehicle = (vehicleId) => {
    const { location } = this.props;
    const { search } = location;
    const query = qs.parse(search);
    this.props.deleteVehicle({ ...query, vehicleId });
  }

  render() {
    const { modelDetails } = this.props.modelInfoReducer;
    const { vehicleListReducer } = this.props;
    const { vehicleData } = this.state;
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
            <VehicleList
              vehicleData={vehicleListReducer}
              onSearch={this.onSearch}
              onPageChange={this.onPageChange}
              onDelete={this.deleteVehicle}
              updateModel={this.toggleUpdateVehicle}
            />
          </CardBody>
        </Card>
        <CrmVehicleModal
          vehicleModalOpen={modelDetails.vehicleModel}
          handleVehicleModal={this.toggleCreateVehicle}
          submitCreateVehicleFun={this.submitCreateVehicle}
        />
        <CrmEditVehicleModal
          vehicleEditModalOpen={modelDetails.vehicleEditModel}
          handleEditVehicleModal={this.toggleEditVehicle}
          submitUpdateVehicleFun={this.submitUpdateVehicle}
          vehicleData={vehicleData}
        />
      </>
    );
  }
}
const mapStateToProps = state => ({
  profileInfoReducer: state.profileInfoReducer,
  modelInfoReducer: state.modelInfoReducer,
  vehicleListReducer: state.vehicleListReducer,
});

const mapDispatchToProps = dispatch => ({
  modelOperate: data => {
    dispatch(modelOpenRequest({ modelDetails: data }));
  },
  vehicleAddAction: data => {
    dispatch(vehicleAddRequest(data));
  },
  getVehicleList: data => {
    dispatch(vehicleGetRequest(data));
  },
  editVehicleAction: data => {
    dispatch(vehicleEditRequest(data));
  },
  deleteVehicle: data => {
    dispatch(deleteVehicle(data));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Vehicles);