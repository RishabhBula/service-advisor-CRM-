import React, { Component } from "react";
import { AppSwitch } from "@coreui/react";
import Validator from "js-object-validation";
import DiscountBtn from '../CrmDiscountBtn';
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Col,
  Badge,
  FormGroup,
  Label,
  Input,
  FormFeedback
} from "reactstrap";
import {
  LabourText,
  LabourTextDefault
} from "../../../config/Constants";
import {
  CreateRateValidations,
  CreateRateValidMessaages,
  CreateLabourValidations,
  CreateLabourValidMessaages
} from "../../../validations";
import { CrmStandardModel } from "../../common/CrmStandardModel";
import Async from "react-select/lib/Async";
import moment from 'moment';
export class CrmLabourModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      discription: "",
      note: "",
      rate: "",
      hours: "",
      labourId: '',
      errors: {},
      isEditMode: 0,
      discountType: '$',
      labourInput: "",
      permission: LabourTextDefault,
      discount: "",
      updatedAt:"",
      selectedRateOptions: {
        label: "",
        value: ""
      },
      openStadardRateModel: false
    };
  }
  stdModelFun = () => {
    this.props.rateAddModalFun();
  };
  handleChange = event => {
    const { name, value } = event.target;
    if (name === 'discount') {
      this.setState({
        [name]: (this.state.discountType === '%' && value === '') ? value.replace('%', '') + '%' : value
      });
    } else {
      this.setState({
        [name]: value
      });
    }

  };
  componentDidUpdate({ tyreModalOpen, dataLabour, rateStandardListData }) {
    if (tyreModalOpen !== this.props.tyreModalOpen && !this.props.dataLabour) {
      this.removeAllState();
    }
    if (this.props.rateStandardListData.selectedOptions !== rateStandardListData.selectedOptions) {
      const { selectedOptions } = this.props.rateStandardListData
      this.setState({
        selectedRateOptions: {
          value: selectedOptions && selectedOptions.value ? selectedOptions.value : '',
          label: selectedOptions && selectedOptions.label ? selectedOptions.label : ''
        }
      })
    }
    if (
      this.props.dataLabour &&
      this.props.dataLabour._id &&
      (dataLabour._id !== this.props.dataLabour._id)
    ) {
      this.setState({
        discription: this.props.dataLabour.discription,
        note: this.props.dataLabour.notes,
        rate: this.props.dataLabour.rate,
        hours: this.props.dataLabour.hours,
        isEditMode: 1,
        errors: {},
        updatedAt:this.props.dataLabour.updatedAt,
        labourId: this.props.dataLabour._id,
        discountType: this.props.dataLabour.discount !== '' && this.props.dataLabour.discount.includes("%") ? '%' : '$',
        permission: this.props.dataLabour.permission,
        selectedLabourRate: this.props.setDefaultRate({ value: this.props.dataLabour.rate && this.props.dataLabour.rate._id ? this.props.dataLabour.rate._id : '', label: this.props.dataLabour.rate && this.props.dataLabour.rate.name ? this.props.dataLabour.rate.name + ' - $' + this.props.dataLabour.rate.hourlyRate : 'Type to select' }),
        discount: this.props.dataLabour.discount,
        openStadardRateModel: false
      })
    }
  }
  async removeAllState() {
    this.setState({
      discription: "",
      note: "",
      rate: "",
      hours: "",
      errors: {},
      isEditMode: 0,
      discountType: '$',
      updatedAt:'',
      permission: LabourTextDefault,
      selectedLabourRate:'',
      discount: "",
      openStadardRateModel: false
    })
  }
  handleRateAdd = async data => {
    const profileData = this.props.profileInfoReducer;
    const { isValid, errors } = Validator(
      data,
      CreateRateValidations,
      CreateRateValidMessaages
    );
    if (!isValid) {
      this.setState({
        errors: errors,
        isLoading: false
      });
      return;
    } else {
      const ratedata = {
        data: data,
        userId: profileData._id,
        parentId: profileData.parentId
      };
      this.props.addRate(ratedata);
    }
  };
  handleClick(singleState, e) {
    const { permission } = this.state;
    permission[singleState] = e.target.checked;
    this.setState({
      ...permission
    });
  }
  handleClickDiscountType = value => {
    this.setState({
      discount: (this.state.discount !== '' && value === '%') ? this.state.discount.replace('%', '') + '%' : this.state.discount.replace('%', ''),
      discountType: value,
    });
  }
  handleStandardRate = e => {
    if (e) {
      if (e.value === "") {
        this.props.rateAddModalFun();
      }
      this.setState({
        selectedRateOptions: {
          value: e.value,
          label: e.label
        }
      })
    } else {
      this.setState({
        selectedRateOptions: {
          value: "",
          label: ""
        }
      })
    }
  };

  handleLabourAdd = () => {
    const { selectedRateOptions } = this.state;
    let data = {
      discription: this.state.discription,
      notes: this.state.note,
      hours: this.state.hours,
      permission: this.state.permission,
      rate: (selectedRateOptions &&
        selectedRateOptions.value) ? selectedRateOptions.value : null,
      discount: this.state.discount,
    }
    const { isValid, errors } = Validator(
      data,
      CreateLabourValidations,
      CreateLabourValidMessaages
    );
    if (!isValid) {
      this.setState({
        errors: errors,
      });
      return;
    }
    if (this.state.isEditMode) {
      data.labourId = this.state.labourId;
      this.props.updateLabour(data);
    } else {
      this.props.addLabour(data);
    }

  }
  loadOptions = (input, callback) => {
    this.setState({ labourInput: input.length > 1 ? input : null });
    this.props.getStdList({ input, callback });
  };
  render() {
    const { tyreModalOpen, handleLabourModal, rateAddModalProp,dataLabour } = this.props;
    const { errors, selectedRateOptions } = this.state;
    const {
      discription,
      note,
      hours,
      discountType,
      discount,
      isEditMode,
      permission,
      updatedAt,
    } = this.state;
    return (
      <>
        <Modal
          isOpen={tyreModalOpen}
          toggle={handleLabourModal}
          backdrop={"static"}
          className="customer-modal custom-form-modal custom-modal-lg"
        >
          <ModalHeader toggle={handleLabourModal}>{isEditMode ? `Update labour detail` : 'Create New Labour'}</ModalHeader>
          <ModalBody>
            <div className="">
              <Row >
                <Col md="6">
                  <FormGroup>
                    <Label htmlFor="name" className="customer-modal-text-style">
                      Labour Description <span className={"asteric"}>*</span>
                    </Label>
                    <div className="input-block">
                      <Input className={"form-control"} type={"text"} id="discription" name=
                        "discription" maxLength="100" onChange={this.handleChange} value={discription} invalid={errors.discription && !discription} placeholder={"Labour Description"} />
                      <FormFeedback>
                        {errors && !discription && errors.discription
                          ? errors.discription
                          : null}
                      </FormFeedback>
                    </div>
                  </FormGroup>
                </Col>
                <Col md="6">
                  <FormGroup>
                    <Label htmlFor="name" className="customer-modal-text-style">
                      Rate
                    </Label>

                    <div md="12" className={"fleet-block rate-standard-list rate-labour"}
                    >
                      <Async
                        placeholder={"Type to select"}
                        loadOptions={this.loadOptions}
                        onChange={e => {
                          this.handleStandardRate(e)
                        }}
                        isClearable={true}
                        value={selectedRateOptions && selectedRateOptions.value!=='' ? selectedRateOptions : ""}
                        noOptionsMessage={() =>"Please type rate name to search"}
                      />
                    </div>
                  </FormGroup>
                </Col>
                <Col md="6">
                  <FormGroup>
                    <Label htmlFor="name" className="customer-modal-text-style">
                      Hours
                    </Label>
                    <div className="input-block">
                      <Input className={"form-control"} name="hours" id="hours" type={"text"} onChange={this.handleChange}  placeholder={"Hours"} maxLength="5" value={hours} invalid={errors.hours && !hours.isNumeric} />
                      <FormFeedback>
                        {errors.hours
                          ? errors.hours
                          : null}
                      </FormFeedback>
                    </div>
                  </FormGroup>
                </Col>
                <Col md="6">
                  <FormGroup>
                    <Label htmlFor="name" className="customer-modal-text-style">
                      Discount
                    </Label>
                    <Input className={"form-control"} id="discount" name="discount" type={"text"} onChange={this.handleChange} maxLength="5" value={discount} placeholder={"Discount"} />
                    <DiscountBtn discountType={discountType} handleClickDiscountType={this.handleClickDiscountType} />
                  </FormGroup>
                </Col>
                <Col md="12">
                  <FormGroup>
                    <Label htmlFor="name" className="customer-modal-text-style">
                      Note
                    </Label>
                    <Input className={"form-control"} maxLength="1000" id="note" name="note" type={"textarea"} onChange={this.handleChange} value={note} placeholder={"Note"} />
                  </FormGroup>
                </Col>

              </Row>
              <Row className="custom-label-padding ">
                {LabourText
                  ? LabourText.map((text, index) => {
                    return (
                      <Col
                        md="6"
                        key={index}
                      >
                        <div className="d-flex" >
                          <AppSwitch
                            className={"mx-1"}
                            checked={
                              permission ? permission[text.key] : null
                            }
                            onClick={this.handleClick.bind(
                              this,
                              text.key
                            )}
                            variant={"3d"}
                            color={"primary"}
                            size={"sm"}
                          />
                          <p className="customer-modal-text-style">
                            {text.text}
                          </p>
                        </div>
                      </Col>

                    );
                  })
                  : null}
              </Row>
              <CrmStandardModel
                openStadardRateModel={rateAddModalProp}
                stdModelFun={this.stdModelFun}
                errors={errors}
                handleRateAdd={this.handleRateAdd}
              />
            </div>
          </ModalBody>
          <ModalFooter>
          <div className={"flex-1"}>
            <div className="required-fields">*Fields are Required.</div>
            {isEditMode ?
              <div className="">
                <b>Last Updated -: &nbsp;
                  <Badge color={"secondary"}>
                      { updatedAt ? moment(updatedAt).format("MMM Do YYYY, h:mm:ss A") :null}
                  </Badge>
                </b>
              </div>
              : null }
            </div>  
            <Button color="primary" onClick={() => this.handleLabourAdd()}>{isEditMode ? `Update labour detail` : 'Add New Labour'}

            </Button>{" "}
            <Button color="secondary" onClick={handleLabourModal}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </>
    );
  }
}


