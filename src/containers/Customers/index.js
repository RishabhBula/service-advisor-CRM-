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
import CustomerList from "../../components/Customer/CustomerList";
import { connect } from "react-redux";
import { customerAddRequest, getMatrixList, modelOpenRequest } from "../../actions";
import { logger } from "../../helpers/Logger";

class Users extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openCreate: false
    };
  }
  componentDidMount() { 
    this.props.getMatrix();
    const { modelDetails } = this.props.modelInfoReducer;
  }
  toggleCreateModal = e => {
    const { modelDetails } = this.props.modelInfoReducer;
    let data = {
      customerModel: !modelDetails.customerModel
    };
    this.props.modelOperate(data);
  };
  createUser = data => {
    logger(data);
  };
  render() {
    const { openCreate } = this.state;
    const { userReducer, addCustomer, matrixListReducer } = this.props;
    const { modelDetails } = this.props.modelInfoReducer;
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
            <CustomerList 
            userData={userReducer} />
          </CardBody>
        </Card>
        <CrmCustomerModal
          customerModalOpen={modelDetails.customerModel}
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
  matrixListReducer: state.matrixListReducer,
  modelInfoReducer: state.modelInfoReducer
});

const mapDispatchToProps = dispatch => ({ 
  addCustomer: data => {
    dispatch(customerAddRequest(data));
  },
  getMatrix: () => {    
    dispatch(getMatrixList());
  },
  modelOperate: (data) => {    
    dispatch(modelOpenRequest({modelDetails: data}));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Users);
