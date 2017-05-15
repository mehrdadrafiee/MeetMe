import React from 'react';
import { View, Text, ScrollView, Image, Button } from 'react-native';
import styles from './styles/MyMeetupsList';
import { Icon } from 'native-base';
import {
  Card,
  CardImage,
  CardTitle,
  CardContent,
  CardAction
} from 'react-native-card-view';

const MyMeetupsList = ({ meetups }) => (
  <View style={styles.container}>
    <ScrollView horizontal>
    {meetups && meetups.map((meetup, i) => (
    <Card key={i}>
      <CardImage>
        <Image
          style={{width: 200, height: 100}}
          source={{uri: 'https://facebook.github.io/react/img/logo_og.png'}}
        />
      </CardImage>
      <CardContent>
        <Text style={styles.title} fontFamily="catamaran">{meetup.title}</Text>
        <Text fontFamily="catamaran">{meetup.group.name}</Text>
        <Text style={styles.meetupCardMetaDate} fontFamily="catamaran">
          Rating:&nbsp;
          <Icon name="md-star" style={{ fontSize: 15 }} />
          <Icon name="md-star" style={{ fontSize: 15 }} />
          <Icon name="md-star" style={{ fontSize: 15 }} />
          <Icon name="md-star" style={{ fontSize: 15 }} />
          <Icon name="md-star-half" style={{ fontSize: 15 }} />
        </Text>
      </CardContent>
      <CardAction styles={{cardAction: [{padding: 0}]}}>
        <Button
          style={styles.button}
          title='Select'
          onPress={() => {}} />
      </CardAction>
    </Card>
    ))}
  </ScrollView>
</View>
);

export default MyMeetupsList;