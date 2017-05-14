import React, { Component } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  TouchableHighlight,
  ActivityIndicator
} from 'react-native';
import * as firebase from 'firebase';
import { NavigationActions } from 'react-navigation'

import styles from '../../commons/styles/common.js';
import { firebaseInit, login, alertService , signup} from '../helpers';

class LandingViews extends Component {
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
      <View style={styles.LoginScreenContainer}>
        <Text style={styles.logoText}>Yelpify</Text>
        <Text style={styles.screenName}>{this.state.screenName}</Text>
        <View>
            <TextInput
              style={styles.textInputStyle}
              autoFocus={true}
              keyboardAppearance='light'
              keyboardType='email-address'
              autoCorrect={false}
              autoCapitalize="none"
              onChangeText={(email) => this.setState({email})}
              placeholder="Email"
              value={this.state.email}
            />
            <TextInput
              style={styles.textInputStyle}
              autoCorrect={false}
              autoCapitalize="none"
              secureTextEntry={true}
              onChangeText={(password) => this.setState({password})}
              placeholder="Password"
              value={this.state.password}
            />
        </View>
        <View>
          <Button title="Submit"  style={styles.button} onPress={this.submit}/>
          <TouchableHighlight onPress={this.switchScreen}>
            {this.state.screenName === 'Login' ? <Text>Go to singup</Text>: <Text>Go to login</Text> }
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
    )
  }
}

export default LandingViews;
