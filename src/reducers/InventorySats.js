import { handleActions } from "redux-actions";
import { inventoryStatsAction } from "../actions";

const initialInventoryStatState = {
  data: {
    quantity: {
      parts: 300,
      tires: 150
    },
    cost: {
      parts: 300,
      tires: 50
    },
    value: {
      parts: 300,
      tires: 50
    }
  },
  isLoading: true
};

export const matrixListReducer = handleActions(
  {
    [inventoryStatsAction.GET_INVENTORY_STATS_SUCCESS]: (state, action) => ({
      ...state,
      data: action.payload,
      isLoading: false
    })
  },
  initialInventoryStatState
);
