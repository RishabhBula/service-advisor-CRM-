import React, { Component } from "react";
import { Router } from "react-router-dom";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import { createLogicMiddleware } from "redux-logic";
import { createBrowserHistory } from "history";
import { routerMiddleware } from "react-router-redux";
// import { renderRoutes } from 'react-router-config';
import AppRoutes from "./routes/";
import arrLogic from "./logic";
import AppReducer from "./reducers";

const logicMiddleware = createLogicMiddleware(arrLogic);
const history = createBrowserHistory();
const middlewares = [logicMiddleware, routerMiddleware(history)];
export const store = createStore(AppReducer, applyMiddleware(...middlewares));



class App extends Component {  
  render() {
    const loading = () => <div className="animated fadeIn pt-3 text-center">Loading...</div>;
    return (
      <Provider store={store}>
          <Router history={history}>   
            <React.Suspense fallback={loading()}>
              <AppRoutes />
            </React.Suspense>       
        </Router>
      </Provider>
    );
  }
}

export default App;
