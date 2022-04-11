import Koa from 'koa';

import json from 'koa-json';
import cors from '@koa/cors';
import bodyparser from 'koa-bodyparser';
import router from './routes';
import { accessLog } from './middleware/access-log';
import { errors } from './errors/middleware';

const app = new Koa();

app.use(cors());
app.use(accessLog());
app.use(json());
app.use(errors());
app.use(bodyparser());

app.use(router.routes()).use(router.allowedMethods());

export default app;