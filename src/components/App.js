import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { HashRouter, Routes, Route } from 'react-router-dom'
import { Container } from 'react-bootstrap'
import { ethers } from 'ethers'

import Button from 'react-bootstrap/Button' 
import Card from 'react-bootstrap/Card' 
import Collapse from 'react-bootstrap/Collapse' 

import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import dappIcon from '../dapp-swap.png';
import appleIcon from '../apple.jpeg';

// Components
import Navigation from './Navigation';
import Tabs from './Tabs';
import Swap from './Swap';
import Deposit from './Deposit';
import Withdraw from './Withdraw';

// import Deposit from './Deposit';
// import Withdraw from './Withdraw';
import Charts from './Charts';

// ABIs: Import your contract ABIs here
import AMM_ABI from '../abis/AMM.json'
import TOKEN_ABI from '../abis/Token.json'

// Config: Import your network config here
import config from '../config.json';


import {
  loadProvider,
  loadBalances,
  loadBalances1,
  loadNetwork,
  loadAccount,
  loadTokens,
  loadAMM,
  loadApple
} from '../store/interactions'

function App() {

  const [open, setOpen] = useState(false);
  const [open1, setOpen1] = useState(false);

  const [dappswap, setDappSwap] = useState(null)
  const [appleswap, setAppleSwap] = useState(null)
  const [usd, setUSD] = useState(null)
  const [dapp, setDapp] = useState(null)

  const [dappAMM, setDappAMM] = useState(null)
  const [appleAMM, setAppleAMM] = useState(null)

  const [usdBalance, setUSDBalance] = useState(0)
  const [dappBalance, setDappBalance] = useState(0)
  const [price1, setPrice1] = useState(0)

  const [usdBalance1, setUSDBalance1] = useState(0)
  const [dappBalance1, setDappBalance1] = useState(0)
  const [price2, setPrice2] = useState(0)

  const [isLoading, setIsLoading] = useState(true)

  const token1 = useSelector(state => state.amm.token1)
  const token2 = useSelector(state => state.amm.token2)
  const token3 = useSelector(state => state.amm.token3)

  const token4 = useSelector(state => state.amm.token4)
  const token5 = useSelector(state => state.amm.token5)

  // const tokenA = useSelector(state => state.appleswap.token1)
  
  const chainId = useSelector(state => state.provider.chainId)
  const account = useSelector(state => state.provider.account)
  const tokens = useSelector(state => state.tokens.contracts)

  const dispatch = useDispatch()


  const loadBlockchainData = async () => {

    // Initiate provider
    const provider = await loadProvider(dispatch)

    // Fetch current network's chainId (e.g. hardhat: 31337, kovan: 42)
    const chainId = await loadNetwork(provider, dispatch)

    // Reload page when network changes
    window.ethereum.on('chainChanged', () => {
      window.location.reload()
    })

    // Fetch current account from Metamask when changed
    window.ethereum.on('accountsChanged', async () => {
      await loadAccount(dispatch)
    })

    // Initiate contracts - Redux
    await loadTokens(provider, chainId, dispatch)
    await loadAMM(provider, chainId, dispatch)
    // await loadApple(provider, chainId, dispatch)

    // Initiate contracts - React
    const dappswap = new ethers.Contract(config[31337].dappswap.address, AMM_ABI, provider)
    setDappSwap(dappswap)

    const appleswap = new ethers.Contract(config[31337].appleswap.address, AMM_ABI, provider)
    setAppleSwap(appleswap)

    // Initiate contracts
    let usd = new ethers.Contract(config[31337].usd.address, TOKEN_ABI, provider)
    setUSD(usd)

    let dapp = new ethers.Contract(config[31337].dapp.address, TOKEN_ABI, provider)
    setDapp(dapp)

    // Retrieve Balances

    let dappBalance = await dapp.balanceOf(appleswap.address)
    dappBalance = ethers.utils.formatUnits(dappBalance, 18)
    setDappBalance(dappBalance)

    let usdBalance = await usd.balanceOf(appleswap.address)
    usdBalance = ethers.utils.formatUnits(usdBalance, 18)
    setUSDBalance(usdBalance)

    let price1 = usdBalance / dappBalance
    setPrice1(price1)

    let dappBalance1 = await dapp.balanceOf(dappswap.address)
    dappBalance1 = ethers.utils.formatUnits(dappBalance1, 18)
    setDappBalance1(dappBalance1)

    let usdBalance1 = await usd.balanceOf(dappswap.address)
    usdBalance1 = ethers.utils.formatUnits(usdBalance1, 18)
    setUSDBalance1(usdBalance1)

    let price2 = usdBalance1 / dappBalance1
    setPrice2(price2)

    setDappAMM('0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0')
    setAppleAMM('0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9')

  }


  useEffect(() => {
    loadBlockchainData()
  }, []);

  return(
    <Container>

    <style>{'body { background-color: rgb(20, 240, 120); opacity: 0.9; }'}</style>

      <HashRouter>

        <Navigation />

    <>
 <p>     
      <img
        alt="dappswap"
        src={dappIcon}
        width="60"
        height="60"
        className="align-right mx-3"
        />
  </p>
      <Button
        onClick={() => setOpen(!open)}
        aria-controls="example-collapse-text"
        aria-expanded={open}
      >
        Liquidity 
      </Button>
      <div style={{ minHeight: '100px' }}>
        <Collapse in={open} dimension="width">
          <div id="example-collapse-text">
            <Card body style={{ width: '300px' }}>
            <h6>DAPP Liquidity: {parseFloat(token1).toFixed(2)}</h6>
            <h6>USD Liquidity: {parseFloat(token2).toFixed(2)}</h6>
            </Card>
          </div>
        </Collapse>
      </div>
    </>

    <>
 <p>     
      <img
        alt="appleswap"
        src={appleIcon}
        width="60"
        height="60"
        className="align-right mx-3"
        />
  </p>
      <Button
        onClick={() => setOpen1(!open1)}
        aria-controls="example-collapse-text"
        aria-expanded={open1}
      >
        Liquidity 
      </Button>
      <div style={{ minHeight: '100px' }}>
        <Collapse in={open1} dimension="width">
          <div id="example-collapse-text">
            <Card body style={{ width: '300px' }}>
            <h6>AppleSwap Liquidity: {parseFloat(token2).toFixed(2)}</h6>
            </Card>
          </div>
        </Collapse>
      </div>
    </>

        <hr />

<Col>
        <h6 className='my-4 text-left'>Total DAPP on Aggregator: <strong>{parseFloat(token1).toFixed(2)}</strong> tokens</h6>
        <h6 className='my-4 text-left'>Total USD on Aggregator: <strong>{parseFloat(token2).toFixed(2)}</strong> tokens</h6>
</Col>
<Col>
        <h6 className='my-4 text-left text-danger'>Total DAPP on AppleSwap: <strong>{parseFloat(dappBalance).toFixed(2)}</strong> tokens</h6>
        <h6 className='my-4 text-left text-danger'>Total USD on AppleSwap: <strong>{parseFloat(usdBalance).toFixed(2)}</strong> tokens</h6>
        <h6 className='my-4 text-left text-danger'>DAPP/USD price on AppleSwap: <strong>{parseFloat(price1).toFixed(2)}</strong></h6>
</Col>
<Col>
        <h6 className='my-4 text-left text-primary'>Total DAPP on DappSwap: <strong>{parseFloat(dappBalance1).toFixed(2)}</strong> tokens</h6>
        <h6 className='my-4 text-left text-primary'>Total USD on DappSwap: <strong>{parseFloat(usdBalance1).toFixed(2)}</strong> tokens</h6>
        <h6 className='my-4 text-left text-primary'>DAPP/USD price on DappSwap: <strong>{parseFloat(price2).toFixed(2)}</strong></h6>
</Col>
        <Tabs />

        <Routes>
          <Route exact path="/" element={<Swap price1={price1} price2={price2} chainId={chainId}/>} />
          <Route path="/deposit" element={<Deposit />} />
          <Route path="/withdraw" element={<Withdraw />} />
          <Route path="/charts" element={<Charts />} />
        </Routes>

        <h3 className='my-4 text-center '>Participating Exchanges:</h3>
 
        <h6 className='my-4 text-center p-3 mb-2 bg-danger bg-gradient rounded-5 text-white'>       

        <img
        alt="dappswap"
        src={dappIcon}
        width="40"
        height="40"
        className="align-right mx-3"
        />

        DApp Swap: <strong>{dappAMM}</strong></h6> 

         
        <h6 className='my-4 text-center p-3 mb-2 bg-danger bg-gradient rounded-5 text-white'>

        <img
        alt="appleswap"
        src={appleIcon}
        width="40"
        height="40"
        className="align-right mx-3"
        />

        Apple Swap: <strong>{appleAMM}</strong></h6>

      </HashRouter>

    </Container>
  )
}

export default App;
