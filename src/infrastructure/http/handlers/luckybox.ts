import { Middleware } from 'koa';
import { getPolarLuckyboxNftMetadata } from 'src/domain/polar-luckybox-nft';
import { State } from '../routes';

const node: Middleware<State> = async (ctx) => {
  const { tokenId } = ctx.state;
  if (!tokenId) {
    return ctx.throw(400, 'tokenId is required');
  }

  const metadata = await getPolarLuckyboxNftMetadata(tokenId);
  if (!metadata) {
    return ctx.throw(404, 'tokenId not found');
  }

  ctx.body = metadata;
};

export default node;
