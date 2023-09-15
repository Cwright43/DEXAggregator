const { ethers } = require('ethers')
const axios = require('axios')

require('dotenv').config()

const provider = new ethers.providers.getDefaultProvider('http://127.0.0.1:8545/')
const bitcoincAddress = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'
const uniswapAddress = '0xcbcdf9626bc03e24f779434178a73a0b4bad62ed'
const url = `https://api.etherscan.io/api?module=contract&action=getabi&address=${uniswapAddress}&apikeys=`

async function main() {
	const wallet = new ethers.Wallet('0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80')
	const connectedWallet = wallet.connect(provider)


const ERC20ABI = require('./abi.json')
const bitcoincContract = new ethers.Contract(bitcoincAddress, ERC20ABI, provider)
const name = await bitcoincContract.name()

console.log('-----------')
console.log('contract name:', name)
console.log('-----------')

}