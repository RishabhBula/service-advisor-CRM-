import React, { Component } from "react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction"; // needed for dayClick
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";

export default class Appointments extends Component {
  constructor(props) {
    super(props);
    this.state = {
      events: [],
    };
  }
  render() {
    return (
      <FullCalendar
        header={{
          left: "title",
          center: "prev,next today",
          right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
        }}
        defaultView="dayGridMonth"
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        weekends={false}
        timeZone={"UTC"}
        events={[
          { title: "event 1", date: "2019-04-01" },
          { title: "event 2", date: "2019-04-02" },
        ]}
        dateClick={e => {
          console.log("====================================");
          console.log(e);
          console.log("====================================");
        }}
      />
    );
  }
}
