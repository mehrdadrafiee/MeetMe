import React, { Component } from 'react';
import {
  Text,
  Picker,
  Button,
  Linking,
  View
} from 'react-native';
import { connect } from 'react-redux';

import {
  Card,
  CardImage,
  CardTitle,
  CardContent,
  CardAction
} from 'react-native-card-view';

import styles from './styles/NotificationsScreen';
import { getLatLongByAddress, getNearbyResturant, sendPushNotification, alertService, deleteNotification } from '../helpers';

import DropDown, {
  Select,
  Option,
  OptionList,
} from 'react-native-selectme';

import Swipeout from 'react-native-swipeout';

class CardView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: null,
      Address: [],
      selectedService: null
    }
    this.navigate = this.navigate.bind(this);
    this._getOptionList = this._getOptionList.bind(this);
    this.deleteCard = this.deleteCard.bind(this);
    this.sendPush = this.sendPush.bind(this);
  }

  sendPush() {
    if (this.props.Address.length > 0 && this.props.Contact.length > 0 && this.state.hasSent === false) {
      this.setState({ hasSent: true });
      const token = [];
      this.props.Contact.map((contact) => {
        if (contact.emails){
          contact.emails.map((emaildata) => {
            Object.keys(this.state.userByToken)
            .map((val, key) =>{
              if (this.state.userByToken[val].email == emaildata.email){
                token.push(this.state.userByToken[val].token);
              }
            })
          });
        }
      });
      sendPushNotification({
        Address: this.props.Address,
        Contact: this.props.Contact,
        token
      }).then((response) => {
        alertService('Successfully sent request to join.');
        this.setState({
          hasSent: false
        });
      })
      .catch((error) => {
        alert(error);
        alertService(`Contact hasn't been registered. Please invite to register.`)
        this.setState({
          hasSent: false
        })
      })
    }
  }

  navigate(value) {
    Linking.openURL(`http://maps.apple.com/?ll=${value.coordinate.latitude},${value.coordinate.longitude}&address=value.name`);
  }

  _getOptionList() {
    return this.refs['OPTIONLIST'];
  }

  componentDidMount() {
    // const Address = [...this.props.Address];
    // console.log(this.props, 'kkkkkkk');
    // if (Address.length > 0) {
    //   console.log('address', Address);
    //   this.setState({Address: [...Address]});
    //   this.setState({selectedService: Address[0].name});
    // }
  }

  deleteCard(rowData) {
    console.log(rowData);
    deleteNotification(rowData.id)
      .then((res) => {
        console.log(res);
      })
  }

  render() {
    console.log(this.props, 'props.....');
    const deleteCard = this.deleteCard;
    let swipeBtns = [{
      text: 'Discard',
      backgroundColor: 'red',
      underlayColor: 'rgba(0, 0, 0, 1, 0.6)',
      onPress: (rowData) => { this.deleteCard(rowData) }
    }];
    return (
      <Swipeout right={swipeBtns}>
        <Card>
          <CardContent>
            <Text fontFamily="catamaran">You are invited for a hangout with {this.props.username}
            </Text>
            <Text>.Vote for the place that you like the most or swipe left to discard.</Text>
            <View style={{paddingTop: 20}}>
              {this.props.Address.map((ad, index) =>{
                return <View key={index} ><Text style={{fontSize: 12}}>{ad.name}</Text></View>;
              })}
            </View>
          </CardContent>
          <CardAction >
            <Button
              style={styles.button}
              onPress={() => {}}
              title='Send'>
            </Button>
          </CardAction>
        </Card>
     </Swipeout>
    )
  }
}

function mapStateToProps(state) {
  return {
    Address: state.Address.toJS(),
    Location: state.Location.toJS(),
    Contact: state.Contact.toJS()
  }
}

export default connect(null, null)(CardView);
