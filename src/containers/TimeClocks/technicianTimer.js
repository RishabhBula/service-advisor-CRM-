import React, { Component } from "react";
import { Card, CardBody, Col, Row, FormGroup, Label, Button } from "reactstrap";
import Avtar from "../../components/common/Avtar";
import "./index.scss";
import Select from "react-select";
import moment from "moment";
import { SecondsToHHMMSS } from "../../helpers";
import Loader from "../Loader/Loader";

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
  startTimer = (techId, orderId, index) => {
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
  stopTimer = (techId, orderId, serviceId) => {
    this.setState({
      isTimerData: true
    });
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
                    value: data.orderId._id
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
                                    users.selectedOrder.value
                                  )
                                : () => this.startTimer(users._id, index)
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
                                  users.currentlyWorking.serviceId
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
              <Loader />
            )}
        </Row>
      </div>
    );
  }
}

export default TechnicianTimer;
