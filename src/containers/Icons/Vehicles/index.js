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
        return <Bicycle color={color || '#000'} />;
      case "sedan":
        return <Sedan color={color || '#000'} />;
      case "truck":
        return <Truck color={color || '#000'} />;
      case "trailer":
        return <Trailer color={color || '#000'} />;
      case "convertible":
        return <Convertible color={color || '#000'} />;
      case "coupe":
        return <Coupe color={color || '#000'} />;
      case "hatchback":
        return <Hatchback color={color || '#000'} />;
      case "suv":
        return <SUV color={color || '#000'} />;
      case "van":
        return <Van color={color || '#000'} />;
      case "wagon":
        return <Wagon color={color || '#000'} />;
      default:
        return <>-</>;
    }
  };
  render() {
    return <div>{this.renderIcon()}</div>;
  }
}

export default VehicleIcons;
