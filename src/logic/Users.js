import { toast } from "react-toastify";
import { createLogic } from "redux-logic";
import { ApiHelper } from "../helpers/ApiHelper";
import { logger } from "../helpers/Logger";
import {
  showLoader,
  hideLoader,
  usersActions,
  addUserSuccess,
  getUsersListSuccess,
} from "./../actions";

const getUsersLogic = createLogic({
  type: usersActions.GET_USER_LIST,
  async process({ action }, dispatch, done) {
    dispatch(
      getUsersListSuccess({
        isLoading: true,
        users: [],
      })
    );
    let api = new ApiHelper();
    let result = await api.FetchFromServer(
      "/user",
      "/getAllUser",
      "GET",
      true,
      action.payload
    );
    if (result.isError) {
      dispatch(
        getUsersListSuccess({
          isLoading: false,
          users: [
            {
              firstName: "Sonu",
              lastName: "B",
              email: "sonu.chapter247@gmail.com",
              createdAt: new Date().toString(),
              isActive: true,
              role: "Admin",
            },
          ],
        })
      );
      done();
      return;
    } else {
      dispatch(hideLoader());
      dispatch(
        getUsersListSuccess({
          isLoading: false,
          users: result.data.data,
        })
      );
      done();
    }
  },
});

const addUsersLogic = createLogic({
  type: usersActions.ADD_USER,
  async process({ action }, dispatch, done) {
    dispatch(showLoader());
    logger(action.payload);
    let api = new ApiHelper();
    let result = await api.FetchFromServer(
      "/auth",
      "/createUser",
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
      dispatch(addUserSuccess());
      dispatch(hideLoader());
      done();
    }
  },
});

export const UsersLogic = [getUsersLogic, addUsersLogic];
