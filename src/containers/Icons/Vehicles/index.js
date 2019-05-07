import React, { Component } from "react";
import Bicycle from "./Bicycle";
import Sedan from "./Sedan";
import Truck from "./Truck";
import Trailer from "./Trailer";
import Convertible from "./Convertible";
import Coupe from "./Coupe";
import Hatchback from "./Hatchback";
import SUV from "./SUV";
import Van from "./Van";
import Wagon from "./Wagon";

class VehicleIcons extends Component {
  renderIcon = () => {
    const { type, color } = this.props;
    switch (type) {
      case "bicycle":
        return <Bicycle color={color} />;
      case "sedan":
        return <Sedan color={color} />;
      case "truck":
        return <Truck color={color} />;
      case "trailer":
        return <Trailer color={color} />;
      case "convertible":
        return <Convertible color={color} />;
      case "coupe":
        return <Coupe color={color} />;
      case "hatchback":
        return <Hatchback color={color} />;
      case "suv":
        return <SUV color={color} />;
      case "van":
        return <Van color={color} />;
      case "wagon":
        return <Wagon color={color} />;
      default:
        return <>-</>;
    }
  };
  render() {
    return <div>{this.renderIcon()}</div>;
  }
}

export default VehicleIcons;
