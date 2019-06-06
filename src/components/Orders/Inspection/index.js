import React, { Component } from "react";
import {
   Button,
   Input,
   Card,
   CardBody,
   CardFooter,
   Row,
   Col,
   Label,
   Badge,
   UncontrolledTooltip,
} from "reactstrap";
import Dropzone from "react-dropzone";
import { ConfirmBox } from "../../../helpers/SweetAlert";
import Templates from "./template";
import SendInspection from "./sentInspect";
import MessageTemplate from "./messageTemplate";
import * as jsPDF from "jspdf";
import 'jspdf-autotable';

class Inspection extends Component {
   constructor(props) {
      super(props);
      this.state = {
         inspection: [],
         modal: false,
         sentModal: false,
         mesageModal: false,
         templateData: [],
         colorIndex: '',
         selectedOption: '',
         showPDF: false
      };
   }

   componentDidMount = () => {
      this.setState({
         customerData: this.props.customerData,
         vehicleData: this.props.vehicleData
      })
   }

   componentDidUpdate = ({ inspectionData, customerData }) => {
      let propdata = this.props.inspectionData;
      if (propdata && propdata.inspectionData && propdata.inspectionData.data && inspectionData !== propdata) {
         this.setState({
            inspection: propdata.inspectionData.data,
         })
      }
      let propsCustomerData = this.props.customerData
      let propsVehicleData = this.props.vehicleData
      if (propsCustomerData && propsCustomerData !== customerData) {
         this.setState({
            customerData: propsCustomerData,
            vehicleData: propsVehicleData
         })
      }
   }
   /**
   *
   */
   handleChange = (e, inspIndex) => {
      const { name, value } = e.target;
      const { inspection } = this.state;
      const item = inspection[inspIndex];
      item[name] = value;
      item.error = false;
      this.setState({
         inspection,
         [e.target.name]: e.target.value,
      });
   }
   /**
   *
   */
   handleItemChange = (index, e, inspIndex) => {
      const { name, value } = e.target;
      const { inspection } = this.state
      const items = inspection[inspIndex].items;
      items[index][name] = value;
      this.setState({
         inspection
      });
   }
   /**
    *
    */
   addInspectionItem = (e) => {
      const obj = {
         inspectionName: "",
         items: [
            { name: "", note: "", itemImagePreview: [], itemImage: [], color: "", aprovedStatus: false }
         ],
         error: false,
         isTemplate: false,
         templateId: null
      };
      this.setState({
         inspection: [...this.state.inspection, obj]
      });
   }
   /**
   *
   */
   removeInspection = async e => {
      const { value } = await ConfirmBox({
         text: "You want to delete this Inspection"
      });
      if (!value) {
         return;
      }
      const { inspection } = this.state
      let itemList = inspection;
      itemList.splice(e, 1);
      this.setState({ inspection })
   }
   /**
    *
    */
   addItem = (inspIndex) => {
      const { inspection } = this.state
      inspection[inspIndex].items.push({
         name: "", note: "", itemImagePreview: [], itemImage: [], color: "", aprovedStatus: false
      })
      this.setState({
         inspection
      })
   }
   /**
   *
   */
   removeItem = (inspIndex, itemIndex) => {
      const { inspection } = this.state
      let itemList = inspection[inspIndex].items;
      itemList.splice(itemIndex, 1);
      inspection[inspIndex].items = itemList
      this.setState({ inspection })
   }
   /**
   *
   */
   removeImage = (previewindx, itemIndex, inspIndex) => {
      const { inspection } = this.state
      let itemImagePreview = inspection[inspIndex].items[itemIndex].itemImagePreview;
      let itemImage = inspection[inspIndex].items[itemIndex].itemImage;
      itemImagePreview.splice(previewindx, 1);
      itemImage.splice(previewindx, 1);
      inspection[inspIndex].items[itemIndex].itemImagePreview = itemImagePreview
      inspection[inspIndex].items[itemIndex].itemImage = itemImage
      this.setState({ inspection })
   }
   /**
    *
    */
   handleInspection = (e) => {
      e.preventDefault();
      const {
         inspection
      } = this.state;
      const payload = {
         inspection: inspection,
         orderId: this.props.orderId
      }
      try {
         var inspectionArray = [...this.state.inspection];
         let i, ele;
         for (i = 0; i < inspectionArray.length; i++) {
            ele = inspectionArray[i];
            if (ele.hasOwnProperty('inspectionName') && ele.inspectionName === '') {
               ele.error = true;
               this.setState({
                  inspectionArray
               });
            }
         }
         if (!ele.error) {
            this.props.addNewInspection(payload)
            this.setState({
               inspection: []
            })
         }
      }
      catch (error) {
         console.log(error)
      }
   }
   /**
    *
    */
   handleOptionChange = (e, inspIndex, itemIndex) => {
      const { inspection } = this.state
      inspection[inspIndex].items[itemIndex].color = e.target.value;
      this.setState({
         selectedOption: e.target.value,
         inspection
      });

   }
   /**
    *
    */
   handleTemplate = (e, inspIndex, id) => {
      e.preventDefault();
      try {
         var inspectionArray = [...this.state.inspection];
         // To remove _id form object
         let i;
         for (i = 0; i < inspectionArray.length; i++) {
            if (inspectionArray[i]._id) {
               delete inspectionArray[i]._id
            }
         }
         // To set isTemplate value true
         inspectionArray[inspIndex].isTemplate = true
         const payload = [inspectionArray[inspIndex]]
         this.props.addInspectionTemplate(payload)

      }
      catch (error) {
         console.log(error)
      }
   }
   /**
    *
    */
   removeTemplate = async data => {
      try {
         const { value } = await ConfirmBox({
            text: "You want to delete this Template"
         });
         if (!value) {
            return;
         }
         data.isDeleted = true
         let payload = []
         payload = [data]
         this.props.addInspectionTemplate(payload)
      }
      catch (error) {
         console.log(error)
      }
   }
   /**
    *
    */
   addTemplate = data => {
      const dataArray = data;
      let i;
      for (i = 0; i < dataArray.items.length; i++) {
         dataArray.items[i].color = ""
      }
      this.setState({
         inspection: [...this.state.inspection, dataArray],
         modal: false
      });
   }
   /**
    *
    */
   onDrop = async (files, inspIndex, itemIndex) => {
      files.map(async (k, i) => {
         let picReader = new FileReader();
         let file = files[i];
         await picReader.addEventListener("load", async (event) => {
            let dataURL = picReader.result;
            const { inspection } = this.state;
            inspection[inspIndex].items[itemIndex].itemImagePreview.push(dataURL)
            inspection[inspIndex].items[itemIndex].itemImage.push(file)
            await this.setState({
               inspection
            })
         });
         await picReader.readAsDataURL(file);
      })
   };
   /**
   *
   */
   toggle = (e) => {
      this.setState({
         modal: !this.state.modal
      });
   }
   /**
    *
    */
   toggleSentInspection = async (e) => {
      if (!this.props.customerData || !this.props.vehicleData) {
         const { value } = await ConfirmBox({
            title: "Please Select a Customer!",
            text: "Please select one of customer details form Customer Selection box",
            type: "warning",
            showCancelButton: false,
            confirmButtonColor: "#3085d6",
            confirmButtonText: "Ok",
         });
         if (!value) {
            return;
         }

      } else {
         this.setState({
            sentModal: !this.state.sentModal
         });
      }

   }
   /**
    *
    */
   handleApproval = (e, inspIndex, itemIndex) => {
      const { inspection } = this.state
      inspection[inspIndex].items[itemIndex].aprovedStatus = !inspection[inspIndex].items[itemIndex].aprovedStatus
      this.setState({
         inspection
      })
   }
   /**
    *
    */
   toggleMessageTemplate = (ele) => {
      this.setState({
         mesageModal: !this.state.mesageModal,
      });
   }

   downloadPDF = () => {
      var doc = new jsPDF();
      doc.setProperties({
         title: "Title",
         subject: "This is the subject",
         author: "Chapter247",
         keywords: "React, JavaScript, NodeJS",
         creator: "Sonu Bamniya"
      });

      

      // let header = function (data) {
      //    doc.setFontSize(18);
      //    doc.setTextColor(40);
      //    doc.setFontStyle('normal');
      //    doc.text("Testing Report", data.settings.margin.left, 50);
      // };

      // let options = {
      //    beforePageContent: header,
      //    margin: {
      //       top: 80
      //    },
      //    startY: doc.autoTableEndPosY() + 20
      // };
      const inspectData = this.state.inspection
      for (let index = 0; index < inspectData.length; index++) {
         const itemArray = []
         for (let j = 0; j < inspectData[index].items.length; j++) {
            itemArray.push([inspectData[index].items[j].name, inspectData[index].items[j].note])
         }
         
         doc.autoTable({
            head: [['Item Tile', 'Note', 'status']],
            body: itemArray,
         });
      }
      window.open(doc.output("bloburl"), "_blank");
   };



   render() {
      const { inspection, templateData } = this.state;
      return (
         <div>
            <Button onClick={this.toggleSentInspection}>Send</Button>
            <Button
               onClick={this.downloadPDF}
               color={"primary"}
               id={"add-Appointment"}
            >
               <i className={"fa fa-plus mr-1"} /> Download PDF
            </Button>
            <div className={"inspection-add-block"} id={"inspection-add-block"}>

               {inspection && inspection.length ? inspection.map((ele, inspIndex) => {
                  return <div className={"inspection-card"} key={inspIndex}>

                     <Card>
                        <div className={"inspection-header"}>
                           <Input
                              type={"text"}
                              value={ele.inspectionName}
                              name={"inspectionName"}
                              bsSize={"lg"}
                              placeholder={"Please Enter a name for this inspection"}
                              onChange={(e) => this.handleChange(e, inspIndex)}
                              invalid={ele.error}
                           />
                           {ele.error ? <p className={"text-danger mb-0"}>Please enter title of Inspection</p> : null}
                        </div>
                        <CardBody className={"p-0"}>
                           <div className={"item-warp"}>
                              {ele.items && ele.items.length ? ele.items.map((val, itemIndex) => {
                                 return (
                                    <div className={"d-flex block-item"} key={itemIndex}>
                                       <div className={"count-block"}>
                                          <Badge color="secondary">{itemIndex + 1}</Badge>
                                       </div>
                                       <Row key={itemIndex} className={"ml-0 mr-0"}>
                                          <Col lg={"9"} md={"9"}>
                                             <Label htmlFor={`item ${itemIndex}`}>Item Description</Label>
                                             <div>
                                                <div className={"status-warp"} >
                                                   <Label className={val.color === 'default' ? "status-checkbox checked default" : "status-checkbox"}>
                                                      <Input type="radio" name={`color ${itemIndex}`} value={"default"} checked={val.color === 'default'} onChange={(e) => this.handleOptionChange(e, inspIndex, itemIndex)} />{' '}
                                                      {/* default */}
                                                   </Label>
                                                   <Label className={val.color === 'danger' ? "status-checkbox checked danger" : "status-checkbox"}>
                                                      <Input type="radio" name={`color ${itemIndex}`} value={"danger"} checked={val.color === 'danger'} onChange={(e) => this.handleOptionChange(e, inspIndex, itemIndex)} />{' '}
                                                      {/* danger */}
                                                   </Label>
                                                   <Label className={val.color === 'success' ? "status-checkbox checked success" : "status-checkbox"}>
                                                      <Input type="radio" name={`color ${itemIndex}`} value={"success"} checked={val.color === 'success'} onChange={(e) => this.handleOptionChange(e, inspIndex, itemIndex)} />{' '}
                                                      {/* success */}
                                                   </Label>
                                                   <span>
                                                      {val.color === 'success' || val.color === 'danger' ? <>
                                                         <Button size={"sm"} outline color={val.aprovedStatus ? "success" : "dark"} className={"status-btn"} onClick={(e) => this.handleApproval(e, inspIndex, itemIndex)} id={`item-status-${itemIndex}`}>
                                                            <i className={"fa fa-check"}></i> Approved
                                                      </Button>
                                                         <UncontrolledTooltip target={`item-status-${itemIndex}`}>
                                                            Click to change status of this inpection item
                                                      </UncontrolledTooltip>
                                                      </>
                                                         : null
                                                      }
                                                   </span>
                                                   <span id={`status-warp-${itemIndex}`} className={"info-icon"}>
                                                      <i className={"fa fa-question-circle"}></i>
                                                   </span>
                                                   <UncontrolledTooltip target={`status-warp-${itemIndex}`}>
                                                      Define the priority of this Inspection item by adding appropriate labels.
                                                   </UncontrolledTooltip>
                                                </div>
                                             </div>
                                             <div className={""}>
                                                <Input
                                                   type="text"
                                                   name={"name"}
                                                   value={val.name}
                                                   placeholder={"Item Title"}
                                                   onChange={e => this.handleItemChange(itemIndex, e, inspIndex)}
                                                />
                                             </div>
                                             <div className={"mt-2"}>
                                                <Input
                                                   type="text"
                                                   name={"note"}
                                                   value={val.note}
                                                   placeholder={"Enter Notes and Recommendation"}
                                                   onChange={(e) => this.handleItemChange(itemIndex, e, inspIndex)}
                                                />
                                             </div>
                                          </Col>
                                          <Col lg={3} md={3} className={"mt-2 p-0"}>
                                             <div className={"d-flex flex-row"}>
                                                <Dropzone onDrop={(files) => this.onDrop(files, inspIndex, itemIndex)}>
                                                   {({ getRootProps, getInputProps }) => (
                                                      <section className="drop-image-block">
                                                         <div {...getRootProps({ className: 'dropzone' })}>
                                                            <input {...getInputProps()} />
                                                            <i className="icon-picture icons"></i>
                                                         </div>
                                                      </section>
                                                   )}
                                                </Dropzone>
                                                {itemIndex >= 1 ?
                                                   <>
                                                      <span onClick={() => { this.removeItem(inspIndex, itemIndex) }} color={"danger"} className={"delete-icon"} id={`delete-${itemIndex}`}><i className={"icons cui-circle-x"}></i></span>
                                                      <UncontrolledTooltip target={`delete-${itemIndex}`}>
                                                         Delete this Item
                                                   </UncontrolledTooltip>
                                                   </>
                                                   : null
                                                }
                                             </div>
                                          </Col>
                                          <Col lg={12} md={12}>
                                             {val.itemImagePreview && val.itemImagePreview.length ?
                                                <ul className={"preview-group d-flex p-0"}>
                                                   {
                                                      val.itemImagePreview.map((file, previewindx) => {
                                                         return (
                                                            <li key={previewindx}>
                                                               <span onClick={(e) => { this.removeImage(previewindx, itemIndex, inspIndex) }} className={"remove-preview"}>
                                                                  <i class="icon-close icons"></i>
                                                               </span>
                                                               <img src={file} alt={file} />
                                                            </li>
                                                         )
                                                      })
                                                   }
                                                </ul>
                                                : null
                                             }
                                          </Col>
                                       </Row>
                                    </div>
                                 )
                              }) : null}
                           </div>

                           <CardFooter>
                              <Button className={"btn-theme"} onClick={() => this.addItem(inspIndex)} id={`add-item-${inspIndex}`}> + Add Item</Button>
                              <UncontrolledTooltip target={`add-item-${inspIndex}`}>
                                 Click to add new item in this inspection
                              </UncontrolledTooltip>
                              <div className={"pull-right"}>
                                 <Button className={"btn-secondary"} onClick={(e) => this.handleTemplate(e, inspIndex, (ele.templateId))} id={`make-template-${inspIndex}`}> Save as Template</Button>  <UncontrolledTooltip target={`make-template-${inspIndex}`}>
                                    Click to make this Inspection as Template
                                 </UncontrolledTooltip>&nbsp;&nbsp;
                                 <Button className={"btn-danger pull-right"} onClick={() => { this.removeInspection(inspIndex) }} id={`delete-${inspIndex}`}> <i className={"fa fa-trash"}></i>
                                 </Button>
                                 <UncontrolledTooltip target={`delete-${inspIndex}`}>
                                    Delete this Inspection
                                 </UncontrolledTooltip>
                              </div>
                           </CardFooter>
                        </CardBody>
                     </Card>
                  </div>
               }) : null}

               {inspection.length ?
                  <Col md={4} lg={4} className={"mb-3"}>
                     <Button color={"success"} className={"mr-3 pull-left"} size={"lg"} onClick={this.handleInspection}> Submit Inspection</Button>
                  </Col>
                  : null
               }
               <div className={"d-flex justify-content-center align-items-center"}>

                  <span className={""}>
                     <Button color={"primary"} onClick={this.addInspectionItem}>New Inspection</Button>
                  </span>
                  <span className={"pl-2 pr-2"}><i className={"fa fa-plus"}></i></span>
                  <span>
                     <Button color={"primary"} onClick={this.toggle}>Add Template</Button>
                  </span>
               </div>
            </div>

            <Templates isOpen={this.state.modal} addTemplate={this.addTemplate} removeTemplate={this.removeTemplate} toggle={this.toggle} templateData={templateData} getTemplateList={this.props.getTemplateList} inspectionData={this.props.inspectionData} />

            <SendInspection
               isOpen={this.state.sentModal}
               inspectionData={this.props.inspectionData}
               toggle={this.toggleSentInspection}
               toggleMessageTemplate={this.toggleMessageTemplate}
               getMessageTemplate={this.props.getMessageTemplate}
               searchMessageTemplateList={this.props.searchMessageTemplateList}
               customerData={this.props.customerData}
               vehicleData={this.props.vehicleData}
               sendMessageTemplate={this.props.sendMessageTemplate}
            />

            {/* ====== MessageTemplate Modal====== */}
            <MessageTemplate isOpen={this.state.mesageModal} toggle={this.toggleMessageTemplate} inspectionData={this.props.inspectionData} addMessageTemplate={this.props.addMessageTemplate} getMessageTemplate={this.props.getMessageTemplate} updateMessageTemplate={this.props.updateMessageTemplate} deleteMessageTemplate={this.props.deleteMessageTemplate} />


         </div>
      );
   }
}

export default Inspection;
