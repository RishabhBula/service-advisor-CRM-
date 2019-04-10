import { handleActions } from "redux-actions";
import { rateStandardListActions } from "./../actions";

const initialAuthState = {
  standardRateList: []
};

export const rateStandardListReducer = handleActions(
    {
    [rateStandardListActions.GET_RATE_STANDARD_LIST_START]: (state, action) => ({
        ...state,
        standardRateList: action.payload.standardRateList
    }),
    [rateStandardListActions.GET_RATE_STANDARD_LIST_SUCCESS]: (state, action) => ({
        ...state,
        standardRateList: action.payload.standardRateList
    }),
    [rateStandardListActions.GET_RATE_STANDARD_LIST_FAILED]: (state, action) => ({
        ...state,
        standardRateList: action.payload.standardRateList
    })
    },
    initialAuthState
);
