
import { createLogic } from "redux-logic";
import { push } from "react-router-redux";

export const redirectToLogic = createLogic({
  type: "REDIRET_TO",
  async process({ action }, dispatch, done) {
    dispatch(push(action.payload.path));
    done();
  }
});
export default [
  redirectToLogic
];
