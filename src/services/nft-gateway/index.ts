import { BigNumber, Contract, ContractFunction, ethers } from 'ethers';
import config from 'src/config';

import { abi as POLAR_NODE_ABI } from './abi/PolarNode.json';
import { abi as POLAR_LUCKYBOX_ABI } from './abi/PolarLuckyBox.json';
import { abi as NODE_TYPE_ABI } from './abi/NodeType.json';
import { abi as MARKETPLACE_ABI } from './abi/PolarMarketPlace.json';

export const provider = ((rpc) => {
  switch (rpc.type) {
    case 'jsonRpc':
      return new ethers.providers.JsonRpcProvider(rpc.url.toString());
    case 'ws':
      return new ethers.providers.WebSocketProvider(rpc.url.toString());
    default:
      throw new Error(`Unknown RPC type: ${rpc.type}`);
  }
})(config.avaxRpc);

type PolarNftContractType = Contract & {
  tokenIdsToType: ContractFunction<string>;
  getAttribute: ContractFunction<string>;
  ownerOf: ContractFunction<string>;
};

export const polarNodeContract = new ethers.Contract(
  config.addresses.nodeNft,
  POLAR_NODE_ABI,
  provider,
) as PolarNftContractType;

export const polarLuckyboxContract = new ethers.Contract(
  config.addresses.luckyboxNft,
  POLAR_LUCKYBOX_ABI,
  provider,
) as PolarNftContractType;

export interface Node {
  owner: string;
  creationTime: BigNumber;
  lastClaimTime: BigNumber;
  obtainingTime: BigNumber;
  isBoostedAirDropRate: BigNumber;
  isBoostedNft: boolean;
  isBoostedToken: boolean;
  feature: string;
}

export function nodeTypeContractByName(name: string) {
  const address = config.addresses.nodeTypes.get(name);
  if (!address) {
    throw new Error(`Node type ${name} not found in configuration`);
  }

  return new ethers.Contract(address, NODE_TYPE_ABI, provider) as Contract & {
    getNodeFromTokenId: ContractFunction<Node>;
    calculateUserRewardsBatch: ContractFunction<[BigNumber[], BigNumber[]]>;
  };
}

export interface MinPrices {
  offerPrice: BigNumber;
  auctionPrice: BigNumber;
}

export const marketplaceContract = new ethers.Contract(
  config.addresses.marketplace,
  MARKETPLACE_ABI,
  provider,
) as Contract & {
  getPricesOfSize: ContractFunction<BigNumber>;
  getPricesOfKeysBetweenIndexes: ContractFunction<string[]>;
  getPricesOfBetweenIndexes: ContractFunction<MinPrices[]>;
};
