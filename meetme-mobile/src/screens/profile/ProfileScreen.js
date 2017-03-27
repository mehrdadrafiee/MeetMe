import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { MaterialIcons } from '@exponent/vector-icons';
import Colors from '../../../constants/Colors';
import styles from './styles/ProfileScreen';

class ProfileScreen extends Component {
  static navigationOptions = {
    header: {
      style: {
        backgroundColor: Colors.whiteColor
      }
    },

    tabBar: {
      icon: ({ tintColor }) => (
        <MaterialIcons 
          name="person"
          size={25}
          color={tintColor}
        />
      )
    }
  }

  render() {
    return (
      <View style={styles.root}>
        <Text>Profile Screen</Text>
      </View>
    );
  }
}

export default ProfileScreen;