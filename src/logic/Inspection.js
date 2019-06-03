import { toast } from "react-toastify";
import { createLogic } from "redux-logic";
import { ApiHelper } from "../helpers/ApiHelper";
import { AppConfig } from "../config/AppConfig";
import {logger} from "../helpers/Logger";
import {
  InspectionActions,
  addInspectionSuccess,
  addInspectionTemplateSuccess,
  getTemplateList,
  getTemplateListSuccess,
  addMessageTemplateSuccess,
  getMessageTemplate,
  getMessageTemplateSuccess,
  updateMessageTemplateSuccess,
  deleteMessageTemplateSuccess,
  searchMessageTemplateListSuccess,
  sendMessageTemplateSuccess,
  showLoader,
  hideLoader,
} from "../actions"


const addInspectionLogic = createLogic({
  type: InspectionActions.ADD_INSPCETION,
  async process({ action }, dispatch, done) {
    dispatch(showLoader());
    let api = new ApiHelper();
    let result = await api.FetchFromServer(
      "/inspection",
      "/addInspection",
      "POST",
      true,
      undefined,
      action.payload
    );
    if (result.isError) {
      toast.error(result.messages[0]);
      dispatch(hideLoader());
      done();
      return;
    } else {
      toast.success(result.messages[0]);
      dispatch(addInspectionSuccess(result.data.data));
      dispatch(hideLoader());
      done();
    }
  }
});

const addInspectionTemplateLogic = createLogic({
  type: InspectionActions.ADD_INSPCETION_TEMPLATE,
  async process({ action }, dispatch, done) {
    dispatch(showLoader());
    let api = new ApiHelper();
    let result = await api.FetchFromServer(
      "/inspection",
      "/inspectionTemplate",
      "POST",
      true,
      undefined,
      action.payload
    );
    if (result.isError) {
      toast.error(result.messages[0]);
      dispatch(hideLoader());
      done();
      return;
    } else {
      toast.success(result.messages[0]);
      dispatch(addInspectionTemplateSuccess(result.data.data));
      dispatch(
        getTemplateList()
      );
      dispatch(hideLoader());
      done();
    }
  }
});


const getTemplateListLogic = createLogic({
  type: InspectionActions.GET_TEMPLATE_LIST,
  async process({ action }, dispatch, done) {
    // dispatch(showLoader());
    // logger(action.payload)
    let api = new ApiHelper();
    let result = await api.FetchFromServer(
      "/inspection",
      "/inspectionList",
      "GET",
      true,
      {
        "isTemplate": true,
        "search": action.payload && action.payload.search ? action.payload.search : null ,
      },
    );
    if (result.isError) {
      dispatch(hideLoader());
      dispatch(
        getTemplateListSuccess({
          isLoading: false,
          templateData: []
        })
      );
      done();
      return;
    } else {
      const options = result.data.inspection.map(inspection => ({
        label: `${inspection.inspectionName}`,
        value: inspection._id
      }));
      logger(action.payload && action.payload.callback ? action.payload.callback(options) : null)
      dispatch(hideLoader());
      dispatch(
        getTemplateListSuccess({
          isLoading: false,
          templateData: result.data.inspection,
        })
      );
      
      done();
    }
  }
});

const addMessageTemplateLogic = createLogic({
  type: InspectionActions.ADD_MESSAGE_TEMPLATE,
  async process({ action }, dispatch, done) {
    dispatch(showLoader());
    let api = new ApiHelper();
    let result = await api.FetchFromServer(
      "/inspection",
      "/messageTemplate",
      "POST",
      true,
      undefined,
      action.payload
    );
    if (result.isError) {
      toast.error(result.messages[0]);
      dispatch(hideLoader());
      done();
      return;
    } else {
      toast.success(result.messages[0]);
      dispatch(addMessageTemplateSuccess());
      dispatch(getMessageTemplate());
      dispatch(hideLoader());
      done();
    }
  }
});

const getMessageTemplateListLogic = createLogic({
  type: InspectionActions.GET_MESSAGE_TEMPLATE,
  async process({ action }, dispatch, done) {
    dispatch(showLoader());
    logger(action.payload)
    let api = new ApiHelper();
    let result = await api.FetchFromServer(
      "/inspection",
      "/messageTemplateList",
      "GET",
      true,
      {
        "id": action.payload
      }
    );
    if (result.isError) {
      dispatch(hideLoader());
      dispatch(
        getMessageTemplateSuccess({
          isLoading: false,
          messageTemplateData: []
        })
      );
      done();
      return;
    } else {
      const options = result.data.data.map(template => ({
        label: `${template.templateName}`,
        value: template._id
      }));
      logger(action.payload && action.payload.callback ? action.payload.callback(options) : null)
      dispatch(hideLoader());
      dispatch(
        getMessageTemplateSuccess({
          isLoading: false,
          messageTemplateData: result.data.data,
        })
      );

      done();
    }
  }
});

const updateMessageTemplateLogic = createLogic({
  type: InspectionActions.UPDATE_MESSAGE_TEMPLATE,
  async process({ action }, dispatch, done) {
    dispatch(showLoader());
    let api = new ApiHelper();
    let result = await api.FetchFromServer(
      "/inspection",
      "/messageTemplateUpdate",
      "PUT",
      true,
      undefined,
      action.payload
    );
    if (result.isError) {
      toast.error(result.messages[0]);
      dispatch(hideLoader());
      done();
      return;
    } else {
      toast.success(result.messages[0]);
      dispatch(updateMessageTemplateSuccess());
      dispatch(getMessageTemplate());
      dispatch(hideLoader());
      done();
    }
  }
});

const deleteMessageTemplateLogic = createLogic({
  type: InspectionActions.DELETE_MESSAGE_TEMPLATE,
  async process({ action }, dispatch, done) {
    dispatch(showLoader());
    let api = new ApiHelper();
    let result = await api.FetchFromServer(
      "/inspection",
      "/messageTemplateDelete",
      "DELETE",
      true,
      undefined,
      {
        "_id": action.payload
      }
    );
    if (result.isError) {
      toast.error(result.messages[0]);
      dispatch(hideLoader());
      done();
      return;
    } else {
      toast.success(result.messages[0]);
      dispatch(deleteMessageTemplateSuccess());
      dispatch(getMessageTemplate());
      dispatch(hideLoader());
      done();
    }
  }
});

const searchMessageTemplateListLogic = createLogic({
  type: InspectionActions.SEARCH_MESSAGE_TEMPLATE_LIST,
  async process({ action }, dispatch, done) {
    // dispatch(showLoader());
    logger(action.payload)
    let api = new ApiHelper();
    let result = await api.FetchFromServer(
      "/inspection",
      "/messageTemplateListSearch",
      "GET",
      true,
      { search: action.payload && action.payload.input ? action.payload.input : action.payload && action.payload.search ? action.payload.search : null }
    );
    if (result.isError) {
      dispatch(hideLoader());
      dispatch(
        searchMessageTemplateListSuccess({
          isLoading: false,
          messageTemplateData: []
        })
      );
      done();
      return;
    } else {
      const options = result.data.data.map(template => ({
        label: `${template.templateName}`,
        value: template._id,
        templateData: template
      }));
      logger(action.payload && action.payload.callback ? action.payload.callback(options) : null)
      dispatch(hideLoader());
      dispatch(
        searchMessageTemplateListSuccess({
          isLoading: false,
          messageTemplateData: result.data.data,
        })
      );
      done();
    }
  }
});

const sentmessageTemplateLogic = createLogic({
  type: InspectionActions.SEND_MESSAGE_TEMPLATE,
  async process({ action }, dispatch, done) {
    dispatch(showLoader());
    let api = new ApiHelper();
    let result = await api.FetchFromServer(
      "/inspection",
      "/sendInspectionDetails",
      "POST",
      true,
      undefined,
      action.payload
    );
    if (result.isError) {
      toast.error(result.messages[0]);
      dispatch(hideLoader());
      done();
      return;
    } else {
      toast.success(result.messages[0]);
      dispatch(sendMessageTemplateSuccess());
      dispatch(hideLoader());
      done();
    }
  }
});

export const InspectLogic = [
  addInspectionLogic,
  addInspectionTemplateLogic,
  getTemplateListLogic,
  addMessageTemplateLogic,
  getMessageTemplateListLogic,
  updateMessageTemplateLogic,
  deleteMessageTemplateLogic,
  searchMessageTemplateListLogic,
  sentmessageTemplateLogic
];