import React, { Component } from "react";
import Dropzone from "react-dropzone";
import { logger } from "../../helpers/Logger";
import XLSX from "xlsx";

class CrmDragDrop extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  onFileDrop = files => {
    var reader = new FileReader();
    reader.onload = function(e) {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      workbook.SheetNames.forEach(sheetName => {
        const XL_row_object = XLSX.utils.sheet_to_row_object_array(
          workbook.Sheets[sheetName]
        );
        logger(XL_row_object);
      });
      /* DO SOMETHING WITH workbook HERE */
    };
    reader.readAsArrayBuffer(files[0]);
  };
  render() {
    return (
      <Dropzone onDrop={this.onFileDrop}>
        {({ getRootProps, getInputProps }) => (
          <section>
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              <p>Drag & drop some files here, or click to select files</p>
            </div>
          </section>
        )}
      </Dropzone>
    );
  }
}

export default CrmDragDrop;
