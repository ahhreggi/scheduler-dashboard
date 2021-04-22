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

  componentDidMount() {
    const focused = JSON.parse(localStorage.getItem("focused"));

    if (focused) {
      this.setState({ focused });
    }
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
            value={panel.value}
            onSelect={event => this.selectPanel(panel.id)}
          />
        );
      });

    return <main className={dashboardClasses}>{panels}</main>;
  }

}

export default Dashboard;
