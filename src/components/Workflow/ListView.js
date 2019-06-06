import React from "react";
import { Table, Nav, NavItem, NavLink } from "reactstrap";
import Loader from "../../containers/Loader/Loader";
import NoDataFound from "../common/NoFound";
import { AppRoutes } from "../../config/AppRoutes";

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
    const { activeTab } = this.state;
    return (
      <tr key={index}>
        <td>
          <span
            onClick={() =>
              this.props.redirectTo(
                `${AppRoutes.WORKFLOW_ORDER.url.replace(":id", order._id)}`
              )
            }
            style={{
              cursor: "pointer"
            }}
          >
            {order.name || "Unnamed order"}
          </span>
        </td>
        <td>
          <i
            className={"fa fa-trash"}
            onClick={() =>
              this.props.deleteOrder({
                statusId: activeTab,
                id: order._id,
                index
              })
            }
          />
        </td>
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
              <th />
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
