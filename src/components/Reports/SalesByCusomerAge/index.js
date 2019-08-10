import React, { Component } from "react";

import {
  Form,
  Row,
  Col,
  FormGroup,
  Label,
  InputGroup,
  Input,
  Table
} from "reactstrap";
import { DayPickerRangeController } from "react-dates";
import CalendarIcon from "./../../../assets/calendar.svg";
import { AppConfig } from "../../../config/AppConfig";
import Loader from "../../../containers/Loader/Loader";

class SalesByCusomerAge extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFilter: "today",
      startDate: null,
      endDate: null,
      openDatePicker: false,
      focusedInput: "startDate"
    };
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
  toggleCalendar = () => {
    this.setState({
      openDatePicker: !this.state.openDatePicker
    });
  };
  /**
   *
   */
  onFilterChange = e => {
    const { value } = e.target;
    this.setState(
      {
        selectedFilter: value,
        openDatePicker: value === "custom"
      },
      () => {
        if (!this.state.openDatePicker) {
          this.props.onFilterChange(value);
        }
      }
    );
  };
  /**
   *
   */
  onDatesChange = ({ startDate, endDate }) => {
    if (this.state.focusedInput === "endDate") {
      this.setState({
        focusedInput: "startDate"
      });
    }
    this.setState(
      {
        startDate,
        endDate
      },
      () => {
        if (startDate && endDate) {
          this.setState({
            openDatePicker: false,
            startDate: null,
            endDate: null
          });
        }
      }
    );
  };
  /**
   *
   */
  onFocusChanged = focusedInput => {
    if (!focusedInput) {
      return;
    }
    this.setState({
      focusedInput
    });
  };
  /**
   *
   */
  render() {
    const { customerSales } = this.props;
    const { isLoading, invoices, invoiceTotal } = customerSales;
    const customers = [];
    for (const key in invoices) {
      if (invoices.hasOwnProperty(key)) {
        const inv = invoices[key];
        customers.push({
          invoiceTotal: invoiceTotal[key],
          numberOfInvoices: inv,
          customerRange: key
        });
      }
    }
    const {
      openDatePicker,
      startDate,
      endDate,
      focusedInput,
      selectedFilter
    } = this.state;
    return (
      <>
        <div className={"filter-block"}>
          <Form onSubmit={this.onSearch}>
            <Row>
              <Col lg={"4"} md={"4"} className="mb-0">
                <FormGroup className="mb-0">
                  <InputGroup>
                    <Label>Select Date Range</Label>
                    &nbsp;
                    <Input
                      type={"select"}
                      className={"form-control"}
                      value={selectedFilter}
                      onChange={this.onFilterChange}
                    >
                      <option value={"today"}>Today</option>
                      <option value={"week"}>This week</option>
                      <option value={"month"}>This month</option>
                      <option value={"quarter"}>This quarter</option>
                      <option value={"all"}>All</option>
                      <option value={"custom"}>Custom</option>
                    </Input>
                  </InputGroup>
                </FormGroup>
              </Col>
              <Col sm={"2"} className={"chart-datepicker-container"}>
                <div
                  onClick={this.toggleCalendar}
                  className={"calendar-icon-container"}
                >
                  <img src={CalendarIcon} alt={""} />
                </div>
                {openDatePicker ? (
                  <DayPickerRangeController
                    startDate={startDate}
                    endDate={endDate}
                    focusedInput={focusedInput}
                    onDatesChange={this.onDatesChange}
                    onFocusChange={this.onFocusChanged}
                    numberOfMonths={1}
                    onOutsideClick={this.toggleCalendar}
                    weekDayFormat="ddd"
                    hideKeyboardShortcutsPanel
                  />
                ) : null}
              </Col>
            </Row>
          </Form>
        </div>
        <Table responsive>
          <thead>
            <tr>
              <th width="60px">S No.</th>
              <th width={"150"}>
                <i className={"fa fa-calendar"} /> Customer Age
              </th>
              <th width={"90"}>
                <i className={"fa fa-dollar"} /> Number of invoices
              </th>
              <th width={"120"}>
                <i className={"fa fa-dollar"} /> Invoice Total
              </th>
            </tr>
          </thead>
          <tbody>
            {!isLoading ? (
              customers && customers.length ? (
                customers.map((customer, index) => {
                  return (
                    <tr key={index}>
                      <td>{(1 - 1) * AppConfig.ITEMS_PER_PAGE + index + 1}.</td>
                      <td>
                        <div
                          className={"vehicle-type-img d-inline-block"}
                          id={`type${index}`}
                        >
                          {customer.customerRange}
                        </div>
                      </td>
                      <td>{customer.numberOfInvoices || 0}</td>
                      <td>{customer.invoiceTotal}</td>
                    </tr>
                  );
                })
              ) : null
            ) : (
              <tr>
                <td className={"text-center"} colSpan={12}>
                  <Loader />
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </>
    );
  }
}

export default SalesByCusomerAge;
