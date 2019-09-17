import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./index.scss"
import logoImg from "../../assets/home-img/logo.png"
import bannerImg from "../../assets/home-img/banner-right-img.png";
import facebookIcon from "../../assets/home-img/facebook-icon.svg";
import twitterIcon from "../../assets/home-img/twitter-icon.svg";
import linkdinIcon from "../../assets/home-img/linkedin-icon.svg";
import instagramIcon from "../../assets/home-img/instagram-icon.svg";
class HomePageComponent extends Component {
   constructor(props) {
      super(props);
      this.state = {
         title: "",
         backgroundClass: "",
         section2Title: "",
         section1: [
            { title: "", subTitle: "", description: "", img: "" }
         ],
         section2: [
            { title: "", description: "", img: "" }
         ],
         section3: [
            { title: "", description: "", video: "" }
         ],
         mobClass: false,
         facebook: "",
         twitter: "",
         instagram: "",
         linkedin: "",
         email: "",
         support_email: "",
         website: "",
         address: "",
         contact: "",
      }
   }

   componentDidMount() {
      window.addEventListener('scroll', this.listenScrollEvent)
   }
   listenScrollEvent = e => {
      if (window.scrollY > 150) {
         this.setState({ backgroundClass: "sticky-header" })
      } else {
         this.setState({ backgroundClass: "" })
      }
   }
   componentDidUpdate = ({ pageData, settingData }) => {
      if (this.props.pageData && this.props.pageData.homePageDetails && this.props.pageData.homePageDetails !== {} && pageData.homePageDetails && this.props.pageData.homePageDetails !== pageData.homePageDetails) {
         const {
            title,
            section2Title,
            section1,
            section2,
            section3,
         } = this.props.pageData.homePageDetails;
         this.setState({
            title,
            section2Title,
            section1,
            section2,
            section3,
         });
      }
      if (this.props.settingData && this.props.settingData.settingDetails && this.props.settingData.settingDetails !== {} && this.props.settingData.settingDetails !== null && settingData.settingDetails && settingData.settingDetails !== this.props.settingData.settingDetails) {
         const {
            facebook,
            twitter,
            instagram,
            linkedin,
            email,
            support_email,
            website,
            contact,
            address
         } = this.props.settingData.settingDetails;
         this.setState({
            facebook,
            twitter,
            instagram,
            linkedin,
            email,
            support_email,
            website,
            contact,
            address

         })
      }
   };

   handleMobileToggle = () => {
      this.setState({
         mobClass: !this.state.mobClass
      })
   }
   validateYouTubeUrl = (url) => {
      let result = "";
      if (url !== undefined || url !== '') {
         var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|v=|\?v=)([^#]*).*/;
         var match = url.match(regExp);
         if (match && match[2].length === 11) {
            // Do anything for being valid
            // if need to change the url to embed url then use below line            
            result = ('https://www.youtube.com/embed/' + match[2] + '?autoplay=0&enablejsapi=1');
         }
      }
      return result
   };
   onGoPage = (pageUrl) => {
      //this.props.onGoPage(pageUrl);
      window.open(pageUrl, "_blank");
   };
   render() {
      const {
         section2Title,
         section1,
         section2,
         section3,
         backgroundClass,
         mobClass,
         facebook,
         twitter,
         instagram,
         linkedin
      } = this.state;
      return (
         <>
            <div className="main-body">
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
                              <Link className="nav-link1" to={"/pricing"}><span>Pricing</span></Link>
                           </li>
                           <li className="nav-item">
                              <Link className="nav-link1" to={"/home"}><span>About Us</span></Link>
                           </li>
                           <li className="nav-item">
                              <Link className="nav-link1 cursor_pointer" to={""} onClick={() => this.onGoPage('/login')}><span>Sign In</span></Link>
                           </li>
                        </ul>
                        <div onClick={() => this.onGoPage('/register')} className="btn btn-primary">Start Free Trial</div>
                     </div>
                  </div>
               </nav>
               <section className="banner">
                  <div className="container">
                     <div className="row align-items-center">
                        <div className="col-sm-6">
                           <div className="banner-left-section">
                              <div className="banner-left-content">
                                 <h1>The Smart & Simple way to Run Your Auto Shop.</h1>
                                 <p>With the easy to use and customizable CRM for your marketing, sales, and customer service teams.</p>
                                 <div onClick={() => this.onGoPage('/register')} className="btn btn-primary">Start Free Trial</div>
                              </div>
                           </div>
                        </div>
                        <div className="col-sm-6">
                           <div className="banner-right-img">
                              <img src={bannerImg} alt="" />
                           </div>
                        </div>
                     </div>
                  </div>
               </section>
               <section className="main-content main-info-section">
                  <div className="container">
                     {section1 && section1.length ? section1.map((data, index) => {
                        let title = (data.title).split(" ");
                        return (
                           <React.Fragment key={index}>
                              {index % 2 === 0 ?
                                 <div className="row align-items-center pt-3 mob-row">
                                    <div className="col-sm-7">
                                       <div className="content-wrap text-right">
                                          <div className="main-heading-wrap">
                                             <p>{data.subTitle ? data.subTitle : ""}</p>
                                             <h2>{title.map((value, index) => {
                                                return (
                                                   <React.Fragment key={index}>
                                                      {index < (title.length - 1) ? <span>{value} </span> : <span className="heading-highlighter">{value}</span>}
                                                   </React.Fragment>
                                                )
                                             })} </h2>
                                          </div>
                                          <p className="padding-left">{data.description ? <div
                                             dangerouslySetInnerHTML={{
                                                __html: `${data.description}`
                                             }} /> : ""}</p>
                                       </div>
                                    </div>
                                    <div className="col-sm-5">
                                       <div className="content-img-wrap">
                                          <img src={data.img} alt="" className="right-img" />
                                       </div>
                                    </div>
                                 </div>
                                 :
                                 <div className="row align-items-center pt-3">
                                    <div className="col-sm-5">
                                       <div className="content-img-wrap">
                                          <img src={data.img} alt="" className="left-img" />
                                       </div>
                                    </div>
                                    <div className="col-sm-7">
                                       <div className="content-wrap text-left">
                                          <div className="main-heading-wrap">
                                             <p>{data.subTitle ? data.subTitle : ""}</p>
                                             <h2>{title.map((value, index) => {
                                                return (
                                                   <React.Fragment key={index}>
                                                      {index < (title.length - 1) ? <span>{value} </span> : <span className="heading-highlighter">{value}</span>}
                                                   </React.Fragment>
                                                )
                                             })} </h2>
                                          </div>
                                          <p className="padding-right">{data.description ? <div
                                             dangerouslySetInnerHTML={{
                                                __html: `${data.description}`
                                             }} /> : ""}</p>
                                       </div>
                                    </div>
                                 </div>
                              }
                           </React.Fragment>
                        )
                     }) : null}
                  </div>
               </section>
               <section className="our-features-section" id="our-features">
                  <div className="container">
                     <div className="main-heading-wrap text-center">
                        <h2>Our <span className="heading-highlighter">Features</span></h2>
                        <p>{section2Title ? section2Title : ""}</p>
                     </div>
                     {section2 && section2.length ? section2.map((data, index) => {
                        return (
                           <React.Fragment key={index}>
                              {index % 2 === 0 ?
                                 <div className="row align-items-center p-3 text-right mob-row">
                                    <div className="col-sm-6">
                                       <h3>{data.title ? data.title : ""}</h3>
                                       <p>{data.description ? <div
                                          dangerouslySetInnerHTML={{
                                             __html: `${data.description}`
                                          }} /> : ""}</p>
                                    </div>
                                    <div className="col-sm-6">
                                       <img src={data.img} alt="" />
                                    </div>
                                 </div>
                                 :
                                 <div className="row align-items-center p-3 text-left">
                                    <div className="col-sm-6">
                                       <img src={data.img} alt="" />
                                    </div>
                                    <div className="col-sm-6">
                                       <h3>{data.title ? data.title : ""}</h3>
                                       <p>{data.description ? <div
                                          dangerouslySetInnerHTML={{
                                             __html: `${data.description}`
                                          }} /> : ""}</p>
                                    </div>
                                 </div>
                              }
                           </React.Fragment>
                        )
                     })
                        : null}
                     <div className="our-features-note">
                        <h4 className="text-center">Invoicing, Inspections, CRM, Texting, Workflow and much more...!</h4>
                     </div>
                  </div>
               </section>
               <section className="main-content why-choose-section" style={{ padding: "30px" }}>
                  <div className="container">
                     {section3 && section3.length ? section3.map((data, index) => {
                        let title = (data.title).split(" ");
                        return (
                           <React.Fragment key={index}>
                              <div className="main-heading-wrap text-center">
                                 <h2>{title.map((value, index) => {
                                    return (
                                       <React.Fragment key={index}>
                                          {index < (title.length - 1) ? <span>{value} </span> : <span className="heading-highlighter">{value}</span>}
                                       </React.Fragment>
                                    )
                                 })} </h2>
                                 <p>{data.description ? <div
                                    dangerouslySetInnerHTML={{
                                       __html: `${data.description}`
                                    }} /> : ""}</p>
                              </div>
                              <div className="text-center pt-3">
                                 {data.video && data.video.length ?
                                    <iframe width="560" title={index} height="315" src={data.video && data.video.length ? this.validateYouTubeUrl(data.video) : ""} frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" >
                                       <p>Your browser does not support iframes.</p>
                                    </iframe>
                                    : null}
                              </div>
                           </React.Fragment>
                        )
                     }) : null}
                  </div>
               </section>
               <section className="main-content" >
                  <div className="container">
                     <div className="get-started-wrap">
                        <div className="get-started">
                           <div className="get-started-left">
                              <h3>Get Started for <span className="heading-highlighter">Free</span></h3>
                              <p>No Contracts. No hidden fees. Get started in minutes. </p>
                           </div>
                           <div className="get-started-right">
                              <div onClick={() => this.onGoPage('/register')} className="btn btn-primary">Start Free Trial
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </section>
               <footer>
                  <div className="footer-wrap">
                     <div className="container">
                        <div className="row align-items-center">
                           <div className="col-sm-3">
                              <Link className="navbar-brand" to={"/home"}><img src={logoImg} alt="logoImg" /></Link>
                           </div>
                           <div className="col-sm-6">
                              <ul>
                                 <ul className="footer-nav-listing text-center">
                                    <li><Link to={"/home"}>Home</Link></li>
                                    <li><Link to={"/home"}>Features</Link></li>
                                    <li><Link to={"/home"}>Pricing</Link></li>
                                    <li><Link to={"/home"}>About Us</Link></li>
                                 </ul>
                              </ul>
                           </div>
                           <div className="col-sm-3">
                              <ul className="social-icon-listing text-center">
                                 <li><a href={facebook ? facebook : ""} target="_blank" rel="noopener noreferrer"><img src={facebookIcon} alt="facebookIcon" /></a></li>
                                 <li><a href={twitter ? twitter : ""} target="_blank" rel="noopener noreferrer"><img src={twitterIcon} alt="twitterIcon" /></a></li>
                                 <li><a href={linkedin ? linkedin : ""} target="_blank" rel="noopener noreferrer"><img src={linkdinIcon} alt="linkdinIcon" /></a></li>
                                 <li><a href={instagram ? instagram : ""} target="_blank" rel="noopener noreferrer"><img src={instagramIcon} alt="instagramIcon" /></a></li>
                              </ul>
                           </div>
                        </div>
                     </div>
                  </div>
                  <div className="copyright-wrap text-center">
                     All Copyrights Reserved by CRM 2019
                     </div>
               </footer>
            </div>
         </>
      )
   }
}
export default HomePageComponent