import React, { Component } from "react";
import { Table, Badge } from "reactstrap";
import Loader from "../../containers/Loader/Loader";
import { formateDate } from "../../helpers/Date";
import PaginationHelper from "../../helpers/Pagination";
class UserList extends Component {
  render() {
    const { userData } = this.props;
    const { users, isLoading, totalUsers } = userData;
    return (
      <>
        <Table responsive bordered>
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Date registered</th>
              <th>Last Login At</th>
              <th>Last Login IP</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {!isLoading ? (
              users.length ? (
                users.map((user, index) => {
                  return (
                    <tr key={index}>
                      <td>{user.firstName || "-"}</td>
                      <td>{user.lastName || "-"}</td>
                      <td>{user.email || "-"}</td>
                      <td>{user.email || "-"}</td>
                      <td>{user.email || "-"}</td>
                      <td>{user.role || "-"}</td>
                      <td>
                        {user.createdAt ? formateDate(user.createdAt) : "-"}
                      </td>
                      <td>
                        <Badge color="success">Active</Badge>
                      </td>
                      <td>
                        <i className={"fa fa-edit"} /> &nbsp;
                        <i className={"fa fa-trash"} />
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td className={"text-center"} colSpan={10}>
                    No staff member found
                  </td>
                </tr>
              )
            ) : (
              <tr>
                <td className={"text-center"} colSpan={10}>
                  <Loader />
                </td>
              </tr>
            )}
          </tbody>
        </Table>
        {totalUsers && !isLoading ? (
          <PaginationHelper
            totalRecords={totalUsers}
            onPageChanged={this.props.onPageChange}
          />
        ) : null}
      </>
    );
  }
}

export default UserList;
