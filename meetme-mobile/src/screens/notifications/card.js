import React, { Component } from 'react';
import {
  Text,
  Picker,
  Button,
  Linking
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
import { getLatLongByAddress, getNearbyResturant, sendPushNotification, alertService } from '../helpers';

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
    const Address = [...this.props.data.Address];
    if (Address.length > 0) {
      this.setState({Address: [...Address]});
      this.setState({selectedService: Address[0].name});
    }
  }

  deleteCard(rowData) {
  }

  render() {
    let swipeBtns = [{
      text: 'Delete',
      backgroundColor: 'red',
      underlayColor: 'rgba(0, 0, 0, 1, 0.6)',
      onPress: () => { this.deleteCard(rowData) }
    }];
    return (
      <Card>
        <CardContent>
          <Text>You are invited for a hangout with
          {this.props.data.Contact.map(contact => <Text key={contact.id} style={{fontWeight: 'bold'}}> {contact.firstName}</Text>)}
          .Vote for the place that you like the most or swipe left to discard.
          </Text>
          <Select
            width={250}
            ref="SELECT1"
            optionListRef={this._getOptionList.bind(this)}
            defaultValue="Select resturant"
            onSelect={this.navigate.bind(this)}>
            {this.state.Address.map( (s, i) => {
              return <Option value = {s} key={i}>{s.name}</Option>
            })}
          </Select>
          <OptionList ref="OPTIONLIST"/>
        </CardContent>
        <CardAction >
          <Button
          style={styles.button}
          onPress={() => {}}
          title='Send'>
          </Button>
        </CardAction>
      </Card>
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

export default connect(mapStateToProps, null)(CardView);
