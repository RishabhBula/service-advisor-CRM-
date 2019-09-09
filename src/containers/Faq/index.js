import React, { Component } from "react";
import { connect } from 'react-redux';
import FaqPageComponent from "../../components/Faq";
import {
   getFaqPageReq,
   redirectTo
} from "../../actions";
class FaqPage extends Component {
   componentDidMount() {
      this.props.getFaqPage();
   }
   render() {
      const { faqPageReducer } = this.props;
      return (
         <>
            <FaqPageComponent
               faqData={faqPageReducer}
            />
         </>
      )
   }
}
const mapStateToProps = state => ({
   faqPageReducer: state.faqPageReducer
});

const mapDispatchToProps = dispatch => ({
   getFaqPage: data => {
      dispatch(getFaqPageReq(data));
   },
   onGoPage: data => {
      dispatch(redirectTo({ path: data }));
   }
});
export default connect(
   mapStateToProps,
   mapDispatchToProps
)(FaqPage);