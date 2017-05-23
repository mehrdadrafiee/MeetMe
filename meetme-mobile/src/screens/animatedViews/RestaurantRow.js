import React, { PropTypes } from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  Button
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import StarRating from 'react-native-star-rating';
import styles from './styles/RestaurantRow';
import * as actionCreators from '../contacts/actions';


const propTypes = {
  image: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  // address: PropTypes.string.isRequired,
  // rating: PropTypes.number.isRequired
};

class RestaurantRow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: false
    }
    this.addAddress = this.addAddress.bind(this);
  }
  addAddress(address) {
    const isThere = this.props.Address.filter((data) => {
      return data.id === address.id;
    });
    if (isThere.length > 0) {
      this.props.actions.removeAddress(address.id);
      this.setState({selected: false})
    } else {
      const newAddress = Object.assign({}, address);
      delete newAddress.actions;
      this.props.actions.addAddress(newAddress);
      this.setState({selected: true})
    }
  }
  render() {
    const { image, name, address, rating } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          <Image
            style={styles.image}
            source={{uri: image}}
            resizeMode="contain"
          />
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.name} fontFamily="catamaran">{name}</Text>
          <Text style={styles.address} fontFamily="catamaran">{address}</Text>
          <StarRating
            disabled={false}
            maxStars={5}
            rating={rating ? rating : 0}
            starColor={'black'}
            starSize={15}
          />
          <Button
            onPress={() => this.addAddress(this.props)}
            title={!this.state.selected ? 'select': 'unselect'}
            fontFamily="catamaran">
          </Button>
        </View>
        {this.state.selected &&
          <View>
            <MaterialIcons name="check-circle" style={styles.selectContactIcon}/>
          </View>
        }
      </View>
    );
  }
}
RestaurantRow.propTypes = propTypes;

function mapStateToProps(state) {
  return {
    Address: state.Address.toJS()
  }
}
function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actionCreators, dispatch) }
}

export default connect(mapStateToProps, mapDispatchToProps)(RestaurantRow);
