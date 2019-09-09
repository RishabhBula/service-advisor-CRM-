import React, { Component } from "react";
import HomeHeader from "../HomePage/homeHeader";
import HomeFooter from "../HomePage/homeFooter";
import {
   Button,
   Card,
   CardBody,
   Col,
   Row,
   UncontrolledCollapse,
} from "reactstrap";
class FaqPageComponent extends Component {
   render() {
      const { faqData } = this.props;
      const { faqPageDetails, totalFaq } = faqData;
      console.log("faqData", faqData);
      return (
         <>
            {/* <HomeHeader /> */}
            <Row className="ml-0">
               <Col lg="12">
                  <Card>
                     <CardBody>
                        <h2 className="pb-3">FAQ :</h2>
                        {faqPageDetails && faqPageDetails.length ? (
                           faqPageDetails.map((faq, index) => {
                              return (
                                 <React.Fragment key={index}>
                                    <Card>
                                       <CardBody>
                                          <div>
                                             <span>{faq.question ? faq.question : ""}</span>
                                             <span
                                                id={`faq-${faq._id}`}
                                                className={"float-right"}
                                             >
                                                <i className="icons icon-arrow-down" />
                                             </span>
                                             <UncontrolledCollapse toggler={`faq-${faq._id}`}>
                                                <span>{faq.answer ? <div
                                                   dangerouslySetInnerHTML={{
                                                      __html: `${faq.answer}`
                                                   }} /> : ""}</span>
                                             </UncontrolledCollapse>
                                          </div>
                                       </CardBody>
                                    </Card>
                                 </React.Fragment>
                              )
                           })
                        ) : ""}
                     </CardBody>
                  </Card>
               </Col>
            </Row>
            {/* <HomeFooter /> */}
         </>
      )
   }
}
export default FaqPageComponent