import Push from './model';
import { Meetup } from '../meetups';
import util from 'util';
import Expo from 'exponent-server-sdk';
import Q from 'q';
let expo = new Expo();

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
  const pushList = [];
  const tokenNumber = req.body.token.length;
  for (let i = 0; i < tokenNumber; i++){
    pushList.push(sendPushNotification({ token: req.body.token[i], body: req.body }));
  }
  const response = await Q.all(pushList);
  return res.json(response);
}

export const registerDevice = async (req, res) => {

}

export const sendPushNotification = async (data) => {
  console.log(data);
  const receipts = await expo.sendPushNotificationsAsync([{
      to: 'ExponentPushToken[mkfvWDE8xm4vC9kdy9LJYv]',
      sound: 'default',
      badge: 1,
      body: data.body.type === 'Invitation' ? 'You have been invited for hangout in Yelpify' : 'Default message',
      data: data.body
  }]);
  console.log('receipts', receipts);
  return receipts;
}
