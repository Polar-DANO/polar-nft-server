import { Middleware } from 'koa';
import { HttpError } from './http-error';

export function errors(): Middleware {
  return async (ctx, next) => {
    try {
      await next();
    } catch (err) {
      if (err instanceof HttpError) {
        ctx.status = err.status;
      } else {
        throw err;
      }
    }
  };
}
