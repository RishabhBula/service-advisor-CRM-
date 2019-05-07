import React, { Component } from "react";
import { Pie } from "react-chartjs-2";
import { Row, Col, Card, CardHeader, CardBody } from "reactstrap";
import Loader from "../../containers/Loader/Loader";
import NoDataFound from "../common/NoFound";

class InventoryStats extends Component {
  renderValueChart = () => {
    const { inventoryStats } = this.props;
    const { value } = inventoryStats;
    const valueChart = {
      labels: [`Parts (${value.parts})`, `Tires (${value.tires})`],
      datasets: [
        {
          data: [value.parts, value.tires],
          backgroundColor: ["#8157ef", "#20a8d8"],
          hoverBackgroundColor: ["#8157ef", "#20a8d8"]
        }
      ]
    };
    const total = value.parts + value.tires;
    return total ? (
      <Pie
        data={valueChart}
        options={{
          legend: {
            display: true,
            position: "left",
            labels: {
              boxWidth: 20,
              fontSize: 10
            }
          },
          title: {
            display: true,
            text: `Total Value(${total})`,
            position: "top"
          }
        }}
      />
    ) : (
      <NoDataFound />
    );
  };
  renderCostChart = () => {
    const { inventoryStats } = this.props;
    const { cost } = inventoryStats;
    const costChart = {
      labels: [`Parts (${cost.parts})`, `Tires (${cost.tires})`],
      datasets: [
        {
          data: [cost.parts, cost.tires],
          backgroundColor: ["#8157ef", "#20a8d8"],
          hoverBackgroundColor: ["#8157ef", "#20a8d8"]
        }
      ]
    };
    const total = cost.parts + cost.tires;
    return total ? (
      <Pie
        data={costChart}
        options={{
          legend: {
            display: true,
            position: "left",
            labels: {
              boxWidth: 20,
              fontSize: 10
            }
          },
          title: {
            display: true,
            text: `Total Cost(${total})`,
            position: "top"
          }
        }}
      />
    ) : (
      <NoDataFound />
    );
  };
  renderQuantityChart = () => {
    const { inventoryStats } = this.props;
    const { quantity } = inventoryStats;
    const quantityChart = {
      labels: [`Parts (${quantity.parts})`, `Tires (${quantity.tires})`],
      datasets: [
        {
          data: [quantity.parts, quantity.tires],
          backgroundColor: ["#8157ef", "#20a8d8"],
          hoverBackgroundColor: ["#8157ef", "#20a8d8"]
        }
      ]
    };
    const total = quantity.parts + quantity.tires;
    return total ? (
      <Pie
        data={quantityChart}
        options={{
          legend: {
            display: true,
            position: "left",
            labels: {
              boxWidth: 20,
              fontSize: 10
            }
          },
          title: {
            display: true,
            text: `Total Quantity(${total})`,
            position: "top"
          }
        }}
      />
    ) : (
      <NoDataFound />
    );
  };
  render() {
    const { isLoading } = this.props;
    return (
      <Row>
        <Col sm={"4"}>
          <Card>
            <CardHeader>
              <h5>Total Quantity</h5>
            </CardHeader>
            <CardBody>
              {isLoading ? <Loader /> : this.renderQuantityChart()}
            </CardBody>
          </Card>
        </Col>
        <Col sm={"4"}>
          <Card>
            <CardHeader>
              <h5>Total Cost</h5>
            </CardHeader>
            <CardBody>
              {isLoading ? <Loader /> : this.renderCostChart()}
            </CardBody>
          </Card>
        </Col>
        <Col sm={"4"}>
          <Card>
            <CardHeader>
              <h5>Total Value</h5>
            </CardHeader>
            <CardBody>
              {isLoading ? <Loader /> : this.renderValueChart()}
            </CardBody>
          </Card>
        </Col>
      </Row>
    );
  }
}

export default InventoryStats;
