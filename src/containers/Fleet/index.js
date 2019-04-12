import React, { Component } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Row,
  Col,
  Button,
  UncontrolledTooltip
} from "reactstrap";
import { CrmFleetModal } from "../../components/common/CrmFleetModal";
import { CrmFleetEditModal } from "../../components/common/CrmFleetEditModal";
import FleetList from "../../components/Fleet/FleetList";
import { connect } from "react-redux";
import {
  fleetListRequest,
  fleetAddRequest,
  getMatrixList,
  getRateStandardListRequest,
  setRateStandardListStart,
  deleteFleet,
  modelOpenRequest,
  fleetEditRequest
} from "../../actions";
import { logger } from "../../helpers/Logger";
import Validator from "js-object-validation";
import { CreateFleetValidations, CreateFleetValidMessaages } from "../../validations";
import * as qs from "query-string";
import { isEqual } from "../../helpers/Object";
class Fleet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: {},
      isLoading: false,
      fleetListData: [],
      openEdit: false,
      openCreate: false,
      fleetSingleData: {}
    };
  }
  toggleCreateModal = e => {
    e.preventDefault();
    this.setState({
      openCreate: !this.state.openCreate
    });
  };

  updateFleetModel = data => {
    this.setState({
      fleetSingleData: data
    })
  }
  toggleEditModal = fleetData => {
    this.setState({
      fleetSingleData: fleetData
    })
    const { modelDetails } = this.props.modelInfoReducer;
    let data = {
      fleetEditModel: false,
      fleetEditModel: !modelDetails.fleetEditModel,
    };
    this.props.modelOperate(data);
  }


  onTypeHeadStdFun = (data) => {
    this.props.getStdList(data);
  }
  onPageChange = page => {
    const { location } = this.props;
    const { search, pathname } = location;
    const query = qs.parse(search);
    this.props.redirectTo(
      [pathname, qs.stringify({ ...query, page })].join("?")
    );
  };
  componentDidMount() {
    this.props.getMatrix();
    const query = qs.parse(this.props.location.search);
    this.props.getFleet({ ...query, page: query.page || 1 })
    this.props.getStdList();
  }
  componentDidUpdate = ({ fleetReducer, location }) => {
    if (
      this.props.fleetReducer.fleetListData.isSuccess !==
      fleetReducer.fleetListData.isSuccess
    ) {
      this.props.getFleet()
    }
    if (
      this.props.fleetReducer.fleetListData.isEditSuccess !==
      fleetReducer.fleetListData.isEditSuccess
    ) {
      this.setState({
        openEdit: !this.state.openEdit
      });
    }
    const prevQuery = qs.parse(location.search);
    const currQuery = qs.parse(this.props.location.search);
    if (!isEqual(prevQuery, currQuery)) {
      const data = {
        ...currQuery,
        page: currQuery.page || 1
      }
      this.props.getFleet(data);
    }
  }
  onSearch = data => {
    const { location } = this.props;
    const { pathname } = location;
    this.props.redirectTo([pathname, qs.stringify(data)].join("?"));
  };
  handleEditFleet = (fleetData, fleetId) => {
    this.setState({
      error: {}
    });
    try {
      const { isValid, errors } = Validator(
        fleetData,
        CreateFleetValidations,
        CreateFleetValidMessaages
      );
      if (!isValid && ((fleetData.email !== '') || (fleetData.companyName === ''))) {
        this.setState({
          error: errors,
          isLoading: false,
        });
        return;
      }
      const userData = this.props.profileInfoReducer.profileInfo
      const userId = userData._id
      const parentId = userData.parentId
      const data = {
        fleetData: fleetData,
        userId: userId,
        parentId: parentId,
        fleetId: fleetId
      }
      this.props.updateFleet(data)
      const { modelDetails } = this.props.modelInfoReducer;
      let modaldata = {
        fleetEditModel: true,
        fleetEditModel: !modelDetails.fleetEditModel,
      };
      this.props.modelOperate(modaldata)
    } catch (error) {
      logger(error);
    }
  }
  handleAddFleet = (fleetData, isEditMode) => {
    this.setState({
      error: {}
    });
    try {
      const { isValid, errors } = Validator(
        fleetData,
        CreateFleetValidations,
        CreateFleetValidMessaages
      );
      if (!isValid && ((fleetData.email !== '') || (fleetData.companyName === ''))) {
        this.setState({
          error: errors,
          isLoading: false,
        });
        return;
      }
      const userData = this.props.profileInfoReducer.profileInfo
      const userId = userData._id
      const parentId = userData.parentId
      const data = {
        fleetData: fleetData,
        userId: userId,
        parentId: parentId
      }
      if (!isEditMode) {
        this.props.addFleet(data)
      } else {
        this.props.updateFleet(data)
      }
      this.setState({
        openCreate: !this.state.openCreate
      })
    } catch (error) {
      logger(error);
    }
  }
  setDefaultRate = value => {
    this.props.setLabourRateDefault(value);
  }
  deleteFleet = fleetId => {
    const { location } = this.props;
    const { search } = location;
    const query = qs.parse(search);
    const data = {
      ...query,
      fleetId: fleetId,
    }
    this.props.deleteFleet(data);
  };
  render() {
    const { openCreate, error, openEdit, fleetSingleData } = this.state;
    const { matrixListReducer, profileInfoReducer, fleetReducer, rateStandardListReducer } = this.props;
    const { modelDetails } = this.props.modelInfoReducer;
    return (
      <>
        <Card>
          <CardHeader>
            <Row>
              <Col sm={"6"} className={"pull-left"}>
                <h4>
                  <i className={"fa fa-users"} /> Fleet List
                </h4>
              </Col>
              <Col sm={"6"} className={"text-right"}>
                <Button
                  color="primary"
                  id="add-user"
                  onClick={this.toggleCreateModal}
                >
                  <i className={"fa fa-plus"} />
                  &nbsp; Add New
                </Button>
                <UncontrolledTooltip target={"add-user"}>
                  Add New Fleet
                </UncontrolledTooltip>
              </Col>
            </Row>
          </CardHeader>
          <CardBody>
            <FleetList
              fleetListData={fleetReducer}
              handleEditFleet={this.handleEditFleet}
              updateFleetModel={this.toggleEditModal}
              onSearch={this.onSearch}
              onPageChange={this.onPageChange}
              onDelete={this.deleteFleet}
              openEdit={openEdit} />
          </CardBody>
        </Card>
        <CrmFleetModal
          fleetModalOpen={openCreate}
          handleFleetModal={this.toggleCreateModal}
          handleAddFleet={this.handleAddFleet}
          errorMessage={error}
          onTypeHeadStdFun={this.onTypeHeadStdFun}
          setDefaultRate={this.setDefaultRate}
          rateStandardListData={rateStandardListReducer}
          profileInfoReducer={profileInfoReducer}
          matrixListReducerData={matrixListReducer}
        />
        <CrmFleetEditModal
          onTypeHeadStdFun={this.onTypeHeadStdFun}
          setDefaultRate={this.setDefaultRate}
          handleEditFleet={this.handleEditFleet}
          rateStandardListData={rateStandardListReducer}
          profileInfoReducer={profileInfoReducer}
          matrixListReducerData={matrixListReducer}
          updateFleetModel={this.updateFleetModel}
          fleetSingleData={fleetSingleData}
          handleFleetModal={this.toggleEditModal}
          fleetEditModalOpen={modelDetails.fleetEditModel}
        />
      </>
    );
  }
}

const mapStateToProps = state => ({
  profileInfoReducer: state.profileInfoReducer,
  matrixListReducer: state.matrixListReducer,
  fleetReducer: state.fleetReducer,
  rateStandardListReducer: state.rateStandardListReducer,
  modelInfoReducer: state.modelInfoReducer
});


const mapDispatchToProps = dispatch => ({
  getFleet: (data) => {
    dispatch(fleetListRequest(data));
  },
  addFleet: data => {
    dispatch(fleetAddRequest(data));
  },
  getMatrix: () => {
    dispatch(getMatrixList());
  },
  getStdList: () => {
    dispatch(getRateStandardListRequest());
  },
  setLabourRateDefault: (data) => {
    dispatch(setRateStandardListStart(data));
  },
  deleteFleet: data => {
    dispatch(deleteFleet(data));
  },
  modelOperate: (data) => {
    dispatch(modelOpenRequest({ modelDetails: data }));
  },
  updateFleet: (data) => {
    dispatch(fleetEditRequest(data))
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Fleet);
