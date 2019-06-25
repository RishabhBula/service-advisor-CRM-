import React, { Component } from "react";
import { Button } from "reactstrap";
class Message extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div className={"message-warp"}>
        <div className={"message-tile"}>
          <div className={"user-name"}>
            <span>R</span>
          </div>
          <div className={"message-input-block border"}>
            <p>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a type specimen book. It has
              survived not only five centuries, but also the leap into
              electronic typesetting, remaining essentially unchanged. It was
              popularised in the 1960s with the release of Letraset sheets
              containing Lorem Ipsum passages, and more recently with desktop
              publishing software like Aldus PageMaker including versions of
              Lorem Ipsum.
            </p>
          </div>
          <div className={"message-tile-footer d-flex justify-content-between"}>
            <span>
              <i className="icons cui-paperclip" /> Attachment
            </span>
            <span>
              <Button color={"primary"}>Send</Button>
            </span>
          </div>
        </div>
      </div>
    );
  }
}

export default Message;
