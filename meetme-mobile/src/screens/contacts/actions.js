import { UPDATE_LOCATION } from './constants';

export function updateLocation(payload){
  return {
    type: UPDATE_LOCATION,
    payload
  }
}
