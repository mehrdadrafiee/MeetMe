import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Colors from '../../../constants/Colors';
import styles from './styles/ContactsScreen';
import { Contacts } from 'react-native-contacts';

class ContactsScreen extends Component {
  static navigationOptions = {
    header: {
      style: {
        backgroundColor: Colors.whiteColor
      }
    },
    
    tabBar: {
      icon: ({ tintColor }) => (
        <MaterialIcons 
          name="contacts"
          size={25}
          color={tintColor}
        />
      )
    }
  }

  render() {
    return (
      <View style={styles.root}>
        <Text>Contacts</Text>
      </View>
    );
  }
}

export default ContactsScreen;