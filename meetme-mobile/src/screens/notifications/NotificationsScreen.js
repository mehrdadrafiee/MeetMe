import React, { Component } from 'react';
import { ScrollView, View, Text, Button, Image } from 'react-native';
import * as firebase from 'firebase';
// import { DropDown } from 'react-native-dropdown';
import { MaterialIcons } from '@expo/vector-icons';
import Colors from '../../../constants/Colors';
import styles from './styles/NotificationsScreen';
import { Permissions, Notifications } from 'expo';
import CardView from './card';

import { getLoggedInUser } from '../helpers';

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
      notifications: []
    };
    this._handleNotification = this._handleNotification.bind(this);
  }

  _handleNotification = (notifications) => {
    // changes color of icon when notification arrives
    this.props.navigation.setParams({hasNotification: true})
  };

  componentDidMount() {
    // updatePosition(this.refs['SELECT1']);
    // updatePosition(this.refs['OPTIONLIST']);
    this._notificationSubscription = Notifications.addListener(this._handleNotification);
  }

  componentDidMount() {
    const userId = firebase.auth().currentUser.uid;
    // this.props.navigation.setParams({hasNewNotification: true})
    getLoggedInUser()
      .then((user) => {
        const notificationSnap = firebase.database().ref(`notifications/${userId}`);
        notificationSnap.on('value', (snapshot) => {
          const notifications = snapshot.val();
          if (notifications){
            const newnotifications = [];
            Object.keys(notifications).map((key, index) => {
              newnotifications.push(Object.assign({},notifications[key], {id: key }));
            });
            console.log(newnotifications, 'new notifications');
            this.setState({notifications: newnotifications});
          }
        });
      });
  }

  _getOptionList() {
    return this.refs['OPTIONLIST'];
  }

  _canada(province) {

	this.setState({
      ...this.state,
      canada: province
    });
  }

  // constructor(props) {
  //   super(props);

  //   this.state = PropertiesStore.getState();
  //   this.onChange = this.onChange.bind(this)
  // }

  // componentDidMount() {
  //   PropertiesStore.listen(this.onChange);

  //   PropertiesActions.getList();
  // }

  // componentWillUnmount() {
  //   PropertiesStore.unlisten(this.onChange);
  // }

  // onChange(state) {
  //   this.setState(state);
  // }

  // state = {
  //   selected1: 'key1',
  //   selected2: 'key1',
  //   selected3: 'key1',
  //   color: 'red',
  //   mode: Picker.MODE_DIALOG,
  // };

  render() {
    console.log(this.state.notifications);
    return (
      <ScrollView>
        <View style={styles.container}>
          {this.state.notifications.length === 0 &&
            <Text>No Notification</Text>
          }
          {this.state.notifications.length > 0 && this.state.notifications.map((card, key) => <CardView {...card} key={key} />)}
          {/*<Card>
            <CardContent>
              <Text>You are invited for a hangout with
                <Text style={{fontWeight: 'bold'}}>
                  Sarah Smith
                </Text>. Vote for the place that you like the most or swipe left to discard.
              </Text>
            </CardContent>
            <CardAction >
              <Button
                style={styles.button}
                onPress={() => {}}
                title='Send'>
              </Button>
            </CardAction>
          </Card>
{/*
          <Text>Fix width : 300</Text>
          <Card styles={{card: {width: 300}}}>
            <CardTitle>
              <Text style={styles.title}>Card Title</Text>
            </CardTitle>
            <CardContent>
              <Text>Content</Text>
            </CardContent>
            <CardAction >
              <Button
                style={styles.button}
                onPress={() => {}}
                title='button 1'>
              </Button>
              <Button
                style={styles.button}
                onPress={() => {}}
                title='button 2'>
              </Button>
            </CardAction>
          </Card>*/}

          {/*<Text>Card Image + Card Title + Card Content + Card Action</Text>
          <Card>
            <CardImage>
              <Image
                style={{width: 300, height: 200}}
                source={{uri: 'https://getmdl.io/assets/demos/image_card.jpg'}}
              />
            </CardImage>
            <CardTitle>
              <Text style={styles.title}>Card Title</Text>
            </CardTitle>
            <CardContent>
              <Text>Content</Text>
              <Text>Content</Text>
              <Text>Content</Text>
              <Text>Content</Text>
              <Text>Content</Text>
              <Text>Content</Text>
            </CardContent>
            <CardAction>
              <Button
                style={styles.button}
                onPress={() => {}}
                title='button 1'>
              </Button>
              <Button
                style={styles.button}
                styleDisabled={{color: 'red'}}
                onPress={() => {}}
                title='button 2'>
              </Button>
            </CardAction>
          </Card>

          <Text>Card Image</Text>
          <Card>
            <CardImage>
              <Image
                style={{width: 256, height: 256}}
                source={{uri: 'https://getmdl.io/assets/demos/image_card.jpg'}}
              >
                <Text style={[styles.title, {alignSelf: 'center'}]}>Beautiful Girl</Text>
              </Image>
            </CardImage>
          </Card>

          <Text>Card Image</Text>
          <Card>
            <CardImage>
              <Image
                style={{width: 256, height: 256}}
                source={{uri: 'https://static.pexels.com/photos/59523/pexels-photo-59523.jpeg'}}
              />
            </CardImage>
          </Card>*/}
        </View>
      </ScrollView>
    );
  }
}


export default NotificationsScreen;
