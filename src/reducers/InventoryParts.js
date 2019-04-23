import { handleActions } from "redux-actions";
import { inventoryPartsActions } from "./../actions";

const initialInventoryPartState = {
  vendors: []
};

export const inventoryPartsReducers = handleActions(
  {
    [inventoryPartsActions.GET_VENDORS_LIST_SUCCESS]: (state, action) => ({
      ...state,
      vendors: action.payload
    })
  },
  initialInventoryPartState
);
