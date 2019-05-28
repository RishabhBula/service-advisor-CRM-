import React from "react";
import { Table, Nav, NavItem, NavLink } from "reactstrap";
import Loader from "../../containers/Loader/Loader";
import NoDataFound from "../common/NoFound";

class WorkflowListView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: null
    };
  }
  /**
   *
   */
  renderRow = (order, index) => {
    return (
      <tr key={index}>
        <td>{order.name || "Unnamed order"}</td>
      </tr>
    );
  };
  /**
   *
   */

  render() {
    const { orderStatus, orderData } = this.props;
    const { orders, isLoading } = orderData;
    let { activeTab } = this.state;
    if (!activeTab && orderStatus[0]) {
      activeTab = orderStatus[0]._id;
    }
    return (
      <div>
        <Nav pills className={"inventory-nav"}>
          {orderStatus
            ? orderStatus.map((tab, index) => {
                return (
                  <NavItem key={index}>
                    <NavLink
                      href={tab.url}
                      active={tab._id === activeTab}
                      onClick={e => {
                        e.preventDefault();
                        this.setState({
                          activeTab: tab._id
                        });
                      }}
                    >
                      {tab.name}
                    </NavLink>
                  </NavItem>
                );
              })
            : null}
        </Nav>
        <Table responsive>
          <thead>
            <tr>
              <th>Order Name</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td>
                  <Loader />
                </td>
              </tr>
            ) : orders && orders[activeTab] && orders[activeTab].length ? (
              orders[activeTab].map(this.renderRow)
            ) : (
              <tr>
                <td className={"text-center"}>
                  <NoDataFound />
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
    );
  }
}

export default WorkflowListView;
