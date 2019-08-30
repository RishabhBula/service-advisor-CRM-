import React, { Component } from "react";
import { connect } from 'react-redux';
import HomePageComponent from "../../components/HomePage";
import {
   getHomePageReq,
   getSiteSettingReq,
   redirectTo
} from "../../actions";
class HomePage extends Component {
   componentDidMount() {
      this.props.getHomePage();
      this.props.getSiteSetting();
   }
   render() {
      const { homePageDetailsReducer, siteSettingDetailsReducer } = this.props;
      return (
         <>
            <HomePageComponent
               pageData={homePageDetailsReducer}
               settingData={siteSettingDetailsReducer}
               onGoPage={this.props.onGoPage} />
         </>
      )
   }
}
const mapStateToProps = state => ({
   homePageDetailsReducer: state.homePageDetailsReducer,
   siteSettingDetailsReducer: state.siteSettingDetailsReducer
});

const mapDispatchToProps = dispatch => ({
   getHomePage: data => {
      dispatch(getHomePageReq(data));
   },
   getSiteSetting: data => {
      dispatch(getSiteSettingReq(data));
   },
   onGoPage: data => {
      dispatch(redirectTo({ path: data }));
   }
});
export default connect(
   mapStateToProps,
   mapDispatchToProps
)(HomePage);