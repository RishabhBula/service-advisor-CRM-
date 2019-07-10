import React, { Component } from "react";
import {
   Button,
   UncontrolledTooltip,
   Nav,
   NavItem,
   NavLink
} from "reactstrap";
import SendInspection from "../Inspection/sentInspect";
import MessageTemplate from "../Inspection/messageTemplate"
import Dropzone from "react-dropzone";
import { ConfirmBox } from "../../../helpers/SweetAlert";
import Notes from './notes';
import moment from "moment";
import "../../../scss/messages.scss"
class Message extends Component {
   constructor(props) {
      super(props);
      this.state = {
         sentModal: false,
         messageData: '',
         messages: [],
         mesageModal: false,
         attachment:
         {
            itemImagePreview: [],
            itemImage: [],
         },
         btnStatus: true,
         activeTab: false,
         activeTabName: 'tab1'
      };
      this.messageDataTextRef = React.createRef();
   }

   componentDidMount = () => {
      if (this.props.isSummary) {
         this.setState({
            messages: this.props.messagesList
         })
      } else {
         this.setState({
            messages: this.props.messageReducer.messageData.data
         })
      }
      this.messageDataTextRef.current.focus();
   }

   componentDidUpdate = ({ messageReducer, messagesList }) => {
      if (!this.props.isSummary) {
         let propdata = this.props.messageReducer;
         if (propdata.messageData.data !== messageReducer.messageData.data) {
            this.setState({
               messages: this.props.messageReducer.messageData.data
            })
         }
      }
      else {
         let propdata = this.props.messagesList
         if (propdata !== messagesList) {
            this.setState({
               messages: this.props.messagesList
            })
         }
      }
   }
   handelTemplateModal = () => {
      this.setState({
         sentModal: !this.state.sentModal
      });
   }
   messsageTemplateData = (message) => {
      this.setState({
         messageData: message,
         btnStatus: false
      })
   }
   toggleMessageTemplate = (ele) => {
      this.setState({
         mesageModal: !this.state.mesageModal,
      });
   }

   onDrop = async (files) => {
      files.map(async (k, i) => {
         let picReader = new FileReader();
         let file = files[i];
         await picReader.addEventListener("load", async (event) => {
            let dataURL = picReader.result;
            const { attachment } = this.state;
            attachment.itemImagePreview.push({ dataURL, name: file.name })
            attachment.itemImage.push(file)
            await this.setState({
               attachment
            })
         });
         await picReader.readAsDataURL(file);
      })
   };

   handleSentMessage = (e, isNote) => {
      e.preventDefault();
      const { attachment } = this.state
      const {
         customerData,
         profileReducer,
         summaryReducer,
         query,
         customerSummryData,
         isSummary,
         profileSummary
      } = this.props
      var subjectValue = document.getElementById('messageDataText'),
         textMessage = subjectValue.innerHTML;

      const payload = {
         receiverId: isSummary ? profileSummary._id : customerData._id,
         customerId: isSummary && customerSummryData ? customerSummryData._id : customerData._id,
         userId: profileReducer ? profileReducer.profileInfo._id : '' || profileSummary._id,
         senderId: isSummary && customerSummryData ? customerSummryData._id : profileReducer.profileInfo._id,
         orderId: isSummary && summaryReducer.orderData ? summaryReducer.orderData._id : this.props.orderId,
         messageData: textMessage,
         messageAttachment: attachment,
         email: customerData ? customerData.email : '' || profileSummary.email,
         notToken: isSummary ? true : false,
         isSummary: isSummary,
         query: query,
         isInternalNotes: isNote ? true : false,
      }

      this.props.sendMessage(payload)
      subjectValue.innerHTML = ''
      this.setState({
         messageData: '',
         attachment:
         {
            itemImagePreview: [],
            itemImage: [],
         },
      })
   }
   messageChange = (event) => {
      const subjectValue = document.getElementById('messageDataText').textContent;
      if (subjectValue !== '') {
         this.setState({
            btnStatus: false
         })
      }
      else {
         this.setState({
            btnStatus: true
         })
      }
   }
   // Delete mesage imagew
   removeImage = async (previewindx) => {
      const { attachment } = this.state;
      const { value } = await ConfirmBox({
         text: "You want to delete this image"
      });
      if (!value) {
         return;
      }
      let itemImagePreview = attachment.itemImagePreview;
      let itemImage = attachment.itemImage;
      itemImagePreview.splice(previewindx, 1);
      itemImage.splice(previewindx, 1);
      attachment.itemImagePreview = itemImagePreview
      attachment.itemImage = itemImage
      this.setState({ attachment })
   }
   // To view file in new window
   viewFile = (filename, type) => {
      let pdfWindow = window.open("")
      pdfWindow.document.body.innerHTML = type === 'pdf' ? "<iframe width='100%' height='100%' src='" + filename + "'></iframe>" : "<img src=' " + filename + "' >";
   }
   tabChange = (tab) => {
      this.setState({
         activeTab: !this.state.activeTab,
         activeTabName: tab
      })
   }
   render() {
      const { messageData, messages, attachment, btnStatus, activeTab, activeTabName } = this.state;
      const { profileReducer, isSummary, profileSummary, customerSummryData, orderReducer } = this.props;

      const customerNameSummary = isSummary && customerSummryData ? customerSummryData.firstName : ''
      const customerName = !isSummary ? orderReducer.orderItems && orderReducer.orderItems.customerId ? orderReducer.orderItems.customerId.firstName : "" : '';
      const companyNameSummary = isSummary && profileSummary.companyName ? profileSummary.companyName : ''
      const companyName = profileReducer ? profileReducer.profileInfo.companyName : "";
      return (
         <div className={"message-warp"} id={"message-warp"}>
            {isSummary ? <h4 className={"mb-4 ml-3 pt-3"}>Messages</h4> : ''}
            {!isSummary ? <Nav tabs>
               <NavItem>
                  <NavLink onClick={(e) => this.tabChange('tab1')} className={activeTabName === 'tab1' ? 'active' : ''} href="#">Messages</NavLink>
               </NavItem>
               <NavItem>
                  <NavLink onClick={(e) => this.tabChange('tab2')} href="#" className={activeTabName === 'tab2' ? 'active' : ''}>Notes</NavLink>
               </NavItem>
            </Nav>
               : ''}
            {!activeTab ?
               <>
                  <div className={"message-tile d-flex flex-row  mb-4 message-sent-block position-relative mt-4"}>
                     <div className={"user-name"}>
                        <span>{isSummary ? customerNameSummary.slice(0, 1) : companyName.slice(0, 1)}</span>
                     </div>
                     <div className={"flex-1"}>
                        <div className={"message-input-block  border p-1"}>
                           <p
                              suppressContentEditableWarning contentEditable={"true"}
                              className={"message-input"}
                              id={'messageDataText'}
                              dangerouslySetInnerHTML={messageData && messageData.length ? { __html: messageData } : null}
                              ref={this.messageDataTextRef}
                              onInput={this.messageChange}
                           >
                           </p>
                           <div className={"p-2"}>
                              {attachment.itemImagePreview && attachment.itemImagePreview.length ?
                                 <ul className={"attachment-preview-group  p-0"}>
                                    {
                                       attachment.itemImagePreview.map((file, previewindx) => {
                                          const type = file.dataURL.split(';')[0].split('/')[1];
                                          return (
                                             <li key={previewindx}>
                                                <span onClick={(e) => { this.removeImage(previewindx) }} className={"remove-block"}>
                                                   <i class="icon-close icons font-x1"></i> &nbsp;Remove
                                          </span>
                                                {type === 'pdf' ?
                                                   <span className={"pdf-img"} onClick={(filename) => this.viewFile(file.dataURL, type)}>
                                                      <i className={"fa fa-file-pdf-o"}></i>
                                                      <span className={"file-name"}>{file.name}</span>
                                                   </span>
                                                   :
                                                   <span className={"img-block"} onClick={(filename) => this.viewFile(file.dataURL, type)}>
                                                      <img src={file.dataURL} alt={file.dataURL} />
                                                   </span>
                                                }
                                             </li>
                                          )
                                       })
                                    }
                                 </ul>
                                 : null
                              }
                              {!isSummary ?
                                 <span className={"btn btn-outline-info btn-sm cursor_pointer"} onClick={this.handelTemplateModal}>Use a Template</span>
                                 : ''}
                           </div>
                        </div>
                        <div className={"message-tile-footer d-flex justify-content-between align-items-center border border-top-0 p-2"}>
                           <span>
                              <Dropzone onDrop={(files) => this.onDrop(files)} >
                                 {({ getRootProps, getInputProps }) => (
                                    <>
                                       <div {...getRootProps({ className: 'dropzone' })} className={"cursor_pointer"}>
                                          <input {...getInputProps()} />
                                          <i className="icons cui-paperclip"></i> Attachment
                                 </div>
                                    </>
                                 )}
                              </Dropzone>
                           </span>
                           <span>
                              {!isSummary ?
                                 <Button color={"secondary"} className={"mr-3"} onClick={(e) => this.handleSentMessage(e, true)} disabled={btnStatus}>Save as Note</Button>
                                 : ''
                              }
                              <Button color={"primary"} onClick={(e) => this.handleSentMessage(e, false)} disabled={btnStatus}>Send</Button>
                           </span>
                        </div>
                     </div>
                  </div>

                  <div className={"message-list mt-5"}>
                     {messages && messages.length ? messages.map((ele, Index) => {

                        return (
                           ele && ele !== null && !ele.isInternalNotes ?
                              <div className={ele.senderId === ele.userId && ele.isSender ? "message-tile d-flex flex-row-reverse send mb-4" : "message-tile d-flex flex-row  recive mb-4"} key={Index}>
                                 <div className={"user-name"} id={`userId-${Index}`}>
                                    <span>
                                       {
                                          isSummary ?
                                             ele.senderId === ele.userId && ele.isSender ?
                                                customerNameSummary.slice(0, 1) :
                                                companyNameSummary.slice(0, 1) :
                                             ele.senderId === ele.userId && ele.isSender ?
                                                companyName.slice(0, 1) : customerName.slice(0, 1)
                                       }
                                    </span>
                                 </div>

                                 <UncontrolledTooltip target={`userId-${Index}`}>
                                    {
                                       isSummary ?
                                          ele.senderId === ele.userId && ele.isSender ?
                                             customerNameSummary :
                                             companyNameSummary :
                                          ele.senderId === ele.userId && ele.isSender ?
                                             companyName : customerName
                                    }
                                 </UncontrolledTooltip>
                                 <div className={"flex-1"}>
                                    <span className={"sent-date"}>{moment(ele.createdAt || '').format("MMM Do YYYY LT")}</span>
                                    <div className={"message-input-block border p-1"}>
                                       <p
                                          className={"message-input"}
                                          id={'messageDataText'}
                                          dangerouslySetInnerHTML={{ __html: ele ? ele.messageData : '' }}
                                       >
                                       </p>
                                       {ele.messageAttachment && ele.messageAttachment.itemImagePreview.length ?
                                          <ul className={"attachment-preview-group  p-1"}>
                                             {ele.messageAttachment ? ele.messageAttachment.itemImagePreview.map((imgele, index, ) => {
                                                const type = imgele.dataURL.split(';')[0].split('/')[1];
                                                return (
                                                   <li key={index}>
                                                      {type === 'pdf' ?
                                                         <span className={"pdf-img"} onClick={(filename) => this.viewFile(imgele.dataURL, type)}>
                                                            <i className={"fa fa-file-pdf-o"}></i>
                                                            <span className={"file-name"}>{imgele.name}</span>
                                                         </span>
                                                         :
                                                         <span className={"img-block"} onClick={(filename) => this.viewFile(imgele.dataURL, type)}>
                                                            <img src={imgele.dataURL} alt={imgele.dataURL} />
                                                         </span>
                                                      }
                                                   </li>
                                                )
                                             }) : ''
                                             }
                                          </ul> : ''
                                       }
                                       <div className="clearfix"></div>
                                    </div>

                                 </div>
                              </div>
                              : ""
                        )
                     })
                        : null}
                  </div>
               </>
               :
               <Notes messages={messages} companyName={companyName} deleteNotes={this.props.deleteNotes} />
            }

            <SendInspection
               isOpen={this.state.sentModal}
               toggle={this.handelTemplateModal}
               isMessage={true}
               messsageTemplateData={this.messsageTemplateData}
               customerData={this.props.customerData}
               vehicleData={this.props.vehicleData}
               searchMessageTemplateList={this.props.searchMessageTemplateList}
               toggleMessageTemplate={this.toggleMessageTemplate}
            />
            {!isSummary ?
               <MessageTemplate isOpen={this.state.mesageModal} toggle={this.toggleMessageTemplate} inspectionData={this.props.inspectionData} addMessageTemplate={this.props.addMessageTemplate} getMessageTemplate={this.props.getMessageTemplate} updateMessageTemplate={this.props.updateMessageTemplate} deleteMessageTemplate={this.props.deleteMessageTemplate} />
               : ''
            }
         </div>
      );
   }
}

export default Message;