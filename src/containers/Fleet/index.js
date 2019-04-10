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
import { fleetListRequest, fleetAddRequest, getMatrixList } from "../../actions";
import { logger } from "../../helpers/Logger";
import Validator from "js-object-validation";
import { CreateFleetValidations, CreateFleetValidMessaages } from "../../validations";
class Fleet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: {},
      isLoading: false,
      openCreate: false
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
  }
  handleAddFleet = (fleetData) => {
    console.log("This is fleet data", fleetData);
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
      this.props.addFleet(fleetData)
    } catch (error) {
      logger(error);
    }
  }
  createUser = data => {
    logger(data);
  };
  render() {
    const { openCreate, error } = this.state;
    const { matrixListReducer } = this.props
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
            <FleetList userData="dasdsa" />
          </CardBody>
        </Card>
        <CrmFleetModal
          fleetModalOpen={openCreate}
          handleFleetModal={this.toggleCreateModal}
          handleAddFleet={this.handleAddFleet}
          errorMessage={error}
          matrixListReducerData={matrixListReducer}
        />
      </>
    );
  }
}

const mapStateToProps = state => ({
  matrixListReducer: state.matrixListReducer
});


const mapDispatchToProps = dispatch => ({
  getFleet: page => {
    dispatch(fleetListRequest({ page }));
  },
  addFleet: data => {
    dispatch(fleetAddRequest(data));
  },
  getMatrix: () => {
    dispatch(getMatrixList());
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Fleet);
