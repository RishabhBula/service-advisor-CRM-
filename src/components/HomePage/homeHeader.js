import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./index.scss"
import logoImg from "../../assets/home-img/logo.png"

class HomeHeader extends Component {
   constructor(props) {
      super(props);
      this.state = {
         backgroundClass: "",
         mobClass: false,
      }
   }
   componentDidMount() {
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
      //this.props.onGoPage(pageUrl);
      window.open(pageUrl);
   };
   render() {
      const {
         backgroundClass,
         mobClass
      } = this.state;
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
                        <Link className="nav-link1 active" to={"/home"}><span>Home</span></Link>
                     </li>
                     <li className="nav-item">
                        <Link className="nav-link1" to={"/home"}><span>Features</span></Link>
                     </li>
                     <li className="nav-item">
                        <Link className="nav-link1" to={"/home"}><span>Pricing</span></Link>
                     </li>
                     <li className="nav-item">
                        <Link className="nav-link1" to={"/home"}><span>About Us</span></Link>
                     </li>
                     <li className="nav-item">
                        <Link className="nav-link1 cursor_pointer" to={""} onClick={() => this.onGoPage('/dev/login')}><span>Sign In</span></Link>
                     </li>
                  </ul>
                  <div onClick={() => this.onGoPage('/dev/register')} className="btn btn-primary">Start Free Trial</div>
               </div>
            </div>
         </nav>
      )
   }
}
export default HomeHeader