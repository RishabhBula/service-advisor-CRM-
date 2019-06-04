import React, { Component } from 'react';
import {
  Table,
} from 'reactstrap';
import * as jsPDF from "jspdf";
import { logger } from "../../../helpers";


export const generateData = (amount) => {
  var result = [];
  var data =
  {
    coin: "100",
    game_group: "GameGroup",
    game_name: "XPTO2",
    game_version: "25",
    machine: "20485861",
    vlt: "0"
  };
  for (var i = 0; i < amount; i += 1) {
    data.id = (i + 1).toString();
    result.push(Object.assign({}, data));
  }
  return result;
};

export const createHeaders = (headers) => {
  const keys = ["id", "coin", "game_group", "game_name", "game_version", "machine", "vlt"];
  var result = [];
  for (var i = 0; i < keys.length; i += 1) {
    result.push({
      'id': keys[i],
      'name': keys[i],
      'prompt': keys[i],
      'width': 65,
      'align': 'center',
      'padding': 0
    });
  }
  return result;
}

export class InspectionPdf extends Component {
  constructor(props) {
    super(props);
    this.state = {
      templateData: [],
    };
  }

  render() {
    const { templateData} = this.state
    return (
      <>
        <table id={"white-card"} >
            <thead>
              <tr>
                <th>#</th>
                <th>Template Title</th>
                <th>Items</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {templateData.map((data, index) => {
                return (
                  <tr key={index}>
                    <td>#</td>
                    <td>Template Title</td>
                    <td>Items</td>
                    <td></td>
                  </tr>
                )
              })
              }
            </tbody>
        </table>
      </>
    );
  }
}

