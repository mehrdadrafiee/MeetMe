import { TabNavigator } from 'react-navigation';
import Colors from '../../constants/Colors';
import {
  ContactsScreen,
  HomeScreen,
  NotificationsScreen,
  ChatScreen,
  AnimatedViews
} from '../screens';

export default TabNavigator({
  Contacts: {
    screen: ContactsScreen
  },
  Home: {
    screen: HomeScreen
  },
  Notifications: {
    screen: NotificationsScreen
  },
  Chat: {
    screen: ChatScreen
  },
  AnimatedViews: {
    screen: AnimatedViews
  }
}, {
  swipeEnabled: false,
  animationEnabled: true,
  tabBarPosition: 'bottom',
  tabBarOptions: {
    showLabel: false,
    showIcon: true,
    inactiveTintColor: Colors.grayColor,
    activeTintColor: Colors.blackColor,
    pressColor: Colors.blackColor,
    indicatorStyle: { backgroundColor: Colors.blackColor },
    style: {
      backgroundColor: Colors.whiteColor
    }
  }
});