import React, { Component } from "react";
import {
  Col,
  Row,
  Popover,
  PopoverBody,
  PopoverHeader,
  Card,
  CardBody,
} from "reactstrap";
import { FullCalendar } from "primereact/fullcalendar";
import CrmCircleIcon from "../../components/common/CrmCircleIcon";
import "primeicons/primeicons.css";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/nova-light/theme.css";

class Calender extends Component {
  constructor(props) {
    super(props);
    this.state = {
      resources: [
        { id: 1, title: "Event Title 1" },
        { id: 2, title: "Event Title 2" },
        { id: 4, title: "Event Title 4" },
      ],
      events: [
        {
          id: 1,
          title: "All Day Event",
          start: "2017-02-01",
          description: "1 description",
        },
        {
          id: 2,
          title: "Long Event",
          start: "2017-02-07",
          end: "2017-02-10",
          description: "2 description",
        },
        {
          id: 3,
          title: "Repeating Event",
          start: "2017-02-09T16:00:00",
          description: "3 description",
        },
        {
          id: 4,
          title: "Event in bold",
          start: "2017-02-16T16:00:00",
          description: "4 description",
        },
        {
          id: 5,
          title: "Conference",
          start: "2017-02-11",
          end: "2017-02-13",
          description: "5 description",
        },
        {
          id: 6,
          title: "Meeting",
          start: "2017-02-12T10:30:00",
          end: "2017-02-12T12:30:00",
          description: "6 description",
        },
        {
          id: 7,
          title: "Lunch",
          start: "2017-02-12T12:00:00",
          description: "7 description",
        },
        {
          id: 8,
          title: "Meeting",
          start: "2017-02-12T14:30:00",
          description: "8 description",
        },
        {
          id: 9,
          title: "Happy Hour",
          start: "2017-02-12T17:30:00",
          description: "9 description",
        },
        {
          id: 10,
          title: "Dinner",
          start: "2017-03-30T20:00:00",
          description: "10 description",
        },
        {
          id: 11,
          title: "Birthday Party",
          start: "2017-03-30T07:00:00",
          description: "11 description",
        },
        {
          id: 12,
          title: "Click for Google",
          url: "http://google.com/",
          start: "2017-02-28",
          description: "12 description",
        },
      ],
      options: {
        defaultDate: "2017-02-01",
        header: {
          left:
            "today prev,next month,agendaWeek,agendaDay,popover myCustomButton",
          center: "title",
          right: "",
        },
        editable: true,
        dateClick: e => {
          //console.log(e);
        },
        eventClick: this.handleEventClick.bind(this),
        // eventClick: info => {
        //   console.log(info);
        //   console.log(info.event.extendedProps.description);
        //   console.log(info.event.title);

        //   info.el.style.borderColor = "red";
        // },
        eventRender: this.handleRenderEventClick.bind(this),
        // eventRender: function(event, element) {
        //   console.log(element);
        //   return (
        //     <Popover
        //       placement="bottom"
        //       isOpen={this.state.popoverOpen}
        //       target="Popover1"
        //       toggle={this.toggle}
        //     >
        //       <PopoverHeader>{event.title}</PopoverHeader>
        //       <PopoverBody>{event.description}</PopoverBody>
        //     </Popover>
        //   );
        // },
      },
      calenderData: {},
    };
  }

  handleEventClick(element) {
    return (
      <Popover
        placement="bottom"
        isOpen={true}
        target="Popover1"
        toggle={this.toggle}
      >
        <PopoverHeader>{element.event.extendedProps.description}</PopoverHeader>
        <PopoverBody>{element.event.extendedProps.description}</PopoverBody>
      </Popover>
    );
  }

  handleRenderEventClick(element) {
    console.log("element");
    console.log(element);
    console.log(element.event.extendedProps.description);
  }

  showPopup() {
    alert("testing");
  }

  render() {
    return (
      <div className="animated fadeIn">
        <Card>
          <CardBody>
            <Row className="mb-4">
              <Col className="title-left-section">
                <h4 class="card-title">Calendar</h4>
              </Col>
              <Col className="text-right title-right-section">
                <button class="btn btn-primary btn-sm">
                  {" "}
                  <i className="fa fa-plus mr-1" />
                  New Appointment
                </button>
                <CrmCircleIcon
                  circleIconPass={"icon-settings"}
                  cssPass={{
                    width: "28px",
                    height: "28px",
                    marginLeft: "4px",
                    fontSize: "18px",
                  }}
                />
              </Col>
            </Row>

            <FullCalendar
              ref={el => (this.fc = el)}
              events={this.state.events}
              options={this.state.options}
            />
          </CardBody>
        </Card>
      </div>
    );
  }
}

export default Calender;
