import React, { Component } from "react";
import { Table, Badge, Button } from "reactstrap";
import Loader from "../../../containers/Loader/Loader";
import { CrmFleetModal } from '../../common/CrmFleetModal'
import { connect } from "react-redux";
import { fleetEditRequest } from "../../../actions";
import { logger } from "../../../helpers/Logger";
import Validator from "js-object-validation";
import { CreateFleetValidations, CreateFleetValidMessaages } from "../../../validations";

class FleetList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openFleetModal: false,
      fleetListdata: {},
      error: {},
      isLoading: false,
    };
  }
  componentDidUpdate({ openEdit }) {
    if (this.props.openEdit !== openEdit) {
      this.setState({
        openFleetModal: false
      });
    }
  }
  handleAddFleet = (fleetData, isEditMode, fleetId) => {
    this.setState({
      error: {}
    });
    try {
      const { isValid, errors } = Validator(
        fleetData,
        CreateFleetValidations,
        CreateFleetValidMessaages
      );
      if (!isValid && ((fleetData.email !== '') || (fleetData.companyName === ''))) {
        this.setState({
          error: errors,
          isLoading: false,
        });
        return;
      }
      const userData = this.props.profileInfoReducer.profileInfo
      const userId = userData._id
      const parentId = userData.parentId
      const data = {
        fleetData: fleetData,
        userId: userId,
        parentId: parentId,
        fleetId: fleetId
      }
      if (isEditMode) {
        this.props.updateFleet(data)
        this.setState({
          openCreate: !this.state.openCreate
        })
      }
    } catch (error) {
      logger(error);
    }
  }
  editFleet = fleetData => {
    this.setState({
      openFleetModal: true,
      fleetListdata: fleetData
    });
  };
  onUpdate = (id, data) => {
    this.props.onUpdate(id, data);
  };
  render() {
    const { openFleetModal, fleetListdata, error } = this.state
    const { fleetListData } = this.props;
    const { isLoading, fleetData } = fleetListData;
    return (
      <>
        <Table responsive bordered>
          <thead>
            <tr>
              <th>Company Name</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Vehicles</th>
              <th>Orders</th>
              <th>Lables</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {!isLoading ? (
              fleetData.length ? (
                fleetData.map((data, index) => {
                  return (
                    <tr key={index}>
                      <td>{data.companyName || "-"}</td>
                      <td>{data.phone || "-"}</td>
                      <td>{data.email || "-"}</td>
                      <td>0</td>
                      <td>0</td>
                      <td className="text-center">
                        <button className="btn btn-sm btn-primary btn-round"><i className="fas fa-plus-square" /></button>
                      </td>
                      <td>
                        {data.status ? (
                          <Badge color="success">Active</Badge>
                        ) : (
                            <Badge color="danger">Inactive</Badge>
                          )}
                      </td>
                      <td>
                        <Button
                          color={"primary"}
                          size={"sm"}
                          onClick={() => this.editFleet(data)}
                        >
                          <i className={"fa fa-edit"} />
                        </Button>{" "}
                        &nbsp;
                        <Button
                          color={"danger"}
                          size={"sm"}
                        >
                          <i className={"fa fa-trash"} />
                        </Button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                  <tr>
                    <td className={"text-center"} colSpan={8}>
                      No Fleet Found
                  </td>
                  </tr>
                )
            ) : (
                <tr>
                  <td className={"text-center"} colSpan={10}>
                    <Loader />
                  </td>
                </tr>
              )
            }
          </tbody>
        </Table>
        {/* {totalUsers ? (
          <PaginationHelper
            totalRecords={totalUsers}
            onPageChanged={this.props.onPageChange}
          />
        ) : null} */}
        <CrmFleetModal
          fleetModalOpen={openFleetModal}
          handleFleetModal={() => {
            this.setState({
              openFleetModal: false,
              fleetData: {}
            });
          }}
          fleetData={fleetListdata}
          handleAddFleet={this.handleAddFleet}
          errorMessage={error}
          updateFleet={this.onUpdate}
        />
      </>
    );
  }
}

const mapStateToProps = state => ({
  profileInfoReducer: state.profileInfoReducer,
});

const mapDispatchToProps = dispatch => ({
  updateFleet: (data) => {
    dispatch(fleetEditRequest(data))
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FleetList);
