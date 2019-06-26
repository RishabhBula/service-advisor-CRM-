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
         inspectionStatus: false,
         modal: false,
         sentModal: false,
         mesageModal: false,
         templateData: [],
         orderDetails: '',
         colorIndex: '',
         selectedOption: '',
         showPDF: false
      };
   }

   componentDidMount = () => {
      this.setState({
         customerData: this.props.customerData,
         vehicleData: this.props.vehicleData,
         orderDetails: this.props.orderReducer
      })
   }

   componentDidUpdate = ({ inspectionData, customerData, orderReducer }) => {
      let propdata = this.props.inspectionData;
      const { inspectionStatus } = this.state
      if (propdata && propdata.inspectionData && propdata.inspectionData.data && inspectionData !== propdata && !inspectionStatus) {
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
      let orderdata = this.props.orderReducer
      if (orderdata && orderdata !== orderReducer) {
         this.setState({
            orderDetails: orderdata
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
   removeImage = async (previewindx, itemIndex, inspIndex) => {
      const { value } = await ConfirmBox({
         text: "You want to delete this image"
      });
      if (!value) {
         return;
      }
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
               inspection: [],
               inspectionStatus: false
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
         let ele;
         ele = inspectionArray[inspIndex];
         if (ele.hasOwnProperty('inspectionName') && ele.inspectionName === '') {
            ele.error = true;
            this.setState({
               inspectionArray
            });
         }
         // To remove _id form object before sent it as payload to API for new template 
         let i;
         for (i = 0; i < inspectionArray.length; i++) {
            if (inspectionArray[i]._id) {
               delete inspectionArray[i]._id
            }
         }
         // To set isTemplate value true
         inspectionArray[inspIndex].isTemplate = true
         const payload = [inspectionArray[inspIndex]]
         this.setState({
            inspectionStatus: true
         })
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
      const { inspection } = this.state;
      let count = 5 - inspection[inspIndex].items[itemIndex].itemImagePreview.length
      if (files.length > count) {
          await ConfirmBox({
            text: "",
            title: "Can not upload more than 5 images",
            showCancelButton:false,
            confirmButtonText:"Ok"
         });
      } else { 
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
      }
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

      var doc = new jsPDF('p', 'pt');
      doc.setFontSize(12)
      doc.setTextColor(51, 47, 62);
      doc.text('D-Company', 40, 30);

      const orderDetail = this.state.orderDetails
      doc.setFontSize(14)
      doc.text('Inspection', 430, 25);
      doc.setTextColor('black');
      doc.text('# ' + orderDetail.orderId, 500, 25);
      doc.setFontSize(12);
      doc.setTextColor('gray');
      var textOrderId = orderDetail.orderItems.orderName ? orderDetail.orderItems.orderName : orderDetail.order.orderName;
      let  textOrderIdDetail =  doc.splitTextToSize(textOrderId);
      doc.text(textOrderIdDetail, 430, 42);

      doc.setTextColor('black');
      doc.setDrawColor(187, 185, 193);
      doc.setLineWidth(0);
      doc.line(0, 50, 600, 50);

      const customerData = this.state.customerData;

      const fullName = customerData.firstName + ' ' + customerData.lastName
      doc.setFontSize(12)
      doc.text(fullName, 40, 70);
      doc.setTextColor(126, 126, 126);
      doc.text(customerData.email, 40, 83);
      doc.text(customerData.phoneDetail[0].value, 40, 97);

      const vehicleData = this.state.vehicleData;
      const vehicalName = vehicleData.make + ' ' + vehicleData.modal + ' ' + vehicleData.year
      doc.setFontSize(12)
      doc.setTextColor(0, 0, 0);
      doc.text(vehicalName, 340, 70);

      const inspectData = this.state.inspection;

      for (let index = 0; index < inspectData.length; index++) {
         let count = 0;
         let finalY = doc.previousAutoTable.finalY ? doc.previousAutoTable.finalY + 15 : 45
         var header = (data) => {
            doc.setFontSize(14);
            doc.setTextColor(40);
            doc.setFontStyle('normal');
            doc.text(inspectData[index].inspectionName, 40, index === 0 ? 130 : finalY + 10);
         };

         var options = {
            theme:'grid',
            beforePageContent: header,
            margin: {
               top: finalY
            },
            startY: index === 0 ? 140 : finalY + 20,
            columnStyles: {
               'Item Tile': { columnWidth: 100 },
               'Note': { columnWidth: 90 },
               'Status': { columnWidth: 60, textColor: '#ffffff' },
               'Image': { columnWidth: 130 ,textColor:'#ffffff',fontSize:8},
            },
            
            styles: {
               1: {rowHeight: 100},
            },
            didParseCell:  data => {
               if (data.row.section !== "head"){
                  data.row.height = 50
               }
               for (let j = 0; j < inspectData[index].items.length; j++) {
                  if (data.row.section !== "head" && data.row.raw.Image > 0) {
                     if (data.row.raw.Image > 3){
                        data.row.height = 130
                     }
                     else{
                        data.row.height = 60
                     }
                     
                  }
               }

            },
            didDrawCell:async  data => {
               if (data.section === 'body' && data.column.dataKey === 'Image') {
                  for (let j = 0; j < 1; j++) {
                     var itemsJ = inspectData[index].items[count];
                     var xAxis = data.cell.x;
                     var yAxis = data.cell.y + 5;
                     count++;
                     for (let k = 0; k < itemsJ.itemImagePreview.length; k++) {
                        var base64Img = itemsJ.itemImagePreview[k];
                        if (k < 3) {
                           doc.addImage(base64Img, 'JPEG', xAxis + (50 * k) + 5, yAxis, 50, 50);
                        }
                        if(k === 3){
                           doc.addImage(base64Img, 'JPEG', xAxis + 5, yAxis + 60, 50, 50);
                        }
                        if (k === 4) {
                           doc.addImage(base64Img, 'JPEG', xAxis + 60, yAxis + 60, 50, 50);
                        }
                     }
                  }
               }
               if (data.section === 'body' && data.column.dataKey === 'Status') {

                  var str = data.cell.text[0];
                  var result = str.split(" ");
                  data.cell.styles.fontSize = 8;
                  if(result[0] === 'true' ){
                     doc.setDrawColor(77, 189, 116);
                     doc.setFillColor(255, 255, 255);
                     doc.roundedRect(data.cell.x + 4, data.cell.y + 25, 60, 15, 2, 2, 'FD'); 
                     doc.setTextColor(77, 189, 116);
                     doc.text("Approved", data.cell.x + 11, data.cell.y + 35);
                  }
                  else {
                     doc.setDrawColor(204, 204, 204);
                     doc.setFillColor(255, 255, 255);
                     doc.roundedRect(data.cell.x + 4, data.cell.y + 25, 60, 15, 2, 2, 'FD');
                     doc.setTextColor(126, 126, 126);
                     doc.text("UnApproved", data.cell.x + 5, data.cell.y + 35);
                  }
                  switch (result[1]) {
                     default:
                        doc.text("Not Selected", data.cell.x + 21, data.cell.y + 15);
                        doc.setFillColor(204, 204, 204);
                        break;
                     case 'default':
                        doc.text("Orange", data.cell.x + 21, data.cell.y + 15);
                        doc.setFillColor(248, 188, 24);
                        break;
                     case 'danger':
                        doc.text("Red", data.cell.x + 21, data.cell.y + 15);
                        doc.setFillColor(243, 65, 65);
                        break;
                     case 'success':
                        doc.text("Green", data.cell.x + 21, data.cell.y + 15);
                        doc.setFillColor(53, 230, 91);
                  }
                  doc.setDrawColor(204);
                  doc.circle(data.cell.x + 8, data.cell.y + 10, 4, 'FD');
                  
               }
             
            },
         };

         var columns = [
            { title: "Item Tile", dataKey: "Item Tile" },
            { title: "Note", dataKey: "Note" },
            { title: "Status", dataKey: "Status" },
            { title: "Image", dataKey: "Image" }
         ];
         const rows = []
         for (let j = 0; j < inspectData[index].items.length; j++) {
            var Index = inspectData[index]
            var imgLength = Index.items[j].itemImagePreview.length
            rows.push({
               'Item Tile': Index.items[j].name || 'Untitled Item',
               Note: Index.items[j].note || '-',
               Status: Index.items[j].aprovedStatus + ' ' + Index.items[j].color || '-',
               Image: imgLength > 0 ? imgLength : 0
            })
         }

         doc.autoTable(columns, rows, options);
      }

      window.open(doc.output("bloburl"), "_blank");
   };



   render() {
      const { inspection, templateData } = this.state;
  
      return (
         <div>
            <div className={"mb-3 d-flex"}>
               {inspection && inspection.length ? <>
                  <span color={""} className={"print-btn"} onClick={this.toggleSentInspection}>
                     <i class="icons cui-cursor"></i>&nbsp; Sent Inspection</span>
                  <span
                     onClick={this.downloadPDF}
                     id={"add-Appointment"}
                     className={"print-btn"}
                  >
                     <i class="icon-printer icons "></i>&nbsp; View or Print
            </span> </>
                  : null
               }
            </div>
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
                              maxLength={75}
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
                                                   maxLength={"75"}
                                                   onChange={e => this.handleItemChange(itemIndex, e, inspIndex)}
                                                />
                                             </div>
                                             <div className={"mt-2"}>
                                                <Input
                                                   type="text"
                                                   name={"note"}
                                                   value={val.note}
                                                   maxLength={"75"}
                                                   placeholder={"Enter Notes and Recommendation"}
                                                   onChange={(e) => this.handleItemChange(itemIndex, e, inspIndex)}
                                                />
                                             </div>
                                          </Col>
                                          <Col lg={3} md={3} className={"mt-2 p-0"}>
                                             <div className={"d-flex flex-row"}>
                                                <Dropzone onDrop={(files) => this.onDrop(files, inspIndex, itemIndex)} >
                                                   {({ getRootProps, getInputProps }) => (
                                                      <>
                                                      <section className="drop-image-block">
                                                         <div {...getRootProps({ className: 'dropzone' })}>
                                                            <input {...getInputProps()} />
                                                            <i className="icon-picture icons"></i>
                                                         </div>
                                                      </section>
                                                         <div className={"drop-image-text"}>
                                                            Max limit 5 images
                                                         </div>
                                                      </>
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
                                                <ul className={"preview-group  p-0"}>
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
                              <div className={"pull-right d-flex align-item-center"}>
                                 <Button className={"btn-dashed"} onClick={(e) => this.handleTemplate(e, inspIndex, (ele.templateId))} id={`make-template-${inspIndex}`}> Save as Template</Button>  <UncontrolledTooltip target={`make-template-${inspIndex}`}>
                                    Click to make this Inspection as Template
                                 </UncontrolledTooltip>&nbsp;&nbsp;
                                 <Button color={"secondary"} className={"pull-right btn-remove btn-outline-danger"} onClick={() => { this.removeInspection(inspIndex) }} id={`delete-${inspIndex}`}> <i className={"fa fa-trash"}></i>&nbsp; Remove
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
                  <div className={"mb-3"}>
                     <Button color={""} className={"mr-3 pull-right btn-blue"} size={"lg"} onClick={this.handleInspection}> Submit Inspection</Button>
                  </div>
                  : null
               }
               <div className={"d-flex justify-content-center align-items-center"}>

                  <span className={""}>
                     <Button color={""} onClick={this.addInspectionItem} className={"browse-btn"}>
                        <i class="icon-eye icons"></i> New Inspection
                     </Button>
                  </span>
                  <span className={"pl-2 pr-2"}><i className={"fa fa-plus"}></i></span>
                  <span>
                     <Button color={""} onClick={this.toggle} className={"browse-btn"}><i class="icon-plus icons "></i> Add Template</Button>
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
