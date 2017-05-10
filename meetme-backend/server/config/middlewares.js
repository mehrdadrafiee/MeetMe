import bodyParser from 'body-parser';
import morgan from 'morgan';
import expressValidator from 'express-validator';

export default app => {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(expressValidator());
  app.use(morgan('dev'));
};
