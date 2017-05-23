import React, { Component } from 'react';
import { ScrollView, View, Text, Button, Image, ActivityIndicator } from 'react-native';
import * as firebase from 'firebase';
// import { DropDown } from 'react-native-dropdown';
import { MaterialIcons } from '@expo/vector-icons';
import Colors from '../../../constants/Colors';
import styles from './styles/NotificationsScreen';
import { Permissions, Notifications } from 'expo';
import CardView from './card';

import { getLoggedInUser, updateNotification, saveNotificationToDatabase, sendPushNotification } from '../helpers';

class NotificationsScreen extends Component {
  static navigationOptions = {
    title: 'NOTIFICATIONS',
    header: {
      style: {
        backgroundColor: Colors.whiteColor
      }
    },

    tabBar: (data) => {
      const color = data.state.params ? 'red': '#cccccc';
      return {
        icon: ({tintColor}) =>
          <MaterialIcons
              name="notifications"
              size={25}
              color={color}
            />
      }
    }
  }

  constructor(props) {
    super(props);

    this.state = {
      canada: '',
      notifications: [],
      isLoading: true
    };
    this._handleNotification = this._handleNotification.bind(this);
    this.updateRating = this.updateRating.bind(this);
    this.deleteNotification = this.deleteNotification.bind(this);
    this.sendRating = this.sendRating.bind(this);
  }

  deleteNotification(id) {
    const notifications = this.state.notifications.filter((notification) => {
      return notification.id != id;
    });
    this.setState({notifications})
  }

  sendRating(data) {
    const creatorId = data.creatorId;
    const token = data.creatorToken;
    const username = firebase.auth().currentUser.username ? firebase.auth().currentUser.username : 'A user';
    const replyData = {
      username:  username,
      type: 'Reply',
      Address: data.Address
    };
    saveNotificationToDatabase('notifications', replyData, creatorId);
    sendPushNotification({ token: token, type: 'Reply', username: username })
  }

  updateRating(rating, addressId, notificationId) {
    const add = this.state.notifications.map((notification) => {
      if (notification.id === notificationId){
        notification.Address.map((address, index) => {
          if (index === addressId) {
            address.userRating = rating;
          }
        });
        return notification
      }
    })
    updateNotification(notificationId, add[0])
      .then((result) => {
      })
  }

  _handleNotification = (notifications) => {
    // changes color of icon when notification arrives
    this.props.navigation.setParams({hasNotification: true})
  };

  componentDidMount() {
    this._notificationSubscription = Notifications.addListener(this._handleNotification);
  }

  componentDidMount() {
    const userId = firebase.auth().currentUser.uid;
    // this.props.navigation.setParams({hasNewNotification: true})
    if (!userId){
      return;
    }
    getLoggedInUser()
      .then((user) => {
        const notificationSnap = firebase.database().ref(`notifications/${userId}`);
        notificationSnap.on('value', (snapshot) => {
          const notifications = snapshot.val();
          if (notifications){
            const newnotifications = [];
            Object.keys(notifications).map((key, index) => {
              newnotifications.push(Object.assign({},notifications[key], {id: key}));
            });
            this.setState({notifications: newnotifications});
          }
          this.setState({ isLoading: false });
        });
      });
  }

  _canada(province) {

	this.setState({
      ...this.state,
      canada: province
    });
  }

  render() {
    return (
      <View style={{flex: 1}}>
        {this.state.isLoading && <ActivityIndicator style={styles.ActivityIndicator}/>}
        {!this.state.isLoading &&
          <ScrollView>
                <View style={styles.container}>
                {this.state.notifications.length === 0 &&
                  <Text style={styles.noNotification}>No Notification</Text>
                }
                {this.state.notifications.map((card, key) => {
                  return (
                      <CardView {...card} key={key} sendRating={this.sendRating.bind(this)}  deleteNotification={this.deleteNotification.bind(this)} updateRating={this.updateRating.bind(this)}/>
                  );
                })}
                </View>
          </ScrollView> }
      </View>
    );
  }
}


export default NotificationsScreen;
