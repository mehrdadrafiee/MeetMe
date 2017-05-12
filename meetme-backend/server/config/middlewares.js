import bodyParser from 'body-parser';
import morgan from 'morgan';
import expressValidator from 'express-validator';
import cors from 'cors';

export default app => {
  app.use(cors());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(expressValidator());
  app.use(morgan('dev'));
};
