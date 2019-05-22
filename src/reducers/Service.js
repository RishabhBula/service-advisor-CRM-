import { handleActions } from "redux-actions";
import { inventoryPartsActions, tiersActions, labourActions } from "./../actions";

const serviceItems = {
    serviceItems: [],
    isLoading: true
};

export const serviceReducers = handleActions(
    {
        [inventoryPartsActions.ADD_SERVICE_PART]: (state, action) => ({
            ...state,
            serviceItems: [
                ...state.serviceItems,
                action.payload,
            ],
            isLoading: false
        })
    },
    serviceItems
);
