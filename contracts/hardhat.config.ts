import 'dotenv/config'
import 'hardhat-deploy'
import { HardhatUserConfig } from 'hardhat/config'
import '@nomiclabs/hardhat-ethers'
import '@nomiclabs/hardhat-waffle'
import '@typechain/hardhat'
import 'hardhat-gas-reporter'
import 'hardhat-abi-exporter'
<<<<<<< HEAD
import "hardhat-contract-sizer"
=======
>>>>>>> 72a3962 (First commit)

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more
const config: HardhatUserConfig = {
<<<<<<< HEAD
  solidity: {
    version: '0.8.16',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
=======
  solidity: '0.8.16',
>>>>>>> 72a3962 (First commit)
  paths: {
    deploy: './deploy',
    sources: './src',
  },
  namedAccounts: {
    deployer: { default: 0 },
    admin: { default: 0 },
    second: { default: 1 },
    random: { default: 8 },
  },
  abiExporter: {
    runOnCompile: true,
<<<<<<< HEAD
    path: '../backend/src/abis',
=======
    path: '../frontend/src/abis',
>>>>>>> 72a3962 (First commit)
    clear: true,
    flat: true,
    only: [],
    pretty: true,
  },
  typechain: {
    outDir: '../typechain',
  },
}

export default config
