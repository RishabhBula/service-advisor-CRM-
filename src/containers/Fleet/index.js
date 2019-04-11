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
import FleetList from "../../components/Fleet/FleetList";
import { connect } from "react-redux";
import { fleetListRequest, fleetAddRequest, getMatrixList, getRateStandardListRequest, setRateStandardListStart } from "../../actions";
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
    };
  }
  toggleCreateModal = e => {
    e.preventDefault();
    this.setState({
      openCreate: !this.state.openCreate
    });
  };
  componentDidMount() {
    this.props.getMatrix();
    const userData = this.props.profileInfoReducer.profileInfo
    const data = {
      userId: userData._id
    }
    this.props.getFleet(data)
    this.props.getStdList();
  }
  componentDidUpdate = ({ fleetReducer, location }) => {
    const userData = this.props.profileInfoReducer.profileInfo
    if (
      this.props.fleetReducer.fleetListData.isSuccess !==
      fleetReducer.fleetListData.isSuccess
    ) {
      this.props.getFleet(userData._id)
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
        userId: userData._id,
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
  render() {
    const { openCreate, error, openEdit } = this.state;
    const { matrixListReducer, profileInfoReducer, fleetReducer, rateStandardListReducer } = this.props
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
              onUpdate={this.props.updateFleet}
              onSearch={this.onSearch}
              openEdit={openEdit} />
          </CardBody>
        </Card>
        <CrmFleetModal
          fleetModalOpen={openCreate}
          handleFleetModal={this.toggleCreateModal}
          handleAddFleet={this.handleAddFleet}
          errorMessage={error}
          setDefaultRate={this.setDefaultRate}
          rateStandardListData={rateStandardListReducer}
          profileInfoReducer={profileInfoReducer}
          matrixListReducerData={matrixListReducer}
        />
      </>
    );
  }
}

const mapStateToProps = state => ({
  profileInfoReducer: state.profileInfoReducer,
  matrixListReducer: state.matrixListReducer,
  fleetReducer: state.fleetReducer,
  rateStandardListReducer: state.rateStandardListReducer
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
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Fleet);
