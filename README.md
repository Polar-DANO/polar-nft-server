# Polar Finance NFT assets server

## Getting started

1. Clone the repo
2. Run `yarn start:dev`

The server will be reloaded when you make changes to any of the files.
A VS Code debugger configuration is also included.

## Setting up the project

**Environment variables** : 

- `HTTP_HOST`: The hostname to bind to.
- `HTTP_PORT`: The port to listen to.
- `POLAR_CONFIG_FILE_PATH`: The path to the configuration file, defaults to `./config/polar.json`

**The `polar.json` config file**:

- `avaxRpc`:
  - `type`: `"jsonRpc" | "ws"`
  - `url`: The URL on which the selected provider type will be connected.
- `addresses`:
  - `nodeNft`: The `PolarNode` contract address
  - `luckyboxNft`: The `PolarLuckyBox` contract address
  - `marketplace`: The `PolarMarketPlace` contract address
- `images`:
  - `node`: key-value object mapping node type to its image URL
    - `[key]`: The node type
    - `[value]`: The corresponding image URL
  - `luckybox`: key-value object mapping luckybox type to its image URL
    - `[key]`: The luckybox type
    - `[value]`: The corresponding image URL
- `videos`:
  - `node`: key-value object mapping node type to its video URL
    - `[key]`: The node type
    - `[value]`: The corresponding video URL
  - `luckybox`: key-value object mapping luckybox type to its video URL
    - `[key]`: The luckybox type
    - `[value]`: The corresponding video URL