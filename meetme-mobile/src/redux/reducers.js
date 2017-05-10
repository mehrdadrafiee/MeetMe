import { combineReducers } from 'redux';

import {
  HomeReducer,
  ContactReducer
} from '../screens';

// Contact reducer has got mutiple reducers.
// We can assign multiple reducers dynamically
// In future we can make this function as service
const GetMultipleReducers  = (reducer) => {
  const reducers = {};
  Object.keys(reducer)
    .map((key, index) =>{
      reducers[key] = reducer[key];
    })
  return reducers;
}

export default combineReducers(Object.assign({
  home: HomeReducer,
}, GetMultipleReducers(ContactReducer)));
