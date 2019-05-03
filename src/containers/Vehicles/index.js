import React, { Component } from "react";
import * as qs from "query-string";
import {
  Card,
  CardHeader,
  CardBody,
  Row,
  Col,
  Button,
  UncontrolledTooltip,
  UncontrolledAlert
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
  updateVehicleStatus,
  importVehicle
} from "../../actions";
import { isEqual } from "../../helpers/Object";
import CrmImportExcel from "../../components/common/CrmImportExcel";
import { logger } from "../../helpers/Logger";
import CrmExportSampleButton, {
  DemoSupportedSheets
} from "../../components/common/CrmExportSampleButton";

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
    logger(data);
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
  onImport = data => {
    this.props.importVehicles(data);
  };
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
                  <i className={"fa fa-automobile"} /> Vehicles List
                </h4>
              </Col>
              <Col sm={"6"} className={"text-right"}>
                <CrmExportSampleButton
                  sheetType={DemoSupportedSheets.VEHICLE}
                />{" "}
                &nbsp;
                <CrmImportExcel
                  modalHeaderText={"Import Vehicle data"}
                  onImport={this.onImport}
                  buttonText={"Import Vehicels"}
                >
                  {vehicleListReducer.importError ? (
                    <Row>
                      <Col sm={{ size: 8, offset: 2 }}>
                        <UncontrolledAlert color="danger">
                          <span
                            dangerouslySetInnerHTML={{
                              __html: vehicleListReducer.importError
                            }}
                          />
                        </UncontrolledAlert>
                      </Col>
                    </Row>
                  ) : null}
                </CrmImportExcel>
                &nbsp;&nbsp;
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
  },
  importVehicles: data => {
    dispatch(importVehicle(data));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Vehicles);
