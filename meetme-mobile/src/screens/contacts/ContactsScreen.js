'use strict';

import React, { Component } from 'react';
import { View, Text, ListView } from 'react-native';
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

  constructor() {
    super();
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows(['row 1', 'row 2']),
    };
  }

  render() {
    return (
        <ListView
        dataSource={this.state.dataSource}
        renderRow={(rowData) => <Text>{rowData}</Text>}
      />
    );
  }
}

export default ContactsScreen;