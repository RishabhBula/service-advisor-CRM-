import React, { Component } from 'react';
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Table,
} from 'reactstrap';
import { Async } from "react-select";
import NoFound from "../../common/NoFound"

class Templates extends Component {
  constructor(props) {
    super(props);
    this.state = {
      templateData: [],
      page: 1,
      search: "",
      sort: "",
      filterApplied: false,
      searchInput: ""
    };
  }

  componentDidMount = () => {
    this.props.getTemplateList()
  }

  componentDidUpdate = ({ inspectionData }) => {
    let propdata = this.props.inspectionData;
    if (propdata.templateData && inspectionData !== propdata) {
      this.setState({
        templateData: propdata.templateData
      })
    }
  }

  handleChange = e => {
    if (e && e.value) {
      this.setState({
        search: e
      },
        () => {
          this.props.getTemplateList({ 'search': this.state.search.label });
        });
    } else {
      this.setState({
        search: ""
      }, () => {
        this.props.getTemplateList();
      });
    }
  };

  loadOptions = (search, callback) => {
    this.setState({ search: search.length > 1 ? search : null });
    this.props.getTemplateList({ search, callback });
  };

  render() {
    const { templateData, search } = this.state
    return (
      <>
        <Modal
          isOpen={this.props.isOpen}
          toggle={this.props.toggle}
          backdrop={"static"}
          className="customer-modal custom-form-modal custom-modal-lg"
        >
          <ModalHeader>
            <Button className="close" onClick={this.props.toggle}>
              <span aria-hidden="true">×</span>
            </Button>
            Template List
          </ModalHeader>
          <ModalBody>
            <div className={"search-block mb-2 bg-secondary p-2"}>
              {/* <Input type={"text"} value={search} name="search" onChange={this.handleChange}/> */}
              <Async
                placeholder={"Type template title"}
                loadOptions={this.loadOptions}
                value={search}
                onChange={e => this.handleChange(e)}
                isClearable={true}
                noOptionsMessage={() =>
                  search ? "No Template found" : "Type Template Title"
                }
              />
            </div>
            <Table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Template Title</th>
                  <th className={"text-center"}>Items</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {templateData && templateData.length ? (
                  templateData.map((data, index) => {
                    return (
                      <tr key={index}>
                        <th scope="row">{index + 1}</th>
                        <td width={"150"}>{data.inspectionName || "-"}</td>
                        <td className={"text-center"}>
                          {data.items.length || 0}
                        </td>
                        <td>
                          <span>
                            <Button
                              onClick={() => this.props.addTemplate(data)}
                            >
                              Add
                            </Button>
                            &nbsp;&nbsp;
                            <Button
                              onClick={() =>
                                this.props.removeTemplate(data)
                              }
                            >
                              Delete
                            </Button>
                          </span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={"4"} className={"text-center"}>
                      <NoFound message={"No any template available"} />
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </ModalBody>
          <ModalFooter />
        </Modal>
      </>
    );
  }
}

export default (Templates)