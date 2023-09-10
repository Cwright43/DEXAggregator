import { ethers } from 'ethers'

import {
  setProvider,
  setNetwork,
  setAccount
} from './reducers/provider'

import {
  setContracts,
  setSymbols,
  balancesLoaded
} from './reducers/tokens'

import {
  setContract,
  setContract1,
  sharesLoaded,
  token1Loaded,
  token2Loaded,
  token3Loaded,
  token4Loaded,
  token5Loaded,
  swapsLoaded,
  swapRequest,
  swapSuccess,
  swapFail
} from './reducers/amm'

import TOKEN_ABI from '../abis/Token.json';
import AMM_ABI from '../abis/AMM.json';
import AGGREGATOR_ABI from '../abis/Aggregator.json';
import config from '../config.json';

export const loadProvider = (dispatch) => {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  dispatch(setProvider(provider))

  return provider
}

export const loadNetwork = async (provider, dispatch) => {
  const { chainId } = await provider.getNetwork()
  dispatch(setNetwork(chainId))

  return chainId
}

export const loadAccount = async (dispatch) => {
  const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
  const account = ethers.utils.getAddress(accounts[0])
  dispatch(setAccount(account))

  return account
}

// ------------------------------------------------------------------------------
// LOAD CONTRACTS
export const loadTokens = async (provider, chainId, dispatch) => {
  const dapp = new ethers.Contract(config[chainId].dapp.address, TOKEN_ABI, provider)
  const usd = new ethers.Contract(config[chainId].usd.address, TOKEN_ABI, provider)

  dispatch(setContracts([dapp, usd]))
  dispatch(setSymbols([await dapp.symbol(), await usd.symbol()]))
}

export const loadAMM = async (provider, chainId, dispatch) => {

  const amm = new ethers.Contract(config[chainId].amm.address, AMM_ABI, provider)

  dispatch(setContract(amm))

  return amm

}

  

export const loadApple = async (provider, chainId, dispatch) => {

  const appleswap = new ethers.Contract(config[chainId].appleswap.address, AMM_ABI, provider)

  dispatch(setContract1(appleswap))

  return appleswap

}


// ------------------------------------------------------------------------------
// LOAD BALANCES & SHARES
export const loadBalances = async (_amm, tokens, account, dispatch) => {
  const balance1 = await tokens[0].balanceOf(account)
  const balance2 = await tokens[1].balanceOf(account)

  dispatch(balancesLoaded([
    ethers.utils.formatUnits(balance1.toString(), 'ether'),
    ethers.utils.formatUnits(balance2.toString(), 'ether')
  ]))

  const shares = await _amm.shares(account)
  dispatch(sharesLoaded(ethers.utils.formatUnits(shares.toString(), 'ether')))

  const token1 = await _amm.token1Balance()
  dispatch(token1Loaded(ethers.utils.formatUnits(token1.toString(), 'ether')))

  const token2 = await _amm.token2Balance()
  dispatch(token2Loaded(ethers.utils.formatUnits(token2.toString(), 'ether')))

  const token3 = await _amm.K()
  dispatch(token3Loaded(ethers.utils.formatUnits(token3.toString(), 'ether')))

}


// ------------------------------------------------------------------------------
// SWAP

export const swap = async (provider, _amm, token, symbol, amount, dispatch) => {
  try {

    dispatch(swapRequest())

    let transaction

    const signer = await provider.getSigner()

    transaction = await token.connect(signer).approve(_amm.address, amount)
    await transaction.wait()

    if (symbol === "DAPP") {
      transaction = await _amm.connect(signer).swapToken1(amount)
    } else {
      transaction = await _amm.connect(signer).swapToken2(amount)
    }

    await transaction.wait()

    // Tell redux that the swap has finished - MISSION COMPLETE

    dispatch(swapSuccess(transaction.hash))

  } catch (error) {
    dispatch(swapFail())
  }
}


// ------------------------------------------------------------------------------
// LOAD ALL SWAPS

export const loadAllSwaps = async (provider, _amm, dispatch) => {
  const block = await provider.getBlockNumber()

  const swapStream = await _amm.queryFilter('Swap', 0, block)
  const swaps = swapStream.map(event => {
    return { hash: event.transactionHash, args: event.args }
  })

  dispatch(swapsLoaded(swaps))
}
