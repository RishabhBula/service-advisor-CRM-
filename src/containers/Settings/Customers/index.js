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
import { CrmCustomerModal } from "../../../components/common/CrmCustomerModal";
import UsersList from "../../../components/UsersList";
import { connect } from "react-redux";
import { getUsersList, addNewUser } from "../../../actions";
import { logger } from "../../../helpers/Logger";

class Users extends Component {
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
  createUser = data => {
    logger(data);
  };
  render() {
    const { openCreate } = this.state;
    const { userReducer, addUser } = this.props;
    return (
      <>
        <Card>
          <CardHeader>
            <Row>
              <Col sm={"6"} className={"pull-left"}>
                <h4>
                  <i className={"fa fa-users"} /> Customer List
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
                  Add New Customer
                </UncontrolledTooltip>
              </Col>
            </Row>
          </CardHeader>
          <CardBody>
            <UsersList userData={userReducer} />
          </CardBody>
        </Card>
        <CrmCustomerModal
          customerModalOpen={openCreate}
          handleCustomerModal={this.toggleCreateModal}
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
    dispatch(getUsersList({ page }));
  },
  addUser: data => {
    dispatch(addNewUser(data));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Users);
