import React, { Component } from "react";
import { Bar } from "react-chartjs-2";
const options = {
  responsive: true,
  scales: {
    xAxes: [
      {
        display: true,
        gridLines: {
          display: false
        }
      },
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
        position: "left"
      },
      {
        display: true,
        gridLines: {
          display: false
        },
        position: "right"
      }
    ]
  }
};

class InvoiceChart extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const costChart = {
      labels: ["January", "February", "March", "April", "May", "June", "July"],
      datasets: [
        {
          data: [250, 400, 95, 200, 185, 590, 621],
          type: "line",
          label: "Test",
          fill: false,
          borderColor: "#8157ef",
          backgroundColor: "#8157ef",
          pointBorderColor: "#8157ef",
          pointBackgroundColor: "#8157ef",
          pointHoverBackgroundColor: "#8157ef",
          pointHoverBorderColor: "#8157ef"
        },
        {
          type: "bar",
          label: "Visitor",
          data: [200, 185, 590, 621, 250, 400, 95],
          fill: false,
          backgroundColor: "#20a8d8",
          borderColor: "#20a8d8",
          hoverBackgroundColor: "#20a8d8",
          hoverBorderColor: "#20a8d8"
        }
      ]
    };
    return (
      <div className={"dashboard-block-container"}>
        <Bar data={costChart} options={options} />
      </div>
    );
  }
}

export default InvoiceChart;
