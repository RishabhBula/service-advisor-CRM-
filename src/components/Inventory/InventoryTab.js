import React from "react";
import { Nav, NavItem, NavLink } from "reactstrap";

const InventoryTab = props => {
  return (
    <Nav pills>
      {props.tabs
        ? props.tabs.map((tab, index) => {
            return (
              <NavItem key={index}>
                <NavLink
                  href={tab.url}
                  active={index === props.activeTab}
                  onClick={e => {
                    e.preventDefault();
                    if (props.onTabChange) props.onTabChange(index);
                  }}
                >
                  {tab.name}
                </NavLink>
              </NavItem>
            );
          })
        : null}
    </Nav>
  );
};

export default InventoryTab;