import React, { Component } from "react";
import { logger } from "../../../helpers";

class Timers extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  /**
   *
   */
  componentDidMount() {
    logger(this.props);
  }
  /**
   *
   */
  render() {
    return (
      <div>
        <h4>Timers</h4>
      </div>
    );
  }
}

export default Timers;
