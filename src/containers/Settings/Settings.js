import React, { Component, Suspense } from "react";
import { Route, Switch } from "react-router-dom";
import { Row, Col } from "reactstrap";
import Loader from "../Loader/Loader";

const Sidebar = React.lazy(() => import("./Sidebar"));
const Users = React.lazy(() => import("./Users"));

const SettingsNav = [
  {
    heading: true,
    icon: "fa fa-cog",
    name: "Settings",
  },
  {
    icon: "fa fa-users",
    name: "Users",
    link: "/settings/users",
  },
];
const SettingRoutes = [
  { path: "/settings/users", name: "Settings", component: Users },
];
class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="animated fadeIn">
        <Row>
          <Col sm={"2"}>
            <Suspense fallback={<Loader />}>
              <Sidebar navItems={SettingsNav} />
            </Suspense>
          </Col>
          <Col sm={"10"}>
            <Suspense fallback={<Loader />}>
              <Switch>
                {SettingRoutes.map((route, idx) => {
                  return route.component ? (
                    <Route
                      key={idx}
                      path={route.path}
                      exact={route.exact}
                      name={route.name}
                      render={props => <route.component {...props} />}
                    />
                  ) : null;
                })}
              </Switch>
            </Suspense>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Settings;
