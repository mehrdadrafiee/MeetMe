import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import styles from './styles/MyMeetupsList';
import { Icon } from 'native-base';

const MyMeetupsList = ({ meetups }) => (
  <View style={styles.root}>
    <View style={styles.titleContainer}>
      <Text style={styles.title}>Nearby Restaurants</Text>
    </View>
    <View style={styles.contentContainer}>
      <ScrollView horizontal>
        {meetups.map((meetup, i) => (
          <View key={i} style={styles.meetupCard}>
            <View style={styles.meetupCardTopContainer}>
              <Text style={styles.meetupCardTitle}>
                {meetup.title}
              </Text>
            </View>

            <View style={styles.meetupCardBottomContainer}>
              <Text style={styles.meetupCardMetaName}>
                {meetup.group.name}
              </Text>
              <Text style={styles.meetupCardMetaDate}>
                Rating:&nbsp;
                  <Icon name="md-star" style={{ fontSize: 15 }} />
                  <Icon name="md-star" style={{ fontSize: 15 }} />
                  <Icon name="md-star" style={{ fontSize: 15 }} />
                  <Icon name="md-star" style={{ fontSize: 15 }} />
                  <Icon name="md-star-half" style={{ fontSize: 15 }} />
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  </View>
);

export default MyMeetupsList;