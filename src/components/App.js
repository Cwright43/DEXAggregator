import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { HashRouter, Routes, Route } from 'react-router-dom'
import { Container } from 'react-bootstrap'
import { ethers } from 'ethers'

import Button from 'react-bootstrap/Button' 
import Card from 'react-bootstrap/Card' 
import Collapse from 'react-bootstrap/Collapse'
import ListGroup from 'react-bootstrap/ListGroup'

import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import dappIcon from '../dapp-swap.png';
import appleIcon from '../apple.jpeg';
import wethIcon from '../WETH.png';
import daiIcon from '../DAI.png';
import uniswapLogo from '../uniswap.png';
import backgroundimage from '../Background.jpeg';

// Components
import Navigation from './Navigation';
import Tabs from './Tabs';
import Swap from './Swap';
import Deposit from './Deposit';
import Withdraw from './Withdraw';
import Charts from './Charts';

// Token icons
import T1Icon from '../T1-Icon.png';
import T2Icon from '../T2-Icon.jpg';
import T3Icon from '../T3-Icon.jpg';
import TokenPair from '../TokenPair.jpg';
import TokenPair2 from '../TokenPair2.png';
import TokenPair3 from '../TokenPair3.png';

// ABIs: Import your contract ABIs here
import AMM_ABI from '../abis/AMM.json'
import TOKEN_ABI from '../abis/Token.json'

// Config: Import your network config here
import config from '../config.json';

import {
  loadProvider,
  loadNetwork,
  loadAccount,
  loadTokens,
  loadDappDappUSD
} from '../store/interactions'

function App() {

  const routerArtifact = require('@uniswap/v2-periphery/build/UniswapV2Router02.json')
  const erc20Abi = require('../abis/erc20.json')
  const wethAbi = require('../abis/weth.json')

  const [open1, setOpen1] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [open3, setOpen3] = useState(false);
  const [open4, setOpen4] = useState(false);
  const [open5, setOpen5] = useState(false);
  const [open6, setOpen6] = useState(false);

  const [usd, setUSD] = useState(null)
  const [dapp, setDapp] = useState(null)
  const [apple, setApple] = useState(null)
  const [dai, setDAI] = useState(null)
  const [weth, setWETH] = useState(null)
  const [daiWethUniswap, setDaiWethUniswap] = useState(null)
  const [router, setRouter] = useState(null)

  // Assign Active User Account and Signer
  const [account, setAccount] = useState(null)
  const [signer, setSigner] = useState(null)
  const [wallet, setWallet] = useState(null)

  const [dappDappUSD, setDappDappUSD] = useState(null)
  const [appleDappUSD, setAppleDappUSD] = useState(null)
  const [dappAppleUSD, setDappAppleUSD] = useState(null)
  const [appleAppleUSD, setAppleAppleUSD] = useState(null)
  const [dappDappApple, setDappDappApple] = useState(null)
  const [appleDappApple, setAppleDappApple] = useState(null)

  // [1] - (DAPP / USD) pools
  const [dappBalance1, setDappBalance1] = useState(0)
  const [dappBalance2, setDappBalance2] = useState(0)
  const [usdBalance1, setUSDBalance1] = useState(0)
  const [usdBalance2, setUSDBalance2] = useState(0)
  const [price1, setPrice1] = useState(0)
  const [price2, setPrice2] = useState(0)

  // [2] - (APPL / USD) pools
  const [appleBalance1, setAppleBalance1] = useState(0)
  const [appleBalance2, setAppleBalance2] = useState(0)
  const [usdBalance3, setUSDBalance3] = useState(0)
  const [usdBalance4, setUSDBalance4] = useState(0)
  const [price3, setPrice3] = useState(0)
  const [price4, setPrice4] = useState(0)

  // [3] - (DAPP / APPL) pools
  const [dappBalance3, setDappBalance3] = useState(0)
  const [dappBalance4, setDappBalance4] = useState(0)
  const [appleBalance3, setAppleBalance3] = useState(0)
  const [appleBalance4, setAppleBalance4] = useState(0)
  const [price5, setPrice5] = useState(0)
  const [price6, setPrice6] = useState(0)

  // Load DAI/WETH Balances from Mainnet
    const poolDAI = useSelector(state => state.amm.poolDAI)
    const poolWETH = useSelector(state => state.amm.poolWETH)

    const poolDAI1 = useSelector(state => state.amm.poolDAI1)
    const poolWETH1 = useSelector(state => state.amm.poolWETH1)

    const poolDAI2 = useSelector(state => state.amm.poolDAI2)
    const poolWETH2 = useSelector(state => state.amm.poolWETH2)

    const poolDAI3 = useSelector(state => state.amm.poolDAI3)
    const poolWETH3 = useSelector(state => state.amm.poolWETH3)

  // Load User Account Balance Individually for DAPP, APPL, USD, DAI, and WETH
    const [dappAccountBalance, setDappAccountBalance] = useState(0)
    const [usdAccountBalance, setUSDAccountBalance] = useState(0)
    const [appleAccountBalance, setAppleAccountBalance] = useState(0)
    const [daiAccountBalance, setDAIAccountBalance] = useState(0)
    const [wethAccountBalance, setWETHAccountBalance] = useState(0)

  const [isLoading, setIsLoading] = useState(true)

  const dispatch = useDispatch()

  const loadBlockchainData = async () => {

    // Initiate provider
    const provider = await loadProvider(dispatch)

    // Fetch current network's chainId (e.g. hardhat: 31337, kovan: 42)
    const chainId = await loadNetwork(provider, dispatch)

    // Load User Account
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
    const account = ethers.utils.getAddress(accounts[0])
    setAccount(account)

    const wallet = new ethers.Wallet('0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80')
    setWallet(wallet)

    const signer = wallet.connect(provider)
    setSigner(signer)

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
    await loadDappDappUSD(provider, chainId, dispatch)

    // Initiate liquidity pool contracts
    const dappDappUSD = new ethers.Contract(config[1].dappDappUSD.address, AMM_ABI, provider)
    setDappDappUSD(dappDappUSD)

    const appleDappUSD = new ethers.Contract(config[1].appleDappUSD.address, AMM_ABI, provider)
    setAppleDappUSD(appleDappUSD)

    const dappAppleUSD = new ethers.Contract(config[1].dappAppleUSD.address, AMM_ABI, provider)
    setDappAppleUSD(dappAppleUSD)

    const appleAppleUSD = new ethers.Contract(config[1].appleAppleUSD.address, AMM_ABI, provider)
    setAppleAppleUSD(appleAppleUSD)

    const dappDappApple = new ethers.Contract(config[1].dappDappApple.address, AMM_ABI, provider)
    setDappDappApple(dappDappApple)

    const appleDappApple = new ethers.Contract(config[1].appleDappApple.address, AMM_ABI, provider)
    setAppleDappApple(appleDappApple)

    // Load Dapp DAI / WETH Pool Address
    const daiWethUniswap = new ethers.Contract(config[1].daiWethUniswap.address, AMM_ABI, provider)
    setDaiWethUniswap(daiWethUniswap)

  // Load UniswapV2 Router Address
    const router = new ethers.Contract('0x7a250d5630b4cf539739df2c5dacb4c659f2488d', routerArtifact.abi, provider)
    setRouter(router)

    // Initiate Token contracts
    let usd = new ethers.Contract(config[1].usd.address, TOKEN_ABI, provider)
    setUSD(usd)

    let dapp = new ethers.Contract(config[1].dapp.address, TOKEN_ABI, provider)
    setDapp(dapp)

    let apple = new ethers.Contract(config[1].apple.address, TOKEN_ABI, provider)
    setApple(apple)

    let dai = new ethers.Contract(config[1].dai.address, erc20Abi, provider)
    setDAI(dai)

    let weth = new ethers.Contract(config[1].weth.address, wethAbi, provider)
    setWETH(weth)

    // Retrieve User Account Balances
      let dappAccountBalance = await dapp.balanceOf(accounts[0])
      dappAccountBalance = ethers.utils.formatUnits(dappAccountBalance, 18)
      setDappAccountBalance(dappAccountBalance)

      let usdAccountBalance = await usd.balanceOf(accounts[0])
      usdAccountBalance = ethers.utils.formatUnits(usdAccountBalance, 18)
      setUSDAccountBalance(usdAccountBalance)

      let appleAccountBalance = await apple.balanceOf(accounts[0])
      appleAccountBalance = ethers.utils.formatUnits(appleAccountBalance, 18)
      setAppleAccountBalance(appleAccountBalance)

      let daiAccountBalance = await dai.balanceOf(accounts[0])
      daiAccountBalance = ethers.utils.formatUnits(daiAccountBalance, 18)
      setDAIAccountBalance(daiAccountBalance)

      let wethAccountBalance = await weth.balanceOf(accounts[0])
      wethAccountBalance = ethers.utils.formatUnits(wethAccountBalance, 18)
      setWETHAccountBalance(wethAccountBalance)

  // Retrieve All Six (6) Liquidity Pool Balances

    // (DAPP / USD) - Dapp Swap
      let dappBalance1 = await dapp.balanceOf(dappDappUSD.address)
      dappBalance1 = ethers.utils.formatUnits(dappBalance1, 18)
      setDappBalance1(dappBalance1)

      let usdBalance1 = await usd.balanceOf(dappDappUSD.address)
      usdBalance1 = ethers.utils.formatUnits(usdBalance1, 18)
      setUSDBalance1(usdBalance1)

      let price1 = usdBalance1 / dappBalance1
      setPrice1(price1)

    // (DAPP / USD) - Apple Swap
      let dappBalance2 = await dapp.balanceOf(appleDappUSD.address)
      dappBalance2 = ethers.utils.formatUnits(dappBalance2, 18)
      setDappBalance2(dappBalance2)

      let usdBalance2 = await usd.balanceOf(appleDappUSD.address)
      usdBalance2 = ethers.utils.formatUnits(usdBalance2, 18)
      setUSDBalance2(usdBalance2)

      let price2 = usdBalance2 / dappBalance2
      setPrice2(price2)

  // (APPL / USD) - Dapp Swap
      let appleBalance1 = await apple.balanceOf(dappAppleUSD.address)
      appleBalance1 = ethers.utils.formatUnits(appleBalance1, 18)
      setAppleBalance1(appleBalance1)

      let usdBalance3 = await usd.balanceOf(dappAppleUSD.address)
      usdBalance3 = ethers.utils.formatUnits(usdBalance3, 18)
      setUSDBalance3(usdBalance3)

      let price3 = usdBalance3 / appleBalance1
      setPrice3(price3)
  
  // (APPL / USD) - Apple Swap
      let appleBalance2 = await apple.balanceOf(appleAppleUSD.address)
      appleBalance2 = ethers.utils.formatUnits(appleBalance2, 18)
      setAppleBalance2(appleBalance2)

      let usdBalance4 = await usd.balanceOf(appleAppleUSD.address)
      usdBalance4 = ethers.utils.formatUnits(usdBalance4, 18)
      setUSDBalance4(usdBalance4)

      let price4 = usdBalance4 / appleBalance2
      setPrice4(price4)

    // (DAPP / APPL) - Dapp Swap
      let dappBalance3 = await dapp.balanceOf(dappDappApple.address)
      dappBalance3 = ethers.utils.formatUnits(dappBalance3, 18)
      setDappBalance3(dappBalance3)

      let appleBalance3 = await apple.balanceOf(dappDappApple.address)
      appleBalance3 = ethers.utils.formatUnits(appleBalance3, 18)
      setAppleBalance3(appleBalance3)

      let price5 = appleBalance3 / dappBalance3
      setPrice5(price5)

    // (DAPP / APPL) - Apple Swap
      let dappBalance4 = await dapp.balanceOf(appleDappApple.address)
      dappBalance4 = ethers.utils.formatUnits(dappBalance4, 18)
      setDappBalance4(dappBalance4)

      let appleBalance4 = await apple.balanceOf(appleDappApple.address)
      appleBalance4 = ethers.utils.formatUnits(appleBalance4, 18)
      setAppleBalance4(appleBalance4)

      let price6 = appleBalance4 / dappBalance4
      setPrice6(price6)
  }

  useEffect(() => {
    loadBlockchainData()
  }, []);

  return(

<div  style={{
      backgroundImage: `url(${backgroundimage})`,
      backgroundPosition: 'center',
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      width: '100vw',
      height: '100vh'
      }}>
    <Container>
  
    <style>{'body { background-color: rgb(20, 240, 120); opacity: 1; }'}</style>

      <HashRouter>
        <Navigation />
<Row>
  <Col>
  <h4 className="text-center text-white">Uniswap Balances</h4>
  <h5 className="text-center text-white">Total DAI in DAI / WETH: {parseFloat(poolDAI).toFixed(2)}</h5>
  <h5 className="text-center text-white">Total WETH in DAI / WETH: {parseFloat(poolWETH).toFixed(2)}</h5>
  <h5 className="text-center text-white">Total DAI in WETH / DAI: {parseFloat(poolDAI1).toFixed(2)}</h5>
  <h5 className="text-center text-white">Total WETH in WETH / DAI: {parseFloat(poolWETH1).toFixed(2)}</h5>
  </Col>
  <Col>
  <h4 className="text-center text-warning">Sushiswap Balances</h4>
  <h5 className="text-center text-warning">Total DAI in DAI / WETH: {parseFloat(poolDAI2).toFixed(2)}</h5>
  <h5 className="text-center text-warning">Total WETH in DAI / WETH: {parseFloat(poolWETH2).toFixed(2)}</h5>
  <h5 className="text-center text-warning">Total DAI in WETH / DAI: {parseFloat(poolDAI3).toFixed(2)}</h5>
  <h5 className="text-center text-warning">Total WETH in WETH / DAI: {parseFloat(poolWETH3).toFixed(2)}</h5>
  </Col>
</Row>
<Row>
  <Col>

    <>
 <h6 className='bg-gradient rounded-5 text-white { opacity: 0.1 }' style={{ width: '660px', color: 'white', textAlign: 'center'}}>
      <img
        alt="dappswap"
        src={dappIcon}
        width="60"
        height="60"
        className="align-right mx-3 img-fluid hover-overlay text-center"
        /> Dapp Swap
  </h6>
  <Row>
    <Col>
      <Button
        onClick={() => setOpen1(!open1)}
        aria-controls="example-collapse-text"
        aria-expanded={open1}
        className='my-4'
      >
        (1) DAPP / USD 
      </Button>
      <div style={{ minHeight: '100px', textAlign: 'left'}}>
        <Collapse in={open1} dimension="width">
          <div id="example-collapse-text">
            <Card body style={{ width: '275px', backgroundColor: 'cyan' }}>
          <ListGroup>
            <ListGroup.Item className='bg-warning bg-gradient bg-opacity-25'>
          <h6 className='my-1'>
              <img
                alt="dapptoken"
                src={dappIcon}
                width="40"
                height="40"
                className="align-right mx-3 img-fluid"
                />
          <strong>{parseFloat(dappBalance1).toFixed(2)} DAPP</strong></h6>
            </ListGroup.Item>
            <ListGroup.Item className='bg-warning bg-gradient bg-opacity-25'>
          <h6 className='my-1'>
              <img
                alt="USDtoken"
                src={T2Icon}
                width="40"
                height="40"
                className="align-right mx-3 img-fluid rounded-circle"
                />
          <strong>{parseFloat(usdBalance1).toFixed(2)} USD</strong></h6>
            </ListGroup.Item>
            <ListGroup.Item className='bg-warning bg-gradient bg-opacity-25'>
          <h6 className='my-1'>
                          <img
                alt="dapp/usd-pair"
                src={TokenPair}
                width="70"
                height="40"
                className="align-right mx-3 img-fluid rounded"
                />
          <strong>Rate: {parseFloat(price1).toFixed(2)}</strong></h6>
            </ListGroup.Item>
         </ListGroup> 
            </Card>
         
          </div>
        </Collapse>
      </div>
    </Col>
    <Col>
      <Button
        onClick={() => setOpen2(!open2)}
        aria-controls="example-collapse-text"
        aria-expanded={open2}
        className='my-4'
      >
        (2) APPL / USD 
      </Button>
      <div style={{ minHeight: '100px', textAlign: 'left'}}>
        <Collapse in={open2} dimension="width">
          <div id="example-collapse-text">
            <Card body style={{ width: '275px', backgroundColor: 'cyan' }}>
          <ListGroup>
            <ListGroup.Item className='bg-warning bg-gradient bg-opacity-25'>
          <h6 className='my-1'>
                          <img
                alt="appltoken"
                src={T3Icon}
                width="40"
                height="40"
                className="align-right mx-3 img-fluid rounded-circle"
                />
          <strong>{parseFloat(appleBalance1).toFixed(2)} APPL</strong></h6>
            </ListGroup.Item>
            <ListGroup.Item className='bg-warning bg-gradient bg-opacity-25'>
          <h6 className='my-1'>
                          <img
                alt="usdtoken"
                src={T2Icon}
                width="40"
                height="40"
                className="align-right mx-3 img-fluid rounded-circle"
                />
          <strong>{parseFloat(usdBalance3).toFixed(2)} USD</strong></h6>
            </ListGroup.Item>
            <ListGroup.Item className='bg-warning bg-gradient bg-opacity-25'>
          <h6 className='my-1'>
                          <img
                alt="appl/usd-pair"
                src={TokenPair2}
                width="70"
                height="40"
                className="align-right mx-3 img-fluid rounded"
                />
          <strong>Rate: {parseFloat(price3).toFixed(2)}</strong></h6>
            </ListGroup.Item>
         </ListGroup> 
            </Card>
         
          </div>
        </Collapse>
      </div>
    </Col>
  </Row>
    <Col>
      <Button
        onClick={() => setOpen3(!open3)}
        aria-controls="example-collapse-text"
        aria-expanded={open3}
      >
        (3) DAPP / APPL 
      </Button>
      <div style={{ minHeight: '100px', textAlign: 'left'}}>
        <Collapse in={open3} dimension="width">
          <div id="example-collapse-text">
            <Card body style={{ width: '275px', backgroundColor: 'cyan' }}>
          <ListGroup>
            <ListGroup.Item className='bg-warning bg-gradient bg-opacity-25'>
          <h6 className='my-1'>
                          <img
                alt="dapptoken"
                src={T1Icon}
                width="40"
                height="40"
                className="align-right mx-3 img-fluid"
                />
          <strong>{parseFloat(dappBalance3).toFixed(2)} DAPP</strong></h6>
            </ListGroup.Item>
            <ListGroup.Item className='bg-warning bg-gradient bg-opacity-25'>
          <h6 className='my-1'>
                          <img
                alt="appletoken"
                src={T3Icon}
                width="40"
                height="40"
                className="align-right mx-3 img-fluid rounded-circle"
                />
          <strong>{parseFloat(appleBalance3).toFixed(2)} APPL</strong></h6>
            </ListGroup.Item>
            <ListGroup.Item className='bg-warning bg-gradient bg-opacity-25'>
          <h6 className='my-1'>
                          <img
                alt="dapp/apple-pair"
                src={TokenPair3}
                width="70"
                height="40"
                className="align-right mx-3 img-fluid rounded"
                />
          <strong>Rate: {parseFloat(price5).toFixed(2)}</strong></h6>
            </ListGroup.Item>
         </ListGroup> 
            </Card>
          </div>
        </Collapse>
      </div>
    </Col>
    </>
  </Col>
  <Col>

    <>
 <h6 className='bg-gradient rounded-5 text-white' style={{ width: '660x', color: 'white', textAlign: 'center'}}>
      <img
        alt="appleswap"
        src={appleIcon}
        width="60"
        height="60"
        className="align-right mx-3 img-fluid hover-overlay rounded-circle"
        /> Apple Swap
  </h6>
<Row>
    <Col>
      <Button
        onClick={() => setOpen4(!open4)}
        aria-controls="example-collapse-text"
        aria-expanded={open4}
        className='my-4'
      >
        (1) DAPP / USD 
      </Button>
      <div style={{ minHeight: '100px', textAlign: 'left'}}>
        <Collapse in={open4} dimension="width">
          <div id="example-collapse-text">
            <Card body style={{ width: '275px', backgroundColor: 'cyan' }}>
          <ListGroup>
            <ListGroup.Item className='bg-warning bg-gradient bg-opacity-25'>
          <h6 className='my-1'>
              <img
                alt="dapptoken"
                src={T1Icon}
                width="40"
                height="40"
                className="align-right mx-3 img-fluid"
                />
          <strong>{parseFloat(dappBalance2).toFixed(2)} DAPP</strong></h6>
            </ListGroup.Item>
            <ListGroup.Item className='bg-warning bg-gradient bg-opacity-25'>
          <h6 className='my-1'>
              <img
                alt="USDtoken"
                src={T2Icon}
                width="40"
                height="40"
                className="align-right mx-3 img-fluid rounded-circle"
                />
          <strong>{parseFloat(usdBalance2).toFixed(2)} USD</strong></h6>
            </ListGroup.Item>
            <ListGroup.Item className='bg-warning bg-gradient bg-opacity-25'>
          <h6 className='my-1'>
                          <img
                alt="dapp/usd-pair"
                src={TokenPair}
                width="70"
                height="40"
                className="align-right mx-3 img-fluid rounded"
                />
          <strong>Rate: {parseFloat(price2).toFixed(2)}</strong></h6>
            </ListGroup.Item>
         </ListGroup> 
            </Card>
         
          </div>
        </Collapse>
      </div>
    </Col>
    <Col>
      <Button
        onClick={() => setOpen5(!open5)}
        aria-controls="example-collapse-text"
        aria-expanded={open5}
        className='my-4'
      >
        (2) APPL / USD 
      </Button>
      <div style={{ minHeight: '100px', textAlign: 'left'}}>
        <Collapse in={open5} dimension="width">
          <div id="example-collapse-text">
            <Card body style={{ width: '275px', backgroundColor: 'cyan' }}>
          <ListGroup>
            <ListGroup.Item className='bg-warning bg-gradient bg-opacity-25'>
          <h6 className='my-1'>
              <img
                alt="appletoken"
                src={T3Icon}
                width="40"
                height="40"
                className="align-right mx-3 img-fluid rounded-circle"
                />
          <strong>{parseFloat(appleBalance2).toFixed(2)} APPL</strong></h6>
            </ListGroup.Item>
            <ListGroup.Item className='bg-warning bg-gradient bg-opacity-25'>
          <h6 className='my-1'>
              <img
                alt="USDtoken"
                src={T2Icon}
                width="40"
                height="40"
                className="align-right mx-3 img-fluid rounded-circle"
                />
          <strong>{parseFloat(usdBalance4).toFixed(2)} USD</strong></h6>
            </ListGroup.Item>
            <ListGroup.Item className='bg-warning bg-gradient bg-opacity-25'>
          <h6 className='my-1'>
                          <img
                alt="dapp/usd-pair"
                src={TokenPair2}
                width="70"
                height="40"
                className="align-right mx-3 img-fluid rounded"
                />
          <strong>Rate: {parseFloat(price4).toFixed(2)}</strong></h6>
            </ListGroup.Item>
         </ListGroup> 
            </Card>
         
          </div>
        </Collapse>
      </div>
    </Col>
    </Row>
    <Col>
      <Button
        onClick={() => setOpen6(!open6)}
        aria-controls="example-collapse-text"
        aria-expanded={open6}
      >
        (3) DAPP / APPL
      </Button>
      <div style={{ minHeight: '100px', textAlign: 'left'}}>
        <Collapse in={open6} dimension="width">
          <div id="example-collapse-text">
            <Card body style={{ width: '275px', backgroundColor: 'cyan' }}>
          <ListGroup>
            <ListGroup.Item className='bg-warning bg-gradient bg-opacity-25'>
          <h6 className='my-1'>
              <img
                alt="dapptoken"
                src={T1Icon}
                width="40"
                height="40"
                className="align-right mx-3 img-fluid"
                />
          <strong>{parseFloat(dappBalance4).toFixed(2)} DAPP</strong></h6>
            </ListGroup.Item>
            <ListGroup.Item className='bg-warning bg-gradient bg-opacity-25'>
          <h6 className='my-1'>
              <img
                alt="appletoken"
                src={T3Icon}
                width="40"
                height="40"
                className="align-right mx-3 img-fluid rounded-circle"
                />
          <strong>{parseFloat(appleBalance4).toFixed(2)} APPL</strong></h6>
            </ListGroup.Item>
            <ListGroup.Item className='bg-warning bg-gradient bg-opacity-25'>
          <h6 className='my-1'>
                          <img
                alt="dapp/apple-pair"
                src={TokenPair3}
                width="70"
                height="40"
                className="align-right mx-3 img-fluid rounded"
                />
          <strong>Rate: {parseFloat(price6).toFixed(2)}</strong></h6>
            </ListGroup.Item>
         </ListGroup> 
            </Card>
          </div>
        </Collapse>
      </div>
    </Col>
    </>
  </Col>
</Row>

        <hr />

        <Tabs />

        <Routes>
        <Route exact path="/" element={<Swap 
                                          dappAccountBalance={dappAccountBalance}
                                          usdAccountBalance={usdAccountBalance}
                                          appleAccountBalance={appleAccountBalance}
                                          daiAccountBalance={daiAccountBalance}
                                          wethAccountBalance={wethAccountBalance}
                                          price1={price1}
                                          price2={price2}
                                          price3={price3}
                                          price4={price4}
                                          price5={price5}
                                          price6={price6}
                                          />} />
          <Route path="/deposit" element={<Deposit />} />
          <Route path="/withdraw" element={<Withdraw />} />
          <Route path="/charts" element={<Charts />} />
        </Routes>

        <h1></h1>
        <h3 className='my-4 text-center text'>Participating Exchanges:</h3>

        <div style={{ textAlign: "center" }}>
 
        <h4 className='my-1 text-center p-3 mb-2 bg-gradient rounded-5'
          style={{ 
            alignItems: 'center', justifyContent: 'center', 
            width: '1296px', height: '55px', display: 'flex',
          }}> 
            <img
            alt="dappswap"
            src={dappIcon}
            width="45"
            height="45"
            className="align-center mx-3 img-fluid"
            />

        Dapp Swap</h4> 

        <h4 className='my-1 text-center p-3 mb-2 bg-gradient rounded-5'       
          style={{ 
            alignItems: 'center', justifyContent: 'center', 
            width: '1296px', height: '55px', display: 'flex'
          }}> 
            <img
            alt="appleswap"
            src={appleIcon}
            width="45"
            height="45"
            className="align-center mx-3 img-fluid rounded-circle"
            />

        Apple Swap</h4>

        <h4 className='my-1 text-center p-3 mb-2 bg-gradient rounded-5'       
          style={{ 
            alignItems: 'center', justifyContent: 'center', 
            width: '1296px', height: '55px', display: 'flex'
          }}> 
            <img
            alt="uniswapLogo"
            src={uniswapLogo}
            width="60"
            height="60"
            className="align-center mx-3 img-fluid rounded-circle"
            />

        Uniswap</h4>

        </div>

      </HashRouter>

    </Container>

</div>
  )
}

export default App;
