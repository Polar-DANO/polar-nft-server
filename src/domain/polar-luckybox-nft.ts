import { BigNumber } from 'ethers';
import config from 'src/config';
import { MinPrices, polarLuckyboxContract } from 'src/services/nft-gateway';
import { ERC721Metadata } from './erc721-metadata';
import { getMarketplaceMinPrices } from './min-prices';

export interface PolarLuckyboxNft {
  type: string;
  attribute: string;
  owner: string;
  minPrices: MinPrices;
}

export async function getPolarLuckyboxNftByTokenId(
  tokenId: BigNumber,
): Promise<PolarLuckyboxNft | null> {
  const owner = await (async () => {
    try {
      return await polarLuckyboxContract.ownerOf(tokenId);
    } catch (err: any) {
      if (err?.message?.includes('owner query for nonexistent token')) {
        return null;
      }

      throw err;
    }
  })();

  if (!owner) {
    return null;
  }

  const type = await polarLuckyboxContract.tokenIdsToType(tokenId);

  return {
    type,
    attribute: await polarLuckyboxContract.getAttribute(tokenId),
    minPrices: (await getMarketplaceMinPrices(config.addresses.luckyboxNft))[
      type
    ],
    owner,
  };
}

export async function getPolarLuckyboxNftMetadata(
  tokenId: BigNumber,
): Promise<ERC721Metadata | null> {
  const nft = await getPolarLuckyboxNftByTokenId(tokenId);
  if (!nft) {
    return null;
  }

  const { type, attribute } = nft;
  const name = `${type} ${attribute}`.trim();
  const description = `${name} by Polar`;
  const image =
    config.images.luckybox.get(name) ?? config.images.luckybox.get('$default');
  const video =
    config.videos.luckybox.get(name) ?? config.videos.luckybox.get('$default');

  if (!image || !video) {
    throw new Error(`Luckybox $default missing in configuration`);
  }

  return {
    name,
    description,
    image: image.toJSON(),
    animation_url: video.toJSON(),
    attributes: [
      { trait_type: 'Attribute', value: attribute || 'None' },
      {
        trait_type: 'Min Offer Price',
        value: nft.minPrices.offerPrice.toString(),
      },
      {
        trait_type: 'Min Auction Price',
        value: nft.minPrices.auctionPrice.toString(),
      },
    ],
    external_link: 'https://polarnodes.finance/',
  };
}
