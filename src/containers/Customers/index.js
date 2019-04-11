import React, { Component } from "react";
import * as qs from "query-string";
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
import { customerAddRequest, getMatrixList, modelOpenRequest, customerGetRequest,deleteCustomer, getRateStandardListRequest } from "../../actions";
import { logger } from "../../helpers/Logger";
import { isEqual } from "../../helpers/Object";

class Users extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openCreate: false,
      customer: {},
      editMode: false
    };
  }
  componentDidMount() { 
    this.props.getMatrix();
    const query = qs.parse(this.props.location.search);
    this.props.getCustomerList({ ...query, page: query.page || 1 });
    this.props.getStdList();
  }

  componentDidUpdate({location }) {
    const prevQuery = qs.parse(location.search);
    const currQuery = qs.parse(this.props.location.search);
    if (!isEqual(prevQuery, currQuery)) {
      this.props.getCustomerList({ ...currQuery, page: currQuery.page || 1 });
    }
  }
  toggleCreateModal = e => {
    this.setState({editMode: false, customer: {}}, () => {
      const { modelDetails } = this.props.modelInfoReducer;
      let data = {
        customerModel: !modelDetails.customerModel
      };
      this.props.modelOperate(data);
    });
  };

  toggleUpdateModal = (customer) => {
    this.setState({editMode: true, customer: customer},() => {
      const { modelDetails } = this.props.modelInfoReducer;
      let data = {
        customerModel: !modelDetails.customerModel
      };
      this.props.modelOperate(data);
    });
  }
  createUser = data => {
    logger(data);
  };

  onSearch = (data) => {
    const { location } = this.props;
    const { pathname } = location;
    this.props.redirectTo([pathname, qs.stringify(data)].join("?"));
  }

  onPageChange = page => {
    const { location } = this.props;
    const { search, pathname } = location;
    const query = qs.parse(search);
    this.props.redirectTo(
      [pathname, qs.stringify({ ...query, page })].join("?")
    );
  };

  deleteCustomer = userId => {
    const { location } = this.props;
    const { search } = location;
    const query = qs.parse(search);
    this.props.deleteCustomer({ ...query, userId });
  };

  addCustomer = (data, editMode) => {
    if(editMode) {
      console.log('====================================');
      console.log("update will run here");
      console.log('====================================');
    }
    else {
      this.props.addCustomer(data);
      this.props.getCustomerList();
      this.onSearch({});
      this.setState({customer: {}, editMode: false})
    }
  }

  onTypeHeadStdFun = (data) => {
    this.props.getStdList(data);
  }

  onStdAdd = () => {
    this.props.getStdList();
  }

  render() {
    const { openCreate, editMode, customer } = this.state;
    const { userReducer, addCustomer, matrixListReducer, customerListReducer, rateStandardListReducer } = this.props;
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
              customerData={customerListReducer} 
              onSearch={this.onSearch}
              onPageChange={this.onPageChange}
              onDelete={this.deleteCustomer}
              updateModel={this.toggleUpdateModal}
            />
          </CardBody>
        </Card>
        <CrmCustomerModal
          customerModalOpen={modelDetails.customerModel}
          handleCustomerModal={this.toggleCreateModal}
          addCustomerFun={this.addCustomer}
          profileInfo={this.props.profileInfoReducer}
          matrixListReducerData={matrixListReducer}
          rateStandardListData ={rateStandardListReducer}
          onTypeHeadStdFun = {this.onTypeHeadStdFun}
          onStdAdd = {this.onStdAdd}
          editMode={editMode}
          customer = {customer}
        />
      </>
    );
  }
}
const mapStateToProps = state => ({
  userReducer: state.usersReducer,
  matrixListReducer: state.matrixListReducer,
  profileInfoReducer: state.profileInfoReducer,
  modelInfoReducer: state.modelInfoReducer,
  customerListReducer: state.customerListReducer,
  rateStandardListReducer: state.rateStandardListReducer
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
  },
  getCustomerList: (data) => {
    dispatch(customerGetRequest(data));
  },
  deleteCustomer: (data) => {
    dispatch(deleteCustomer(data));
  },
  getStdList: () => {
    dispatch(getRateStandardListRequest());
  },

});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Users);
