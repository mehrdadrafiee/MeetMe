import { Permissions, Notifications } from 'expo';
import { GooglePlacesAPI } from '../config';
import  { AsyncStorage } from 'react-native';

const api = `https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyCfua3xcDexrf74snFHczxbd3S6RtpPHbU`
const nearbysearchUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?radius=500&type=restaurant&key=${GooglePlacesAPI}`

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

export async function HTTP(endpoint, verb, data){
  let params = {
    method: verb,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  }
  if (verb === 'POST'){
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
  let endpoint = getEndPoints('push/register');
  // post  token to our backend so we can use it to send pushes
  const response = await HTTP(endpoint, 'POST', { token });
  return response;
}

export async function sendPushNotification(token) {
  let endpoint = getEndPoints('push/send');
  const response = await HTTP(endpoint, 'POST', { token });
  return response;
}

export async function registerDevice(){

}
