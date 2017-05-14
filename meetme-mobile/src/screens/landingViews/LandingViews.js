import React, { Component } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableHighlight,
  ActivityIndicator
} from 'react-native';
import * as firebase from 'firebase';
import { NavigationActions } from 'react-navigation';
import { FormLabel, FormInput, Button } from 'react-native-elements';

import Colors from '../../../constants/Colors';

import styles from '../../commons/styles/common.js';
import { firebaseInit, login, alertService , signup} from '../helpers';

class LandingViews extends Component {
  static navigationOptions = {
    header: (navigation) => {
      const style = { backgroundColor: Colors.whiteColor };

      return {style};
    }
  }
  constructor(props){
    super(props);
    this.state = {
      email: '',
      password: '',
      screenName: 'Login',
      process: false
    }
    this.submit = this.submit.bind(this);
    this.switchScreen = this.switchScreen.bind(this);
  }

  submit() {
    if (this.state.email && this.state.password){
      const method = this.state.screenName === 'Login' ? login : signup;
      this.setState({process: true})
      method(this.state.email, this.state.password)
        .then((result) => {
        })
        .catch((error) => {
          alertService(error.message);
        })
        .finally(() =>{
          this.setState({process: false})
        })
    }
  }

  switchScreen() {
    this.setState({screenName: this.state.screenName === 'Login' ? 'Signup' : 'Login'})
  }

  async componentWillMount() {
    this.setState({process: true});
    firebaseInit()
      .then((firebase) => {
      })
      .finally(() => this.setState({process: false}));
    // check to see if we have logged in user
    const navigateAction = NavigationActions.navigate({
      routeName: 'Home',
      action: NavigationActions.navigate({ routeName: 'Contacts'})
    })
   firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          this.props.navigation.dispatch(navigateAction);
        } else {
          // No user is signed in.
        }
    });
  }

  render() {
    return (
      <View style={styles.root}>
        <View style={styles.LoginScreenContainer}>
          <Text style={styles.logoText} fontFamily="catamaran">Yelpify</Text>
          <Text style={styles.screenName} fontFamily="catamaran">{this.state.screenName}</Text>
          <View style={styles.item}>
            <FormLabel fontFamily="catamaran">Email Address</FormLabel>
            <FormInput
              selectionColor={Colors.blackColor}
              style={styles.textInputStyle}
              autoFocus={true}
              keyboardAppearance='light'
              keyboardType='email-address'
              autoCorrect={false}
              autoCapitalize="none"
              onChangeText={(email) => this.setState({email})}
              value={this.state.email}
              fontFamily="catamaran"
            />
          </View>
          <View style={styles.item}>
            <FormLabel fontFamily="catamaran">Password</FormLabel>
            <FormInput
              selectionColor={Colors.blackColor}
              style={styles.textInputStyle}
              autoCorrect={false}
              autoCapitalize="none"
              secureTextEntry={true}
              onChangeText={(password) => this.setState({password})}
              value={this.state.password}
              fontFamily="catamaran"
            />
          </View>
          <View>
            <Button backgroundColor={Colors.darkBlueColor} raised fontFamily="catamaran" title="Submit" style={styles.button} onPress={this.submit}/>
            <TouchableHighlight onPress={this.switchScreen} style={styles.pageInfo}>
              {this.state.screenName === 'Login' ? <Text fontFamily="catamaran">Haven't registered yet? Go to Register page.</Text>: <Text fontFamily="catamaran">Already registered? Go to Login page.</Text> }
            </TouchableHighlight>
          </View>
        {this.state.process &&
          <ActivityIndicator
            style={[styles.centering, styles.gray]}
            size="large"
            color="white"
          />
        }
        </View>
      </View>
    )
  }
}

export default LandingViews;
