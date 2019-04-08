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
import { getUsersList, addNewUser } from "../../actions";

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
  onPageChange = page => {
    this.props.getUsers(page);
  };
  componentDidUpdate({ userReducer }) {
    if (
      this.props.userReducer.userData.isSuccess !==
      userReducer.userData.isSuccess
    ) {
      this.setState({
        openCreate: false
      });
    }
  }
  toggleCreateModal = e => {
    e.preventDefault();
    this.setState({
      openCreate: !this.state.openCreate
    });
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
