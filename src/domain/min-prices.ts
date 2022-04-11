import { marketplaceContract, MinPrices } from 'src/services/nft-gateway';

export async function getMarketplaceMinPrices(
  nftAddress: string,
): Promise<Record<string, MinPrices>> {
  const size = await marketplaceContract.getPricesOfSize(nftAddress);

  const keys = await marketplaceContract.getPricesOfKeysBetweenIndexes(
    nftAddress,
    0,
    size,
  );

  const values = await marketplaceContract.getPricesOfBetweenIndexes(
    nftAddress,
    0,
    size,
  );

  if (keys.length !== values.length) {
    throw new Error(
      `Marketplace contract returned different number of keys and values`,
    );
  }

  return Object.fromEntries(
    keys.map((key, index) => {
      return [key, values[index]];
    }),
  );
}
