import React, { Component } from "react";
import { AutoComplete } from "primereact/autocomplete";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText
} from "reactstrap";
class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      brandSuggestions: null
    };
    this.brands = [
      "Audi",
      "Audi1",
      "Audi2",
      "Audi3",
      "BMW",
      "Fiat",
      "Ford",
      "Honda",
      "Jaguar",
      "Mercedes",
      "Renault",
      "Volvo"
    ];
  }

  suggestBrands(event) {
    setTimeout(() => {
      let results = this.brands.filter(brand => {
        return brand.toLowerCase().startsWith(event.query.toLowerCase());
      });
      console.log(event.query.length);
      console.log(results.length);
      if (!results.length) {
        let data = ["no"];
        this.setState({ brandSuggestions: data });
      } else {
        this.setState({ brandSuggestions: results });
      }
    }, 1000);
  }

  itemTemplate(brand) {
    console.log(brand);
    if (brand === "no") {
      return (
        <div className="p-clearfix search-output">
          <div
            style={{
              fontSize: "16px",
              textAlign: "center",
              margin: "10px 10px 0 0"
            }}
          >
            {"No Data Found"}
          </div>
        </div>
      );
    } else {
      return (
        <div className="p-clearfix search-output">
          <img
            alt={brand}
            src={
              "https://www.primefaces.org/primereact/showcase/resources/demo/images/car/Audi.png"
            }
            style={{
              width: "32px",
              display: "inline-block",
              margin: "5px 0 2px 5px"
            }}
          />
          <div
            style={{
              fontSize: "16px",
              float: "right",
              margin: "10px 10px 0 0"
            }}
          >
            {brand}
          </div>
        </div>
      );
    }
  }

  render() {
    return (
      <div className="animated fadeIn">
        <InputGroup>
          <InputGroupAddon addonType="prepend">
            <InputGroupText>
              <i className="fa fa-search fa-lg " />
            </InputGroupText>
          </InputGroupAddon>
          <AutoComplete
            value={this.state.brand}
            suggestions={this.state.brandSuggestions}
            completeMethod={this.suggestBrands.bind(this)}
            size={80}
            minLength={1}
            placeholder="Search customer, cars, orders, or vendors"
            itemTemplate={this.itemTemplate.bind(this)}
            onChange={e => this.setState({ brand: e.value })}
            inputClassName="form-control search-input"
            className="search-input-parent"
          />
        </InputGroup>
      </div>
    );
  }
}

export default SearchBar;
