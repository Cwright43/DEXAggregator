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
  dappDappApple1Loaded,
  dappDappApple2Loaded,
  appleDappApple1Loaded,
  appleDappApple2Loaded,
  loadNetwork,
  loadAccount,
  loadTokens,
  loadAMM,
  loadApple
} from '../store/interactions'

function App() {

  const [open1, setOpen1] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [open3, setOpen3] = useState(false);
  const [open4, setOpen4] = useState(false);
  const [open5, setOpen5] = useState(false);
  const [open6, setOpen6] = useState(false);

  const [dappswap, setDappSwap] = useState(null)
  const [appleswap, setAppleSwap] = useState(null)

  const [usd, setUSD] = useState(null)
  const [dapp, setDapp] = useState(null)
  const [apple, setApple] = useState(null)

  const [dappAMM, setDappAMM] = useState(null)
  const [appleAMM, setAppleAMM] = useState(null)
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
  

  const [isLoading, setIsLoading] = useState(true)

  const token1 = useSelector(state => state.amm.token1)
  const token2 = useSelector(state => state.amm.token2)
  const token3 = useSelector(state => state.amm.token3)

  const token4 = useSelector(state => state.amm.token4)
  const token5 = useSelector(state => state.amm.token5)

  const dappDappApple1 = useSelector(state => state.amm.dappDappApple1)
  const dappDappApple2 = useSelector(state => state.amm.dappDappApple2)
  const appleDappApple1 = useSelector(state => state.amm.appleDappApple1)
  const appleDappApple2 = useSelector(state => state.amm.appleDappApple2)
  
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

    const dappDappApple = new ethers.Contract(config[1].dappDappApple.address, AMM_ABI, provider)
    setDappDappApple(dappDappApple)

    const appleDappApple = new ethers.Contract(config[1].appleDappApple.address, AMM_ABI, provider)
    setAppleDappApple(appleDappApple)

    // Initiate contracts
    let usd = new ethers.Contract(config[1].usd.address, TOKEN_ABI, provider)
    setUSD(usd)

    let dapp = new ethers.Contract(config[1].dapp.address, TOKEN_ABI, provider)
    setDapp(dapp)

    let apple = new ethers.Contract(config[1].apple.address, TOKEN_ABI, provider)
    setApple(apple)

    // Retrieve Balances

    let dappBalance1 = await dapp.balanceOf(dappswap.address)
    dappBalance1 = ethers.utils.formatUnits(dappBalance1, 18)
    setDappBalance1(dappBalance1)

    let usdBalance1 = await usd.balanceOf(dappswap.address)
    usdBalance1 = ethers.utils.formatUnits(usdBalance1, 18)
    setUSDBalance1(usdBalance1)

    let price1 = usdBalance1 / dappBalance1
    setPrice1(price1)

    let dappBalance2 = await dapp.balanceOf(appleswap.address)
    dappBalance2 = ethers.utils.formatUnits(dappBalance2, 18)
    setDappBalance2(dappBalance2)

    let usdBalance2 = await usd.balanceOf(appleswap.address)
    usdBalance2 = ethers.utils.formatUnits(usdBalance2, 18)
    setUSDBalance2(usdBalance2)

    let price2 = usdBalance2 / dappBalance2
    setPrice2(price2)


  // Load APPL / USD balances

    let appleBalance1 = await apple.balanceOf(dappAppleUSD.address)
    appleBalance1 = ethers.utils.formatUnits(appleBalance1, 18)
    setAppleBalance1(appleBalance1)

    let usdBalance3 = await usd.balanceOf(dappAppleUSD.address)
    usdBalance3 = ethers.utils.formatUnits(usdBalance3, 18)
    setUSDBalance3(usdBalance3)

    let price3 = usdBalance3 / appleBalance1
    setPrice3(price3)

    let appleBalance2 = await apple.balanceOf(appleAppleUSD.address)
    appleBalance2 = ethers.utils.formatUnits(appleBalance2, 18)
    setAppleBalance2(appleBalance2)

    let usdBalance4 = await usd.balanceOf(appleAppleUSD.address)
    usdBalance4 = ethers.utils.formatUnits(usdBalance4, 18)
    setUSDBalance4(usdBalance4)

    let price4 = usdBalance4 / appleBalance2
    setPrice4(price4)

    // Load DAPP / APPL balances

    let dappBalance3 = await dapp.balanceOf(dappDappApple.address)
    dappBalance3 = ethers.utils.formatUnits(dappBalance3, 18)
    setDappBalance3(dappBalance3)

    let appleBalance3 = await apple.balanceOf(dappDappApple.address)
    appleBalance3 = ethers.utils.formatUnits(appleBalance3, 18)
    setAppleBalance3(appleBalance3)

    let price5 = appleBalance3 / dappBalance3
    setPrice5(price5)

    let dappBalance4 = await dapp.balanceOf(appleDappApple.address)
    dappBalance4 = ethers.utils.formatUnits(dappBalance4, 18)
    setDappBalance4(dappBalance4)

    let appleBalance4 = await apple.balanceOf(appleDappApple.address)
    appleBalance4 = ethers.utils.formatUnits(appleBalance4, 18)
    setAppleBalance4(appleBalance4)

    let price6 = appleBalance4 / dappBalance4
    setPrice6(price6)

    setDappAMM('0x92b0d1Cc77b84973B7041CB9275d41F09840eaDd')
    setAppleAMM('0x996785Fe937d92EDBF420F3Bf70Acc62ecD6f655')

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
  <Row>
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
                src={TokenPair}
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
                src={TokenPair}
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
 <h6 className='bg-danger bg-gradient rounded-5 text-white}}' style={{ width: '275px', color: 'white', textAlign: 'center'}}>
      <img
        alt="appleswap"
        src={appleIcon}
        width="60"
        height="60"
        className="align-right mx-3 img-fluid hover-overlay"
        /> Apple Swap
  </h6>
<Row>
    <Col>
      <Button
        onClick={() => setOpen4(!open4)}
        aria-controls="example-collapse-text"
        aria-expanded={open4}
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
                src={TokenPair}
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
                src={TokenPair}
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

<h4 className='text-warning'>DAPP / APPL on Dapp Swap: {dappDappApple1}</h4>
<h4 className='text-warning'>DAPP / APPL on Apple Swap: {}</h4>

        <hr />

        <Tabs />

        <Routes>
          <Route exact path="/" element={<Swap price1={price1} price2={price2} chainId={chainId}/>} />
          <Route path="/deposit" element={<Deposit />} />
          <Route path="/withdraw" element={<Withdraw />} />
          <Route path="/charts" element={<Charts />} />
        </Routes>

        <h3 className='my-4 text-center'>Participating Exchanges:</h3>

        <div style={{ textAlign: "center" }}>
 
        <h6 className='my-4 text-center p-3 mb-2 bg-danger bg-gradient rounded-5 text-white'       
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

        <h6 className='my-4 text-center p-3 mb-2 bg-danger bg-gradient rounded-5 text-white'       
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
