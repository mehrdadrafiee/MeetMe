import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Components, Location } from 'expo';
import { connect } from 'react-redux';
import { Button, Icon } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';

import { LoadingScreen } from '../../commons';
import { MyMeetupsList } from './components';

import { fetchMyMeetups } from './actions';
import Colors from '../../../constants/Colors';
import styles from './styles/HomeScreen';

@connect(
  state => ({
    myMeetups: state.home.myMeetups
  }),
  { fetchMyMeetups }
)
class HomeScreen extends Component {
  static navigationOptions = {
    header: ({ navigate }) => {
      const style = { backgroundColor: Colors.whiteColor };
      const right = (
        <TouchableOpacity style={styles.iconAdd} onPress={() => navigate('CreateMeetup')}>
          <MaterialIcons
            name="add-circle"
            size={30}
            color="Colors.blackColor" />
        </TouchableOpacity>
      );

      return {style, right };
    },
    tabBar: {
      icon: ({ tintColor }) => (
        <MaterialIcons 
          name="home"
          size={25}
          color={tintColor}
        />
      )
    }
  }

  state = {
    region: {
      latitude: 34.0195,
      longitude: -118.4912,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421
    },
    markers: {
      latlng: [ 34.0195, -118.4912 ],
      title: "Marker title",
      description: "marker description"
    },
    initialPosition: 'unknown',
    lastPosition: 'unknown',
  }

  watchID: ?number = null;

  componentDidMount() {
    this.props.fetchMyMeetups();

    navigator.geolocation.getCurrentPosition(
      (position) => {
        var initialPosition = JSON.stringify(position);
        this.setState({initialPosition});
        console.log(initialPosition);
      },
      (error) => alert(JSON.stringify(error)),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    );
    this.watchID = navigator.geolocation.watchPosition((position) => {
      var lastPosition = JSON.stringify(position);
      this.setState({lastPosition});
    });
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
  }

  onRegionChange(region) {
    return regionChanged =  this.setState({ region });
  }

  render() {
    const {
      myMeetups: {
        isFetched,
        data,
        error
      }
    } = this.props;
    if (!isFetched) {
      return <LoadingScreen />;
    } else if (error.on) {
      return (
        <View>
          <Text>{error.message}</Text>
        </View>
      );
    }
    return (
      <View style={styles.root}>
        <Components.MapView
          style={styles.mapContainer}
          showsUserLocation={true}
          region={this.state.region}
          onRegionChange={this.regionChanged}>
          <Components.MapView.Marker
            coordinate={{latitude: 34.0195, longitude: -118.4912}}
            title={"title"}
            description={"description"}
          />
          <Components.MapView.Marker
            coordinate={{latitude: 34, longitude: -118.45}}
            title={"title"}
            description={"description"}
          />
        </Components.MapView>
        <View style={styles.bottomContainer}>
          <MyMeetupsList meetups={data} />
        </View>
      </View>
    );
  }
}

export default HomeScreen;