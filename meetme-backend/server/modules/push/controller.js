import Push from './model';
import { Meetup } from '../meetups';
import util from 'util';
import Expo from 'exponent-server-sdk';

export const addToken = async (req, res) => {
  req.checkBody('token', 'Token required').notEmpty();
  req.getValidationResult().then((result) => {
    if (!result.isEmpty()) {
      return res.status(400).send('There have been validation errors: ' + util.inspect(result.array()));
    } else {
      const token = new Push(req.body);
      token.save((err) => {
        if (!err) {
          return res.json(token);
        }
      })
    }
  })
};

export const send = async (req, res) => {
  // check to see if this is valid expo token
  let token = req.body.token.slice(req.body.token.indexOf('[') + 1, req.body.token.length-1);
  let isPushToken = Expo.isExponentPushToken(token);
  // Create a new Expo SDK client
  let expo = new Expo();
  console.log(req.body.token);

  try {
    let receipts = await expo.sendPushNotificationsAsync([{
      // The push token for the app user to whom you want to send the notification
      to: req.body.token,
      sound: 'default',
      badge: 1,
      body: 'This is a test notification',
      data: {withSome: 'data'},
    }]);
    console.log(receipts);
    return res.json(receipts);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
}

export const registerDevice = async (req, res) => {

}
