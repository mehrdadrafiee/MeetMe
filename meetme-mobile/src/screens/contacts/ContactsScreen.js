'use strict';

import React, { Component } from 'react';
import { View, Text, ListView, Button, Image, TouchableOpacity, TouchableHighlight } from 'react-native';
import { bindActionCreators } from 'redux';
import { Permissions, Notifications } from 'expo';
import { connect } from 'react-redux';
import { MaterialIcons } from '@expo/vector-icons';
import Colors from '../../../constants/Colors';
import styles from './styles/ContactsScreen';
import Communications from 'react-native-communications';
import { Contacts } from 'expo';
import { ListAddress } from './List';
import * as actionCreators from './actions';

import { registerForPushNotification, getStorage, setStorage, sendPushNotification, registerDevice } from '../helpers';

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

class ContactsScreen extends Component {
  static navigationOptions = {
    title: 'CONTACTS',
    header: (navigation) => {
      const { navigate, state } = navigation;
      // Navigate to map if the user has selected any on the contact in the lists.
      // const GoToMap = () =>{
      //   if (state.params && state.params.locations && state.params.locations.length > 0){
      //     navigate('Map', {locations: state.params.locations});
      //   }
      // }

      const style = { backgroundColor: Colors.whiteColor };
      const right = (
        <TouchableOpacity onPress={() => navigate('Map') }>
          <MaterialIcons
            name="navigate-next"
            size={30}
            color={Colors.blackColor}
            />
        </TouchableOpacity>
      );

      return {style, right };
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

  constructor(props) {
    super(props);
    this.state = {
      dataSource: ds.cloneWithRows([]),
      selected: [],
      locations: [],
      notification: {}
    };
    this.selectContact = this.selectContact.bind(this);
    this._renderRow = this._renderRow.bind(this);
  }

  componentDidMount() {
    this.getAllContacts();
    registerForPushNotification()
      .then((response) => {
        setStorage('push_token', JSON.stringify(response))
      });
  }

  selectContact(contact) {
    let contactDetails;
    const selected = [...this.state.selected];
    const index = selected.indexOf(contact.id);
    // Check to see wheather this contact id has already beeen selected or not
    index !== -1 ? selected.splice(index, 1) : selected.push(contact.id);
    this.setState({selected})

    // Check to see this address has already been selected or not. This is important for map view.
    if (contact.addresses) {
      contact.addresses.map((address, index) => {
        if (address.label === 'work') {
          contactDetails = `${contact.addresses[index].street}, ${contact.addresses[index].region}, ${contact.addresses[index].city}, ${contact.addresses[index].postcode}`;
          const locations = [...this.state.locations];
          const locationIndex = locations.indexOf(contactDetails);
          locationIndex !== -1 ? locations.splice(locationIndex, 1) : locations.push(contactDetails);
          this.setState({locations});
          // this.props.navigation.setParams({locations})
          if (locationIndex === -1) {
            this.props.actions.updateLocation(contactDetails)
            this.props.actions.addContact(contact);
          } else {
            this.props.actions.removeLocation(contactDetails);
            this.props.actions.removeContact(contact.id);
          }
        }
      });
    }
  }

  async getAllContacts() {
    const contacts = await Contacts.getContactsAsync([
      Contacts.PHONE_NUMBERS,
      Contacts.EMAILS,
      Contacts.ADDRESSES
    ]);
    if (contacts.length > 0) {
      this.setState({dataSource: ds.cloneWithRows(contacts)});
    }

    return contacts;
  }

  render() {
    return (
      <ListView contentContainerStyle={styles.listView} dataSource={this.state.dataSource} renderRow={this._renderRow} enableEmptySections={true}/>
    );
  }
  _renderRow(rowData){
    return(
        <View style={styles.container} key={rowData.id}>
          <View style={styles.imageContainer}>
            <Image
            style={{width: 50, height: 50, borderRadius: 25}}
            source={{uri: 'https://cdn4.iconfinder.com/data/icons/ionicons/512/icon-ios7-contact-128.png'}}
            />
          </View>
          <View style={styles.infoContainer}>
            <TouchableOpacity onPress={() => this.selectContact(rowData)}>
              <View>
                <Text style={styles.name}>{rowData.name}</Text>
                <TouchableOpacity onPress={() => Communications.text(rowData.phoneNumbers ? rowData.phoneNumbers[0].number: '')}>
                  <Text style={styles.call}>
                    <MaterialIcons name="textsms" style={styles.textIcon}/> Text:
                    <Text style={styles.phoneNumber}>
                      {rowData.phoneNumbers ? rowData.phoneNumbers[0].number: ''}
                    </Text>
                  </Text>
                </TouchableOpacity>
                <ListAddress data={rowData.addresses} type={'home'}/>
                <ListAddress data={rowData.addresses} type={'work'}/>
              </View>
            </TouchableOpacity>
          </View>
          {this.state.selected.indexOf(rowData.id) !== -1 &&
            <View style={styles.selected}>
              <MaterialIcons name="check-circle" style={styles.selectContactIcon}/>
            </View>
          }
        </View>
    )
  }
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actionCreators, dispatch) }
}

function mapStateToProps(state) {
  return {
    Location: state.Location.toJS(),
    Contact: state.Contact.toJS()
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ContactsScreen);
