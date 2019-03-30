import React, { Component } from "react";
import { SmallModels } from "../../components/common/CrmModal";
import {
  Badge,
  Col,
  Nav,
  NavItem,
  NavLink,
  Row,
  Button,
} from "reactstrap";
import classnames from "classnames";
import Avatar from "react-avatar";
class CommonPage extends Component {
  constructor(props) {
    super(props);

  
    this.state = {      
      smallModelDisplay: false
    };
  }

  handleSmallModel = () => {
    this.setState({
      smallModelDisplay: !this.state.smallModelDisplay
    })
  }

  render() {

    return (
      <div className="animated fadeIn">
        <Row>
          <Col xs="12" md="12" className="">
            <div className="margin-top-10 page-title">
              <h4 className="">Common Model Component</h4>
            </div>
            <Button
              color="primary"
              onClick={this.handleSmallModel}
              className="mr-1"
            >
              Small Model
            </Button>
            <SmallModels
              smallModelDisplay={this.state.smallModelDisplay}
              handleSmallModel={this.handleSmallModel}
            />
          </Col>
        </Row>
        <Row>
          <Col xs="12" md="12" className="mb-4">
            50 px <Avatar name="Foo Bar" size="50" round={true} />
            50px{" "}<Avatar src={"/assets/img/avatars/6.jpg"} size="50" round={true}/>
            100px{" "}<Avatar src={"/assets/img/avatars/6.jpg"} size="100" round={true}/>
            100px <Avatar name="Foo Bar" size="100" round={true} />
          </Col>
        </Row>
      </div>
    );
  }
}

export default CommonPage;
