import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Colors from '../../../constants/Colors';
import styles from './styles/NotificationsScreen';

class NotificationsScreen extends Component {
  static navigationOptions = {
    header: {
      style: {
        backgroundColor: Colors.whiteColor
      }
    },
    
    tabBar: {
      icon: ({ tintColor }) => (
        <MaterialIcons 
          name="notifications"
          size={25}
          color={tintColor}
        />
      )
    }
  }

  render() {
    return (
      <View style={styles.root}>
        <Text>Notifications</Text>
      </View>
    );
  }
}

export default NotificationsScreen;