import React, { Component } from "react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction"; // needed for dayClick
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import rrulePlugin from '@fullcalendar/rrule';
import moment from "moment";
import { logger } from "../../helpers";
import "./index.scss"
import { AppRoutes } from "../../config/AppRoutes";

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
    if (!(info.event.url)) {
      this.props.onEventClick(info.event.id);
    } else {
      this.props.onGoPage(info.event.url);
    }
  };
  /**
   *
   */
  render() {
    let { data, filter, userReducer } = this.props;
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
    let events1 = [];
    if (userReducer && userReducer.users && userReducer.users.length) {
      // events1 = userReducer.users.map(event => {
      //   const anniversaryNo = moment().diff(moment(event.createdAt), "year");
      //   const url = (AppRoutes.STAFF_MEMBERS_DETAILS.url).replace(":id", event._id);
      //   return {
      //     id: event._id,
      //     title: `${event.firstName ? event.firstName : ""} ${event.lastName ? event.lastName : ""} ${anniversaryNo > 0 ? anniversaryNo + "th" : ""} anniversary`,
      //     start: new Date(event.createdAt),
      //     color: "#000",
      //     allDay: true, // will make the time hide
      //     url: `${window.location.protocol}//${window.location.host}${url}?tab=Technician%20%20Info`,
      //     rrule: {
      //       freq: 'YEARLY',
      //       interval: 1,
      //       dtstart: new Date(event.createdAt),
      //     },
      //   }
      // })
    }
    // let event = events.concat(events1);
    return (
      <div>
        <FullCalendar
          header={{
            left: "title",
            center: "prev,next today",
            right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek"
          }}
          defaultView={filter && filter !== {} && filter.search ? (filter.search !== "today" && filter.search !== "week" ? "dayGridMonth" : (filter.search === "today" ? "timeGridDay" : "timeGridWeek")) : "dayGridMonth"}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, rrulePlugin]}
          weekends={true}
          timeZone='UTC'
          eventSources={[
            {
              events: events
            },
            {
              events: events1
            }
          ]}
          // events={event}
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
      </div>
    );
  }
}
