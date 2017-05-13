import React, { Component } from 'react';
import {
  Text,
  Picker,
  Button,
  Linking
} from 'react-native';

import {
  Card,
  CardImage,
  CardTitle,
  CardContent,
  CardAction
} from 'react-native-card-view';

import styles from './styles/NotificationsScreen';
import DropDown, {
  Select,
  Option,
  OptionList,
} from 'react-native-selectme';

import Swipeout from 'react-native-swipeout';

export default class CardView extends Component {
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
