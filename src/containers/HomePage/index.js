import React, { Component } from "react";
import { connect } from 'react-redux';
import HomePageComponent from "../../components/HomePage";
import {
   getHomePageReq,
   profileInfoRequest,
   getSiteSettingReq,
   logOutRequest,
   redirectTo
} from "../../actions";
class HomePage extends Component {
   componentDidMount() {
      this.props.getHomePage();
      this.props.getSiteSetting();
      if (localStorage.getItem("token")) {
         this.props.profileInfoAction();
      }
   }
   signOut() {
      this.props.logoutUser();
    }
   render() {
      const { homePageDetailsReducer, siteSettingDetailsReducer, profileInfoReducer } = this.props;
      return (
         <>
            <HomePageComponent
               pageData={homePageDetailsReducer}
               settingData={siteSettingDetailsReducer}
               onGoPage={this.props.onGoPage}
               profileInfoReducer={profileInfoReducer} 
               onLogout={e => this.signOut(e)}/>
         </>
      )
   }
}
const mapStateToProps = state => ({
   homePageDetailsReducer: state.homePageDetailsReducer,
   siteSettingDetailsReducer: state.siteSettingDetailsReducer,
   profileInfoReducer: state.profileInfoReducer,
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
   },
   profileInfoAction: () => dispatch(profileInfoRequest()),
   logoutUser: () => dispatch(logOutRequest()),
});
export default connect(
   mapStateToProps,
   mapDispatchToProps
)(HomePage);