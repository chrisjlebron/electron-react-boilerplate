import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import activity from './activity';

const rootReducer = combineReducers({
  activity,
  routing
});

export default rootReducer;
