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
import { getCustomerList, addNewCustomer } from "../../actions";
import { logger } from "../../helpers/Logger";

class Fleet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openCreate: false
    };
  }
  componentDidMount() {
    this.props.getUsers(1);
  }
  toggleCreateModal = e => {
    e.preventDefault();
    this.setState({
      openCreate: !this.state.openCreate
    });
  };
  handleAddFleet = (fleetData) => {
    
  }
  createUser = data => {
    logger(data);
  };
  render() {
    const { openCreate } = this.state;
    const { userReducer} = this.props;
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
            <FleetList userData={userReducer} />
          </CardBody>
        </Card>
        <CrmFleetModal
          fleetModalOpen={openCreate}
          handleFleetModal={this.toggleCreateModal}
          handleAddFleet={this.handleAddFleet}
        />
      </>
    );
  }
}
const mapStateToProps = state => ({
  userReducer: state.usersReducer
});

const mapDispatchToProps = dispatch => ({
  getUsers: page => {
    dispatch(getCustomerList({ page }));
  },
  addCustomer: data => {
    dispatch(addNewCustomer(data));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Fleet);
