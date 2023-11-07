import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Container } from 'react-bootstrap'
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Spinner from 'react-bootstrap/Spinner';
import { ethers } from 'ethers'

import dappIcon from '../dapp-swap.png';
import appleIcon from '../apple.jpeg';

import Alert from './Alert'

import {
  swap,
  loadBalances,
  loadNetwork,
  loadTokens,
  loadAppleUSD,
  loadDappApple,
  loadDapp,
  loadDappAppleUSD,
  loadDappDappApple,
  loadApple,
  loadAppleAppleUSD,
  loadAppleDappApple
  
} from '../store/interactions'

const Swap = ({ dappAccountBalance, usdAccountBalance, appleAccountBalance, 
                daiAccountBalance, wethAccountBalance,
                price1, price2, price3, price4, price5, price6
              }) => {

  const [inputToken, setInputToken] = useState(null)
  const [outputToken, setOutputToken] = useState(null)
  const [inputAmount, setInputAmount] = useState(0)
  const [outputAmount, setOutputAmount] = useState(0)
  const [exchangeRate, setExchangeRate] = useState(0)  

  const [flagDapp, setFlagDapp] = useState(false)
  const [flagApple, setFlagApple] = useState(false)

  const [price, setPrice] = useState(0)
  const [protocol, setProtocol] = useState(0)

  const [showAlert, setShowAlert] = useState(false)

  const provider = useSelector(state => state.provider.connection)
  const account = useSelector(state => state.provider.account)

  const tokens = useSelector(state => state.tokens.contracts)
  const symbols = useSelector(state => state.tokens.symbols)
  const balances = useSelector(state => state.tokens.balances)

  const amm = useSelector(state => state.amm.contract)
  const chainId = useSelector(state => state.provider.chainId)
  const isSwapping = useSelector(state => state.amm.swapping.isSwapping)
  const isSuccess = useSelector(state => state.amm.swapping.isSuccess)
  const transactionHash = useSelector(state => state.amm.swapping.transactionHash)

  const token1 = useSelector(state => state.amm.token1)
  const token2 = useSelector(state => state.amm.token2)

  const dispatch = useDispatch()

  const testHandler = async (e) => {
    console.log(`Token 1 Account Balance: ${parseFloat(balances[0]).toFixed(2)}`)
    console.log(`Token 2 Account Balance: ${parseFloat(balances[1]).toFixed(2)}`)
    console.log(`Active AMM Address: ${amm.address}`)
    console.log(`Active Symbol (1): ${symbols}`)
}

  const inputHandler = async (e) => {

    if (e.target.value == 0) {
      setPrice(0)
      setOutputAmount(0)
      setExchangeRate(0)
      return
    }

    if (!inputToken || !outputToken) {
      window.alert('Please select token')
      return
    }

    if (inputToken === outputToken) {
      window.alert('Invalid Token Pair')
      return
    }

    if (protocol === 1) {
      setInputAmount(e.target.value)
      const _token1Amount = ethers.utils.parseUnits(e.target.value, 'ether')
      const result = await amm.calculateToken1Swap(_token1Amount)
      const _token2Amount = ethers.utils.formatUnits(result.toString(), 'ether')
      setOutputAmount(_token2Amount.toString())
      setExchangeRate((_token2Amount/_token1Amount) * 10e17)
    } else if (protocol === 2) {
      setInputAmount(e.target.value)
      const _token2Amount = ethers.utils.parseUnits(e.target.value, 'ether')
      const result = await amm.calculateToken2Swap(_token2Amount)
      const _token1Amount = ethers.utils.formatUnits(result.toString(), 'ether')
      setOutputAmount(_token1Amount.toString())
      setExchangeRate((_token1Amount/_token2Amount) * 10e17)
      }

   }

  const swapHandler = async (e) => {
    e.preventDefault()

    setShowAlert(false)

    if (inputToken === outputToken) {
      window.alert('Invalid Token Pair')
      return
    }

    const _inputAmount = ethers.utils.parseUnits(inputAmount, 'ether')
      await loadTokens(provider, chainId, dispatch);

    // Swap token depending upon which one we're doing...
    if ((inputToken === 'DAPP' && outputToken === 'USD') 
      || (inputToken === 'APPL' && outputToken === 'USD') 
        || (inputToken === 'DAPP' && outputToken === 'APPL')) {
      await swap(provider, amm, tokens[0], inputToken, outputToken, _inputAmount, dispatch)
    } else {
      await swap(provider, amm, tokens[1], inputToken, outputToken, _inputAmount, dispatch)
    }

    await loadBalances(amm, tokens, account, dispatch)
    await getPrice()

    setShowAlert(true)
  }

  const getPrice = async () => {

    setFlagApple(false)
    setFlagDapp(false)

    if (inputToken === outputToken) {
      setPrice(0)
      return
    }

    if (inputToken === outputToken) {
      window.alert('Invalid token pair')
      return
    }

    if ((inputToken === 'DAPP' && outputToken === 'USD') ||
    (inputToken === 'APPL' && outputToken === 'USD') ||
      (inputToken === 'DAPP' && outputToken === 'APPL'))
          {
          setProtocol(1)
              } else {
          setProtocol(2)
              }

  // Fetch Chain ID for Active Network
  const chainId = await loadNetwork(provider, dispatch)

  if ((inputToken === 'DAPP' && outputToken === 'USD') || (inputToken === 'USD' && outputToken === 'DAPP')) {
      await loadTokens(provider, chainId, dispatch);
  } else if ((inputToken === 'APPL' && outputToken === 'USD') || (inputToken === 'USD' && outputToken === 'APPL')) {
      await loadAppleUSD(provider, chainId, dispatch);
  } else if ((inputToken === 'DAPP' && outputToken === 'APPL') || (inputToken === 'APPL' && outputToken === 'DAPP')) {
      await loadDappApple(provider, chainId, dispatch);
  }

  if (inputToken === 'DAPP' && outputToken === 'USD') {
        if (price2 > price1) {
          await loadApple(provider, chainId, dispatch)
          console.log("AppleSwap WINS")
          setFlagApple(true)
        } else {
          await loadDapp(provider, chainId, dispatch)
          console.log("DappSwap WINS")
          setFlagDapp(true)
        }
  } else if (inputToken === 'USD' && outputToken === 'DAPP') {
        if (price1 > price2) {
          await loadApple(provider, chainId, dispatch)
          console.log("AppleSwap WINS")
          setFlagApple(true)
        } else {
          await loadDapp(provider, chainId, dispatch)
          console.log("DappSwap WINS")
          setFlagDapp(true)
        }
     }
   
  if (inputToken === 'APPL' && outputToken === 'USD') {
        if (price4 > price3) {
          await loadAppleAppleUSD(provider, chainId, dispatch)
          console.log("AppleSwap WINS")
          setFlagApple(true)
        } else {
          await loadDappAppleUSD(provider, chainId, dispatch)
          console.log("DappSwap WINS")
          setFlagDapp(true)
        }
      } else if (inputToken === 'USD' && outputToken === 'APPL') {
        if (price3 > price4) {
          await loadAppleAppleUSD(provider, chainId, dispatch)
          console.log("AppleSwap WINS")
          setFlagApple(true)
        } else {
          await loadDappAppleUSD(provider, chainId, dispatch)
          console.log("DappSwap WINS")
          setFlagDapp(true)
        }
      }

  if (inputToken === 'DAPP' && outputToken === 'APPL') {
        if (price6 > price5) {
          await loadAppleDappApple(provider, chainId, dispatch)
          console.log("AppleSwap WINS")
          setFlagApple(true)
        } else {
          await loadDappDappApple(provider, chainId, dispatch)
          console.log("DappSwap WINS")
          setFlagDapp(true)
        }
      } else if (inputToken === 'APPL' && outputToken === 'DAPP') {
        if (price5 > price6) {
          await loadAppleDappApple(provider, chainId, dispatch)
          console.log("AppleSwap WINS")
          setFlagApple(true)
        } else {
          await loadDappDappApple(provider, chainId, dispatch)
          console.log("DappSwap WINS")
          setFlagDapp(true)
        }
      }

    if (protocol === 1) {
      setPrice((token2 / token1))
    } else if (protocol === 2) {
      setPrice((token1 / token2))
    }

   await loadBalances(amm, tokens, account, dispatch);
}

  useEffect(() => {
    if(inputToken && outputToken) {
      getPrice();
    }
  }, [inputToken, outputToken]);

  return (
    <div>
    <Row className='mtext-center'>
      {flagDapp && (
    <h5 className='d-flex justify-content-center align-items-center text-warning my-3 body rounded-5'>
        Routing: DappSwap
        <img
        alt="dappswap"
        src={dappIcon}
        width="40"
        height="40"
        className="align-center mx-3"
        />
    </h5>
      )}
      {flagApple && (
    <h5 className='d-flex justify-content-center align-items-center text-warning my-3 body rounded-5'
>
      Routing: Appleswap
        <img
        alt="appleswap"
        src={appleIcon}
        width="40"
        height="40"
        className="text-center mx-3 rounded-circle"
        />
    </h5>
      )}
</Row>
<Row>
      <Card style={{ maxWidth: '450px' }} className='mx-auto px-4'>
        {account ? (
          <Form onSubmit={swapHandler} style={{ maxWidth: '450px', margin: '50px auto' }}>

            <Row className='my-3'>
              <div className='d-flex justify-content-between'>
                <Form.Label><strong>Input: </strong></Form.Label>
                <Form.Text muted>
                Balance: {
                  inputToken === 'DAPP' ? (
                      parseFloat(dappAccountBalance).toFixed(2)
                    ) : inputToken === 'USD' ? (
                      parseFloat(usdAccountBalance).toFixed(2)
                    ) : inputToken === 'APPL' ? (
                      parseFloat(appleAccountBalance).toFixed(2)
                    ) : inputToken === 'DAI' ? (
                      parseFloat(daiAccountBalance).toFixed(2)
                    ) : inputToken === 'WETH' ? (
                      parseFloat(wethAccountBalance).toFixed(2)
                    ) : 0
                  }
                </Form.Text>
              </div>
              <InputGroup>
                <Form.Control
                  type="number"
                  placeholder="0.0"
                  min="0.0"
                  step="any"
                  onChange={(e) => inputHandler(e)}
                  disabled={!inputToken}
                />
                <DropdownButton
                  variant="outline-secondary"
                  title={inputToken ? inputToken : "Select Token"}
                  step="any"
                >
                  <Dropdown.Item onClick={(e) => setInputToken(e.target.innerHTML)} >DAPP</Dropdown.Item>
                  <Dropdown.Item onClick={(e) => setInputToken(e.target.innerHTML)} >USD</Dropdown.Item>
                  <Dropdown.Item onClick={(e) => setInputToken(e.target.innerHTML)} >APPL</Dropdown.Item>
                  <Dropdown.Item onClick={(e) => setInputToken(e.target.innerHTML)} >DAI</Dropdown.Item>
                  <Dropdown.Item onClick={(e) => setInputToken(e.target.innerHTML)} >WETH</Dropdown.Item>
                </DropdownButton>
              </InputGroup>
            </Row>
            <Row className='my-4'>
              <div className='d-flex justify-content-between'>
                <Form.Label><strong>Output:</strong></Form.Label>
                <Form.Text muted>
                Balance: {
                  outputToken === 'DAPP' ? (
                      parseFloat(dappAccountBalance).toFixed(2)
                    ) : outputToken === 'USD' ? (
                      parseFloat(usdAccountBalance).toFixed(2)
                    ) : outputToken === 'APPL' ? (
                      parseFloat(appleAccountBalance).toFixed(2)
                    ) : outputToken === 'DAI' ? (
                      parseFloat(daiAccountBalance).toFixed(2)
                    ) : outputToken === 'WETH' ? (
                      parseFloat(wethAccountBalance).toFixed(2)
                    ) : 0
                  }
                </Form.Text>
              </div>
              <InputGroup>
                <Form.Control
                  type="number"
                  placeholder="0.0"
                  value={outputAmount === 0 ? "" : outputAmount }
                  disabled
                />
                <DropdownButton
                  variant="outline-secondary"
                  title={outputToken ? outputToken : "Select Token"}
                >
                  { inputToken !== 'WETH' && inputToken !=='DAI' && (
                    <>
                  <Dropdown.Item onClick={(e) => setOutputToken(e.target.innerHTML)}>DAPP</Dropdown.Item>
                  <Dropdown.Item onClick={(e) => setOutputToken(e.target.innerHTML)}>USD</Dropdown.Item>
                  <Dropdown.Item onClick={(e) => setOutputToken(e.target.innerHTML)}>APPL</Dropdown.Item>
                    </>
                  )}
                { inputToken =='WETH' && (
                  <Dropdown.Item onClick={(e) => setOutputToken(e.target.innerHTML)}>DAI</Dropdown.Item>
                )}
                { inputToken =='DAI' && (
                  <Dropdown.Item onClick={(e) => setOutputToken(e.target.innerHTML)}>WETH</Dropdown.Item>
                )}
                </DropdownButton>
              </InputGroup>
            </Row>
            <Row className='my-3'>
              {isSwapping ? (
                <Spinner animation="border" style={{ display: 'block', margin: '0 auto' }} />
              ): (
                <Button type='submit'>Swap</Button>
              )}
              <Form.Text muted>
                <p>Exchange Rate: {exchangeRate}</p>
              </Form.Text>
            </Row>
          </Form>
        ) : (
          <p
            className='d-flex justify-content-center align-items-center'
            style={{ height: '300px' }}
          >
            Please connect wallet.
          </p>
        )}
      </Card>
      <p>
                <Button 
                  variant="primary" 
                  style={{ width: '20%' }}
                  onClick={() => testHandler()}
                  >
                  Show T1 / T2 Account Balances 
                </Button>
              </p>
      {isSwapping ? (
        <Alert
          message={'Swap Pending...'}
          transactionHash={null}
          variant={'info'}
          setShowAlert={setShowAlert}
        />
      ) : isSuccess && showAlert ? (
        <Alert
          message={'Swap Successful'}
          transactionHash={transactionHash}
          variant={'success'}
          setShowAlert={setShowAlert}
        />
      ) : !isSuccess && showAlert ? (
        <Alert
          message={'Swap Failed'}
          transactionHash={null}
          variant={'danger'}
          setShowAlert={setShowAlert}
        />
      ) : (
        <></>
      )}
</Row>
    </div>
  );
}

export default Swap;
