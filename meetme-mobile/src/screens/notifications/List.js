import React from 'react';
import { View, Dimensions, StyleSheet, Image } from 'react-native';
import {
  Card,
  CardImage,
  CardTitle,
  CardContent,
  CardAction
} from 'react-native-card-view';

import { Text } from 'react-native-elements';

const { height, width } = Dimensions;
const ListItem = (props) => {
  return (
    <Card>
      <CardContent >
        <Text>{props.name}</Text>
      </CardContent>
    </Card>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  name: {
    fontSize: 10
  },
  title: {
    fontSize: 18
  }
})

export default ListItem;
