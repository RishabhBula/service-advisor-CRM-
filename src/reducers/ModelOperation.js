import { handleActions } from "redux-actions";
import { modelActions } from "./../actions";

const initialAuthState = {
  modelDetails: {
    customerModel: false,
    customerEditModel: false,
    fleetEditModel: false,
    vehicleModel: false,
    vehicleEditModel: false,
    custAndVehicle: false,
    custAndVehicleCustomer: false,
    custAndVehicleVehicle: false,
    addUserModal: false,
    editUserModal: false,
    typeAddModalOpen: false,
    partAddModalOpen: false
  }
};

export const modelInfoReducer = handleActions(
  {
    [modelActions.MODEL_OPEN_REQUEST]: (state, action) => ({
      ...state,
      modelDetails: {
        ...state.modelDetails,
        ...action.payload.modelDetails
      }
    }),
    [modelActions.MODEL_CLOSE_REQUEST]: (state, action) => ({
      ...state,
      modelDetails: {
        ...state.modelDetails,
        ...action.payload.modelDetails
      }
    })
  },
  initialAuthState
);
