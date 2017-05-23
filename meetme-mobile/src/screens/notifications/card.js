import React, { Component } from 'react';
import {
  Text,
  Picker,
  Linking,
  TouchableOpacity,
  View,
  Divider,
  Dimensions
} from 'react-native';

import { connect } from 'react-redux';

import {
  Card,
  ListItem,
  Button
} from 'react-native-elements';

import Swipeout from 'react-native-swipeout';
import StarRating from 'react-native-star-rating';
const { width, height } = Dimensions;

import styles from './styles/NotificationsScreen';
import { getLatLongByAddress, getNearbyResturant, sendPushNotification, alertService, deleteData } from '../helpers';
import List from './List';

class CardView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: null,
      Address: [],
      selectedService: null,
      starCount: 2,
      rating: [1, 2, 3, 4, 5]
    }
    this.navigate = this.navigate.bind(this);
    this.deleteCard = this.deleteCard.bind(this);
    this.sendPush = this.sendPush.bind(this);
    this.rateResturant = this.rateResturant.bind(this);
  }

  rateResturant(rating, index, notificationId) {
    this.props.updateRating(rating, index, notificationId);
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

  deleteCard(rowData) {
    deleteData('notifications', rowData.id)
      .then((res) => {
        this.props.deleteNotification(rowData.id);
      });
  }

  render() {
    const title = this.props.type == 'Invitation' ?  `You are invited for a hangout with ${this.props.username}`: `${this.props.username} has accepted to go to this place`;
    let swipeBtns = [{
      text: 'Discard',
      backgroundColor: 'red',
      onPress: (rowData) => { this.deleteCard(this.props) }
    }];
    let addressCount = this.props.Address.length;
    return (
      <Swipeout right={swipeBtns}>
        <View style={styles.container}>
        {this.props.type === 'Invitation' ?
          <Card title={title}>
          <Text style={{marginBottom: 10}}>
          Vote for the place that you like the most or swipe left to discard.
          </Text>
          {
            this.props.Address.map((address, i) => {
              return (
                <View style={{flex: 1}} key={i}>
                { addressCount === (i + 1) ?
                  <ListItem
                  roundAvatar
                  subtitle= {
                    <View style={{flex: 1}}>
                    <View style={{flex: 1, flexDirection: 'row'}}>
                    <View style={{flex: 1, marginLeft: 10}}><Text>Your rating {address.userRating} out of 6</Text></View>
                    <View style={{flex: 1}}>
                    <StarRating
                    disabled={false}
                    maxStars={6}
                    rating={address.userRating}
                    starSize={20}
                    selectedStar={(rating) => this.rateResturant(rating, i, this.props.id)}
                    />
                    </View>
                    </View>
                    <View style={{flex: 1, paddingTop: 10, justifyContent: 'center', alignItems: 'center'}}>
                    <Button
                    small
                    icon={{name: 'send', type: 'font-awesome'}}
                    title='Send' onPress={() => {this.props.sendRating(this.props)}} />
                    </View>
                    </View>
                  }
                  title={address.name}
                  hideChevron={true}
                  avatar={{uri:address.image}} />
                  :
                  <ListItem
                  roundAvatar
                  subtitle= {
                    <View style={{flex: 1, flexDirection: 'row'}}>
                    <View style={{flex: 1, marginLeft: 10}}><Text>Your rating {address.userRating} out of 6</Text></View>
                    <View style={{flex: 1}}>
                    <StarRating
                    disabled={false}
                    maxStars={6}
                    rating={address.userRating}
                    starSize={20}
                    selectedStar={(rating) => this.rateResturant(rating, i, this.props.id)}
                    />
                    </View>
                    </View>
                  }
                  title={address.name}
                  hideChevron={true}
                  avatar={{uri:address.image}} />

                }
                </View>
              )
            })
          }
          </Card>:
          <Card title={title}>
          {
            this.props.Address.map((address, i) => {
              return (
                <View style={{flex: 1}} key={i}>
                    <ListItem
                    roundAvatar
                    title={address.name}
                    subtitle= {
                      <View style={{flex:1}}>
                        <TouchableOpacity onPress={() => {this.navigate(address)}}>
                          <Text style={{paddingLeft: 10, color: 'grey'}}>View</Text>
                        </TouchableOpacity>
                      </View>
                    }
                    hideChevron={true}
                    avatar={{uri:address.image}}/>
                </View>
              )
            })
          }
          </Card>

        }
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
