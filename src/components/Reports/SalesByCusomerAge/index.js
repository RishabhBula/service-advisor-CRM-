import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  Form,
  Row,
  Col,
  Table,
  FormGroup,
  InputGroup,
  Input,
  UncontrolledTooltip,
  Button,
  Label
} from "reactstrap";
import { AppConfig } from "../../../config/AppConfig";
import Loader from "../../../containers/Loader/Loader";
import { CustomerAgeTypes } from "../../../config/Constants";
import { AppRoutes } from "../../../config/AppRoutes";
import { logger } from "../../../helpers";
import NoDataFound from "../../common/NoFound";
import Dollor from "../../common/Dollor"

class SalesByCusomerAge extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFilter: ""
    };
  }
  /**
   *
   */
  componentDidUpdate({ searchKey: oldSearchKey }) {
    const { searchKey } = this.props;
    logger(searchKey, oldSearchKey);
    if (searchKey !== oldSearchKey) {
      this.setState({
        selectedFilter: searchKey
      });
    }
  }
  /**
   *
   */
  handleChange = e => {
    const { name, value } = e.target;
    this.setState({
      [name]: value
    });
  };
  /**
   *
   */
  onSearch = e => {
    e.preventDefault();
    this.props.onSearch(this.state.selectedFilter);
  };
  /**
   *
   */
  onReset = e => {
    e.preventDefault();
    this.setState({
      selectedFilter: ""
    });
    this.props.onReset();
  };
  /**
   *
   */
  render() {
    const { customerReport } = this.props;
    const { isLoading, data } = customerReport;
    const { selectedFilter } = this.state;
    let totalPaid = 0;
    let totalUnPaid = 0;
    let totalThirty = 0;
    let totalSixty = 0;
    let totalNinenty = 0;
    let ninentyPlus = 0;
    return (
      <>
        <div className={"filter-block"}>
          <Form onSubmit={this.onSearch}>
            <Row>
              <Col lg={"4"} md={"4"} className="mb-0">
                {
                  <FormGroup className="mb-0">
                    <InputGroup>
                      <Input
                        type={"text"}
                        className={"form-control"}
                        value={selectedFilter}
                        onChange={this.handleChange}
                        name={"selectedFilter"}
                        placeholder={"Enter customer name or email"}
                      />
                    </InputGroup>
                  </FormGroup>
                }
              </Col>
              <Col lg={"6"} md={"6"} className="mb-0">
                <div className="filter-btn-wrap">
                  <Label className="height17 label" />
                  <div className="form-group mb-0">
                    <span className="mr-2">
                      <Button
                        type="submit"
                        className="btn btn-theme-transparent"
                        id="Tooltip-1"
                      >
                        <i className="icons cui-magnifying-glass" />
                      </Button>
                      <UncontrolledTooltip target="Tooltip-1">
                        Search
                      </UncontrolledTooltip>
                    </span>
                    <span className="">
                      <Button
                        className="btn btn-theme-transparent"
                        id="Tooltip-2"
                        onClick={this.onReset}
                      >
                        <i className="icon-refresh icons" />
                      </Button>
                      <UncontrolledTooltip target={"Tooltip-2"}>
                        Reset all filters
                      </UncontrolledTooltip>
                    </span>
                  </div>
                </div>
              </Col>
            </Row>
          </Form>
        </div>
        <Table responsive>
          <thead>
            <tr>
              <th width="60px">S No.</th>
              <th width={"150"}>
                <i className={"fa fa-user"} /> Customer
              </th>
              <th width={"90"}>
                <i className={"fa fa-calendar"} /> 0-30 Days
              </th>
              <th width={"120"}>
                <i className={"fa fa-calendar"} /> 31-60 Days
              </th>
              <th width={"120"}>
                <i className={"fa fa-calendar"} /> 61-90 Days
              </th>
              <th width={"120"}>
                <i className={"fa fa-calendar"} /> 91 days and above
              </th>
              <th width={"150"}>
                <i className={"fa fa-dollar"} /> Credit
              </th>
              <th width={"150"}>
                <i className={"fa fa-dollar"} /> Due
              </th>
            </tr>
          </thead>
          <tbody>
            {!isLoading ? (
              data && data.length ? (
                <>
                  {data.map((customer, index) => {
                    totalPaid += parseFloat(customer["paid"]);
                    totalUnPaid += parseFloat(customer["due"]);
                    totalThirty += parseFloat(
                      customer[CustomerAgeTypes.THIRTY_DAYS] || 0
                    );
                    totalSixty += parseFloat(
                      customer[CustomerAgeTypes.SIXTY_DAYS] || 0
                    );
                    totalNinenty += parseFloat(
                      customer[CustomerAgeTypes.NINETY_DAYS] || 0
                    );
                    ninentyPlus += parseFloat(
                      customer[CustomerAgeTypes.NINENTY_PLUS] || 0
                    );
                    return (
                      <tr key={index}>
                        <td>
                          {(1 - 1) *
                            AppConfig.ITEMS_PER_PAGE +
                            index +
                            1}
                          .
                        </td>
                        <td>
                          <div
                            className={
                              "font-weight-semibold text-capitalize pb-1"
                            }
                            id={`type${index}`}
                          >
                            <Link
                              to={AppRoutes.CUSTOMER_DETAILS.url.replace(
                                ":id",
                                customer.customerId._id
                              )}
                              className={
                                "text-body font-weight-semibold"
                              }
                            >
                              {" "}
                              {[
                                customer.customerId
                                  .firstName,
                                customer.customerId.lastName
                              ]
                                .join(" ")
                                .trim()}
                            </Link>
                          </div>
                          {customer.customerId.email ? (
                            <>
                              <a
                                href={`mailto:${
                                  customer.customerId.email
                                }`}
                                target={"_blank"}
                                className={"text-body"}
                              >
                                {customer.customerId.email}
                              </a>
                              <br />
                            </>
                          ) : null}
                          {customer.customerId
                            .phoneDetail &&
                          customer.customerId
                            .phoneDetail[0] ? (
                            <a
                              href={`tel:${
                                customer.customerId
                                  .phoneDetail[0].value
                              }`}
                              target={"_blank"}
                              className={"text-body"}
                            >
                              {
                                customer.customerId
                                  .phoneDetail[0].value
                              }
                            </a>
                          ) : null}
                        </td>
                        <td>
                          <Dollor
                            value={
                              customer["0-30 Days"] || 0
                            }
                          />
                        </td>
                        <td>
                          <Dollor
                            value={
                              customer["31-60 Days"] || 0
                            }
                          />
                        </td>
                        <td>
                          <Dollor
                            value={
                              customer["61-90 Days"] || 0
                            }
                          />
                        </td>
                        <td>
                          <Dollor
                            value={
                              customer[
                                "91 Days and above"
                              ] || 0
                            }
                          />
                        </td>
                        <td
                          className={"font-weight-semibold"}
                        >
                          <Dollor
                            value={customer["due"] || 0}
                          />
                        </td>
                        <td
                          className={"font-weight-semibold"}
                        >
                          <Dollor
                            value={customer["paid"] || 0}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </>
              ) : (
                <tr>
                  <td className={"text-center"} colSpan={12}>
                    <NoDataFound noResult />
                  </td>
                </tr>
              )
            ) : (
              <tr>
                <td className={"text-center"} colSpan={12}>
                  <Loader />
                </td>
              </tr>
            )}
            <tr>
              <td className={"text-left font-weight-semibold"} colSpan={2}>
                Total
              </td>
              <td>
                <b>
                  <Dollor value={totalThirty} />
                </b>
              </td>
              <td>
                <b>
                  <Dollor value={totalSixty} />
                </b>
              </td>
              <td>
                <b>
                  <Dollor value={totalSixty} />
                </b>
              </td>
              <td>
                <b>
                  <Dollor value={ninentyPlus} />
                </b>
              </td>
              <td>
                <b>
                  <Dollor value={totalUnPaid} />
                </b>
              </td>
              <td>
                <b>
                  <Dollor value={totalPaid} />
                </b>
              </td>
            </tr>
          </tbody>
        </Table>
      </>
    );
  }
}

export default SalesByCusomerAge;
