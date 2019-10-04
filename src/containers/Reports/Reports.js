import React, { Component } from "react";
import { Col, Row, Card, CardBody } from "reactstrap";
import SalesByCusomerAge from "../../components/Reports/SalesByCusomerAge";
import { getCustomerInoiveReport } from "../../actions";
import { connect } from "react-redux";
import { logger } from "../../helpers";
import { AppRoutes } from "../../config/AppRoutes";
import qs from "querystring";

class Reports extends Component {
  constructor(props) {
    super(props);
    this.state = {
      customerSearch: ""
    };
  }
  /**
   *
   */
  componentDidMount = () => {
    const { search } = this.props.location;
    const { customerSearch } = qs.parse(search.replace("?", ""));
    this.setState(
      {
        customerSearch
      },
      () => {
        this.getCustomerSales();
      }
    );
  };
  /**
   *
   */
  componentDidUpdate({ location }) {
    const { search: oldSearch } = location;
    const { search } = this.props.location;
    const { customerSearch } = qs.parse(search.replace("?", ""));
    const { customerSearch: oldCustomerSearch } = qs.parse(
      oldSearch.replace("?", "")
    );
    if (customerSearch !== oldCustomerSearch) {
      this.setState(
        {
          customerSearch
        },
        () => {
          this.getCustomerSales();
        }
      );
    }
  }
  /**
   *
   */
  getCustomerSales = () => {
    const { location } = this.props.history;
    const { search } = location;
    let { customerSearch } = qs.parse(search.replace("?", ""));
    logger(customerSearch);
    this.props.getCustomerSales({
      search: customerSearch
    });
  };
  /**
   *
   */
  onCustomerSearch = value => {
    this.props.redirectTo(
      `${AppRoutes.REPORTS.url}?${qs.stringify({
        customerSearch: value
      })}`
    );
  };
  /**
   *
   */
  onCustomerSearchReset = () => {
    const { location } = this.props.history;
    const { search } = location;
    let data = qs.parse(search.replace("?", ""));
    if (data.customerSearch) {
      delete data.customerSearch;
    }
    this.props.redirectTo(`${AppRoutes.REPORTS.url}?${qs.stringify(data)}`);
  };
  /**
   *
   */
  render() {
    const { customerReport } = this.props;
    const { customerSearch } = this.state;
    return (
      <div className="animated fadeIn">
        <Card className={"white-card position-relative"}>
          <CardBody className={"custom-card-body"}>
            <Row className={"mb-2 ml-0"}>
              <Col
                className={
                  "p-2 bg-white border-theme d-flex align-items-center"
                }
              >
                <h1 className={"pl-2 pr-3 mb-0 text-purple"}>
                  <i class="icons cui-pie-chart"></i>
                </h1>
                <div>
                  <h4 className={"card-title mb-0"}>Sales Summary</h4>
                  <p className={"mb-0 text-muted"}>
                    This daily sales report sample is useful to track on a
                    weekly basis since tracking it daily is just too short of a
                    time span to evaluate your strongest and weakest points.
                  </p>
                </div>
              </Col>
            </Row>
            <Row className={"m-0"}>
              <Col sm={"12"} className={"p-0"}>
                <SalesByCusomerAge
                  searchKey={customerSearch}
                  customerReport={customerReport}
                  onFilterChange={this.onCustomerSaleRangeChange}
                  onSearch={this.onCustomerSearch}
                  onReset={this.onCustomerSearchReset}
                />
              </Col>
            </Row>
          </CardBody>
        </Card>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  customerReport: state.reportReducer.customerReport
});
const mapDispatchToProps = dispatch => ({
  getCustomerSales: data => dispatch(getCustomerInoiveReport(data))
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Reports);
