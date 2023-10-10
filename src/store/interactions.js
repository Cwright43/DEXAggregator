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
  sharesLoaded,
  token1Loaded,
  token2Loaded,
  swapsLoaded,
  swapRequest,
  swapSuccess,
  depositRequest,
  depositSuccess,
  depositFail,
  withdrawRequest,
  withdrawSuccess,
  withdrawFail,
  swapFail
} from './reducers/amm'

import TOKEN_ABI from '../abis/Token.json';
import AMM_ABI from '../abis/AMM.json';
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
// Load Tokens - DAPP, USD, APPL
export const loadTokens = async (provider, chainId, dispatch) => {
  const dapp = new ethers.Contract(config[chainId].dapp.address, TOKEN_ABI, provider)
  const usd = new ethers.Contract(config[chainId].usd.address, TOKEN_ABI, provider)

  dispatch(setContracts([dapp, usd]))
  dispatch(setSymbols([await dapp.symbol(), await usd.symbol()]))
}

// Load APPL / USD Token Pair
export const loadAppleUSD = async (provider, chainId, dispatch) => {
  const apple = new ethers.Contract(config[chainId].apple.address, TOKEN_ABI, provider)
  const usd = new ethers.Contract(config[chainId].usd.address, TOKEN_ABI, provider)

  dispatch(setContracts([apple, usd]))
  dispatch(setSymbols([await apple.symbol(), await usd.symbol()]))
}

// Load DAPP / APPL Token Pair
export const loadDappApple = async (provider, chainId, dispatch) => {
  const dapp = new ethers.Contract(config[chainId].dapp.address, TOKEN_ABI, provider)
  const apple = new ethers.Contract(config[chainId].apple.address, TOKEN_ABI, provider)

  dispatch(setContracts([dapp, apple]))
  dispatch(setSymbols([await dapp.symbol(), await apple.symbol()]))
}

// ------------------------------------------------------------------------------
// Load Liquidity Pools
  export const loadAMM = async (provider, chainId, dispatch) => {
    const amm = new ethers.Contract(config[chainId].amm.address, AMM_ABI, provider)
    dispatch(setContract(amm))
    return amm
  }

  // Load Dapp Swap (DAPP / USD) Address
  export const loadDapp = async (provider, chainId, dispatch) => {
    const amm = new ethers.Contract(config[chainId].dappswap.address, AMM_ABI, provider)
    dispatch(setContract(amm))
    return amm
  }

  // Load Dapp Swap (APPL / USD) Address
  export const loadDappAppleUSD = async (provider, chainId, dispatch) => {
    const amm = new ethers.Contract(config[chainId].dappAppleUSD.address, AMM_ABI, provider)
    dispatch(setContract(amm))
    return amm
  }
  // Load Dapp Swap (DAPP / APPL) Address
  export const loadDappDappApple = async (provider, chainId, dispatch) => {
    const amm = new ethers.Contract(config[chainId].dappDappApple.address, AMM_ABI, provider)
    dispatch(setContract(amm))
    return amm
  }

  // Load Apple Swap (DAPP / USD) Address
  export const loadApple = async (provider, chainId, dispatch) => {
    const amm = new ethers.Contract(config[chainId].appleswap.address, AMM_ABI, provider)
    dispatch(setContract(amm))
    return amm
  }

  // Load Apple Swap (APPL / USD) Address
  export const loadAppleAppleUSD = async (provider, chainId, dispatch) => {
    const amm = new ethers.Contract(config[chainId].appleAppleUSD.address, AMM_ABI, provider)
    dispatch(setContract(amm))
    return amm
  }

  // Load Apple Swap (DAPP / APPL) Address
  export const loadAppleDappApple = async (provider, chainId, dispatch) => {
    const amm = new ethers.Contract(config[chainId].appleDappApple.address, AMM_ABI, provider)
    dispatch(setContract(amm))
    return amm
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

}

// ------------------------------------------------------------------------------
// ADD LIQUDITY
export const addLiquidity = async (provider, amm, tokens, amounts, dispatch) => {
  try {
    dispatch(depositRequest())

    const signer = await provider.getSigner()

    let transaction

    transaction = await tokens[0].connect(signer).approve(amm.address, amounts[0])
    await transaction.wait()

    transaction = await tokens[1].connect(signer).approve(amm.address, amounts[1])
    await transaction.wait()

    transaction = await amm.connect(signer).addLiquidity(amounts[0], amounts[1])
    await transaction.wait()

    dispatch(depositSuccess(transaction.hash))
  } catch (error) {
    dispatch(depositFail())
  }
}

// ------------------------------------------------------------------------------
// REMOVE LIQUDITY
export const removeLiquidity = async (provider, amm, shares, dispatch) => {
  try {
    dispatch(withdrawRequest())

    const signer = await provider.getSigner()

    let transaction = await amm.connect(signer).removeLiquidity(shares)
    await transaction.wait()

    dispatch(withdrawSuccess(transaction.hash))
  } catch (error) {
    dispatch(withdrawFail())
  }
}

// ------------------------------------------------------------------------------
// SWAP

export const swap = async (provider, amm, token, inputSymbol, outputSymbol, amount, dispatch) => {
  try {

    dispatch(swapRequest())

    let transaction

    const signer = await provider.getSigner()

    transaction = await token.connect(signer).approve(amm.address, amount)
    await transaction.wait()

    if ((inputSymbol === "DAPP") || (inputSymbol === "APPL" && outputSymbol === "USD")) {
      transaction = await amm.connect(signer).swapToken1(amount)
    } else { 
      transaction = await amm.connect(signer).swapToken2(amount)
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
