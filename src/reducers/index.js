import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

const AppReducer = combineReducers({
    routing: routerReducer
});

export default AppReducer;