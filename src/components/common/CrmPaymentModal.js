import React, { Component } from "react";
import { Modal, ModalBody, ModalHeader, Input } from "reactstrap";
import { CrmPaymentCardType } from "./CrmPaymentCardType"
const paymentMethod = [
   {
      icon: "/assets/img/credit-card.svg",
      value: "Card"
   },
   {
      icon: "/assets/img/money.svg",
      value: "Cash"
   },
   {
      icon: "/assets/img/cheque.svg",
      value: "Cheque"
   }
]
export class CrmPaymentModel extends Component {
   constructor(props) {
      super(props);
      this.state = {
         remainingAmmount: 0,
         paymentType: "",
         showRemainingAmt: false
      };
   }
   componentDidUpdate = ({ openPaymentModel }) => {
      if (openPaymentModel !== this.props.openPaymentModel) {
         this.setState({
            remainingAmmount: 0,
            paymentType: "",
            showRemainingAmt: false
         })
      }
   }
   handlePaymentType = (name) => {
      this.setState({
         paymentType: name
      })
   }
   render() {
      const {
         openPaymentModel,
         handlePaymentModal,
         payableAmmount,
      } = this.props
      const { paymentType } = this.state;
      return (
         <>
            <Modal
               isOpen={openPaymentModel}
               toggle={handlePaymentModal}
               className='customer-modal custom-form-modal '
               backdrop={"static"}
            >
               <ModalHeader toggle={handlePaymentModal}>New Payment</ModalHeader>
               <ModalBody>
                  {
                     paymentType === "" ?
                        <>
                           <div className={"text-center payment-body"}>
                              <div className={"box-contain"}>
                                 <div className={"justify-content-center"}>
                                    <Input className={"text-success"} onChange={this.handleChange} value={`$${parseFloat(payableAmmount).toFixed(2)}`} />
                                 </div>
                              </div>
                              <span className={"text-primary cursor_pointer"}>Remaining Due</span>
                           </div>
                           <div className={"d-flex m-3 payment-method"}>
                              {
                                 paymentMethod.map((item, index) => {
                                    return (
                                       <div key={index} onClick={() => this.handlePaymentType(item.value)} className={"box-contain"}>
                                          <div className={"justify-content-center"}>
                                             <img src={item.icon} alt="" />
                                             <div className={"welcome-service-text"}>
                                                {item.value}
                                             </div>
                                          </div>
                                       </div>
                                    )
                                 })
                              }
                           </div>
                        </> :
                        null
                  }
                  {
                     paymentType === "Card" ?
                        <CrmPaymentCardType /> : null
                  }
               </ModalBody>
               {/* <ModalFooter>
                  <Button color="primary" onClick={this.handleSubmit}>
                     Start Payment
                  </Button>{" "}
                  <Button color="secondary" onClick={handlePaymentModal}>
                     Cancel
                  </Button>
               </ModalFooter> */}
            </Modal>
         </>
      );
   }
}
