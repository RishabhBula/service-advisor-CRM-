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
import { CrmUserModal } from "../../../components/common/CrmUserModal";

class Users extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openCreate: false
    };
  }
  toggleCreateModal = e => {
    e.preventDefault();
    this.setState({
      openCreate: !this.state.openCreate
    });
  };
  createUser = data => {
    console.log(data);
  };
  render() {
    const { openCreate } = this.state;
    return (
      <>
        <Card>
          <CardHeader>
            <Row>
              <Col sm={"6"} className={"pull-left"}>
                <h4>
                  <i className={"fa fa-users"} /> Users
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
                  Add New User
                </UncontrolledTooltip>
              </Col>
            </Row>
          </CardHeader>
          <CardBody>Test</CardBody>
        </Card>
        <CrmUserModal
          userModalOpen={openCreate}
          handleUserModal={this.toggleCreateModal}
          onCreate={this.createUser}
        />
      </>
    );
  }
}

export default Users;
