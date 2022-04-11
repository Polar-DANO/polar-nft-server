import { BigNumber } from 'ethers';
import config from 'src/config';
import {
  MinPrices,
  Node,
  nodeTypeContractByName,
  polarNodeContract,
} from 'src/services/nft-gateway';
import { ERC721Metadata } from './erc721-metadata';
import { getMarketplaceMinPrices } from './min-prices';

export async function getPolarNodeNftByTokenId(tokenId: BigNumber): Promise<
  | (Node & {
      nodeType: string;
      pendingRewards: BigNumber;
      minPrices: MinPrices;
    })
  | null
> {
  const nodeType = await polarNodeContract.tokenIdsToType(tokenId);
  if (!nodeType) {
    return null;
  }
  const node = await nodeTypeContractByName(nodeType).getNodeFromTokenId(
    tokenId,
  );

  return {
    nodeType,
    pendingRewards: (
      await nodeTypeContractByName(nodeType).calculateUserRewardsBatch(
        node.owner,
        [tokenId],
      )
    )[0][0],
    minPrices: (await getMarketplaceMinPrices(config.addresses.nodeNft))[
      nodeType
    ],
    ...node,
  };
}

export async function getPolarNodeNftMetadata(
  tokenId: BigNumber,
): Promise<ERC721Metadata | null> {
  const nft = await getPolarNodeNftByTokenId(tokenId);
  if (!nft) {
    return null;
  }

  const { nodeType, feature } = nft;
  const name = `${nodeType} ${feature}`.trim();
  const description = `${name} by Polar`;
  const image =
    config.images.node.get(name) ?? config.images.node.get(nodeType);
  const video =
    config.videos.node.get(name) ?? config.videos.node.get(nodeType);

  if (!image || !video) {
    throw new Error(`Node Type ${nodeType} missing in configuration`);
  }

  return {
    name,
    description,
    image: image.toJSON(),
    animation_url: video.toJSON(),
    attributes: [
      { trait_type: 'Feature', value: feature || 'None' },
      { trait_type: 'Creation Time', value: nft.creationTime.toNumber() },
      { trait_type: 'Last Claim Time', value: nft.lastClaimTime.toNumber() },
      { trait_type: 'Obtaining Time', value: nft.obtainingTime.toNumber() },
      { trait_type: 'Boosted Token', value: nft.isBoostedToken },
      { trait_type: 'Boosted Rewards', value: nft.isBoostedNft },
      {
        trait_type: 'Boosted Air Drop Rate',
        value: nft.isBoostedAirDropRate.toString(),
      },
      {
        trait_type: 'Pending Rewards',
        value: nft.pendingRewards.toString(),
      },
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
