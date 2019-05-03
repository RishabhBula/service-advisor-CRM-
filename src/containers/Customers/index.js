import React, { Component } from "react";
import * as qs from "query-string";
import {
  Card,
  CardHeader,
  CardBody,
  Row,
  Col,
  Button,
  UncontrolledTooltip,
  UncontrolledAlert
} from "reactstrap";
import { CrmCustomerModal } from "../../components/common/CrmCustomerModal";
import { CrmEditCustomerModal } from "../../components/common/CrmEditCustomerModal";
import CustomerList from "../../components/Customer/CustomerList";
import { connect } from "react-redux";
import {
  customerAddRequest,
  getMatrixList,
  modelOpenRequest,
  customerGetRequest,
  deleteCustomer,
  getRateStandardListRequest,
  setRateStandardListStart,
  customerEditRequest,
  updateCustomerStatus,
  getCustomerFleetListRequest,
  importCustomers
} from "../../actions";
import { logger } from "../../helpers/Logger";
import { isEqual } from "../../helpers/Object";
import CrmExportSampleButton, {
  DemoSupportedSheets
} from "../../components/common/CrmExportSampleButton";
import CrmImportExcel from "../../components/common/CrmImportExcel";

class Customers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openCreate: false,
      customer: {},
      editMode: false,
      customerId: ""
    };
  }
  componentDidMount() {
    this.props.getMatrix();
    const query = qs.parse(this.props.location.search);
    this.props.getCustomerList({ ...query, page: query.page || 1 });
    this.props.getStdList("");
    this.props.setLabourRateDefault();
    this.props.getCustomerFleetListActions();
  }

  componentDidUpdate({ location, modelInfoReducer }) {
    const prevQuery = qs.parse(location.search);
    const currQuery = qs.parse(this.props.location.search);
    if (!isEqual(prevQuery, currQuery)) {
      this.props.getCustomerList({ ...currQuery, page: currQuery.page || 1 });
    }
  }

  loadTypeRate = input => {
    this.props.getStdList(input);
  };
  toggleCreateModal = e => {
    const { modelDetails } = this.props.modelInfoReducer;
    let data = {
      customerModel: !modelDetails.customerModel,
      customerEditModel: false
    };
    this.props.modelOperate(data);
  };

  toggleEditModal = e => {
    this.setState({ customer: {} });
    const { modelDetails } = this.props.modelInfoReducer;
    let data = {
      customerModel: false,
      customerEditModel: !modelDetails.customerEditModel
    };
    this.props.modelOperate(data);
  };

  toggleUpdateModal = customer => {
    this.setState({ customerId: customer._id });
    this.setState({ customer: customer }, () => {
      const { modelDetails } = this.props.modelInfoReducer;
      let data = {
        customerEditModel: !modelDetails.customerEditModel
      };
      this.props.modelOperate(data);
    });
  };
  createUser = data => {
    logger(data);
  };

  onSearch = data => {
    const { location } = this.props;
    const { pathname } = location;
    this.props.redirectTo([pathname, qs.stringify(data)].join("?"));
  };

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

  // changeCustomerStatus = (e, customerId) => {
  //   let data = {
  //     status: e.enabled,
  //     customerId: customerId,
  //   };
  //   this.props.updateCustomer(data);
  // }

  onStatusUpdate = data => {
    const { location } = this.props;
    const { search } = location;
    const query = qs.parse(search);
    this.props.onStatusUpdate({ ...query, ...data });
  };

  addCustomer = data => {
    this.props.addCustomer(data);
    this.props.getCustomerList();
    this.onSearch({});
  };

  updateCustomerForm = data => {
    let customerId = this.state.customerId;
    data.customerId = customerId;
    const { location } = this.props;
    const { search } = location;
    const query = qs.parse(search);
    this.props.updateCustomer({ query, data });
  };
  onTypeHeadStdFun = data => {
    this.props.getStdList(data);
  };

  onStdAdd = () => {
    this.props.getStdList();
  };

  setDefaultRate = value => {
    this.props.setLabourRateDefault(value);
  };
  onImport = data => {
    this.props.importCustomer(data);
  };
  render() {
    const { editMode, customer } = this.state;
    const {
      matrixListReducer,
      customerListReducer,
      rateStandardListReducer,
      customerFleetReducer
    } = this.props;
    const { modelDetails } = this.props.modelInfoReducer;
    return (
      <>
        <Card>
          <CardHeader>
            <Row>
              <Col sm={"6"} className={"pull-left"}>
                <h4>
                  <i className={"fa fa-users"} /> Customer List{" "}
                  {!customerListReducer.isLoading
                    ? `(${customerListReducer.totalCustomers || 0})`
                    : null}
                </h4>
              </Col>
              <Col sm={"6"} className={"text-right"}>
                <CrmExportSampleButton
                  sheetType={DemoSupportedSheets.CUSTOMER}
                />{" "}
                &nbsp;
                <CrmImportExcel
                  modalHeaderText={"Import customer data"}
                  onImport={this.onImport}
                  buttonText={"Import Customers"}
                >
                  {customerListReducer.importError ? (
                    <Row>
                      <Col sm={{ size: 8, offset: 2 }}>
                        <UncontrolledAlert color="danger">
                          <span
                            dangerouslySetInnerHTML={{
                              __html: customerListReducer.importError
                            }}
                          />
                        </UncontrolledAlert>
                      </Col>
                    </Row>
                  ) : null}
                </CrmImportExcel>
                &nbsp;&nbsp;
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
              changeStatus={this.changeCustomerStatus}
              onStatusUpdate={this.onStatusUpdate}
              updateModel={this.toggleUpdateModal}
            />
          </CardBody>
        </Card>
        <CrmCustomerModal
          customerModalOpen={modelDetails.customerModel}
          handleCustomerModalFun={this.toggleCreateModal}
          addCustomerFun={this.addCustomer}
          profileInfo={this.props.profileInfoReducer}
          matrixListReducerData={matrixListReducer}
          rateStandardListData={rateStandardListReducer}
          onTypeHeadStdFun={this.onTypeHeadStdFun}
          onStdAdd={this.onStdAdd}
          editMode={editMode}
          customer={customer}
          getCustomerFleetList={customerFleetReducer.customerFleetData}
          setDefaultRate={this.setDefaultRate}
          loadTypeRate={this.loadTypeRate}
        />
        <CrmEditCustomerModal
          customerModalOpen={modelDetails.customerEditModel}
          handleCustomerModalFun={this.toggleEditModal}
          addCustomerFun={this.updateCustomerForm}
          profileInfo={this.props.profileInfoReducer}
          matrixListReducerData={matrixListReducer}
          rateStandardListData={rateStandardListReducer}
          onTypeHeadStdFun={this.onTypeHeadStdFun}
          onStdAdd={this.onStdAdd}
          editMode={editMode}
          customer={customer}
          getCustomerFleetList={customerFleetReducer.customerFleetData}
          setDefaultRate={this.setDefaultRate}
          loadTypeRate={this.loadTypeRate}
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
  rateStandardListReducer: state.rateStandardListReducer,
  customerFleetReducer: state.fleetReducer
});

const mapDispatchToProps = dispatch => ({
  addCustomer: data => {
    dispatch(customerAddRequest(data));
  },
  getMatrix: () => {
    dispatch(getMatrixList());
  },
  modelOperate: data => {
    dispatch(modelOpenRequest({ modelDetails: data }));
  },
  getCustomerList: data => {
    dispatch(customerGetRequest(data));
  },
  deleteCustomer: data => {
    dispatch(deleteCustomer(data));
  },
  onStatusUpdate: data => {
    dispatch(updateCustomerStatus(data));
  },
  getStdList: data => {
    dispatch(getRateStandardListRequest(data));
  },
  setLabourRateDefault: data => {
    dispatch(setRateStandardListStart(data));
  },
  updateCustomer: data => {
    dispatch(customerEditRequest(data));
  },
  getCustomerFleetListActions: () => {
    dispatch(getCustomerFleetListRequest());
  },
  importCustomer: data => {
    dispatch(importCustomers(data));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Customers);
