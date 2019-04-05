import React, { Component } from "react";
import { logger } from "../../helpers/Logger";

class UserList extends Component {
  render() {
    const { userData } = this.props;
    const { users, isLoading } = userData;
    logger(users);
    logger(isLoading);
    return <div>fasdfsad</div>;
  }
}

export default UserList;
