import { GooglePlacesAPI } from '../config';

const api = `https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyCfua3xcDexrf74snFHczxbd3S6RtpPHbU`
const nearbysearchUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?radius=500&type=restaurant&key=${GooglePlacesAPI}`

export async function getNearbyResturant(region){
  const response = await fetch(`${nearbysearchUrl}&location=${region.latitude},${region.longitude}`);
  let data = await response.json();
  return data;
}

export async  function getLatLongByAddress(address){
  const response = await fetch(`${api}&address=${address}`);
  let data = await response.json();
  return data;
}
