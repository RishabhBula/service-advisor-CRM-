import React, { Component } from "react";

import {
  Col,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane,
  Card,
  CardBody
} from "reactstrap";

class WorkFlow extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      activeTab: new Array(4).fill("1"),
      tabDetails: [
        {
          name: "Quotes",
          details: [
            {
              abc: "name1"
            },
            {
              abc: "name"
            }
          ]
        },
        {
          name: "In Progress",
          details: [
            {
              abc: "name"
            },
            {
              abc: "name"
            }
          ]
        },
        {
          name: "Dropped Off",
          details: [
            {
              abc: "name"
            },
            {
              abc: "name"
            }
          ]
        },
        {
          name: "Invoices",
          details: [
            {
              abc: "name"
            },
            {
              abc: "name"
            }
          ]
        }
      ],
    };
  }

  lorem(detailsData) {
    return Object.keys(detailsData).map(function(key, index) {
      return <li key={index}>{detailsData[key].abc}</li>;
    });
  }

  toggle(tabPane, tab) {
    const newArray = this.state.activeTab.slice();
    newArray[tabPane] = tab;
    this.setState({
      activeTab: newArray
    });
  }

  tabPane() {
    const { tabDetails } = this.state;
    return tabDetails.map((item, index) => {
      return (
        <TabPane tabId={(index + 1).toString()}>
          {index + 1} {this.lorem(item.details)}
        </TabPane>
      );
    });
  }

  render() {
    const { tabDetails } = this.state;

    return (
      <div className="animated fadeIn">
        <Card>
          <CardBody>
            <Row className="mb-4">
              <Col className="title-left-section">
                <h4 class="card-title">WorkFlow</h4>
                <div className="workflow-mode">
                  <div className="mode-inner">
                    <div className="mode-flow">
                      <button class="nav-icon icon-list btn btn-outline-dark" />
                    </div>
                    <div className="mode-flow">
                      <button class="nav-icon icon-grid btn btn-outline-dark " />
                    </div>
                  </div>
                </div>
              </Col>
              <Col className="title-right-section">
                <button class="btn btn-primary btn-sm">
                  <i className="fa fa-plus mr-1"/> New Quote
                </button>
              </Col>
            </Row>
            <Nav tabs>
              {tabDetails.map((item, index) => {
                return (
                  <NavItem>
                    <NavLink
                      active={
                        parseInt(this.state.activeTab[0]) ===
                        parseInt(index) + 1
                      }
                      onClick={() => {
                        this.toggle(0, (parseInt(index) + 1).toString());
                      }}
                    >
                      {item.name}
                    </NavLink>
                  </NavItem>
                );
              })}
            </Nav>
            <TabContent activeTab={this.state.activeTab[0]}>
              {this.tabPane()}
            </TabContent>
          </CardBody>
        </Card>
      </div>
    );
  }
}

export default WorkFlow;
