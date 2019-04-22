import React from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";
import * as classNames from "classnames";
const CRMModal = props => (
  <Modal
    isOpen={props.isOpen}
    toggle={props.toggle}
    className={classNames(
      "customer-modal",
      "custom-form-modal",
      "custom-modal-lg",
      { ...props.classNames }
    )}
  >
    <ModalHeader toggle={props.toggle}>
      {props.headerText || "Modal Header"}
    </ModalHeader>
    <ModalBody>{props.children}</ModalBody>
    <ModalFooter>
      {props.showfooterMsg ? (
        <div class="required-fields">
          {props.footerMessage || "*Fields are Required."}
        </div>
      ) : null}
      {props.footerButtons &&
        props.footerButtons.map((button, index) => {
          return (
            <Button
              color={button.color}
              onClick={e => {
                e.preventDefault();
                if (button.onClick) {
                  button.onClick(e);
                }
              }}
              type={button.type}
            >
              {button.text || "Button"}
            </Button>
          );
        })}
    </ModalFooter>
  </Modal>
);

export default CRMModal;
