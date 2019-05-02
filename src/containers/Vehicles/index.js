import React, { Component } from "react";
import * as qs from "query-string";
import {
  Card,
  CardBody,
  Button,
  UncontrolledTooltip
} from "reactstrap";
import { connect } from "react-redux";
import { CrmVehicleModal } from "../../components/common/Vehicles/CrmVehicleModal";
import { CrmEditVehicleModal } from "../../components/common/Vehicles/CrmEditVehicleModal";
import VehicleList from "../../components/Vehicles/VehiclesList";
import {
  modelOpenRequest,
  vehicleAddRequest,
  vehicleGetRequest,
  vehicleEditRequest,
  deleteVehicle,
  updateVehicleStatus
} from "../../actions";
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

  componentDidUpdate({ location, modelInfoReducer }) {
    const prevQuery = qs.parse(location.search);
    const currQuery = qs.parse(this.props.location.search);
    if (!isEqual(prevQuery, currQuery)) {
      this.props.getVehicleList({ ...currQuery, page: currQuery.page || 1 });
    }
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

  deleteVehicle = vehicleId => {
    const { location } = this.props;
    const { search } = location;
    const query = qs.parse(search);
    this.props.deleteVehicle({ ...query, vehicleId });
  };

  onStatusUpdate = data => {
    const { location } = this.props;
    const { search } = location;
    const query = qs.parse(search);
    this.props.onStatusUpdate({ ...query, ...data });
  };

  onSearch = data => {
    const { location } = this.props;
    const { pathname } = location;
    this.props.redirectTo([pathname, qs.stringify(data)].join("?"));
  };

  onPageChange = page => {
    const { location } = this.props;
    const { search, pathname } = location;
    const query = qs.parse(search);
    this.props.redirectTo(
      [pathname, qs.stringify({ ...query, page })].join("?")
    );
  };

  render() {
    const { modelDetails } = this.props.modelInfoReducer;
    const { vehicleListReducer } = this.props;
    const { vehicleData } = this.state;
    return (
      <>
        <Card className={"white-card"}>
          <CardBody className={"custom-card-body position-relative"}>
              <div className={"text-right invt-add-btn-block"}>
                <Button
                  color="primary"
                  id="add-user"
                  onClick={this.toggleCreateVehicle}
                >
                  <i className={"fa fa-plus"} />
                  &nbsp; Add New Vehicle
                </Button>
                <UncontrolledTooltip target={"add-user"}>
                  Add New Vehicle
                </UncontrolledTooltip>
              </div>
            <VehicleList
              vehicleData={vehicleListReducer}
              onSearch={this.onSearch}
              onPageChange={this.onPageChange}
              updateModel={this.toggleUpdateVehicle}
              onDelete={this.deleteVehicle}
              onStatusUpdate={this.onStatusUpdate}
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
  vehicleListReducer: state.vehicleListReducer
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
  },
  onStatusUpdate: data => {
    dispatch(updateVehicleStatus(data));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Vehicles);
