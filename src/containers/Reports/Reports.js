import React, { Component } from "react";
import {
  Col,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane
} from "reactstrap";
// import classnames from "classnames";
import { BigModals } from '../../components/common/CrmWelcomeModel'
class Reports extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      activeTab: new Array(4).fill("1"),
      modalOpen: false,
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
      ]
    };
  }

  componentDidMount = () => {
    this.toggleLarge()
  }
  toggleLarge = () => {
    this.setState({
      modalOpen: !this.state.modalOpen
    });
  };
  lorem(detailsData) {
    return Object.keys(detailsData).map(function (key, index) {
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
    const { tabDetails, modalOpen } = this.state;

    return (
      <div className="animated fadeIn">
        <Row>
          <Col xs="12" md="12" className="">
            <div className="margin-top-10 page-title">
              <h4 className="">WorkFlow</h4>
              <div className="workflow-mode">
                <div className="mode-inner">
                  <div className="mode-flow">
                    <button class="nav-icon icon-list" />
                  </div>
                  <div className="mode-flow">
                    <button class="nav-icon icon-grid" />
                  </div>
                </div>
              </div>
            </div>
          </Col>
          {/* <Col xs="4" md="4" className="mb-4">
            
          </Col> */}
        </Row>
        <Row>
          <Col xs="12" md="12" className="mb-4">
            <Nav tabs>
              {tabDetails.map((item, index) => {
                return (
                  <NavItem>
                    <NavLink
                      active={this.state.activeTab[0] === parseInt(index) + 1}
                      onClick={() => {
                        this.toggle(0, (parseInt(index) + 1).toString());
                      }}
                    >
                      {item.name}
                    </NavLink>
                  </NavItem>
                );
              })}
              {/* <NavItem>
                <NavLink
                  active={this.state.activeTab[0] === "1"}
                  onClick={() => {
                    this.toggle(0, "1");
                  }}
                >
                  Quotes
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  active={this.state.activeTab[0] === "2"}
                  onClick={() => {
                    this.toggle(0, "2");
                  }}
                >
                  In Progress
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  active={this.state.activeTab[0] === "3"}
                  onClick={() => {
                    this.toggle(0, "3");
                  }}
                >
                  Dropped Off
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  active={this.state.activeTab[0] === "4"}
                  onClick={() => {
                    this.toggle(0, "4");
                  }}
                >
                  Invoices
                </NavLink>
              </NavItem> */}
            </Nav>
            <TabContent activeTab={this.state.activeTab[0]}>
              {this.tabPane()}
            </TabContent>
          </Col>
        </Row>
        {
          modalOpen ?
            <BigModals
              modalOpen={modalOpen}
              toggleLarge={this.toggleLarge}
            /> : ""
        }
      </div>
    );
  }
}

export default Reports;
