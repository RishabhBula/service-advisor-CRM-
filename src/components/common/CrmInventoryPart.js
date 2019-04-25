import React, { Component } from "react";
import {
  Form,
  Row,
  FormGroup,
  Col,
  Label,
  Input,
  FormFeedback,
  InputGroup,
  ButtonGroup,
  Button
} from "reactstrap";
import CRMModal from "./Modal";
import { logger } from "../../helpers/Logger";
import {
  MarkupChangeValues,
  MarginChangeValues,
  CreatePartOptions,
  DefaultErrorMessage
} from "../../config/Constants";
import { AppSwitch } from "@coreui/react";
import Validator from "js-object-validation";
import { PartValidations, PartValidationMessages } from "../../validations";
import {
  CalculateMarkupPercent,
  CalculateMarginPercent,
  CalculateRetailPriceByMarkupPercent,
  CalculateRetailPriceByMarginPercent
} from "../../helpers/Sales";
import { Async } from "react-select";
import { toast } from "react-toastify";
class CrmInventoryPart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errors: {},
      partDescription: "",
      note: "",
      partNumber: "",
      vendorId: "",
      location: "",
      priceMatrix: "",
      cost: "",
      price: "",
      markup: "",
      margin: "",
      criticalQuantity: "",
      quantity: "",
      partOptions: {
        isTaxed: true,
        showNumberOnQuoteAndInvoice: false,
        showPriceOnQuoteAndInvoice: true,
        showNoteOnQuoteAndInvoice: true
      }
    };
  }
  addPart = e => {
    e.preventDefault();
    this.setState({
      errors: {}
    });
    try {
      const {
        partDescription,
        note,
        partNumber,
        vendorId,
        location,
        priceMatrix,
        cost,
        price,
        markup,
        margin,
        criticalQuantity,
        quantity
      } = this.state;
      let data = {
        partDescription,
        note,
        partNumber,
        vendorId,
        location,
        priceMatrix,
        cost,
        price,
        markup,
        margin,
        criticalQuantity,
        quantity
      };
      const { isValid, errors } = Validator(
        data,
        PartValidations,
        PartValidationMessages
      );
      if (!isValid) {
        this.setState({
          errors
        });
        return;
      }
      data.vendorId = vendorId ? vendorId.value : "";
      this.props.addInventoryPart(data);
    } catch (error) {
      logger(error);
      toast.error(DefaultErrorMessage);
    }
  };
  handleClick = e => {
    this.setState({
      partOptions: {
        ...this.state.partOptions,
        [e.target.name]: e.target.checked
      }
    });
  };
  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value,
      errors: {
        ...this.state.errors,
        [e.target.name]: null
      }
    });
  };
  handleRetailsPriceChange = e => {
    this.setState(
      {
        price: e.target.value
      },
      () => {
        const { cost, price } = this.state;
        this.setState({
          markup:
            parseFloat(cost) && parseFloat(price)
              ? CalculateMarkupPercent(cost, price).toFixed(2)
              : "",
          margin:
            parseFloat(cost) && parseFloat(price)
              ? CalculateMarginPercent(cost, price).toFixed(2)
              : ""
        });
      }
    );
  };
  setPriceByMarkup = markupPercent => {
    const { cost } = this.state;
    this.setState({
      price:
        cost && markupPercent
          ? CalculateRetailPriceByMarkupPercent(cost, markupPercent).toFixed(2)
          : this.state.price
    });
  };
  setPriceByMargin = marginPercent => {
    const { cost } = this.state;
    this.setState({
      price:
        cost && marginPercent
          ? CalculateRetailPriceByMarginPercent(cost, marginPercent).toFixed(2)
          : this.state.price
    });
  };
  loadOptions = (input, callback) => {
    this.props.getInventoryPartsVendors({ input, callback });
  };
  render() {
    const {
      errors,
      partDescription,
      note,
      partNumber,
      location,
      priceMatrix,
      cost,
      price,
      markup,
      partOptions,
      margin,
      vendorId,
      criticalQuantity,
      quantity
    } = this.state;
    const { isOpen, toggle } = this.props;
    const buttons = [
      {
        text: "Add part",
        color: "primary",
        onClick: this.addPart,
        type: "submit"
      },
      {
        text: "Cancel",
        onClick: toggle,
        type: "button"
      }
    ];
    return (
      <Form onSubmit={this.addPart}>
        <CRMModal
          isOpen={isOpen}
          toggle={toggle}
          headerText={"Add new part to inventory"}
          footerButtons={buttons}
          showfooterMsg
        >
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
                      name="partDescription"
                      onChange={this.handleChange}
                      placeholder="Part Description"
                      id="name"
                      value={partDescription}
                      invalid={errors.partDescription}
                    />
                    {errors.partDescription ? (
                      <FormFeedback>{errors.partDescription}</FormFeedback>
                    ) : null}
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
                    placeholder="Note"
                    onChange={this.handleChange}
                    name="note"
                    value={note}
                    invalid={errors.note}
                  />
                  {errors.note ? (
                    <FormFeedback>{errors.note}</FormFeedback>
                  ) : null}
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
                    placeholder="#10000"
                    onChange={this.handleChange}
                    maxLength="10"
                    name="partNumber"
                    value={partNumber}
                    invalid={errors.partNumber}
                  />
                  {errors.partNumber ? (
                    <FormFeedback>{errors.partNumber}</FormFeedback>
                  ) : null}
                </div>
              </FormGroup>
            </Col>
            <Col md="6">
              <FormGroup>
                <Label htmlFor="name" className="customer-modal-text-style">
                  Vendor
                </Label>
                <div className={"input-block"}>
                  <Async
                    placeholder={"Type vendor name"}
                    loadOptions={this.loadOptions}
                    value={vendorId}
                    onChange={e => {
                      this.setState({
                        vendorId: e
                      });
                    }}
                  />
                  {errors.vendorId ? (
                    <FormFeedback>{errors.vendorId}</FormFeedback>
                  ) : null}
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
                    placeholder="Bin/Location"
                    onChange={this.handleChange}
                    maxLength="40"
                    name="location"
                    value={location}
                    invalid={errors.location}
                  />
                  {errors.location ? (
                    <FormFeedback>{errors.location}</FormFeedback>
                  ) : null}
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
                    placeholder="Price metrix"
                    onChange={this.handleChange}
                    maxLength="40"
                    name="priceMatrix"
                    value={priceMatrix}
                    invalid={errors.priceMatrix}
                  />
                  {errors.priceMatrix ? (
                    <FormFeedback>{errors.priceMatrix}</FormFeedback>
                  ) : null}
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
                    type="number"
                    className="customer-modal-text-style"
                    placeholder="$"
                    onChange={this.handleChange}
                    maxLength="40"
                    name="cost"
                    invalid={errors.cost}
                    value={cost}
                  />
                  {errors.cost ? (
                    <FormFeedback>{errors.cost}</FormFeedback>
                  ) : null}
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
                    type="number"
                    className="customer-modal-text-style"
                    placeholder="$"
                    onChange={this.handleRetailsPriceChange}
                    maxLength="40"
                    name="price"
                    invalid={errors.price}
                    value={price}
                  />
                  {errors.price ? (
                    <FormFeedback>{errors.price}</FormFeedback>
                  ) : null}
                </div>
              </FormGroup>
            </Col>
            <Col md="6">
              <FormGroup>
                <Label htmlFor="name" className="customer-modal-text-style">
                  Quantity in hand
                </Label>
                <div className={"input-block"}>
                  <Input
                    type="number"
                    className="customer-modal-text-style"
                    placeholder="100"
                    onChange={this.handleChange}
                    maxLength="10"
                    name="quantity"
                    invalid={errors.quantity}
                    value={quantity}
                  />
                  {errors.quantity ? (
                    <FormFeedback>{errors.quantity}</FormFeedback>
                  ) : null}
                </div>
              </FormGroup>
            </Col>
            <Col md="6">
              <FormGroup>
                <Label htmlFor="name" className="customer-modal-text-style">
                  Critical Quantity
                </Label>
                <div className={"input-block"}>
                  <Input
                    type="number"
                    className="customer-modal-text-style"
                    placeholder="10"
                    onChange={this.handleChange}
                    maxLength="10"
                    name="criticalQuantity"
                    invalid={errors.criticalQuantity}
                    value={criticalQuantity}
                  />
                  {errors.criticalQuantity ? (
                    <FormFeedback>{errors.criticalQuantity}</FormFeedback>
                  ) : null}
                </div>
              </FormGroup>
            </Col>
            <Col md="6">
              <FormGroup>
                <Label htmlFor="name" className="customer-modal-text-style">
                  Markup
                </Label>
                <div className={"input-block"}>
                  <ButtonGroup>
                    {MarkupChangeValues.map((mark, index) => {
                      return (
                        <Button
                          key={index}
                          type={"button"}
                          color={"primary"}
                          size={"sm"}
                          onClick={() => this.setPriceByMarkup(mark.value)}
                        >
                          {mark.key}
                        </Button>
                      );
                    })}
                    <Button type={"button"} size={"sm"}>
                      <Input
                        type={"text"}
                        placeholder={"Markup"}
                        defaultValue={markup}
                        onChange={e => this.setPriceByMarkup(e.target.value)}
                      />
                    </Button>
                  </ButtonGroup>
                </div>
              </FormGroup>
            </Col>
            <Col md="6">
              <FormGroup>
                <Label htmlFor="name" className="customer-modal-text-style">
                  Margin
                </Label>
                <div className={"input-block"}>
                  <ButtonGroup>
                    {MarginChangeValues.map((mark, index) => {
                      return (
                        <Button
                          key={index}
                          type={"button"}
                          color={"primary"}
                          size={"sm"}
                          onClick={() => this.setPriceByMargin(mark.value)}
                        >
                          {mark.key}
                        </Button>
                      );
                    })}
                    <Button type={"button"} size={"sm"}>
                      <Input
                        type={"text"}
                        placeholder={"Margin"}
                        defaultValue={margin}
                        onChange={e => this.setPriceByMargin(e.target.value)}
                      />
                    </Button>
                  </ButtonGroup>
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
                    placeholder="Item reference"
                    onChange={this.handleChange}
                    maxLength="40"
                    name="email"
                  />
                </div>
              </FormGroup>
            </Col>
          </Row>
          <Row>
            {CreatePartOptions.map((option, index) => {
              return (
                <Col sm={{ size: 5, offset: 1 }} key={index}>
                  <Row className="justify-content-center pb-2" key={index}>
                    <Col md="2">
                      <AppSwitch
                        className={"mx-1"}
                        name={option.key}
                        checked={partOptions[option.key]}
                        onClick={this.handleClick}
                        variant={"3d"}
                        color={"primary"}
                        size={"sm"}
                      />
                    </Col>
                    <Col md="10">
                      <p className="customer-modal-text-style">{option.text}</p>
                    </Col>
                  </Row>
                </Col>
              );
            })}
          </Row>
        </CRMModal>
      </Form>
    );
  }
}

export default CrmInventoryPart;
