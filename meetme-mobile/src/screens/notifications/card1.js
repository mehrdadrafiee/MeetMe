import React, { Component } from 'react';
import {
  Text,
  Picker,
  Button,
  Linking,
  View,
  Dimensions
} from 'react-native';
import { connect } from 'react-redux';

import {
  Card,
  CardImage,
  CardTitle,
  CardContent,
  CardAction
} from 'react-native-card-view';

import { List, ListItem } from 'react-native-elements'
const { width, height } = Dimensions;

import styles from './styles/NotificationsScreen';
import { getLatLongByAddress, getNearbyResturant, sendPushNotification, alertService, deleteData } from '../helpers';

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
      selectedService: null,
      rating: [1, 2, 3, 4, 5]
    }
    this.navigate = this.navigate.bind(this);
    this._getOptionList = this._getOptionList.bind(this);
    this.deleteCard = this.deleteCard.bind(this);
    this.sendPush = this.sendPush.bind(this);
    this.selected = this.selected.bind(this);
  }

  selected(value) {
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

  _getOptionList(index) {
    return this.refs[index];
  }

  componentDidMount() {
  }

  deleteCard(rowData) {
    deleteData('notifications', rowData.id)
      .then((res) => {
      })
  }

  render() {
    const deleteCard = this.deleteCard;
    let swipeBtns = [{
      text: 'Discard',
      backgroundColor: 'red',
      underlayColor: 'rgba(0, 0, 0, 1, 0.6)',
      onPress: (rowData) => { this.deleteCard(this.props) }
    }];
    return (
      <Swipeout right={swipeBtns}>
        <View>
          <CardContent>
            <Text fontFamily="catamaran" style={{fontSize: 16}}>You are invited for a hangout with {this.props.username}
            </Text>
            <Text style={{fontSize: 16}}>Vote for the place that you like the most or swipe left to discard.</Text>
            <View style={{paddingTop: 20, flex: 1}}>
              {this.props.Address.map((item, i) =>{

                return  <View style={{flex: 1, flexDirection: 'row'}} key={i}>
                              <View style={{flex: 1}}>
                                <Text style={{fontSize: 13}}>{item.address}</Text>
                              </View>
                              <View style={{flex: 1, width: 400}}>
                                  <Picker  selectedValue={this.state.rating[0]} onValueChange={(item) => this.selected(item)}>
                                    {this.state.rating.map((rate, index) =>{
                                      return <Picker.Item  style={{marginBottom: 300}} key={index} label={String(rate)} value={rate} />
                                    })}
                                  </Picker>
                              </View>
                </View>
              })}
              {/*<List>
                {
                  this.props.Address.map((item, i) => (
                    <View style={{flex: 1, flexDirection: 'row'}} key={i}>
                      <View style={{flex: 1, width: 200}}>
                        <ListItem subtitle={item.address} roundAvatar key={i} title={item.name} avatar={item.image} hideChevron={true}/>
                        <Picker selectedValue={this.state.rating[0]} onValueChange={(item) => this.selected(item)}>
                          {this.state.rating.map((rate, index) =>{
                            return <Picker.Item key={index} label={String(rate)} value={rate} />
                          })}
                        </Picker>
                      </View>
                    </View>
                  ))
                }
              </List>*/}
            </View>
          </CardContent>
          <CardAction >
            <Button
              style={styles.button}
              onPress={() => {}}
              title='Send'>
            </Button>
          </CardAction>
        </View>
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
