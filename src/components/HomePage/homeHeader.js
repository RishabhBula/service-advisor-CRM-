import React, { Component } from "react";
import { Link, NavLink } from "react-router-dom";
import "./index.scss"
import logoImg from "../../assets/home-img/logo.png"
import { AppHeaderDropdown } from "@coreui/react";
import Avtar from "../common/Avtar"
import {
   DropdownMenu,
   DropdownToggle,
} from "reactstrap";
import "../../App.scss";
class HomeHeader extends Component {
   constructor(props) {
      super(props);
      this.state = {
         backgroundClass: "",
         mobClass: false,
         isLogin: false
      }
   }
   componentDidMount() {
      if (!localStorage.getItem("token")) {
         this.setState({ isLogin: false });
      } else {
         this.setState({ isLogin: true });
      }
      window.addEventListener('scroll', this.listenScrollEvent)
   };
   listenScrollEvent = e => {
      if (window.scrollY > 150) {
         this.setState({ backgroundClass: "sticky-header" })
      } else {
         this.setState({ backgroundClass: "" })
      }
   };
   handleMobileToggle = () => {
      this.setState({
         mobClass: !this.state.mobClass
      })
   };
   onGoPage = (pageUrl) => {
      this.props.onGoPage(pageUrl);
      // window.open(pageUrl);
   };
   render() {
      const {
         profileInfoReducer
      } = this.props;
      const {
         backgroundClass,
         mobClass,
         isLogin
      } = this.state;
      const profileName =
         profileInfoReducer && profileInfoReducer.profileInfo
            ? profileInfoReducer.profileInfo.firstName + " " +
            profileInfoReducer.profileInfo.lastName
            : "Loading...";
      const profileEmail =
         profileInfoReducer && profileInfoReducer.profileInfo
            ? profileInfoReducer.profileInfo.email
            : "Loading...";
      return (
         <nav className={`navbar navbar-expand-md navbar-dark main-header fixed-top ${backgroundClass}`} id="banner">
            <div className="container">
               <Link className="navbar-brand" to={"/home"}><img src={logoImg} alt="" /></Link>
               <button onClick={this.handleMobileToggle} className={mobClass ? "navbar-toggler mob-nav" : "navbar-toggler"} type="button" data-toggle="collapse" data-target="#collapsibleNavbar">
                  <span className="navbar-toggler-icon"></span>
               </button>
               <div className="collapse navbar-collapse" id="collapsibleNavbar">
                  <ul className="navbar-nav ml-auto">
                     <li className="nav-item">
                        <NavLink className="nav-link1" to={"/home"}><span>Home</span></NavLink>
                     </li>
                     <li className="nav-item">
                        <NavLink className="nav-link1" to={"/home"}><span>Features</span></NavLink>
                     </li>
                     <li className="nav-item">
                        <NavLink className="nav-link1" to={"/home"}><span>Pricing</span></NavLink>
                     </li>
                     <li className="nav-item">
                        <NavLink className="nav-link1" to={"/home"}><span>About Us</span></NavLink>
                     </li>
                     {!isLogin ?
                        <li className="nav-item">
                           <NavLink className="nav-link1" to={"/login"} /*onClick={() => this.onGoPage('/dev/login')}*/><span>Sign In</span></NavLink>
                        </li>
                        : null}
                  </ul>
                  {!isLogin ?
                     <Link to={"/register"}/*onClick={() => this.onGoPage('/dev/register')}*/ className="btn btn-primary">Start Free Trial</Link>
                     : <ul className="app-header position-relative">
                        <AppHeaderDropdown direction="down" className="user-Info-dropdown">
                           <DropdownToggle className="nav-link pl-2 pr-2 ">
                              <span className={"fa-user-icon"}>
                                 <span className="fas fa-user" />
                              </span>
                           </DropdownToggle>
                           <DropdownMenu right style={{ right: "auto" }} className="">
                              <div>
                                 <div className={"top-block d-flex"}>
                                    <span className={"avtar-icon"}>
                                       <Avtar value={profileName} class={"name"} />
                                    </span>
                                    <div>
                                       <div className={"text-capitalize name-block"}>
                                          {profileName}
                                       </div>
                                       <div className={"email"}>{profileEmail}</div>
                                    </div>
                                 </div>
                                 <NavLink to="/profile" className="nav-link">
                                    <i className={"fa fa-user"} /> My Profile
                                 </NavLink>
                                 <NavLink to="/home" className="nav-link">
                                    <i className={"fas fa-home"} /> Home
                                 </NavLink>
                                 <NavLink to="/faq" className="nav-link">
                                    <i className={"fa fa-question-circle"} /> FAQ's
                                 </NavLink>
                                 <NavLink to="/profile" className="nav-link">
                                    <i className={"fa fa-phone"} /> Support
                                 </NavLink>
                                 <NavLink to="#" className="nav-link logout-link">
                                    <span
                                       className={"logout-btn"}
                                       onClick={e => this.props.onLogout(e)}
                                    >
                                       <i className={"fa fa-sign-out"} /> Logout
                                    </span>
                                 </NavLink>
                              </div>
                           </DropdownMenu>
                        </AppHeaderDropdown>
                     </ul>}
               </div>
            </div>
         </nav>
      )
   }
}
export default HomeHeader