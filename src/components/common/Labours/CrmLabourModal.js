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
  FormGroup,
  Label,
  Input
} from "reactstrap";
import {
    LabourText,
    LabourTextDefault 
  } from "../../../config/Constants";
import {
    CreateRateValidations,
    CreateRateValidMessaages
  } from "../../../validations";  
import { CrmStandardModel } from "../../common/CrmStandardModel";
import Async from "react-select/lib/Async";  
import { ApiHelper } from "../../../helpers/ApiHelper";
import { logger } from "../../../helpers/Logger";
import { toast } from "react-toastify";
export class CrmLabourModal extends Component { 
  constructor(props) {
    super(props);
    this.state = {
      labourDescription: "",
      note: "",
      rate: "",
      hours: "",
      errors: {},
      isEditMode:0,
      discountType:'$',
      permission:LabourTextDefault,
      selectedLabourRate:{ value: "", label: "Select..." },
      discount:"",   
      openStadardRateModel: false    
    };
  }
  stdModelFun = () => {
    this.setState({
      openStadardRateModel: !this.state.openStadardRateModel
    });
  };
  handleChange = event => {
    const { name, value } = event.target;
    if(name==='discount')
    {
      this.setState({
          [name]: (this.state.discountType==='%' && value==='') ? value.replace('%','')+'%' : value 
      });
    }else{
      this.setState({
          [name]: value
      });
    }
   
  };
  handleRateAdd = async data => {
    const profileData = this.props.profileInfoReducer;
    let api = new ApiHelper();
    try {
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
        let result = await api.FetchFromServer(
          "/labour",
          "/addRate",
          "POST",
          true,
          undefined,
          ratedata
        );
        if (result.isError) {
          toast.error(result.messages[0]);
        } else {
          toast.success(result.messages[0]);
          this.setState({
            openStadardRateModel: !this.state.openStadardRateModel,
            selectedLabourRate: {
              value: result.data.data._id,
              label: result.data.data.name + " - " + result.data.data.hourlyRate
            }
          });
          this.props.getStdList();
        }
      }
    } catch (error) {
      logger(error);
    }
  };
  handleClick(singleState, e) {
    const { permission } = this.state;
    permission[singleState] = e.target.checked;
    this.setState({
      ...permission
    });
  }
  handleClickDiscountType = value=>{
    
    this.setState({
      discount: (this.state.discount!=='' && value==='%') ? this.state.discount.replace('%','')+'%' : this.state.discount,
      discountType: value,
    });
  }
  handleStandardRate = selectValue => {
    if (selectValue) {
      if (selectValue.value === "") {
        this.setState({
          openStadardRateModel: !this.state.openStadardRateModel
        });
      } else {
       
        this.setState({
          selectedLabourRate: selectValue
        });
        //this.props.setDefaultRate(selectValue);
      }
    } else {
      this.props.onTypeHeadStdFun({});
      this.setState({
        selectedLabourRate: {
          value: "",
          label: "Select..."
        }
      });
    }
  };
  handleLabourAdd=()=>{
      let data={
        discription:this.state.labourDescription,
        notes:this.state.note,
        hours:this.state.hours,
        permission:this.state.permission,
        rateId:this.state.selectedLabourRate.value,
        discount:this.state.discount,   
      } 
      if (this.state.isEditMode) {
        this.props.updateLabour(data);
      } else {
        this.props.addLabour(data);
      }

  }
  render() {
    const { tyreModalOpen, handleLabourModal,rateStandardListData } = this.props;
    const { errors } = this.state;
    const {
      labourDescription,
      note,
      hours,
      discountType,
      selectedLabourRate,
      discount,   
      permission,
      } = this.state;
    return (
      <>
        <Modal
          isOpen={tyreModalOpen}
          toggle={handleLabourModal}
          backdrop={"static"}
          className="customer-modal custom-form-modal custom-modal-lg"
        >
          <ModalHeader toggle={handleLabourModal}>Create New Labour</ModalHeader>
          <ModalBody>
            <div className="">
              <Row >
                <Col md="6">
                  <FormGroup>
                    <Label htmlFor="name" className="customer-modal-text-style">
                    Labour Description <span className={"asteric"}>*</span>
                    </Label>
                    <Input className={"form-control"} type={"text"} id="labourDescription" name=
                    "labourDescription" onChange={this.handleChange} value={labourDescription} />
                  </FormGroup>
                </Col>                
                <Col md="6">
                  <FormGroup>
                    <Label htmlFor="name" className="customer-modal-text-style">
                    Rate <span className={"asteric"}>*</span>
                    </Label>
                    
                    <div md="12" className={"fleet-block rate-standard-list rate-labour"} 
                    >
                    <Async
                        defaultOptions={
                            rateStandardListData.standardRateList
                        }
                        loadOptions={this.loadOptions}
                        onChange={this.handleStandardRate}
                        isClearable={
                            selectedLabourRate.value !== ""
                            ? true
                            : false 
                        }
                        value={selectedLabourRate}
                    />
                    </div>
                  </FormGroup>
                </Col>
                <Col md="6">
                  <FormGroup>
                    <Label htmlFor="name" className="customer-modal-text-style">
                    Hours <span className={"asteric"}>*</span>
                    </Label>
                    <Input className={"form-control"} name="hours" id="hours" type={"text"} onChange={this.handleChange} value={hours} />
                  </FormGroup>
                </Col>
                <Col md="6">
                  <FormGroup>
                    <Label htmlFor="name" className="customer-modal-text-style">
                    Discount
                    </Label>
                    <Input className={"form-control"} id="discount" name="discount" type={"text"} onChange={this.handleChange} value={discount}  />
                    <DiscountBtn discountType={discountType} handleClickDiscountType={this.handleClickDiscountType}  />
                  </FormGroup>
                </Col>
                <Col md="12">
                  <FormGroup>
                    <Label htmlFor="name" className="customer-modal-text-style">
                    Note
                    </Label>
                    <Input className={"form-control"} id="note" name="note" type={"textarea"} onChange={this.handleChange}  value={note} />
                  </FormGroup>
                </Col>
               
              </Row>
              <Row className="custom-label-padding ">
                  {LabourText
                    ? LabourText.map((text, index) => {
                        return (
                          <>
                            <Col
                              md="6"
                              key={index}
                             >
                              <div className="d-flex">
                                <AppSwitch
                                  className={"mx-1"}
                                  checked={
                                    permission[text.key]
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
                          </>
                        );
                      })
                    : null}
                </Row>
                <CrmStandardModel
                    openStadardRateModel={this.state.openStadardRateModel}
                    stdModelFun={this.stdModelFun}
                    errors={errors}
                    handleRateAdd={this.handleRateAdd}
                />
            </div>
          </ModalBody>
          <ModalFooter>
            <div className="required-fields">*Fields are Required.</div>
            <Button color="primary" onClick={() => this.handleLabourAdd()}>
              Add New Labour
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
