import React, { Component } from "react";
function validation(getdData, mode, dataName) {
  let responseData;
  switch (mode) {
    case "name":
      var nameRegex = getdData.match(/^[0-9a-zA-Z][0-9a-zA-Z\s]*$/);
      var temp = dataName ? dataName : "Name";
      if (getdData === "") {
        return requiredMessage(temp);
      } else if (!nameRegex) {
        return emptyMessage(temp);
      } else {
        return noError();
      }

    case "contactNumber":
      var contactRegex = getdData.match(/^\d{7,14}$/);
      if (getdData === "") {
        return requiredMessage(dataName);
      } else if (!contactRegex) {
        return invalidMessage(dataName);
      } else {
        return noError();
      }
    case "address":
      var addressRegex = getdData.match(/^[0-9a-zA-Z\s,'-]*$/);

      if (getdData === "") {
        return requiredMessage(dataName);
      } else if (!addressRegex) {
        return emptyMessage(dataName);
      } else {
        return noError();
      }

    case "email":
      var emailRegex = getdData.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);

      if (getdData === "") {
        return requiredMessage("Please enter email address.");
      } else if (!emailRegex) {
        return invalidMessage(dataName);
      } else {
        return noError();
      }
    case "password":
      if (getdData === "") {
        return requiredMessage(dataName);
      } else if (getdData.length < 6) {
        var errMessage = "Password should have 6 character";
        responseData = {
          isError: true,
          message: errMessage
        };
        return responseData;
      } else {
        return noError();
      }
    default:
      responseData = {};
      break;
  }
}
function noError() {
  var responseData = {
    isError: false,
    message: ""
  };
  return responseData;
}
function requiredMessage(fieldName) {
  let errMessage = "";
  if(fieldName == "") 
  errMessage = "This Field is required";
  else 
  errMessage = fieldName;
  var responseData = {
    isError: true,
    message: errMessage
  };
  return responseData;
}
function emptyMessage(fieldName) {
  let errMessage = fieldName + " can not Empty";
  var responseData = {
    isError: true,
    message: errMessage
  };
  return responseData;
}
export function invalidMessage(fieldName) {
   let errMessage = "";
   if (fieldName == "") 
   errMessage = "Email is Invalid";
   else errMessage = fieldName;

  var responseData = {
    isError: true,
    message: errMessage
  };
  return responseData;
}
export default validation;
