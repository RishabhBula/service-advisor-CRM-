import React, { Component } from "react";
import {
   Button,
   UncontrolledTooltip
} from "reactstrap";
import SendInspection from "../Inspection/sentInspect"
import Dropzone from "react-dropzone";
import { ConfirmBox } from "../../../helpers/SweetAlert";
class Message extends Component {
   constructor(props) {
      super(props);
      this.state = {
         sentModal: false,
         messageData:'',
         messages:[],
         attachment:
            {
               itemImagePreview:[],
               itemImage: [],
            }
      };
      this.messageDataTextRef = React.createRef();
   }

   componentDidMount =() =>{
      this.setState({
         messages: this.props.messageReducer.messageData.data
      })
      // setTimeout(() => {
      //    this.messageDataTextRef.current.focus();
      // }, 10);
   }

   componentDidUpdate = ({messageReducer})=>{
      let propdata = this.props.messageReducer;
      if (messageReducer.messageData.isSuccess !== propdata.messageData.isSuccess ){
         this.setState({
            messages: this.props.messageReducer.messageData.data 
         })
      }
   }

   handelTemplateModal = () =>{
      this.setState({
         sentModal: !this.state.sentModal
      });
   }
   messsageTemplateData =(message)=>{
      this.setState({
         messageData: message
      })
   }

   onDrop = async (files) => {
      const { attachment } = this.state;
      console.log(attachment, files, "attachment, files")
         files.map(async (k, i) => {
            let picReader = new FileReader();
            let file = files[i];
            console.log(file.size, "file.size cvdfjidsfjdij")
            await picReader.addEventListener("load", async (event) => {
               let dataURL = picReader.result;
               const { attachment } = this.state;
               attachment.itemImagePreview.push({ dataURL, name: file.name})
               attachment.itemImage.push(file)
               await this.setState({
                  attachment
               })
            });
            await picReader.readAsDataURL(file);
         })
   };

   handleSentMessage = (e) =>{
      e.preventDefault();
      const { attachment } =this.state
      const { customerData } = this.props
      var subjectValue = document.getElementById('messageDataText'),
         textMessage = subjectValue.innerHTML;
      const payload={
         receiverId: customerData._id,
         customerId: customerData._id,
         orderId: this.props.orderId,
         messageData: textMessage,
         messageAttachment:attachment,
         email: customerData.email
      }
      this.props.sendMessage(payload)
   }
   // Delete mesage imagew
   removeImage = async (previewindx) =>{
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
   viewFile = (filename, type) =>{
      let pdfWindow = window.open("")
      pdfWindow.document.body.innerHTML = type === 'pdf' ? "<iframe width='100%' height='100%' src='" + filename+"'></iframe>": "<img src=' " + filename+ "' >";
   }
   
   render() {
      const { messageData, messages, attachment} = this.state;
      const { customerData, profileReducer } = this.props
      const profileName = profileReducer.profileInfo.companyName || profileReducer.profileInfo.firstName
      return (
         <div className={"message-warp"}>
            <div className={"message-tile d-flex flex-row w-75 mb-4 message-sent-block position-relative"}>
               <div className={"user-name"}>
                  <span>{profileName.slice(0, 1)}</span>
               </div>
               <div className={"flex-1"}>
                  <div className={"message-input-block  border p-1"}>
                     <p
                        suppressContentEditableWarning contentEditable={"true"}
                        className={"message-input"}
                        id={'messageDataText'}
                        dangerouslySetInnerHTML={messageData && messageData.length ? { __html: messageData } : null}
                        ref={this.messageDataTextRef}
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
                                          <span onClick={(e) => { this.removeImage(previewindx)}} className={"remove-block"}>
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
                     <span className={"btn btn-outline-info btn-sm"} onClick={this.handelTemplateModal}>Use a Template</span>
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
                     <Button color={"primary"} onClick={this.handleSentMessage}>Send</Button>
                  </span>
               </div>
               </div>
            </div>
            
            <div className={"message-list"}>
               {messages && messages.length  ? messages.map((ele, Index) => {
                  console.log(ele, "ele")
                  return (
                     ele && ele !==null ?
                     <div className={!ele.isSender ? "message-tile d-flex flex-row-reverse w-75 recive mb-2" : "message-tile d-flex flex-row w-75 send mb-2"} key={Index}>
                        <div className={"user-name"} id={`userId-${Index}`}>
                           <span>{ele && !ele.isSender ? customerData.firstName.slice(0, 1) : profileName.slice(0, 1) }</span>
                        </div>
                        <UncontrolledTooltip target={`userId-${Index}`}>
                           {!ele.isSender ? customerData.firstName : profileName}
                        </UncontrolledTooltip>
                        <div className={"flex-1"}>
                           <div className={"message-input-block border p-1"}>
                              <p
                                 className={"message-input"}
                                 id={'messageDataText'}
                                 dangerouslySetInnerHTML={{ __html: ele ? ele.messageData :'' }}
                              >
                              </p>
                              <ul className={"attachment-preview-group  p-1"}>
                                 {ele.messageAttachment.itemImagePreview.map((imgele, index, ) => {
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
                                    })
                                 }
                              </ul>
                              <div className="clearfix"></div>
                           </div>
                           
                        </div>
                     </div>
                     : ""
                  )
               })
                : null}
            </div>
            
            <SendInspection 
            isOpen={this.state.sentModal} 
            toggle={this.handelTemplateModal}
            isMessage={true}
            messsageTemplateData={this.messsageTemplateData}
            customerData={this.props.customerData}
            vehicleData={this.props.vehicleData}
            searchMessageTemplateList={this.props.searchMessageTemplateList}
            />
         </div>
      );
   }
}

export default Message;
