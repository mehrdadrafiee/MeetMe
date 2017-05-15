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
  const receipts = await expo.sendPushNotificationsAsync([{
      to: req.body.token,
      sound: 'default',
      badge: 1,
      body: req.body.type === 'Invitation' ? `You have been invited by ${req.body.username} for hangout in Yelpify` : 'Default message',
      data: req.body
  }]);
  return res.json(receipts);
}

export const registerDevice = async (req, res) => {

}

export const sendPushNotification = async (data) => {
  console.log(data);
  const receipts = await expo.sendPushNotificationsAsync([{
      to: 'ExponentPushToken[HM7fnOC8PCHxcJxTr4NMOn]',
      sound: 'default',
      badge: 1,
      body: data.body.type === 'Invitation' ? 'You have been invited for hangout in Yelpify' : 'Default message',
      data: data.body
  }]);
  console.log('receipts', receipts);
  return receipts;
}
