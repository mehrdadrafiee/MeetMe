import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Button, Icon } from 'native-base';

import Colors from '../../../constants/Colors';

class CreateMeetupScreen extends Component {
  static navigationOptions = {
    title: 'Create new Meeting',
    header: ({ goBack }) => {
      const style = { backgroundColor: Colors.whiteColor };
      const titleStyle = { color: Colors.blackColor };
      const left = (
        <Button transparent onPress={() => goBack()}>
          <Icon
            name="md-close"
            style={{
              fontSize: 30,
              color: Colors.blackColor
            }}
          />
        </Button>
      )

      return { style, titleStyle, left };
    }
  }
  render() {
    return (
      <View>
        <Text>Here is the text</Text>
      </View>
    );
  }
}

export default CreateMeetupScreen;