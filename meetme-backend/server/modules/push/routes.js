import { Router } from 'express';
import * as TokenController from './controller';

const routes = new Router();

routes.post('/push/register', TokenController.addToken);
routes.post('/push/send', TokenController.send);

export default routes;
