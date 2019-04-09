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
import { CrmUserModal } from "../../components/common/CrmUserModal";
import UsersList from "../../components/UsersList";
import { connect } from "react-redux";
import { getUsersList, addNewUser, deleteUser } from "../../actions";
import * as qs from "query-string";
import { isEqual } from "../../helpers/Object";
class Users extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openCreate: false
    };
  }
  componentDidMount() {
    const query = qs.parse(this.props.location.search);
    this.props.getUsers({ ...query, page: query.page || 1 });
  }
  onPageChange = page => {
    const { location } = this.props;
    const { search, pathname } = location;
    const query = qs.parse(search);
    this.props.redirectTo(
      [pathname, qs.stringify({ ...query, page })].join("?")
    );
  };
  componentDidUpdate({ userReducer, location }) {
    if (
      this.props.userReducer.userData.isSuccess !==
      userReducer.userData.isSuccess
    ) {
      this.setState({
        openCreate: false
      });
      const query = qs.parse(this.props.location.search);
      this.props.getUsers({ ...query, page: query.page || 1 });
    }
    const prevQuery = qs.parse(location.search);
    const currQuery = qs.parse(this.props.location.search);
    if (!isEqual(prevQuery, currQuery)) {
      this.props.getUsers({ ...currQuery, page: currQuery.page || 1 });
    }
  }
  toggleCreateModal = e => {
    e.preventDefault();
    this.setState({
      openCreate: !this.state.openCreate
    });
  };
  onSearch = data => {
    const { location } = this.props;
    const { pathname } = location;
    this.props.redirectTo([pathname, qs.stringify(data)].join("?"));
  };
  deleteUser = userId => {
    const { location } = this.props;
    const { search } = location;
    const query = qs.parse(search);
    this.props.deleteUser({ ...query, userId });
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
                  <i className={"fa fa-users"} /> Staff Members
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
                  Add New Staff Member
                </UncontrolledTooltip>
              </Col>
            </Row>
          </CardHeader>
          <CardBody>
            <UsersList
              userData={userReducer}
              onPageChange={this.onPageChange}
              onSearch={this.onSearch}
              onDelete={this.deleteUser}
            />
          </CardBody>
        </Card>
        <CrmUserModal
          userModalOpen={openCreate}
          handleUserModal={this.toggleCreateModal}
          addUser={addUser}
        />
      </>
    );
  }
}
const mapStateToProps = state => ({
  userReducer: state.usersReducer
});

const mapDispatchToProps = dispatch => ({
  getUsers: data => {
    dispatch(getUsersList(data));
  },
  addUser: data => {
    dispatch(addNewUser(data));
  },
  deleteUser: data => {
    dispatch(deleteUser(data));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Users);
