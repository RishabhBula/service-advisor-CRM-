import React, { Component } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Col,
  FormGroup,
  Label,
  Input
} from "reactstrap";
import Dropzone from 'react-dropzone'
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
export class BigModals extends Component {
  constructor(props) {
    super(props);
    this.state = {
      large: false,
      companyLogo: ''
    };
    this.cropper = React.createRef();
  }
  

  _crop(event) {
    var width = event.detail.width;
    var height = event.detail.height;
    console.log(event.target.currentSrc);
    
    // if (width < AppConfig.width_img || height < AppConfig.height_img) {
    //     this.refs.cropper.setData({
    //         width: Math.max(AppConfig.width_img, Math.min(AppConfig.width_img, width)),
    //         height: Math.max(AppConfig.height_img, Math.min(AppConfig.height_img, height)),
    //     });
    // }
    // image in dataUrl
}
  // image in dataUrl
  toggleLarge = () => {
    this.setState({
      large: !this.state.large
    });
  };
  onSelectFile = (e) => {
    var reader = new FileReader();
    const scope = this;
    reader.addEventListener("load", () =>
      scope.setState({
        companyLogo: reader.result
      })
    );
    reader.onloadend = function (as) {
      var image = new Image();
      image.onload = function () {
        scope.setState({
          companyLogo: reader.result,
        })
      }
    }
    reader.readAsDataURL(e[0]);
  };
  render() {
    const { modalOpen, toggleLarge } = this.props;
    const { companyLogo } = this.state;
    return (
      <>
        <Modal
          isOpen={modalOpen}
          toggle={toggleLarge}
          className={"modal-lg " + this.props.className}
        >
          <ModalHeader toggle={toggleLarge}>Modal title</ModalHeader>
          <ModalBody>
            <h2 className="text-center pb-4">Hi Rishabh, You're almost Done!</h2>
            <div className="pb-3">
              <h4 className="text-center pb-2">1. Tell us about your shop.</h4>
              <Row className="justify-content-center">
                <Col md="6">
                  <FormGroup>
                    <Label htmlFor="name" className="font-text">Company Name</Label>
                    <Input type="text" id="name" required />
                  </FormGroup>
                </Col>
                <Col md="6">
                  <FormGroup>
                    <Label htmlFor="name" className="font-text">Website (optional)</Label>
                    <Input type="text" id="name" required />
                  </FormGroup>
                </Col>
              </Row>
              <Row className="justify-content-center pb-2">
                <Col md="6">
                  <Dropzone onDrop={this.onSelectFile}>
                    {({ getRootProps, getInputProps, isDragActive }) => {
                      return (
                        <div
                          className="welcome-image-select-background"
                        >
                          <div className="text-center"{...getRootProps()}>
                            <input {...getInputProps()} accept="image/png, image/jpeg" />
                            {
                              companyLogo == '' ?
                                <>
                                  <i className="far fa-file-image welcome-image-icon" />
                                  <div className="text-center welcome-image-text">
                                    Shop Logo
                                  <br />
                                    Drag image here or click to add
                                  </div>
                                </> :
                                <Cropper
                                  ref={this.cropper}
                                  src={companyLogo}
                                  style={{ height: 165, width: 165 }}
                                  // Cropper.js options
                                  aspectRatio={16 / 9}
                                  guides={false}
                                  crop={this._crop.bind(this)} />
                            }
                          </div>
                        </div>
                      )
                    }}
                  </Dropzone>
                  {/* <Dropzone onDrop={acceptedFiles => this.handleImage(acceptedFiles)}>
                    {({ getRootProps, getInputProps }) => (
                      <section>
                        <div className="welcome-image-select-background" >
                          <div className="text-center"{...getRootProps()}>
                            {
                              !companyLogo ?
                                <>

                                  <input {...getInputProps()} onClick={this.handleImage} />
                                  <i className="far fa-file-image welcome-image-icon" />

                                  <div className="text-center welcome-image-text">
                                    Shop Logo
                                    <br />
                                    Drag image here or click to add
                                  </div>
                                </> :
                                <img src={companyLogo} alt="dsfds" />
                            }
                          </div>
                        </div>
                      </section>
                    )}
                  </Dropzone> */}
                </Col>
                <Col md="6" className="welcome-image-align">
                  <div className="welcome-image-text">
                    <span >Your logo will appear on quotes, invoices, work orders and work request forms.</span>
                  </div>
                </Col>
              </Row>
            </div>
            <div className="pb-3">
              <h4 className="text-center pb-2">2. How many people work in your shop?</h4>
              <div className="justify-content-center">
                <div className="d-flex box-space">
                  <div className="box-contain">
                    <div className="welcome-service-text">1-2</div>
                  </div>
                  <div className="box-contain">
                    <div className="welcome-service-text">3-6</div>
                  </div>
                  <div className="box-contain">
                    <div className="welcome-service-text">7-10</div>
                  </div>
                  <div className="box-contain">
                    <div className="welcome-service-text">11+</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="pb-3">
              <h4 className="text-center pb-2">3. What kinds of services do you offer?</h4>
              <div className="justify-content-center">
                <div className="d-flex box-space">
                  <div className="box-contain">
                    <div className="justify-content-center">
                      <img src="/assets/img/repairing-car.svg" alt="" />
                      <div className="welcome-service-text">Repair & Maintenance</div>
                    </div>
                  </div>
                  <div className="box-contain">
                    <img src="/assets/img/carPaintingLogo.svg" alt="" />
                    <div className="welcome-service-text">Detail, Wrap & Film</div>
                  </div>
                  <div className="box-contain">
                    <img src="/assets/img/carChachisLogo.svg" alt="" />
                    <div className="welcome-service-text">Restoration & Custom Builds</div>
                  </div>
                  <div className="box-contain">
                    <img src="/assets/img/list-dots.svg" alt="" />
                    <div className="welcome-service-text">Others</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="pb-3">
              <h4 className="text-center pb-2">4. What types of vehicles do you service?</h4>
              <div className="justify-content-center">
                <div className="d-flex box-space">
                  <div className="box-contain">
                    <div className="justify-content-center">
                      <img src="/assets/img/carLogo.svg" alt="" />
                      <div className="welcome-service-text">Cars</div>
                    </div>
                  </div>
                  <div className="box-contain">
                    <div>
                      <img src="/assets/img/trukLogo.svg" alt="" />
                      <div className="welcome-service-text">Semi & Heavy Duty</div>
                    </div>
                  </div>
                  <div className="box-contain">
                    <div>
                      <img src="/assets/img/vanLogo.svg" alt="" />
                      <div className="welcome-service-text">RVs</div>
                    </div>
                  </div>
                  <div className="box-contain">
                    <div>
                      <img src="/assets/img/trailerLogo.svg" alt="" />
                      <div className="welcome-service-text">Trailers</div>
                    </div>
                  </div>
                </div>
                <div className="d-flex box-space">
                  <div className="box-contain">
                    <div className="justify-content-center">
                      <img src="/assets/img/motorcycleLogo.svg" alt="" />
                      <div className="welcome-service-text">Motorcycles</div>
                    </div>
                  </div>
                  <div className="box-contain">
                    <img src="/assets/img/boatLogo.svg" alt="" />
                    <div className="welcome-service-text">Boats</div>
                  </div>
                  <div className="box-contain">
                    <img src="/assets/img/cycleLogo.svg" alt="" />
                    <div className="welcome-service-text">Bicycless</div>
                  </div>
                  <div className="box-contain">
                    <img src="/assets/img/list-dots.svg" />
                    <div className="welcome-service-text">Others</div>
                  </div>
                </div>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={toggleLarge}>
              Do Something
            </Button>{" "}
            <Button color="secondary" onClick={toggleLarge}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </>
    );
  }
}


