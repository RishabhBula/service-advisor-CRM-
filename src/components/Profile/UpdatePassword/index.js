import React, { Component } from "react";
import {
  Row,
  Col,
  Form,
  Input,
  FormGroup,
  FormFeedback,
  Button,
  Label
} from "reactstrap";
import { logger } from "../../../helpers/Logger";
import Validator from "js-object-validation";
import { ProfileValidations, ProfileValidationsMessaages} from "../../../validations/profile.js";

class UpdatePassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errors: "",
      oldPassword:"",
      newPassword:"",
      confirmPassword:""
    };
  }
  // componentDidUpdate = ({profileInfoReducer}) =>{
  //   if (profileInfoReducer.isSuccess !== this.props.profileInfoReducer.isSuccess){
  //     this.setState({
  //       oldPassword :"",
  //       newPassword:"",
  //       confirmPassword:"",
  //     })
  //   }
  // }

  handleInputChange = e => {
    const { target } = e;
    const { name, value } = target;
    this.setState({
      [name]: value,
      errors: {
        ...this.state.errors,
        [name]: null
      }
    });
    console.log(value)
  };

  handleSubmit = e=>{
    e.preventDefault();
    try {
      const {
        oldPassword,
        newPassword,
        confirmPassword,
      } = this.state;

      const validData = {
        oldPassword,
        newPassword,
        confirmPassword
      };
      const payload = {
        oldPassword,
        newPassword,
      };
      const { isValid, errors } = Validator(
        validData,
        ProfileValidations,
        ProfileValidationsMessaages
      );
      if (!isValid) {
        this.setState({
          errors
        });
        return;
      }
      else{
        this.props.updatePassword(payload)
        this.setState({
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        })
      }
    }
    catch (error) {
      logger(error);
    }

  }

  render() {
    const { errors, oldPassword, newPassword, confirmPassword } = this.state;

    return (
      <div>
        <Row>
          <Col lg={"12"} md={"12"} className={"custom-form-modal"}>
            <Form onSubmit={this.handleSubmit}>
              <FormGroup>
                  <Label htmlFor={"old password"} className="customer-modal-text-style">
                    Old Password <span className="asteric">*</span>
                  </Label>
                <div className="input-block">
                  <Input
                    type="password"
                    placeholder="Old Password"
                    onChange={this.handleInputChange}
                    value={oldPassword}
                    name="oldPassword"
                    invalid={errors.oldPassword}
                  />
                  <FormFeedback>
                    {errors.oldPassword ? errors.oldPassword : null}
                  </FormFeedback>
                  </div>
              </FormGroup>
              <FormGroup>
                <Label htmlFor={"old password"} className="customer-modal-text-style">
                  New Password <span className="asteric">*</span>
                </Label>
                <div className="input-block">
                  <Input
                    type="password"
                    placeholder="New Password"
                    onChange={this.handleInputChange}
                    value={newPassword}
                    name="newPassword"
                    invalid={errors.newPassword}
                  />
                  <FormFeedback>
                    {errors.newPassword ? errors.newPassword : null}
                  </FormFeedback>
                </div>
              </FormGroup>
              <FormGroup>
                <Label htmlFor={"old password"} className="customer-modal-text-style">
                  Confirm Password <span className="asteric">*</span>
                </Label>
                <div className="input-block">
                  <Input
                    type="password"
                    placeholder="Confirm Password"
                    onChange={this.handleInputChange}
                    value={confirmPassword}
                    name="confirmPassword"
                    invalid={errors.confirmPassword}
                  />
                  <FormFeedback>
                    {errors.confirmPassword ? errors.confirmPassword : null}
                  </FormFeedback>
                </div>
              </FormGroup>          
             
              <Row className={"m-0"}>
                <Col xs="8" className={"mt-0 mb-0 ml-auto mr-auto"}>
                  <FormGroup>
                    <Label htmlFor={"old password"} className="customer-modal-text-style">
                    </Label>
                    <div className="input-block">
                      <Button
                        color="primary"
                        className="px-4 btn-theme"
                        type="submit"
                        block
                        onClick={this.handleSubmit}
                      >
                        Update
                    </Button>
                    </div>
                  </FormGroup>       
            
                </Col>
              </Row>

            </Form>
          </Col>
        </Row>
      </div>
    )
  }
}

export default UpdatePassword