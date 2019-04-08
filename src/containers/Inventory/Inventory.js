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
  CardBody,
} from "reactstrap";
import CrmDropDownMenu from "../../components/common/CrmDropDownMenu";
import { CrmUserModal } from '../../components/common/CrmUserModal'
class Inventory extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      activeTab: new Array(4).fill("1"),
      userModalOpen: false,
      tabDetails: [
        {
          name: "Parts",
          details: [
            {
              abc: "name1",
            },
            {
              abc: "name",
            },
          ],
        },
        {
          name: "Tires",
          details: [
            {
              abc: "name",
            },
            {
              abc: "name",
            },
          ],
        },
        {
          name: "Labor",
          details: [
            {
              abc: "name",
            },
            {
              abc: "name",
            },
          ],
        },
        {
          name: "Vendors",
          details: [
            {
              abc: "name",
            },
            {
              abc: "name",
            },
          ],
        },
      ],
    };
  }

  lorem(detailsData) {
    return Object.keys(detailsData).map(function (key, index) {
      return <li key={index}>{detailsData[key].abc}</li>;
    });
  }

  toggle(tabPane, tab) {
    const newArray = this.state.activeTab.slice();
    newArray[tabPane] = tab;
    this.setState({
      activeTab: newArray,
    });
  }

  tabPane() {
    const { tabDetails } = this.state;
    return tabDetails.map((item, index) => {
      return (
        <TabPane tabId={(index + 1).toString()} key={index}>
          {index + 1} {this.lorem(item.details)}
        </TabPane>
      );
    });
  }

  performInventoryAction = options => {
    console.log(options);
  };
  componentDidMount = () => {
    this.handleUserModal()
  }
  handleUserModal = () => {
    this.setState({
      userModalOpen: !this.state.userModalOpen
    })
  }
  render() {
    const { tabDetails, userModalOpen } = this.state;
    let dropdownOptions = [
      { value: "import", label: "Import" },
      { value: "export", label: "export" },
    ];
    return (
      <div className="animated fadeIn">
        <Card>
          <CardBody>
            <Row className="mb-4">
              <Col className="title-left-section">
                <h4 className="card-title">Inventory</h4>
              </Col>
              <Col className="title-right-section">
                <button className="btn btn-primary btn-sm">
                  <i className="fa fa-plus mr-1" />
                  Add Part
                </button>
                <CrmDropDownMenu
                  classNamePass={"common-crm-dropdown"}
                  imageDisplay={false}
                  iconPass={"icon-options icons"}
                  options={dropdownOptions}
                  returnCrmDropAction={this.performInventoryAction}
                  cssPass={""}
                />
              </Col>
            </Row>
            <Nav tabs>
              {tabDetails.map((item, index) => {
                return (
                  <NavItem key={index}>
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
        {
          userModalOpen ?
            <CrmUserModal
              userModalOpen={userModalOpen}
              handleUserModal={this.handleUserModal}
            /> : ""
        }
      </div>
    );
  }
}

export default Inventory;
