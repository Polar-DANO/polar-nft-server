import { BigNumber } from 'ethers';
import Router from 'koa-router';
import node from './handlers/node';
import luckybox from './handlers/luckybox';

export interface State {
  tokenId?: BigNumber;
}

const router = new Router<State>();

router
  .param('tokenId', async (tokenId, ctx, next) => {
    try {
      ctx.state.tokenId = BigNumber.from(tokenId);
    } catch {
      return ctx.throw(400, 'tokenId must be a properly formatted BigNumber');
    }

    await next();
  })
  .get('/node/:tokenId', node)
  .get('/luckybox/:tokenId', luckybox);

export default router;
