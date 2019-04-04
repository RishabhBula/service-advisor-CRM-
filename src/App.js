import { createBrowserHistory } from "history";
import React, { Component } from "react";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import { routerMiddleware } from "react-router-redux";
import { createStore, applyMiddleware } from "redux";
import logger from "redux-logger";
import { createLogicMiddleware } from "redux-logic";
import { mode, EnviornmentTypes } from "./config/AppConfig";
import Loader from "./containers/Loader/Loader";
import arrLogic from "./logic";
import AppReducer from "./reducers";
import AppRoutes from "./routes/";

const logicMiddleware = createLogicMiddleware(arrLogic);
const history = createBrowserHistory();
const middlewares = [logicMiddleware, routerMiddleware(history)];
if (mode === EnviornmentTypes.DEV) {
  middlewares.push(logger);
}

export const store = createStore(AppReducer, applyMiddleware(...middlewares));

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router history={history}>
          <React.Suspense fallback={<Loader />}>
            <AppRoutes />
          </React.Suspense>
        </Router>
      </Provider>
    );
  }
}

export default App;
