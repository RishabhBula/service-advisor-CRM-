import React, { Component } from "react";
import {
  Col,
  Row,
  UncontrolledTooltip,
  Button,
  Card,
  CardBody
} from "reactstrap";
import SalesByCusomerAge from "../../components/Reports/SalesByCusomerAge";
import { getDashboardCustomerSale } from "../../actions";
import { connect } from "react-redux";
import { logger } from "../../helpers";
import { AppRoutes } from "../../config/AppRoutes";
import qs from "querystring";
import moment from "moment";
class Reports extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  /**
   *
   */
  componentDidMount = () => {
    this.getCustomerSales();
  };
  /**
   *
   */
  componentDidUpdate({ location }) {
    const { search: oldSearch } = location;
    const { search } = this.props.location;
    const {
      customerSales,
      start: customerStart,
      end: oldCustomerEnd
    } = qs.parse(search.replace("?", ""));
    const { customerSales: oldCustomerSales, start, end } = qs.parse(
      oldSearch.replace("?", "")
    );
    if (
      customerSales !== oldCustomerSales ||
      customerStart !== start ||
      end !== oldCustomerEnd
    ) {
      this.getCustomerSales();
    }
  }
  /**
   *
   */
  getCustomerSales = () => {
    const { location } = this.props.history;
    const { search } = location;
    let { customerSales, start, end } = qs.parse(search.replace("?", ""));
    this.setState({
      type: customerSales
    });
    if (!start || !end) {
      let dates = this.getStartAndEnd(customerSales);
      start = dates.start;
      end = dates.end;
    }
    if (!start) {
      start = moment().format("YYYY-MM-DD");
    }
    if (!end) {
      end = moment().format("YYYY-MM-DD");
    }
    this.props.getCustomerSales({
      start,
      end
    });
  };
  /**
   *
   */
  getStartAndEnd = type => {
    switch (type) {
      case "week":
        return {
          start: moment()
            .startOf("week")
            .format("YYYY-MM-DD"),
          end: moment().format("YYYY-MM-DD")
        };
      case "month":
        return {
          start: moment()
            .startOf("month")
            .format("YYYY-MM-DD"),
          end: moment().format("YYYY-MM-DD")
        };
      case "quarter":
        return {
          start: moment()
            .startOf("quarter")
            .format("YYYY-MM-DD"),
          end: moment().format("YYYY-MM-DD")
        };
      case "all":
        return {
          start: moment()
            .subtract(10, "years")
            .format("YYYY-MM-DD"),
          end: moment().format("YYYY-MM-DD")
        };
      default:
        return {
          start: moment().format("YYYY-MM-DD"),
          end: moment().format("YYYY-MM-DD")
        };
    }
  };
  /**
   *
   */
  onCustomerSaleRangeChange = (value, start, end) => {
    if (value !== "custom") {
      const dates = this.getStartAndEnd(value);
      start = dates.start;
      end = dates.end;
    }
    let { search } = this.props.location;
    if (!search) {
      search = {};
    } else {
      search = qs.parse(search.replace("?", ""));
    }
    search = {
      ...search,
      customerSales: value,
      start,
      end
    };
    logger(qs.stringify(search));

    this.props.redirectTo(`${AppRoutes.REPORTS.url}?${qs.stringify(search)}`);
  };
  /**
   *
   */
  render() {
    const { customerSales } = this.props;

    return (
      <div className="animated fadeIn">
        <Card className={"white-card position-relative"}>
          <CardBody className={"custom-card-body"}>
            <Row className={"mb-2 ml-0"}>
              <Col className={"title-left-section"}>
                <h4 className={"card-title"}>Reports</h4>
                <div className={"workflow-mode"}>
                  <div className={"mode-inner"} />
                </div>
              </Col>
              <Col className={"title-right-section"}>
                <div className={"invt-add-btn-block"}>
                  <Button
                    onClick={this.handleOrder}
                    color={"primary"}
                    id={"add-Appointment"}
                  >
                    <i className={"fa fa-plus mr-1"} /> New Quote
                  </Button>
                  <UncontrolledTooltip target={"add-Appointment"}>
                    Add a New Quote
                  </UncontrolledTooltip>
                </div>
              </Col>
            </Row>
            <Row>
              <Col sm={"12"}>
                <SalesByCusomerAge
                  customerSales={customerSales}
                  onFilterChange={this.onCustomerSaleRangeChange}
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
  customerSales: state.dashboardReducer.customerSales
});
const mapDispatchToProps = dispatch => ({
  getCustomerSales: data => dispatch(getDashboardCustomerSale(data))
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Reports);
