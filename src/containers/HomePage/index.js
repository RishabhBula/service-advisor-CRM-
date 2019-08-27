import React, { Component } from "react";
import { connect } from 'react-redux';
import HomePageComponent from "../../components/HomePage";
import {
   getHomePageReq,
   redirectTo
} from "../../actions";
class HomePage extends Component {
   componentDidMount() {
      this.props.getHomePage();
   }
   render() {
      const { homePageDetailsReducer } = this.props;
      return (
         <>
            <HomePageComponent
               pageData={homePageDetailsReducer} 
               onGoPage={this.props.onGoPage}/>
         </>
      )
   }
}
const mapStateToProps = state => ({
   homePageDetailsReducer: state.homePageDetailsReducer,
});

const mapDispatchToProps = dispatch => ({
   getHomePage: data => {
      dispatch(getHomePageReq(data));
   },
   onGoPage: data => {
      dispatch(redirectTo({ path: data }));
   }
});
export default connect(
   mapStateToProps,
   mapDispatchToProps
)(HomePage);