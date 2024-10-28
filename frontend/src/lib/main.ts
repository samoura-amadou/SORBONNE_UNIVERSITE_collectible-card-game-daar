import { ethers } from 'ethers'
import * as ethereum from './ethereum'
import { contracts } from '@/contracts.json'
<<<<<<< HEAD
import type { Main } from '$/src/Main'
export type { Main } from '$/src/Main'
=======
import type { Main } from '$/Main'
import type { MyShip } from '$/Ship.sol'
export type { Main } from '$/Main'
>>>>>>> 72a3962 (First commit)

export const correctChain = () => {
  return 31337
}

export const init = async (details: ethereum.Details) => {
  const { provider, signer } = details
  const network = await provider.getNetwork()
  if (correctChain() !== network.chainId) {
    console.error('Please switch to HardHat')
    return null
  }
  const { address, abi } = contracts.Main
  const contract = new ethers.Contract(address, abi, provider)
  const deployed = await contract.deployed()
  if (!deployed) return null
  const contract_ = signer ? contract.connect(signer) : contract
  return contract_ as any as Main
}

<<<<<<< HEAD

export const myShip = () => contracts.Main.address
=======
export const myShip = () => contracts.MyShip.address
>>>>>>> 72a3962 (First commit)
