import React, { Component } from "react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction"; // needed for dayClick
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import moment from "moment";
import { logger } from "../../helpers";

export default class Appointments extends Component {
  constructor(props) {
    super(props);
    this.state = {
      events: []
    };
  }
  /**
   *
   */
  onDateClick = ({ date, ...props }) => {
    logger(props);
    if (moment(date).diff(moment(), "days") >= 0) {
      this.props.addAppointment(null, date);
    }
  };
  /**
   *
   */
  onEventClick = info => {
    this.props.onEventClick(info.event.id);
  };
  /**
   *
   */
  render() {
    let { data } = this.props;
    if (!data) {
      data = [];
    }
    const events = data.map(event => {
      const startHours = moment.utc(event.startTime).format("HH");
      const endHours = moment.utc(event.endTime).format("HH");
      const startMin = moment.utc(event.startTime).format("HH");
      const endMin = moment.utc(event.endTime).format("HH");

      return {
        id: event._id,
        title: event.appointmentTitle,
        start: new Date(
          new Date(event.appointmentDate).setUTCHours(startHours)
        ).setUTCMinutes(startMin),
        end: new Date(
          new Date(event.appointmentDate).setUTCHours(endHours)
        ).setUTCMinutes(endMin),
        color: event.appointmentColor,
        customRender: true
      };
    });
    return (
      <FullCalendar
        header={{
          left: "title",
          center: "prev,next today",
          right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek"
        }}
        defaultView="dayGridMonth"
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        weekends={true}
        events={events}
        displayEventTime={true}
        displayEventEnd={true}
        eventClick={this.onEventClick}
        dateClick={this.onDateClick}
      />
    );
  }
}
