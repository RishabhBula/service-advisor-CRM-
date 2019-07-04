import { handleActions } from "redux-actions";
import { MessageAction } from "../actions";

const initialState = {
  messageData: {
    isSuccess: false,
    data: []
  },
  isLoading: true,
}

export const messageReducer = handleActions(
  {
    [MessageAction.SEND_MESSAGE]: (state, action) => ({
      messageData: {
        isSuccess: false
      }
    }),
    [MessageAction.SEND_MESSAGE_SUCCESS]: (state, action) => ({
      ...state,
      messageData: {
        isSuccess: true,
        ...state.data,
        data: action.payload.message,
      }
    }),
    [MessageAction.GET_MESSAGE_LIST]: (state, action) => ({
      ...state,
      messageData: {
        isSuccess: false,
        data: [],
      }
    }),
    [MessageAction.GET_MESSAGE_LIST_SUCCESS]: (state, action) => ({
      ...state,
      messageData: {
        isSuccess: true,
        data: action.payload.messages,
      }
    }),
  },
  initialState
);