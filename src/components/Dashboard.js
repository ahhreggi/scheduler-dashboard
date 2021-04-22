import React, { Component } from "react";
import classnames from "classnames";
import axios from "axios";

import Loading from "./Loading";
import Panel from "./Panel";
import {
  getTotalInterviews,
  getLeastPopularTimeSlot,
  getMostPopularDay,
  getInterviewsPerDay
 } from "helpers/selectors";

const data = [
  {
    id: 1,
    label: "Total Interviews",
    getValue: getTotalInterviews
  },
  {
    id: 2,
    label: "Least Popular Time Slot",
    getValue: getLeastPopularTimeSlot
  },
  {
    id: 3,
    label: "Most Popular Day",
    getValue: getMostPopularDay
  },
  {
    id: 4,
    label: "Interviews Per Day",
    getValue: getInterviewsPerDay
  }
];

class Dashboard extends Component {

  state = {
    loading: true,
    focused: null, // null (4-panel view) or id = 1-4 (1-panel view)
    days: [],
    appointments: {},
    interviewers: {}
  };

  componentDidMount() {
    const focused = JSON.parse(localStorage.getItem("focused"));

    if (focused) {
      this.setState({ focused });
    }

    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("/api/interviewers")
    ]).then(([days, appointments, interviewers]) => {
      this.setState({
        loading: false,
        days: days.data,
        appointments: appointments.data,
        interviewers: interviewers.data
      });
    });
  }

  componentDidUpdate(previousProps, previousState) {
    if (previousState.focused !== this.state.focused) {
      localStorage.setItem("focused", JSON.stringify(this.state.focused));
    }
  }

  selectPanel(id) {
    this.setState(prev => ({
      focused: prev.focused !== null ? null : id
    }));
  }

  render() {

    if (this.state.loading) {
      return <Loading />;
    }

    const dashboardClasses = classnames("dashboard", {
      "dashboard--focused": this.state.focused
    })

    const panels = data
      // Filter panel data (all of none focused, or only 1 panel if id is specified)
      .filter(panel => {
        return this.state.focused === null || this.state.focused === panel.id
      })
      // Convert panel(s) into components
      .map(panel => {
        return (
          <Panel
            key={panel.id}
            id={panel.id}
            label={panel.label}
            value={panel.getValue(this.state)}
            onSelect={event => this.selectPanel(panel.id)}
          />
        );
      });

    return <main className={dashboardClasses}>{panels}</main>;
  }

}

export default Dashboard;
