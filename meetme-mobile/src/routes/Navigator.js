import { StackNavigator } from 'react-navigation';
import HomeNavigator from './HomeNavigator';
import LandingViews from '../screens/landingViews/LandingViews';

import {
  CreateMeetupScreen
} from '../screens';

export default StackNavigator({
  Login: { screen : LandingViews},
  Home: { screen: HomeNavigator },
  CreateMeetup: { screen: CreateMeetupScreen }
}, {
  mode: 'modal',
});
