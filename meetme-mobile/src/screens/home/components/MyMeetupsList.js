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
  <View style={styles.root}>
    <View style={styles.titleContainer}>
      <Text style={styles.title}>Nearby Restaurants</Text>
    </View>
    <View style={styles.contentContainer}>
      <ScrollView horizontal>
        {meetups.map((meetup, i) => (
          <Card key={i}>
          <CardTitle>
            <Text style={styles.title}>{meetup.title}</Text>
          </CardTitle>
          <CardContent>
            <Text>{meetup.group.name}</Text>
            <Image
              style={{width: 50, height: 50}}
              source={{uri: 'https://facebook.github.io/react/img/logo_og.png'}}
            />
            <Text style={styles.meetupCardMetaDate}>
                Rating:&nbsp;
                  <Icon name="md-star" style={{ fontSize: 15 }} />
                  <Icon name="md-star" style={{ fontSize: 15 }} />
                  <Icon name="md-star" style={{ fontSize: 15 }} />
                  <Icon name="md-star" style={{ fontSize: 15 }} />
                  <Icon name="md-star-half" style={{ fontSize: 15 }} />
            </Text>
          </CardContent>
          <CardAction >
            <Button
              style={styles.button}
              title='button 1'
              onPress={() => {}} />
          </CardAction>
        </Card>
        ))}
      </ScrollView>
    </View>
  </View>
);

export default MyMeetupsList;