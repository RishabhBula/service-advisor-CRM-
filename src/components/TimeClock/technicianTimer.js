import React, { Component } from "react";
import { Card, CardBody, Col, Row, FormGroup, Label, Button } from "reactstrap";
import Avtar from "../common/Avtar";
import "./index.scss";
import Select from "react-select";
import moment from "moment";
import { SecondsToHHMMSS } from "../../helpers";
import NoDataFound from "../common/NoFound"

class TechnicianTimer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      duration: [],
      userData: [],
      isTimerData: false
    };
    this.timer = [];
  }

  componentDidUpdate = ({ userReducer }) => {
    const userNewReducer = this.props.userReducer;
    const timer = userReducer.isStartTimer !== userNewReducer.isStartTimer;
    if (
      userNewReducer &&
      userNewReducer.users &&
      userNewReducer.users.length &&
      userReducer.users !== userNewReducer.users
    ) {
      userNewReducer.users.forEach(data => {
        this.state.userData.push({
          ...data,
          selectedOrder: {
            label: "",
            value: ""
          }
        });
      });
    }
    if (timer) {
      this.setState(
        {
          userData: []
        },
        () => {
          userNewReducer.users.map(data => {
            this.state.userData.push({
              ...data,
              selectedOrder: {
                label: "",
                value: ""
              }
            });
            return true;
          });
        }
      );
      // this.setState({
      //   userData: userNewReducer.users
      // })
    }
  };
  startTimer = (techId, orderId, index, orderData) => {
    const users = [...this.state.userData]
    if (users[index] && users[index].currentlyWorking) {
      users[index].currentlyWorking.generalService = orderId ? false : true
      users[index].currentlyWorking.orderId = orderId ? orderData : null
      users[index].currentlyWorking.startTime = new Date().toJSON()
    }
    this.props.timmerStartForTechnician(users)
    this.props.startTimer({
      technicianId: techId,
      orderId: orderId ? orderId : null,
      index: index
    });
  };
  /*
  /*  
  */
  startTempTimer = (index, startTime) => {
    if (this.timer[index]) {
      clearInterval(this.timer[index]);
    }
    const { duration } = this.state;
    this.timer[index] = setInterval(() => {
      duration[index] = moment().diff(moment(startTime), "seconds");
      this.setState({
        duration
      });
    }, 1000);
  };
  /*
   *
   */
  stopTimer = (techId, orderId, serviceId, index) => {
    this.setState({
      isTimerData: true
    });
    const users = [...this.state.userData]
    users[index].currentlyWorking = {
      generalService: false,
      startTime: new Date().toJSON(),
      _id: users[index].currentlyWorking._id
    }
    this.props.timmerStopForTechnician(users)
    this.setState({
      userData: users
    })
    this.props.stopTimer({
      technicianId: techId,
      orderId,
      serviceId
    });
  };
  /*
   *
   */
  handleOrderSelect = (e, index) => {
    if (e && e.value !== "") {
      const userData = [...this.state.userData];
      userData[index].selectedOrder.label = e.label;
      userData[index].selectedOrder.value = e.value;
      userData[index].selectedOrder.data = e.data;
      this.setState({
        userData
      });
    } else {
      const userData = [...this.state.userData];
      userData[index].selectedOrder.label = "General";
      userData[index].selectedOrder.value = "";
      this.setState({
        userData
      });
    }
  };
  render() {
    const { serviceData, userReducer } = this.props;
    const { duration, userData } = this.state;
    const timer = userReducer.isStartTimer;
    return (
      <div>
        <Row>
          {userData && userData.length ? (
            userData.map((users, index) => {
              let defaultOptions = [
                {
                  label: "General",
                  value: ""
                }
              ];
              const isWorking =
                users &&
                users.currentlyWorking &&
                (users.currentlyWorking.orderId ||
                  users.currentlyWorking.generalService ||
                  (timer && timer.length ? timer[index] : false));

              const startTime =
                users &&
                  users.currentlyWorking &&
                  users.currentlyWorking.startTime
                  ? users.currentlyWorking.startTime
                  : false;
              const technicicanService = serviceData.filter(
                service => service.technician === users._id
              );
              technicicanService.map(data => {
                if (users._id === data.technician && data.orderId) {
                  const dataObject = {
                    label: `Order(#${data.orderId.orderId}) ${
                      data.orderId.orderName
                      }`,
                    value: data.orderId._id,
                    data: data.orderId
                  };
                  defaultOptions.push(dataObject);
                }
                return true;
              });
              const defaultOrderSelect = {
                label: "General",
                value: ""
              };
              return (
                <Col key={index} md={"3"}>
                  <Card className={"text-center timer-display"}>
                    <div className={isWorking ? "isWorking" : ""}>
                      <CardBody>
                        <div className={"pb-2"}>
                          <Avtar
                            value={users.firstName}
                            class={"avtar-component"}
                          />
                        </div>
                        <h5 className={"technician-name"}>
                          {users.firstName} {users.lastName}
                        </h5>
                        <h6>Clocked out at 11:28am</h6>
                        <div className={"pb-2"}>
                          {isWorking ? (
                            <div className={"timer-running-manually"}>
                              {this.startTempTimer(index, startTime)}
                              {SecondsToHHMMSS(
                                duration[index] ||
                                moment().diff(moment(startTime), "seconds")
                              )}
                            </div>
                          ) : (
                              <span className={"timer-running-manually"}>
                                --:--:--
                            </span>
                            )}
                        </div>
                        <Card className={"pb-2"}>
                          <Row className={"m-0"}>
                            <div className={"task-area"}>
                              <span className={"text-day"}>Today</span>
                              <div>
                                <span>00:00</span>
                              </div>
                            </div>
                            <div className={"task-area"}>
                              <span className={"text-day"}>This Week</span>
                              <div>
                                <span>00:00</span>
                              </div>
                            </div>
                            <div className={"task-area"}>
                              <span className={"text-day"}>This Month</span>
                              <div>
                                <span>00:00</span>
                              </div>
                            </div>
                          </Row>
                        </Card>
                        <FormGroup className={"d-flex align-items-center"}>
                          <Label className={"mr-2 mb-0"}>Activity</Label>
                          <Select
                            className={"w-100 form-select"}
                            options={defaultOptions}
                            value={
                              isWorking
                                ? users.currentlyWorking.generalService
                                  ? defaultOrderSelect
                                  : {
                                    value: users.currentlyWorking.orderId,
                                    label: users.currentlyWorking.orderId ? `Order(#${users.currentlyWorking.orderId.orderId}) ${
                                      users.currentlyWorking.orderId.orderName
                                      }` : ""
                                  }
                                : users.selectedOrder.value !== "" ? users.selectedOrder : defaultOrderSelect
                            }
                            onChange={e => this.handleOrderSelect(e, index)}
                            type="select"
                          />
                        </FormGroup>
                        {!isWorking ? (
                          <Button
                            onClick={
                              users.selectedOrder.value !== ""
                                ? () =>
                                  this.startTimer(
                                    users._id,
                                    users.selectedOrder.value,
                                    index,
                                    users.selectedOrder.data
                                  )
                                : () => this.startTimer(users._id, null, index, null)
                            }
                          >
                            Clock In
                          </Button>
                        ) : (
                            <Button
                              color={"danger"}
                              onClick={() =>
                                this.stopTimer(
                                  users._id,
                                  users.currentlyWorking.orderId,
                                  users.currentlyWorking.serviceId,
                                  index
                                )
                              }
                            >
                              Clock Out
                          </Button>
                          )}
                      </CardBody>
                    </div>
                  </Card>
                </Col>
              );
            })
          ) : (
              <NoDataFound
                showAddButton
                message={"Currently there are no technician added"}
                onAddClick={this.props.onAddClick}
              />
            )}
        </Row>
      </div>
    );
  }
}

export default TechnicianTimer;
