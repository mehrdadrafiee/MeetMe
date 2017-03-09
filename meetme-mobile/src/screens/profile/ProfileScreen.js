import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { MaterialIcons } from '@exponent/vector-icons';
import Colors from '../../../constants/Colors';

class ProfileScreen extends Component {
  static navigationOptions = {
    header: {
      style: {
        backgroundColor: Colors.whiteColor,
        height: 20
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
      <View style={{ flex: 1 }}>
        <Text>Profile Scree</Text>
      </View>
    );
  }
}

export default ProfileScreen;