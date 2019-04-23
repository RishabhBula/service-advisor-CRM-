import React, { Component } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Form,
  Row,
  FormGroup,
  Col,
  Label,
  Input,
  FormFeedback,
  InputGroup
} from "reactstrap";
class CrmInventoryPart extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { isOpen, toggle } = this.props;
    return (
      <Modal
        isOpen={isOpen}
        toggle={toggle}
        className="customer-modal custom-form-modal custom-modal-lg"
        backdrop={"static"}
      >
        <ModalHeader toggle={toggle}>Add new part to inventory</ModalHeader>
        <ModalBody>
          <Form>
            <Row className="justify-content-center">
              <Col md="6">
                <FormGroup>
                  <Label htmlFor="name" className="customer-modal-text-style">
                    Part Description <span className={"asteric"}>*</span>
                  </Label>
                  <InputGroup>
                    <div className={"input-block"}>
                      <Input
                        type="text"
                        name="companyName"
                        onChange={this.handleChange}
                        placeholder="Company Name"
                        maxLength="20"
                        id="name"
                        invalid={true}
                      />
                      <FormFeedback>fasdf</FormFeedback>
                    </div>
                  </InputGroup>
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label htmlFor="name" className="customer-modal-text-style">
                    Note
                  </Label>
                  <div className={"input-block"}>
                    <Input
                      type="text"
                      className="customer-modal-text-style"
                      placeholder="john.doe@example.com"
                      onChange={this.handleChange}
                      maxLength="40"
                      name="email"
                    />
                    <FormFeedback>fasdfa</FormFeedback>
                  </div>
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label htmlFor="name" className="customer-modal-text-style">
                    Part Number
                  </Label>
                  <div className={"input-block"}>
                    <Input
                      type="text"
                      className="customer-modal-text-style"
                      placeholder="john.doe@example.com"
                      onChange={this.handleChange}
                      maxLength="40"
                      name="email"
                    />
                    <FormFeedback>fasdfa</FormFeedback>
                  </div>
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label htmlFor="name" className="customer-modal-text-style">
                    Vendor
                  </Label>
                  <div className={"input-block"}>
                    <Input
                      type="text"
                      className="customer-modal-text-style"
                      placeholder="john.doe@example.com"
                      onChange={this.handleChange}
                      maxLength="40"
                      name="email"
                    />
                    <FormFeedback>fasdfa</FormFeedback>
                  </div>
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label htmlFor="name" className="customer-modal-text-style">
                    Bin/Location
                  </Label>
                  <div className={"input-block"}>
                    <Input
                      type="text"
                      className="customer-modal-text-style"
                      placeholder="john.doe@example.com"
                      onChange={this.handleChange}
                      maxLength="40"
                      name="email"
                    />
                    <FormFeedback>fasdfa</FormFeedback>
                  </div>
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label htmlFor="name" className="customer-modal-text-style">
                    Pricing Matrix
                  </Label>
                  <div className={"input-block"}>
                    <Input
                      type="text"
                      className="customer-modal-text-style"
                      placeholder="john.doe@example.com"
                      onChange={this.handleChange}
                      maxLength="40"
                      name="email"
                    />
                    <FormFeedback>fasdfa</FormFeedback>
                  </div>
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label htmlFor="name" className="customer-modal-text-style">
                    Cost
                  </Label>
                  <div className={"input-block"}>
                    <Input
                      type="text"
                      className="customer-modal-text-style"
                      placeholder="john.doe@example.com"
                      onChange={this.handleChange}
                      maxLength="40"
                      name="email"
                    />
                    <FormFeedback>fasdfa</FormFeedback>
                  </div>
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label htmlFor="name" className="customer-modal-text-style">
                    Retail Price
                  </Label>
                  <div className={"input-block"}>
                    <Input
                      type="text"
                      className="customer-modal-text-style"
                      placeholder="john.doe@example.com"
                      onChange={this.handleChange}
                      maxLength="40"
                      name="email"
                    />
                    <FormFeedback>fasdfa</FormFeedback>
                  </div>
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label htmlFor="name" className="customer-modal-text-style">
                    Markup
                  </Label>
                  <div className={"input-block"}>
                    <Input
                      type="text"
                      className="customer-modal-text-style"
                      placeholder="john.doe@example.com"
                      onChange={this.handleChange}
                      maxLength="40"
                      name="email"
                    />
                    <FormFeedback>fasdfa</FormFeedback>
                  </div>
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label htmlFor="name" className="customer-modal-text-style">
                    Margin
                  </Label>
                  <div className={"input-block"}>
                    <Input
                      type="text"
                      className="customer-modal-text-style"
                      placeholder="john.doe@example.com"
                      onChange={this.handleChange}
                      maxLength="40"
                      name="email"
                    />
                    <FormFeedback>fasdfa</FormFeedback>
                  </div>
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md="6">
                <FormGroup>
                  <Label htmlFor="name" className="customer-modal-text-style">
                    Quickbooks Item Reference
                  </Label>
                  <div className={"input-block"}>
                    <Input
                      type="text"
                      className="customer-modal-text-style"
                      placeholder="john.doe@example.com"
                      onChange={this.handleChange}
                      maxLength="40"
                      name="email"
                    />
                    <FormFeedback>fasdfa</FormFeedback>
                  </div>
                </FormGroup>
              </Col>
            </Row>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={toggle}>
            Do Something
          </Button>{" "}
          <Button color="secondary" onClick={toggle}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

export default CrmInventoryPart;
