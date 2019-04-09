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
import { CrmCustomerModal } from "../../components/common/CrmCustomerModal";
import UsersList from "../../components/UsersList";
import { connect } from "react-redux";
import { getCustomerList, addNewCustomer, getMatrixList } from "../../actions";
import { logger } from "../../helpers/Logger";

class Users extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openCreate: false
    };
  }
  componentDidMount() {
    this.props.getUsers(1);    
    this.props.getMatrix();
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
    const { userReducer, addCustomer, matrixListReducer } = this.props;
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
          addCustomer={addCustomer}
          matrixListReducerData={matrixListReducer}
        />
      </>
    );
  }
}
const mapStateToProps = state => ({
  userReducer: state.usersReducer,
  matrixListReducer: state.matrixListReducer
});

const mapDispatchToProps = dispatch => ({
  getUsers: page => {
    dispatch(getCustomerList({ page }));
  },
  addCustomer: data => {
    dispatch(addNewCustomer(data));
  },
  getMatrix: () => {    
    dispatch(getMatrixList());
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Users);
