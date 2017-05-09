import { UPDATE_LOCATION } from './constants';

const INITIAL_STATE = {
  locations: []
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case UPDATE_LOCATION:
      const newlocation = [...action.payload];
      console.log(newlocation, 'new');
      return newlocation;
    default:
      return state;
  }
};
