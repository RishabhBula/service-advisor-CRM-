import React, { Component } from "react";
import { Bar } from "react-chartjs-2";
import Loader from "../../containers/Loader/Loader";
import { Input, Row, Col } from "reactstrap";
import { DayPickerRangeController } from "react-dates";
import CalendarIcon from "./../../assets/calendar.svg";
class InvoiceChart extends Component {
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
  componentDidUpdate({ type: oldType }) {
    const { type } = this.props;
    if (oldType !== type) {
      const showDate = type === "custom";
      this.setState({
        selectedFilter: type,
        showDate
      });
    }
  }
  /**
   *
   */
  renderOptions = () => {
    return {
      responsive: true,
      scales: {
        xAxes: [
          {
            display: true,
            gridLines: {
              display: false
            }
          }
        ],
        yAxes: [
          {
            display: true,
            gridLines: {
              display: false
            },
            ticks: {
              beginAtZero: true
            }
          }
        ]
      }
    };
  };
  /**
   *
   */
  renderChartData = () => {
    const { customerSales } = this.props;
    const { invoices, invoiceTotal } = customerSales;
    const labels = [];
    const invoiceNumbers = [];
    const totalInvoiceAmount = [];
    for (const i in invoices) {
      if (invoices.hasOwnProperty(i)) {
        const element = invoices[i];
        invoiceNumbers.push(element);
        totalInvoiceAmount.push(invoiceTotal[i]);
        labels.push(i);
      }
    }
    return {
      labels,
      datasets: [
        {
          data: totalInvoiceAmount,
          type: "line",
          label: "Invoice Amount",
          fill: false,
          borderColor: "#8157ef",
          backgroundColor: "#8157ef",
          pointBorderColor: "#8157ef",
          pointBackgroundColor: "#8157ef",
          pointHoverBackgroundColor: "#8157ef",
          pointHoverBorderColor: "#8157ef"
        },
        {
          data: invoiceNumbers,
          type: "bar",
          label: "Number of Invoices",
          fill: false,
          backgroundColor: "#20a8d8",
          borderColor: "#20a8d8",
          hoverBackgroundColor: "#20a8d8",
          hoverBorderColor: "#20a8d8"
        }
      ]
    };
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
          this.props.onFilterChange(
            "custom",
            startDate.format("YYYY-MM-DD"),
            endDate.format("YYYY-MM-DD")
          );
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
  toggleCalendar = () =>
    this.setState({ openDatePicker: !this.state.openDatePicker });
  /**
   *
   */
  render() {
    const costChart = this.renderChartData();
    const options = this.renderOptions();
    const {
      selectedFilter,
      focusedInput,
      startDate,
      endDate,
      openDatePicker
    } = this.state;
    const { customerSales } = this.props;
    const { isLoading } = customerSales;
    return (
      <div className={"dashboard-block-container chart-container text-right"}>
        <Row>
          <Col sm={"4"}>
            <h3>Sales Details</h3>
          </Col>
          <Col sm={"6"}>
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
              />
            ) : null}
          </Col>
        </Row>
        <br />
        {isLoading ? <Loader /> : <Bar data={costChart} options={options} />}
      </div>
    );
  }
}

export default InvoiceChart;
