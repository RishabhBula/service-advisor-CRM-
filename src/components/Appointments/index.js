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
    console.log("$$$$$$$$$$$$$$$$$", moment(date).diff(moment(), "days"));

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
    let { data, filter } = this.props;
    if (!data) {
      data = [];
    }
    const events = data.map(event => {
      const startHours = moment.utc(event.startTime).format("HH");
      const endHours = moment.utc(event.endTime).format("HH");
      const startMin = moment.utc(event.startTime).format("mm");
      const endMin = moment.utc(event.endTime).format("mm");
      let appointmentDate = new Date(event.appointmentDate);
      return {
        id: event._id,
        title: event.appointmentTitle,
        start: new Date(appointmentDate).setUTCHours(startHours, startMin),
        end: startHours < endHours || (startHours === endHours && startMin <= endMin) ? new Date(appointmentDate).setUTCHours(endHours, endMin) : new Date(appointmentDate.setDate(appointmentDate.getDate() + 1)).setUTCHours(endHours, endMin),
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
        defaultView={filter && filter !== {} && filter.search ? (filter.search !== "today" && filter.search !== "week" ? "dayGridMonth" : (filter.search === "today" ? "timeGridDay" : "timeGridWeek")) : "dayGridMonth"}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        weekends={true}
        timeZone='UTC'
        events={events}
        displayEventTime={true}
        displayEventEnd={true}
        eventClick={this.onEventClick}
        dateClick={this.onDateClick}
        eventLimit={4}
        showNonCurrentDates={false}
        fixedWeekCount={false}
        slotLabelFormat={[
          {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          }
        ]}
        eventTimeFormat={{
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        }}
      />
    );
  }
}
