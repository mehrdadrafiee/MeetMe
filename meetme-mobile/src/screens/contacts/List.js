import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';

import {
  View,
  Text,
} from 'react-native';

import styles from './styles/ContactsScreen';

function convertToUpperCase(str){
  return str.toLowerCase().replace(/\b[a-z]/g, function(letter) {
    return letter.toUpperCase();
 });
}

export const ListAddress = (props) => {
  let address;
  let contactDetails;
  if (props.data){
    contactDetails = props.data.filter(address => address.label === props.type);
    address = contactDetails.length > 0 ? `${contactDetails[0].street}, ${contactDetails[0].region}, ${contactDetails[0].city}, ${contactDetails[0].postcode}` : 'Not found';
  }else {
    address =  'Not found';
  }
  return (
    <Text style={styles.location}>
      <MaterialIcons name={props.type} style={styles.locationIcon}/> {convertToUpperCase(props.type)}: {address}
    </Text>
  )
}
