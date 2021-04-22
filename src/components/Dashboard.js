import React, { Component } from "react";

import classnames from "classnames";

import Loading from "./Loading";
import Panel from "./Panel";

const data = [
  {
    id: 1,
    label: "Total Interviews",
    value: 6
  },
  {
    id: 2,
    label: "Least Popular Time Slot",
    value: "1pm"
  },
  {
    id: 3,
    label: "Most Popular Day",
    value: "Wednesday"
  },
  {
    id: 4,
    label: "Interviews Per Day",
    value: "2.3"
  }
];

class Dashboard extends Component {

  state = {
    loading: false,
    focused: null // null (4-panel view) or id = 1-4 (1-panel view)
  };

  render() {
    const dashboardClasses = classnames("dashboard");

    if (this.state.loading) {
      return <Loading />;
    }

    const panels = data
      // Filter panel data (all of none focused, or only 1 panel if id is specified)
      .filter(panel => {
        return this.state.focused === null || this.state.focused === panel.id
      })
      // Convert panel(s) into components
      .map(panel => {
        const dashboardClasses = classnames("dashboard", {
          "dashboard--focused": this.state.focused
        })
        return (
          <Panel
            key={panel.id}
            id={panel.id}
            label={panel.label}
            value={panel.value}
            className={dashboardClasses}
          />
        );
      })

    return <main className={dashboardClasses}>{panels}</main>;
  }

}

export default Dashboard;
