import React, { Component } from "react";
import TimeLogList from "./timeLogList"

class TimeClock extends Component {
   constructor(props) {
      super(props);
      this.state = {};
   }
   render() {
      return (
         <div>
            TimeClock Data!!
            <TimeLogList />
         </div>
      );
   }
}

export default TimeClock;
