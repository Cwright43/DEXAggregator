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
import backgroundimage from '../Background.jpeg';

// Components
import Navigation from './Navigation';
import Tabs from './Tabs';
import Swap from './Swap';
import Deposit from './Deposit';
import Withdraw from './Withdraw';

// Token icons
import T1Icon from '../T1-Icon.png';
import T2Icon from '../T2-Icon.jpg';
import T3Icon from '../T3-Icon.jpg';
import TokenPair from '../TokenPair.jpg';

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
  const [open2, setOpen2] = useState(false);
  const [open3, setOpen3] = useState(false);

  const [dappswap, setDappSwap] = useState(null)
  const [appleswap, setAppleSwap] = useState(null)

  const [usd, setUSD] = useState(null)
  const [dapp, setDapp] = useState(null)
  const [apple, setApple] = useState(null)

  const [dappAMM, setDappAMM] = useState(null)
  const [appleAMM, setAppleAMM] = useState(null)
  const [dappAppleUSD, setDappAppleUSD] = useState(null)
  const [appleAppleUSD, setAppleAppleUSD] = useState(null)

  const [usdBalance, setUSDBalance] = useState(0)
  const [dappBalance, setDappBalance] = useState(0)
  const [price1, setPrice1] = useState(0)

  const [usdBalance1, setUSDBalance1] = useState(0)
  const [dappBalance1, setDappBalance1] = useState(0)
  const [price2, setPrice2] = useState(0)
  const [price3, setPrice3] = useState(0)
  const [price4, setPrice4] = useState(0)

  const [appleBalance, setAppleBalance] = useState(0)
  const [usdBalance2, setUSDBalance2] = useState(0)

  const [appleBalance1, setAppleBalance1] = useState(0)
  const [usdBalance3, setUSDBalance3] = useState(0)

  const [isLoading, setIsLoading] = useState(true)

  const token1 = useSelector(state => state.amm.token1)
  const token2 = useSelector(state => state.amm.token2)
  const token3 = useSelector(state => state.amm.token3)

  const token4 = useSelector(state => state.amm.token4)
  const token5 = useSelector(state => state.amm.token5)

  
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
    const dappswap = new ethers.Contract(config[1].dappswap.address, AMM_ABI, provider)
    setDappSwap(dappswap)

    const appleswap = new ethers.Contract(config[1].appleswap.address, AMM_ABI, provider)
    setAppleSwap(appleswap)

    const dappAppleUSD = new ethers.Contract(config[1].dappAppleUSD.address, AMM_ABI, provider)
    setDappAppleUSD(dappAppleUSD)

    const appleAppleUSD = new ethers.Contract(config[1].appleAppleUSD.address, AMM_ABI, provider)
    setAppleAppleUSD(appleAppleUSD)

    // Initiate contracts
    let usd = new ethers.Contract(config[1].usd.address, TOKEN_ABI, provider)
    setUSD(usd)

    let dapp = new ethers.Contract(config[1].dapp.address, TOKEN_ABI, provider)
    setDapp(dapp)

    let apple = new ethers.Contract(config[1].apple.address, TOKEN_ABI, provider)
    setApple(apple)

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

    let appleBalance = await apple.balanceOf(dappAppleUSD.address)
    appleBalance = ethers.utils.formatUnits(appleBalance, 18)
    setAppleBalance(appleBalance)

    let usdBalance2 = await usd.balanceOf(dappAppleUSD.address)
    usdBalance2 = ethers.utils.formatUnits(usdBalance2, 18)
    setUSDBalance2(usdBalance2)

    let price3 = usdBalance2 / appleBalance
    setPrice3(price3)

    let appleBalance1 = await apple.balanceOf(appleAppleUSD.address)
    appleBalance1 = ethers.utils.formatUnits(appleBalance1, 18)
    setAppleBalance1(appleBalance1)

    let usdBalance3 = await usd.balanceOf(appleAppleUSD.address)
    usdBalance3 = ethers.utils.formatUnits(usdBalance3, 18)
    setUSDBalance3(usdBalance3)

    let price4 = usdBalance3 / appleBalance1
    setPrice4(price4)

    setDappAMM('0xcB0f2a13098f8e841e6Adfa5B17Ec00508b27665')
    setAppleAMM('0x37D31345F164Ab170B19bc35225Abc98Ce30b46A')

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

    <>
 <h6 className='bg-danger bg-gradient rounded-5 text-white}}' style={{ width: '275px', color: 'white', textAlign: 'center'}}>
      <img
        alt="dappswap"
        src={dappIcon}
        width="60"
        height="60"
        className="align-right mx-3 img-fluid hover-overlay"
        /> Dapp Swap
  </h6>

    <Col>
      <Button
        onClick={() => setOpen(!open)}
        aria-controls="example-collapse-text"
        aria-expanded={open}
      >
        (1) DAPP / USD 
      </Button>
      <div style={{ minHeight: '100px', textAlign: 'left'}}>
        <Collapse in={open} dimension="width">
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
        onClick={() => setOpen2(!open2)}
        aria-controls="example-collapse-text"
        aria-expanded={open2}
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
          <strong>{parseFloat(appleBalance).toFixed(2)} APPL</strong></h6>
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
          <strong>{parseFloat(usdBalance2).toFixed(2)} USD</strong></h6>
            </ListGroup.Item>
            <ListGroup.Item className='bg-warning bg-gradient bg-opacity-25'>
          <h6 className='my-1'>
                          <img
                alt="appl/usd-pair"
                src={TokenPair}
                width="40"
                height="40"
                className="align-right mx-3 img-fluid rounded-circle"
                />
          <strong>Rate: {parseFloat(price3).toFixed(2)}</strong></h6>
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
 <h6 className='bg-danger bg-gradient rounded-5 text-white}}' style={{ width: '275px', color: 'white', textAlign: 'center'}}>
      <img
        alt="appleswap"
        src={appleIcon}
        width="60"
        height="60"
        className="align-right mx-3 img-fluid hover-overlay"
        /> Apple Swap
  </h6>
    <Col>
      <Button
        onClick={() => setOpen1(!open1)}
        aria-controls="example-collapse-text"
        aria-expanded={open1}
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
                src={T1Icon}
                width="40"
                height="40"
                className="align-right mx-3 img-fluid"
                />
          <strong>{parseFloat(dappBalance).toFixed(2)} DAPP</strong></h6>
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
          <strong>{parseFloat(usdBalance).toFixed(2)} USD</strong></h6>
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
        onClick={() => setOpen3(!open3)}
        aria-controls="example-collapse-text"
        aria-expanded={open3}
      >
        (2) APPL / USD 
      </Button>
      <div style={{ minHeight: '100px', textAlign: 'left'}}>
        <Collapse in={open3} dimension="width">
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
                className="align-right mx-3 img-fluid"
                />
          <strong>{parseFloat(appleBalance1).toFixed(2)} DAPP</strong></h6>
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
          <strong>{parseFloat(usdBalance3).toFixed(2)} USD</strong></h6>
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
    </>
  </Col>
</Row>

        <hr />

<Row>

</Row>
        <Tabs />

        <Routes>
          <Route exact path="/" element={<Swap price1={price1} price2={price2} chainId={chainId}/>} />
          <Route path="/deposit" element={<Deposit />} />
          <Route path="/withdraw" element={<Withdraw />} />
          <Route path="/charts" element={<Charts />} />
        </Routes>

        <h3 className='my-4 text-center'>Participating Exchanges:</h3>

        <div style={{ textAlign: "center" }}>
 
        <h6 className='my-4 text-center p-3 mb-2 bg-danger bg-gradient rounded-5 text-white float'       
          style={{ 
            alignItems: 'center', justifyContent: 'center', 
            width: '1296px', height: '55px', display: 'flex',
          }}> 
            <img
            alt="dappswap"
            src={dappIcon}
            width="40"
            height="40"
            className="align-center mx-3 img-fluid"
            />

        DApp Swap: <strong>{dappAMM}</strong></h6> 

        <h6 className='my-4 text-center p-3 mb-2 bg-danger bg-gradient rounded-5 text-white float'       
          style={{ 
            alignItems: 'center', justifyContent: 'center', 
            width: '1296px', height: '55px', display: 'flex'
          }}> 
            <img
            alt="appleswap"
            src={appleIcon}
            width="40"
            height="40"
            className="align-center mx-3 img-fluid hover-overlay rounded-circle"
            />

        Apple Swap: <strong>{appleAMM}</strong></h6>

        </div>

      </HashRouter>

    </Container>

</div>
  )
}

export default App;
