import { createLogic } from "redux-logic";
import { ApiHelper } from "../helpers/ApiHelper";
import { toast } from "react-toastify";
import { DefaultErrorMessage } from "../config/Constants";
import {
   homePageActions,
   getHomePageSucc,
   showLoader,
   hideLoader,
} from "./../actions";

let toastId = null;

const getHomePageLogic = createLogic({
   type: homePageActions.GET_HOME_PAGE_REQUEST,
   cancelType: homePageActions.GET_HOME_PAGE_FAILED,
   async process({ action }, dispatch, done) {
      dispatch(showLoader());
      let api = new ApiHelper();
      let result = await api.FetchFromServer(
         "/home-page",
         "/home",
         "GET",
         true,
         undefined,
         undefined
      );
      if (result.isError) {
         if (!toast.isActive(toastId)) {
            toastId = toast.error(result.messages[0] || DefaultErrorMessage);
         }
         dispatch(hideLoader());
         done();
         return;
      } else {
         dispatch(hideLoader());
         dispatch(getHomePageSucc({
            homePageDetails: result.data.data,
            isLoading: false
         }))
         done();
      }
   }
});

export const HomePageLogic = [
   getHomePageLogic
];