import { TabNavigator } from 'react-navigation';
import Colors from '../../constants/Colors';
import {
  HomeScreen,
  NotificationsScreen,
  ProfileScreen,
  ChatScreen
} from '../screens';

export default TabNavigator({
  Home: {
    screen: HomeScreen
  },
  Notifications: {
    screen: NotificationsScreen
  },
  Chat: {
    screen: ChatScreen
  },
  Profile: {
    screen: ProfileScreen
  }
}, {
  swipeEnabled: true,
  animationEnabled: true,
  tabBarPosition: 'bottom',
  tabBarOptions: {
    showLabel: false,
    showIcon: true,
    inactiveTintColor: Colors.grayColor,
    activeTintColor: Colors.blackColor,
    pressColor: Colors.redColor,
    indicatorStyle: { backgroundColor: Colors.redColor },
    style: {
      backgroundColor: Colors.whiteColor
    }
  }
});