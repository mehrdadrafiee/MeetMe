import { ADD_LOCATION, REMOVE_LOCATION, ADD_CONTACT, REMOVE_CONTACT, ADD_ADDRESS, REMOVE_ADDRESS } from './constants';

export function updateLocation(payload) {
  return {
    type: ADD_LOCATION,
    payload
  }
}

export function removeLocation(payload) {
  return {
    type: REMOVE_LOCATION,
    payload
  }
}

export function addContact(payload) {
  return {
    type: ADD_CONTACT,
    payload
  }
}

export function removeContact(payload) {
  return {
    type: REMOVE_CONTACT,
    payload
  }
}

export function addAddress(payload) {
  return {
    type: ADD_ADDRESS,
    payload
  }
}

export function removeAddress(payload) {
  return {
    type: REMOVE_ADDRESS,
    payload
  }
}
