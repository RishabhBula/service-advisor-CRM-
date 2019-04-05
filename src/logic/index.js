import { push } from "react-router-redux";

import { createLogic } from "redux-logic";
import { LoginLogics } from "./Login";

import { SignUpLogic } from "./SignUp";

export const redirectToLogic = createLogic({
  type: "REDIRET_TO",
  async process({ action }, dispatch, done) {
    dispatch(push(action.payload.path));
    done();
  },
});

export default [...LoginLogics, ...SignUpLogic, redirectToLogic];
