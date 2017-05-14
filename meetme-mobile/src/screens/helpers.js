import { Permissions, Notifications } from 'expo';
import * as firebase from 'firebase';

import {
  GooglePlacesAPI,
  apiKey,
  authDomain,
  databaseURL,
  storageBucket
} from '../config';

const firebaseConfig = {
  apiKey,
  authDomain,
  databaseURL,
  storageBucket
};

import  {
  AsyncStorage,
  AlertIOS
} from 'react-native';

const api = `https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyCfua3xcDexrf74snFHczxbd3S6RtpPHbU`
const nearbysearchUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?radius=500&type=restaurant&key=${GooglePlacesAPI}`
let firebaseApp;


function getEndPoints(uri) {
  const environment = process.env.NODE_ENV;
  const api = require('../config')[`${environment}_api`]
  return uri ? `${api}${uri}` :  api;
}

export async function getNearbyResturant(region, address) {
  const response = await fetch(`${nearbysearchUrl}&location=${region.latitude},${region.longitude}`);
  let data = await response.json();
  return { data, address };
}

export async function setStorage(key, data) {
  const stored = await AsyncStorage.setItem(key, data);
  return stored;
}

export async function getStorage(key) {
  const getStored = await AsyncStorage.getItem(key);
  return getStored;
}

export async  function getLatLongByAddress(address) {
  const response = await fetch(`${api}&address=${address}`);
  let data = await response.json();
  return { data, address };
}

export async function HTTP(endpoint, verb, data) {
  let params = {
    method: verb,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  }
  if (verb === 'POST') {
    params.body = JSON.stringify(data);
  }
  const response = await fetch(endpoint, params);
  return response.json();
}

export async function registerForPushNotification() {
  // Ask permission on ios
  let { status } = await Permissions.askAsync(Permissions.REMOTE_NOTIFICATIONS);
  // The line below needs to uncomment in production
  // if (status !== 'granted'){
  //   return;
  // }

  // This token uniquely identifies this device
  let token = await Notifications.getExponentPushTokenAsync();
  console.log('token...', token);
  // post  token to our backend so we can use it to send pushes (firebase)
  const response = await saveTokenToDatabase(token);
  return response;
}

export async function sendPushNotification(data) {
  let url = getEndPoints('push/send');
  let t = await getStorage('push_token');
  // let token = data.token;
  // let params = Object.assign(data, { token });
  const response = await HTTP(url, 'POST', data);
  return response;
}

export function alertService(message) {
  AlertIOS.prompt(
    'Info',
    message,
    null,
    null
  );
}

export function sort_by(field, reverse, primer) {
   var key = primer ?
       function(x) {return primer(x[field])} :
       function(x) {return x[field]};

   reverse = !reverse ? 1 : -1;
   return function (a, b) {
       return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
     }
}

export async function firebaseInit() {
  firebaseApp = firebase.initializeApp(firebaseConfig);
  return firebaseApp;
}

export async function login(email, pass) {
  const result = await firebase.auth().signInWithEmailAndPassword(email, pass);
  return result;
}

export async function signup(email, pass) {
  const result = await firebase.auth().createUserWithEmailAndPassword(email, pass);
  return result;
}

export async function saveTokenToDatabase(token) {
  const userId = firebase.auth().currentUser.uid;
  const email = firebase.auth().currentUser.email;
  const response = await firebase.database().ref(`users/${userId}`).set({
    token,
    email
  });
  return response;
}

export async function saveNotiicationToDatabase(data) {
  const userId = firebase.auth().currentUser.uid;
  const email = firebase.auth().currentUser.email;
  const response = await firebase.database().ref(`notifications/${userId}`).set(data);
  return response;
}

export async function saveToDatabase(data) {
  const userId = firebase.auth().currentUser.uid;
  const email = firebase.auth().currentUser.email;
  const instanceRef = firebase.database().ref(`notifications/${userId}`);
  instanceRef.set(data)
  return instanceRef;
}

export async function getLoggedInUser(data) {
  const userId = firebase.auth().currentUser.uid;
  return userId;
}
