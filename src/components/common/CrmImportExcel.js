import React, { Component } from "react";
import {
  Button,
  Row,
  Col,
  Table,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane
} from "reactstrap";
import * as classnames from "classnames";
import CRMModal from "./Modal";
import CrmDragDrop from "./CrmDragDrop";
import { logger } from "../../helpers/Logger";
import XLSX from "xlsx";
import Loader from "../../containers/Loader/Loader";
import { connect } from "react-redux";
import { modelOpenRequest } from "../../actions";

class CrmImportExcel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      file: null,
      fileError: undefined,
      sheets: [],
      activeSheet: 0
    };
  }
  toggleImportModal = () => {
    this.setState({
      isLoading: false,
      file: null,
      fileError: undefined,
      sheets: [],
      activeSheet: 0
    });
    this.props.toggleModal(!this.props.isOpen);
  };
  onImport = () => {
    const { file, sheets } = this.state;
    if (!file) {
      this.setState({ fileError: "Please choose at least one file." });
      return;
    }
    this.setState({
      sheets: [],
      activeSheet: 0,
      isLoading: true
    });
    const reader = new FileReader();
    reader.onload = e => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      workbook.SheetNames.forEach(sheetName => {
        const XL_row_object = XLSX.utils.sheet_to_row_object_array(
          workbook.Sheets[sheetName]
        );

        let outputableHeader;
        for (let i = 0; i < XL_row_object.length; i++) {
          const element = XL_row_object[i];
          if (i === 0) {
            const header = [];
            for (const key in element) {
              if (element.hasOwnProperty(key)) {
                header.push(key);
              }
            }
            outputableHeader = header;
          }
          element.sheetName = sheetName;
          element.rowNumber = i + 1;
        }
        const outputableData = XL_row_object;
        sheets.push({
          name: sheetName,
          header: outputableHeader,
          data: outputableData
        });
      });
      this.setState({
        sheets,
        isLoading: false
      });
    };
    reader.readAsArrayBuffer(file);
  };
  onImportData = () => {
    const { sheets } = this.state;
    const { onImport } = this.props;
    let dataToImport = [];
    sheets.forEach(sheet => (dataToImport = dataToImport.concat(sheet.data)));
    if (onImport) {
      onImport(dataToImport);
    }
  };
  modalOptions = () => {
    const { modalHeaderText, isOpen } = this.props;
    const { sheets } = this.state;
    return {
      isOpen,
      headerText: modalHeaderText || "Import Data",
      toggle: this.toggleImportModal,
      footerButtons: [
        {
          text: sheets.length ? modalHeaderText || "Import Data" : "Confirm",
          type: "submit",
          color: "primary",
          onClick: sheets.length ? this.onImportData : this.onImport
        },
        {
          text: "Cancel",
          type: "button",
          onClick: this.toggleImportModal
        }
      ]
    };
  };
  onFileDrop = file => {
    this.setState({
      file,
      fileError: "",
      sheets: []
    });
  };
  renderTable = sheet => {
    return (
      <div className={"table-responsive"} style={{ height: 250 }}>
        <Table striped size="sm">
          <thead>
            <tr>
              {sheet.header &&
                sheet.header.map((head, ind) => {
                  return <th key={ind}>{head}</th>;
                })}
            </tr>
          </thead>
          <tbody>
            {sheet.data &&
              sheet.data.map((data, index) => {
                return (
                  <tr index={Math.random()}>
                    {sheet.header
                      ? sheet.header.map((d, i) => {
                          return <td key={index + i}>{data[d]}</td>;
                        })
                      : null}
                  </tr>
                );
              })}
          </tbody>
        </Table>
      </div>
    );
  };
  renderSheets = () => {
    const { sheets, activeSheet } = this.state;
    let totalRecords = 0;
    return (
      <>
        <Nav tabs>
          {sheets &&
            sheets.map((sheet, index) => {
              return (
                <NavItem key={index}>
                  <NavLink
                    className={classnames({
                      active: activeSheet === index
                    })}
                    onClick={() => {
                      this.setState({
                        activeSheet: index
                      });
                    }}
                  >
                    {sheet.name}
                  </NavLink>
                </NavItem>
              );
            })}
        </Nav>
        <TabContent activeTab={activeSheet}>
          {sheets &&
            sheets.map((sheet, index) => {
              totalRecords =
                totalRecords + (sheet.data ? sheet.data.length : 0);
              return (
                <TabPane tabId={index}>
                  <Row>
                    <Col sm="12">{this.renderTable(sheet)}</Col>
                  </Row>
                </TabPane>
              );
            })}
        </TabContent>
        <br />
        <h4>Total Records: {totalRecords}</h4>
      </>
    );
  };
  render() {
    const { buttonText, btnColor } = this.props;
    const { isLoading, fileError, sheets } = this.state;
    logger(isLoading);
    return (
      <>
        <Button color={btnColor || "primary"} onClick={this.toggleImportModal}>
          {buttonText || "Import Excel"}
        </Button>
        <CRMModal {...this.modalOptions()}>
          <Row>
            <Col sm={{ size: 4, offset: 4 }}>
              <CrmDragDrop
                accept={[".xlsx", ".xls", ".csv"]}
                acceptMessage={"Only CSV/Excel files are allowed"}
                onFileDrop={this.onFileDrop}
                containerClass={fileError ? "dropzone-error text-danger" : null}
              />
              {fileError ? <p className={"text-danger"}>{fileError}</p> : null}
            </Col>
            <Col sm={12}>
              {isLoading ? (
                <>
                  <Loader />
                </>
              ) : sheets.length ? (
                this.renderSheets()
              ) : null}
            </Col>
          </Row>
        </CRMModal>
      </>
    );
  }
}
const mapStateToProps = state => ({
  isOpen: state.modelInfoReducer.modelDetails.showImportModal
});

const mapDispatchToProps = dispatch => ({
  toggleModal: isOpen => {
    dispatch(
      modelOpenRequest({
        modelDetails: {
          showImportModal: isOpen
        }
      })
    );
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CrmImportExcel);
