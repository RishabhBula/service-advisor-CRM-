import { createAction } from "redux-actions";

export const MessageAction = {
  SEND_MESSAGE: "Sent message Requested!",
  SEND_MESSAGE_SUCCESS: "Sent message Success!",
  GET_MESSAGE_LIST: "Message List Requested!",
  GET_MESSAGE_LIST_SUCCESS: "Message List Success",
  DELETE_NOTES: "Delete note requested",
  DELETE_NOTES_SUCCESS: "Delete note success",
}

export const sendMessage = createAction(MessageAction.SEND_MESSAGE);
export const sendMessageSuccess = createAction(MessageAction.SEND_MESSAGE_SUCCESS);

export const getMessageList = createAction(MessageAction.GET_MESSAGE_LIST);
export const getMessageListSuccess = createAction(MessageAction.GET_MESSAGE_LIST_SUCCESS);

export const deleteNotes = createAction(MessageAction.DELETE_NOTES);
export const deleteNotesSuccess = createAction(MessageAction.DELETE_NOTES_SUCCESS);
