import React from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  Animated,
  TouchableOpacity,
  Navigator,
  Text,
  ActivityIndicator
} from 'react-native';

import { connect } from 'react-redux';

import * as firebase from 'firebase';

import { MaterialIcons } from '@expo/vector-icons';
import MapView from 'react-native-maps';

import { Components, Location } from 'expo';

import PanController from './PanController';
// import CustomMarker from './CustomMarker';
import RestaurantRow from './RestaurantRow';

import Colors from '../../../constants/Colors';

import { GooglePlacesAPI } from '../../config';

import PriceMarker from './AnimatedPriceMarker';

import { getLatLongByAddress, getNearbyResturant, sendPushNotification, alertService, saveNotificationToDatabase, getStorage } from '../helpers';

const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE = 36.7783;
const LONGITUDE = 119.4179;
const LATITUDE_DELTA = 0.0122;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const ITEM_SPACING = 10;
const ITEM_PREVIEW = 10;
const ITEM_WIDTH = width - (2 * ITEM_SPACING) - (2 * ITEM_PREVIEW);
const SNAP_WIDTH = ITEM_WIDTH + ITEM_SPACING;
const ITEM_PREVIEW_HEIGHT = 150;
const SCALE_END = width / ITEM_WIDTH;
const BREAKPOINT1 = 246;
const BREAKPOINT2 = 350;
const ONE = new Animated.Value(1);

function getMarkerState(panX, panY, scrollY, i) {
  const xLeft = (-SNAP_WIDTH * i) + (SNAP_WIDTH / 2);
  const xRight = (-SNAP_WIDTH * i) - (SNAP_WIDTH / 2);
  const xPos = -SNAP_WIDTH * i;

  const isIndex = panX.interpolate({
    inputRange: [xRight - 1, xRight, xLeft, xLeft + 1],
    outputRange: [0, 1, 1, 0],
    extrapolate: 'clamp'
  });

  const isNotIndex = panX.interpolate({
    inputRange: [xRight - 1, xRight, xLeft, xLeft + 1],
    outputRange: [1, 0, 0, 1],
    extrapolate: 'clamp'
  });

  const center = panX.interpolate({
    inputRange: [xPos - 10, xPos, xPos + 10],
    outputRange: [0, 1, 0],
    extrapolate: 'clamp'
  });

  const selected = panX.interpolate({
    inputRange: [xRight, xPos, xLeft],
    outputRange: [0, 1, 0],
    extrapolate: 'clamp'
  });

  const translateY = Animated.multiply(isIndex, panY);

  const translateX = panX;

  const anim = Animated.multiply(isIndex, scrollY.interpolate({
    inputRange: [0, BREAKPOINT1],
    outputRange: [0, 1],
    extrapolate: 'clamp'
  }));

  const scale = Animated.add(ONE, Animated.multiply(isIndex, scrollY.interpolate({
    inputRange: [BREAKPOINT1, BREAKPOINT2],
    outputRange: [0, SCALE_END - 1],
    extrapolate: 'clamp'
  })));

  // [0 => 1]
  let opacity = scrollY.interpolate({
    inputRange: [BREAKPOINT1, BREAKPOINT2],
    outputRange: [0, 1],
    extrapolate: 'clamp'
  });

  // if i === index: [0 => 0]
  // if i !== index: [0 => 1]
  opacity = Animated.multiply(isNotIndex, opacity);


  // if i === index: [1 => 1]
  // if i !== index: [1 => 0]
  opacity = opacity.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0]
  });

  let markerOpacity = scrollY.interpolate({
    inputRange: [0, BREAKPOINT1],
    outputRange: [0, 1],
    extrapolate: 'clamp'
  });

  markerOpacity = Animated.multiply(isNotIndex, markerOpacity).interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0]
  });

  const markerScale = selected.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.2]
  });

  return {
    translateY,
    translateX,
    scale,
    opacity,
    anim,
    center,
    selected,
    markerOpacity,
    markerScale
  };
}

class AnimatedViews extends React.Component {
  static navigationOptions = {
    title: 'NEARBY PLACES',
    header: ({ state }) => {
      const style = { backgroundColor: Colors.whiteColor };
      const left = (
        <TouchableOpacity style={styles.iconAdd} >
          <MaterialIcons
            name="add-circle"
            size={30}
            color={Colors.blackColor} />
        </TouchableOpacity>
      );
      const right = (
        <TouchableOpacity onPress={() => state.params.sendPush()}>
          <MaterialIcons
            name="navigate-next"
            size={30}
            color={Colors.blackColor}
            />
        </TouchableOpacity>
      );

      return {style, left, right };
    },
    tabBar: {
      icon: ({ tintColor }) => (
        <MaterialIcons
          name="map"
          size={25}
          color={tintColor}
        />
      )
    }
  }

  constructor(props) {
    super(props);
    const panX = new Animated.Value(0);
    const panY = new Animated.Value(0);

    const scrollY = panY.interpolate({
      inputRange: [-1, 1],
      outputRange: [1, -1]
    });

    const scrollX = panX.interpolate({
      inputRange: [-1, 1],
      outputRange: [1, -1]
    });

    const scale = scrollY.interpolate({
      inputRange: [0, BREAKPOINT1],
      outputRange: [1, 1.6],
      extrapolate: 'clamp'
    });

    const translateY = scrollY.interpolate({
      inputRange: [0, BREAKPOINT1],
      outputRange: [0, -100],
      extrapolate: 'clamp'
    });

    const markers = [];

    this.state = {
      initialRegion: null,
      panX,
      panY,
      index: 0,
      canMoveHorizontal: true,
      scrollY,
      scrollX,
      scale,
      translateY,
      markers,
      userToken: null,
      userByToken: {},
      hasSent: false,
      region: new MapView.AnimatedRegion({
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      }),
      coordinate: {
        latitude: LATITUDE,
        longitude: LONGITUDE
      },
      locations: []
    };
    this.getLatLng = this.getLatLng.bind(this);
    this.onRegionChange = this.onRegionChange.bind(this);
    this.sendPush = this.sendPush.bind(this);
  }

  onRegionChange(region) {
    this.state.region.setValue(region);
  }

   sendPush() {
     if (this.props.Address.length > 0 && this.props.Contact.length > 0 && this.state.hasSent === false) {
       this.setState({ hasSent: true });
       const saveNotification = [];
       let combined = [];
       const token = [];
       const currentUser = firebase.auth().currentUser.email;
       const userId = firebase.auth().currentUser.uid;
       const displayName = firebase.auth().currentUser.displayName !== null ? firebase.auth().currentUser.displayName: 'a user';
       this.props.Contact.map((contact) => {
         if (contact.emails){
           contact.emails.map((emaildata) => {
             Object.keys(this.state.userByToken)
             .map((key, index) =>{
               if (this.state.userByToken[key].email === emaildata.email) {
                 let invitationData = {
                   Address: this.props.Address,
                   Contact: this.props.Contact,
                   type: 'Invitation',
                   userId: key,
                   username:  displayName,
                   creatorToken: this.state.userToken,
                   creatorId: userId
                 };
                 saveNotification.push(saveNotificationToDatabase('notifications', invitationData, userId));
                 token.push(sendPushNotification({ token: this.state.userByToken[key].token, type: 'Invitation', username:  displayName }));
               }
             })
           });
         }
       });
       combined = [...saveNotification, ...token];
       Promise.all(combined)
        .then((result) => {
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
        });
     }
   }

  getLatLng(locations) {
    let promises = [];
    let markes = [];
    let latlng = [];
    // adding both user locations and selected contact locations
    for(let i = 0; i < locations.length; i++){
      promises.push(getLatLongByAddress(locations[i]));
    }
    Promise.all(promises)
      .then((results) => {
        // send request for nearby restaurant for current user
        latlng.push(getNearbyResturant(this.state.locations[0]));
        results.map((result) => {
          if (result.data.results && result.data.results[0] && result.data.results[0].geometry) {
            let latitude = result.data.results[0].geometry.location.lat;
            let longitude = result.data.results[0].geometry.location.lng;
            let regions = {
              latitude,
              longitude
            };
            // Passing the lat long to search nearby restaurant;
            latlng.push(getNearbyResturant(regions, result.address));
          }
          return result;
        });
        Promise.all(latlng)
          .then((response) => {
            response.map((responseData) => {
              responseData.data.results.forEach((r, index) => {
                markes.push({
                  id: index,
                  name: r.name,
                  icon: r.icon,
                  rating: r.rating,
                  price: r.priceLevel,
                  image: this.getUrlImage(r),
                  address: r.vicinity,
                  actualAddress: responseData.address,
                  coordinate: {
                    latitude: r.geometry.location.lat,
                    longitude: r.geometry.location.lng,
                  }
                })
              });
            })
            this.generateMarkers(markes);
          })
      })
  }

  componentDidMount() {
    const { panX, panY, scrollY } = this.state;

    panX.addListener(this.onPanXChange);
    panY.addListener(this.onPanYChange);

    navigator.geolocation.getCurrentPosition((position) => {
      if (position && position.coords) {
        // this.onRegionChangeComplete(position.coords);
        this.setState({locations: [position.coords]});

      }
    }, (error) => {

      Alert.alert(
        'Error',
        "Please Activate your location !",
        [
          {text: 'Close', onPress: () => {}},
        ]
      );
    }
    );
    const userData = firebase.database().ref(`users/`);
    if (!userData) {
      return;
    }
    userData.on('value', (snapshot) => {
      const data = snapshot.val();
      this.setState({userByToken: Object.assign({}, data)});
    });
    getStorage('token')
      .then((token) => {
        this.setState({userToken: token});
      })
    this.props.navigation.setParams({ sendPush: this.sendPush });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.Location.length > 0) {
      this.getLatLng(nextProps.Location);
    }
  }

  onStartShouldSetPanResponder = (e) => {
    // we only want to move the view if they are starting the gesture on top
    // of the view, so this calculates that and returns true if so. If we return
    // false, the gesture should get passed to the map view appropriately.
    const { panY } = this.state;
    const { pageY } = e.nativeEvent;
    const topOfMainWindow = ITEM_PREVIEW_HEIGHT + panY.__getValue();
    const topOfTap = height - pageY;

    return topOfTap < topOfMainWindow;
  }

  onMoveShouldSetPanResponder = (e) => {
    const { panY } = this.state;
    const { pageY } = e.nativeEvent;
    const topOfMainWindow = ITEM_PREVIEW_HEIGHT + panY.__getValue();
    const topOfTap = height - pageY;

    return topOfTap < topOfMainWindow;
  }

  onPanXChange = ({ value }) => {
    const { index } = this.state;
    const newIndex = Math.floor(((-1 * value) + (SNAP_WIDTH / 2)) / SNAP_WIDTH);
    if (index !== newIndex) {
      this.setState({ index: newIndex });
    }
  }

  onPanYChange = ({ value }) => {
    const { canMoveHorizontal, region, scrollY, scrollX, markers, index } = this.state;
    const shouldBeMovable = Math.abs(value) < 2;
    if (shouldBeMovable !== canMoveHorizontal) {
      this.setState({ canMoveHorizontal: shouldBeMovable });
      if (!shouldBeMovable) {
        const { coordinate } = markers[index];
        region.stopAnimation();
        region.timing({
          latitude: scrollY.interpolate({
            inputRange: [0, BREAKPOINT1],
            outputRange: [
              coordinate.latitude,
              coordinate.latitude - (LATITUDE_DELTA * 0.5 * 0.375),
            ],
            extrapolate: 'clamp'
          }),
          latitudeDelta: scrollY.interpolate({
            inputRange: [0, BREAKPOINT1],
            outputRange: [LATITUDE_DELTA, LATITUDE_DELTA * 0.5],
            extrapolate: 'clamp'
          }),
          longitudeDelta: scrollY.interpolate({
            inputRange: [0, BREAKPOINT1],
            outputRange: [LONGITUDE_DELTA, LONGITUDE_DELTA * 0.5],
            extrapolate: 'clamp'
          }),
          duration: 0
        }).start();
      } else {
        region.stopAnimation();
        region.timing({
          latitude: scrollX.interpolate({
            inputRange: markers.map((m, i) => i * SNAP_WIDTH),
            outputRange: markers.map(m => m.coordinate.latitude),
          }),
          longitude: scrollX.interpolate({
            inputRange: markers.map((m, i) => i * SNAP_WIDTH),
            outputRange: markers.map(m => m.coordinate.longitude),
          }),
          duration: 0
        }).start();
      }
    }
  }

  onRegionChangeComplete = (region) => {
    const {initialRegion} = this.state;
    this.setState({initialRegion: region});
    if (initialRegion !== null) {
      return;
    }
    else {
      this.findRestaurant(region);
    }
  }

  generateMarkers(markers) {
    const { panX, panY, scrollY } = this.state;
    const animations = markers.map((m, i) =>
    getMarkerState(panX, panY, scrollY, i));
    this.setState({ animations, markers });
    this.startAnimate();
  }

  startAnimate() {
    const { region, panX, panY, scrollX, markers } = this.state;
    if(markers.length > 1) {
      region.stopAnimation();
      region.timing({
        latitude: scrollX.interpolate({
          inputRange: markers.map((m, i) => i * SNAP_WIDTH),
          outputRange: markers.map(m => m.coordinate.latitude),
        }),
        longitude: scrollX.interpolate({
          inputRange: markers.map((m, i) => i * SNAP_WIDTH),
          outputRange: markers.map(m => m.coordinate.longitude),
        }),
        duration: 0
      }).start();
    }
  }
  //Currently we are not using this function since we need to have pure function to get response only
  async findRestaurant(region) {

    const url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?" +
    `location=${region.latitude},${region.longitude}` +
    // `location=${LATITUDE},${LONGITUDE}` +
    "&radius=500&type=restaurant&key=" + GooglePlacesAPI

    let markes = [];

    await fetch(url)
    .then(response => {
      return response.json();
    })
    .then((responseData) => {
      if(responseData && responseData.results) {
        responseData.results.forEach((r, index) => {
          markes.push({id: index,
            name: r.name,
            icon: r.icon,
            rating: r.rating,
            price: r.priceLevel,
            image: this.getUrlImage(r),
            vicinity: r.vicinity,
            coordinate: {
              latitude: r.geometry.location.lat,
              longitude: r.geometry.location.lng,
            }
          })
        });
      }
    })
    .catch(error => {
    });

    this.generateMarkers(markes);
  }

  getUrlImage(item) {
    let url = item.icon;
    if(item.photo && item.photos[0]) {
      url =  "https://maps.googleapis.com/maps/api/place/photo?"+
      "maxwidth=400&photoreference="+ item.photos[0].photo_reference +
      "&key="+ GooglePlacesAPI;
    }
    return url;
  }

  render() {
    const {
      panX,
      panY,
      animations,
      canMoveHorizontal,
      markers,
      region,
      initialRegion
    } = this.state;

    return (
      <View style={styles.container}>
        {this.state.hasSent &&
          <ActivityIndicator style={[styles.centering, {height: 80}]} size="large"/>
        }
        {!this.state.hasSent &&
          <PanController
          style={styles.container}
          vertical
          horizontal={canMoveHorizontal}
          xMode="snap"
          snapSpacingX={SNAP_WIDTH}
          yBounds={[-1 * height, 0]}
          xBounds={[-width * (markers.length - 1), 0]}
          panY={panY}
          panX={panX}
          onStartShouldSetPanResponder={this.onStartShouldSetPanResponder}
          onMoveShouldSetPanResponder={this.onMoveShouldSetPanResponder}
          >
          <MapView.Animated
          provider={this.props.provider}
          style={styles.map}
          region={region}
          onRegionChange={this.onRegionChange}
          showsUserLocation={true}
          followsUserLocation={true}
          showsMyLocationButton={true}
          showsCompass={true}
          showsBuildings={true}
          zoomEnabled={true}
          rotateEnabled={true}
          loadingEnabled={true}
          showsTraffic={true}
          onRegionChangeComplete={this.onRegionChangeComplete}
          legalLabelInsets={{top: 10, right: 10, bottom: 10, left: 10 }}
          >
          {markers.map((marker, i) => {
            const {
              selected,
              markerOpacity,
              markerScale
            } = animations[i];
            return (
              <MapView.Marker
              key={marker.id}
              coordinate={marker.coordinate}
              >
              <PriceMarker
              style={{
                opacity: markerOpacity,
                transform: [
                  { scale: markerScale },
                ],
              }}
              amount={marker.price}
              selected={selected}
              />
              </MapView.Marker>
            );

            return (
              <Components.MapView.Marker
              key={marker.id}
              coordinate={marker.coordinate}
              //image={marker.image}
              selected={selected}
              />
            );
          })}
          </MapView.Animated>
          <View style={styles.itemContainer}>
          {markers.map((marker, i) => {
            const {
              translateY,
              translateX,
              scale,
              opacity
            } = animations[i];

            return (
              <Animated.View
              key={marker.id}
              style={[styles.item, {
                opacity,
                transform: [
                  { translateY },
                  { translateX },
                  { scale }
                ]
              }]}
              >
              <RestaurantRow
              rating={marker.rating}
              name={marker.name}
              image={marker.image}
              address={marker.address}
              id={marker.id}
              coordinate={marker.coordinate}
              />
              </Animated.View>
            );
          })}
          </View>
          </PanController>
        }
      </View>
    );
  }
}

// AnimatedViews.propTypes = {
//   provider: MapView.ProviderPropType
// };

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject
  },
  itemContainer: {
    backgroundColor: 'transparent',
    flexDirection: 'row',
    paddingHorizontal: (ITEM_SPACING / 2) + ITEM_PREVIEW,
    position: 'absolute',
    // top: height - ITEM_PREVIEW_HEIGHT - 64,
    paddingTop: height - ITEM_PREVIEW_HEIGHT - 100,
    // paddingTop: !ANDROID ? 0 : height - ITEM_PREVIEW_HEIGHT - 64,
  },
  map: {
    backgroundColor: 'transparent',
    ...StyleSheet.absoluteFillObject
  },
  item: {
    width: ITEM_WIDTH,
    height: height + (2 * ITEM_PREVIEW_HEIGHT),
    marginHorizontal: ITEM_SPACING / 2,
    overflow: 'hidden',
    borderRadius: 3,
    borderColor: '#000'
  },
  iconAdd: {
    marginLeft: 10
  },
  centering: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  }
});
function mapStateToProps(state) {
  return {
    Address: state.Address.toJS(),
    Location: state.Location.toJS(),
    Contact: state.Contact.toJS()
  }
}

export default connect(mapStateToProps, null)(AnimatedViews);
