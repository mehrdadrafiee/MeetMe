import { List } from 'immutable';
import { UPDATE_LOCATION, ADD_CONTACT, ADD_LOCATION, REMOVE_LOCATION, REMOVE_CONTACT, ADD_ADDRESS, REMOVE_ADDRESS } from './constants';

const INITIAL_STATE = List([]);

const INITIAL_CONTACT = List([])

const INITIAL_ADDRESS = List([])

export function Location(state = INITIAL_STATE, action) {
  switch (action.type) {
    case ADD_LOCATION:
      return state.push(action.payload);
    case REMOVE_LOCATION:
      return state.filter(location => location !== action.payload);
    default:
      return state;
  }
};

export function Contact(state = INITIAL_CONTACT, action){
  switch (action.type) {
    case ADD_CONTACT:
      return state.push(action.payload);
      break;
    case REMOVE_CONTACT:
      return state.filter(contact => contact.id !== action.payload);
      break;
    default:
      return state;
  }
}

export function Address(state = INITIAL_ADDRESS, action){
  switch (action.type) {
    case ADD_ADDRESS:
      return state.push(action.payload);
      break;
    case REMOVE_ADDRESS:
      return state.filter(address => address.id !== action.payload);
      break;
    default:
      return state;
  }
}
