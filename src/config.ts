import dotenv from 'dotenv';
import {
  mapping,
  url,
  object,
  regex,
  number,
  string,
  optional,
  oneOf,
} from 'decoders';
import { readFileSync } from 'fs';
dotenv.config();

const evmAddress = regex(/^0x[0-9a-fA-F]{40}$/, 'Must be an EVM address');
const config = object({
  httpPort: number,
  httpHost: string,
  environment: optional(string, 'development'),
  avaxRpc: object({
    type: oneOf(['jsonRpc', 'ws']),
    url: url,
  }),
  addresses: object({
    nodeNft: evmAddress,
    luckyboxNft: evmAddress,
    marketplace: evmAddress,
    nodeTypes: mapping(evmAddress),
  }),
  images: object({
    node: mapping(url),
    luckybox: mapping(url),
  }),
  videos: object({
    node: mapping(url),
    luckybox: mapping(url),
  }),
});

export default config.verify({
  httpPort: Number(process.env.HTTP_PORT) || 8080,
  httpHost: process.env.HTTP_HOST || '0.0.0.0',
  environment: process.env.NODE_ENV || 'development',
  avaxRpc: {
    type: 'jsonRpc',
    url: process.env.JSON_RPC_URL as string,
  },
  ...JSON.parse(
    readFileSync(
      process.env.POLAR_CONFIG_FILE_PATH ?? './config/polar.json',
      'utf8',
    ),
  ),
});
