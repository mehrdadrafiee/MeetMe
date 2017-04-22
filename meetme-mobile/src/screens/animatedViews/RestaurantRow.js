import React, { PropTypes } from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text
} from 'react-native';
import StarRating from 'react-native-star-rating';

const propTypes = {
  image: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  address: PropTypes.string.isRequired,
  rating: PropTypes.number.isRequired
};

export default class RestaurantRow extends React.Component {
  render() {
    const { image, name, address, rating } = this.props;
    return (
      <View style={styles.container} >
        <View style={styles.imageContainer}>
          <Image 
            style={styles.image}
            source={{uri: image}}
            resizeMode="contain"
          />
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.title}>{name}</Text>
          <Text style={styles.address}>{address}</Text>
          <StarRating
            disabled={false}
            maxStars={5}
            rating={rating}
            starColor={'black'}
            starSize={20}
          />
        </View>
      </View>
    );
  }
}

RestaurantRow.propTypes = propTypes;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    flexDirection: 'row'
  },
  imageContainer: {
    height: 150,
    width: 150,
    padding: 20
  },
  image: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'gray'
  },
  infoContainer: {
    flex: 3,
    padding: 10
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 4
  },
  address: {
    fontSize: 10
  }
});
