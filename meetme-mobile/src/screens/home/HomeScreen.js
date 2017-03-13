import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Components } from 'exponent';
import { connect } from 'react-redux';
import { Button, Icon } from 'native-base';
import { MaterialIcons } from '@exponent/vector-icons';

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
        <View>
          <Button
          transparent
          onPress={() => navigate('CreateMeetup')}>
            <Icon
            name="md-add-circle"
            style={{
              fontSize: 30,
              color: Colors.blackColor
            }}
            />
          </Button>
        </View>
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

  componentDidMount() {
    this.props.fetchMyMeetups();
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
        <View style={styles.topContainer}>
          <Text>Home</Text>
        </View>
        <Components.MapView
          style={styles.mapContainer}
          initialRegion={{
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
        <View style={styles.bottomContainer}>
          <MyMeetupsList meetups={data} />
        </View>
      </View>
    );
  }
}

export default HomeScreen;