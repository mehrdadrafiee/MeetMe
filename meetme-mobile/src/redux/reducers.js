import { combineReducers } from 'redux';

import {
  HomeReducer,
  ContactReducer
} from '../screens';

export default combineReducers({
  home: HomeReducer,
  location: ContactReducer
});
